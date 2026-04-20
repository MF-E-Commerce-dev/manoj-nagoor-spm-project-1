(() => {
  const utils = window.MNUtils;
  const {
    formatPrice,
    getCartCount,
    addToCart,
    toggleFavorite,
    isFavorite,
    getProductById,
  } = utils;

  const productsGrid = document.getElementById("productsGrid");
  const productCountLabel = document.getElementById("productCountLabel");
  const cartCountBadge = document.getElementById("cartCountBadge");

  const pills = Array.from(document.querySelectorAll(".pill[data-category]"));
  const minPriceInput = document.getElementById("minPriceInput");
  const maxPriceInput = document.getElementById("maxPriceInput");
  const applyPriceBtn = document.getElementById("applyPriceBtn");
  const clearPriceBtn = document.getElementById("clearPriceBtn");
  const priceErrorEl = document.getElementById("priceError");

  const detailsModalOverlay = document.getElementById("detailsModalOverlay");
  const detailsModalCloseBtn = document.getElementById("detailsModalCloseBtn");
  const detailsModalTitle = document.getElementById("detailsModalTitle");
  const detailsModalImage = document.getElementById("detailsModalImage");
  const detailsModalPrice = document.getElementById("detailsModalPrice");
  const detailsModalMeta = document.getElementById("detailsModalMeta");
  const detailsModalDesc = document.getElementById("detailsModalDesc");
  const detailsModalHighlights = document.getElementById("detailsModalHighlights");
  const detailsAddToCartBtn = document.getElementById("detailsAddToCartBtn");
  const detailsBuyBtn = document.getElementById("detailsBuyBtn");
  const detailsFavoriteBtn = document.getElementById("detailsFavoriteBtn");

  const orderModalOverlay = document.getElementById("orderModalOverlay");
  const orderModalCloseBtn = document.getElementById("orderModalCloseBtn");
  const orderProductSummary = document.getElementById("orderProductSummary");
  const orderForm = document.getElementById("orderForm");
  const orderFormError = document.getElementById("orderFormError");
  const orderCancelBtn = document.getElementById("orderCancelBtn");
  const orderQtyInput = document.getElementById("orderQty");

  const toastEl = document.getElementById("toastEl");
  const toastText = document.getElementById("toastText");

  const state = {
    selectedCategory: "All",
    priceMin: null,
    priceMax: null,
    orderProductId: null,
    isSubmittingOrder: false,
  };

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    if (!toastEl) return;
    toastText.textContent = message;
    toastEl.classList.add("toastShow");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("toastShow"), 1600);
  }

  function updateCartBadge() {
    if (cartCountBadge) cartCountBadge.textContent = String(getCartCount());
  }

  function setActiveCategory(category) {
    for (const btn of pills) {
      const isActive = btn.getAttribute("data-category") === category;
      btn.classList.toggle("pillActive", isActive);
    }
  }

  function parsePriceInput(inputEl) {
    if (!inputEl) return null;
    const raw = String(inputEl.value || "").trim();
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return null;
    if (n < 0) return null;
    return n;
  }

  function validateAndSetPriceFilter() {
    priceErrorEl.textContent = "";

    const min = parsePriceInput(minPriceInput);
    const max = parsePriceInput(maxPriceInput);

    if (min !== null && max !== null && min > max) {
      priceErrorEl.textContent = "Min price must be less than or equal to max price.";
      return false;
    }

    state.priceMin = min;
    state.priceMax = max;
    return true;
  }

  function resetPriceFilter() {
    state.priceMin = null;
    state.priceMax = null;
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    priceErrorEl.textContent = "";
  }

  function getFilteredProducts() {
    const all = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    let filtered = all;

    if (state.selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === state.selectedCategory);
    }

    if (state.priceMin !== null) {
      filtered = filtered.filter((p) => p.price >= state.priceMin);
    }

    if (state.priceMax !== null) {
      filtered = filtered.filter((p) => p.price <= state.priceMax);
    }

    return filtered;
  }

  function productCardHtml(product) {
    const fav = isFavorite(product.id);
    const favBtnClass = fav ? "favoriteBtn liked" : "favoriteBtn";
    const favText = fav ? "Liked" : "Like";

    return `
      <article class="productCard" aria-label="${escapeHtml(product.name)}">
        <div class="productImageWrap">
          <img class="productImage" src="${product.image}" alt="${escapeHtml(product.name)}" />
        </div>
        <div class="productBody">
          <div class="productTitleRow">
            <div>
              <h3>${escapeHtml(product.name)}</h3>
              <div class="productCategory">${escapeHtml(product.category)} • ${escapeHtml(product.type)}</div>
            </div>
          </div>

          <div class="priceRow">
            <div class="productPrice">${formatPrice(product.price)}</div>
          </div>

          <div class="actionsRowBuy">
            <button type="button" class="btn btnPrimary addToCartBtn" data-product-id="${product.id}">
              Add to Cart
            </button>
            <button type="button" class="btn btnSecondary buyBtn" data-product-id="${product.id}">
              Buy
            </button>
          </div>
          <div class="favRow">
            <button type="button" class="btn btnGhost ${favBtnClass}" data-product-id="${product.id}" aria-pressed="${fav ? "true" : "false"}">
              ${favText}
            </button>
          </div>

          <div class="detailsBtn">
            <button type="button" class="btn btnLink detailsBtn" data-product-id="${product.id}">
              View details
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const filtered = getFilteredProducts();
    productCountLabel.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;
    productsGrid.innerHTML = filtered.map(productCardHtml).join("");
  }

  function openDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;

    detailsModalTitle.textContent = product.name;
    detailsModalImage.src = product.image;
    detailsModalPrice.textContent = formatPrice(product.price);
    detailsModalMeta.textContent = `${product.category} • ${product.type}`;
    detailsModalDesc.textContent = product.description;
    detailsModalHighlights.innerHTML = (product.highlights || [])
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join("");

    detailsAddToCartBtn.dataset.productId = product.id;
    detailsBuyBtn.dataset.productId = product.id;
    detailsFavoriteBtn.dataset.productId = product.id;

    const fav = isFavorite(product.id);
    detailsFavoriteBtn.classList.toggle("liked", fav);
    detailsFavoriteBtn.textContent = fav ? "Liked" : "Like";

    detailsModalOverlay.classList.add("modalOverlayOpen");
  }

  function closeDetails() {
    detailsModalOverlay.classList.remove("modalOverlayOpen");
  }

  function parsePositiveInt(value, fallback = 1) {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n < 1) return fallback;
    return n;
  }

  function setOrderSubmitting(isSubmitting) {
    state.isSubmittingOrder = isSubmitting;
    const submitBtn = document.getElementById("orderSubmitBtn");
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Saving..." : "Place order";
  }

  async function saveOrderToFirebase(orderData) {
    if (!window.firebase || !window.firebase.apps.length) {
      throw new Error("Firebase is not configured.");
    }

    const db = window.firebase.firestore();
    await db.collection("orders").add(orderData);
  }

  function refreshOrderSummary() {
    const productId = state.orderProductId;
    const product = productId ? getProductById(productId) : null;
    if (!product || !orderProductSummary) return;
    const qty = parsePositiveInt(orderQtyInput?.value, 1);
    if (orderQtyInput && String(orderQtyInput.value) !== String(qty)) orderQtyInput.value = String(qty);
    const lineTotal = product.price * qty;
    orderProductSummary.innerHTML = `
      <div>${escapeHtml(product.name)}</div>
      <div style="font-weight:700;color:var(--muted);margin-top:4px">${formatPrice(product.price)} each × ${qty}</div>
      <div class="orderLineTotal">Total: ${formatPrice(lineTotal)}</div>
    `;
  }

  function openOrderModal(productId) {
    const product = getProductById(productId);
    if (!product || !orderModalOverlay || !orderForm) return;

    state.orderProductId = productId;
    if (orderFormError) orderFormError.textContent = "";
    orderForm.reset();
    if (orderQtyInput) orderQtyInput.value = "1";
    refreshOrderSummary();

    orderModalOverlay.classList.add("modalOverlayOpen");
    orderForm.elements?.fullName?.focus?.();
  }

  function closeOrderModal() {
    if (orderModalOverlay) orderModalOverlay.classList.remove("modalOverlayOpen");
    state.orderProductId = null;
    if (orderFormError) orderFormError.textContent = "";
  }

  // Events: categories
  for (const btn of pills) {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");
      state.selectedCategory = category;
      setActiveCategory(category);
      renderProducts();
    });
  }

  // Events: price filter
  applyPriceBtn.addEventListener("click", () => {
    const ok = validateAndSetPriceFilter();
    if (!ok) return;
    renderProducts();
  });

  clearPriceBtn.addEventListener("click", () => {
    resetPriceFilter();
    renderProducts();
  });

  minPriceInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyPriceBtn.click();
  });
  maxPriceInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyPriceBtn.click();
  });

  // Events: product card actions (event delegation)
  productsGrid.addEventListener("click", (e) => {
    const target = e.target;

    const addBtn = target.closest(".addToCartBtn");
    if (addBtn) {
      const productId = addBtn.getAttribute("data-product-id");
      addToCart(productId, 1);
      updateCartBadge();
      showToast("Added to cart");
      return;
    }

    const buyBtn = target.closest(".buyBtn");
    if (buyBtn) {
      const productId = buyBtn.getAttribute("data-product-id");
      openOrderModal(productId);
      return;
    }

    const favBtn = target.closest(".favoriteBtn");
    if (favBtn) {
      const productId = favBtn.getAttribute("data-product-id");
      const nextIsFav = toggleFavorite(productId);
      renderProducts(); // keep card state in sync with favorites
      showToast(nextIsFav ? "Added to favorites" : "Removed from favorites");
      return;
    }

    const detailsBtn = target.closest(".detailsBtn");
    if (detailsBtn) {
      const productId = detailsBtn.getAttribute("data-product-id");
      openDetails(productId);
      return;
    }
  });

  // Events: modal close
  detailsModalCloseBtn.addEventListener("click", closeDetails);
  detailsModalOverlay.addEventListener("click", (e) => {
    if (e.target === detailsModalOverlay) closeDetails();
  });

  if (orderModalCloseBtn) orderModalCloseBtn.addEventListener("click", closeOrderModal);
  if (orderCancelBtn) orderCancelBtn.addEventListener("click", closeOrderModal);
  if (orderModalOverlay) {
    orderModalOverlay.addEventListener("click", (e) => {
      if (e.target === orderModalOverlay) closeOrderModal();
    });
  }
  if (orderQtyInput) {
    orderQtyInput.addEventListener("input", () => {
      refreshOrderSummary();
    });
  }
  if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (state.isSubmittingOrder) return;
      orderFormError.textContent = "";

      const productId = state.orderProductId;
      const product = productId ? getProductById(productId) : null;
      if (!product) {
        orderFormError.textContent = "This product is no longer available.";
        return;
      }

      const fullName = String(orderForm.elements.fullName?.value || "").trim();
      const phone = String(orderForm.elements.phone?.value || "").trim();
      const address = String(orderForm.elements.address?.value || "").trim();
      const email = String(orderForm.elements.email?.value || "").trim();
      const notes = String(orderForm.elements.notes?.value || "").trim();
      const qty = parsePositiveInt(orderForm.elements.qty?.value, 1);

      if (!fullName) {
        orderFormError.textContent = "Please enter your full name.";
        orderForm.elements.fullName?.focus?.();
        return;
      }
      if (!phone) {
        orderFormError.textContent = "Please enter a phone number.";
        orderForm.elements.phone?.focus?.();
        return;
      }
      if (!address) {
        orderFormError.textContent = "Please enter a delivery address.";
        orderForm.elements.address?.focus?.();
        return;
      }

      const orderData = {
        fullName,
        phone,
        email: email || null,
        address,
        notes: notes || null,
        qty,
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          type: product.type,
          price: product.price,
          image: product.image,
        },
        total: product.price * qty,
        createdAt: new Date().toISOString(),
      };

      try {
        setOrderSubmitting(true);
        await saveOrderToFirebase(orderData);
        closeOrderModal();
        showToast(`Thanks! Order received for ${qty}× ${product.name}.`);
      } catch (err) {
        console.error("Failed to save order:", err);
        orderFormError.textContent =
          "Unable to place order now. Please check Firebase config and try again.";
      } finally {
        setOrderSubmitting(false);
      }
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (orderModalOverlay?.classList.contains("modalOverlayOpen")) {
      closeOrderModal();
      return;
    }
    if (detailsModalOverlay.classList.contains("modalOverlayOpen")) closeDetails();
  });

  // Events: modal actions
  detailsAddToCartBtn.addEventListener("click", () => {
    const productId = detailsAddToCartBtn.dataset.productId;
    if (!productId) return;
    addToCart(productId, 1);
    updateCartBadge();
    showToast("Added to cart");
  });

  detailsFavoriteBtn.addEventListener("click", () => {
    const productId = detailsFavoriteBtn.dataset.productId;
    if (!productId) return;
    const nextIsFav = toggleFavorite(productId);
    detailsFavoriteBtn.classList.toggle("liked", nextIsFav);
    detailsFavoriteBtn.textContent = nextIsFav ? "Liked" : "Like";
    showToast(nextIsFav ? "Added to favorites" : "Removed from favorites");
  });

  if (detailsBuyBtn) {
    detailsBuyBtn.addEventListener("click", () => {
      const productId = detailsBuyBtn.dataset.productId;
      if (!productId) return;
      openOrderModal(productId);
    });
  }

  // Footer year + initial render
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  updateCartBadge();
  renderProducts();
})();

