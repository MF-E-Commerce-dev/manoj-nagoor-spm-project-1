(() => {
  const utils = window.MNUtils;
  const {
    formatPrice,
    getCart,
    getCartCount,
    setCartQty,
    removeFromCart,
    getCartDetailed,
    calcCartTotal,
  } = utils;

  const cartItemsList = document.getElementById("cartItemsList");
  const cartEmptyState = document.getElementById("cartEmptyState");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartItemsCountLabel = document.getElementById("cartItemsCountLabel");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const cartCountBadge = document.getElementById("cartCountBadge");

  function updateHeaderBadge() {
    if (cartCountBadge) cartCountBadge.textContent = String(getCartCount());
  }

  function renderCart() {
    const cart = getCart();
    const items = getCartDetailed();

    if (!items.length) {
      cartItemsList.innerHTML = "";
      cartEmptyState.style.display = "block";
    } else {
      cartEmptyState.style.display = "none";
      cartItemsList.innerHTML = items
        .map((row) => {
          const { product, qty, lineTotal } = row;
          return `
            <div class="cartItemRow" data-product-id="${product.id}">
              <img src="${product.image}" alt="${product.name}" />
              <div class="cartItemInfo">
                <h3>${product.name}</h3>
                <small>${product.category} • ${product.type} • ${formatPrice(product.price)} each</small>
              </div>
              <div class="cartItemRight">
                <div class="qtyRow">
                  <button type="button" class="btn btnGhost qtyMinusBtn" data-product-id="${product.id}" aria-label="Decrease quantity">-</button>
                  <input
                    class="qtyInput qtyInputEl"
                    type="number"
                    min="1"
                    step="1"
                    value="${qty}"
                    data-product-id="${product.id}"
                    aria-label="Quantity"
                  />
                  <button type="button" class="btn btnGhost qtyPlusBtn" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
                </div>
                <div style="font-weight: 1000">${formatPrice(lineTotal)}</div>
                <button type="button" class="btn btnDanger removeFromCartBtn" data-product-id="${product.id}">
                  Remove
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    }

    cartItemsCountLabel.textContent = String(cart.reduce((sum, x) => sum + x.qty, 0));
    cartTotalEl.textContent = formatPrice(calcCartTotal(cart));
    updateHeaderBadge();

    if (clearCartBtn) {
      clearCartBtn.disabled = cart.length === 0;
      clearCartBtn.style.opacity = cart.length === 0 ? "0.6" : "1";
      clearCartBtn.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
    }
  }

  cartItemsList.addEventListener("click", (e) => {
    const target = e.target;
    const pid = target.closest("[data-product-id]")?.getAttribute("data-product-id");
    if (!pid) return;

    const cart = getCart();
    const line = cart.find((x) => x.productId === pid);
    const currentQty = line ? line.qty : 0;

    if (target.closest(".qtyMinusBtn")) {
      const nextQty = Math.max(1, currentQty - 1);
      setCartQty(pid, nextQty);
      renderCart();
      return;
    }

    if (target.closest(".qtyPlusBtn")) {
      setCartQty(pid, currentQty + 1);
      renderCart();
      return;
    }

    if (target.closest(".removeFromCartBtn")) {
      removeFromCart(pid);
      renderCart();
      return;
    }
  });

  cartItemsList.addEventListener("change", (e) => {
    const el = e.target;
    if (!el.classList || !el.classList.contains("qtyInputEl")) return;

    const pid = el.getAttribute("data-product-id");
    const n = Number(el.value);
    if (!Number.isFinite(n) || n <= 0) {
      // Reset invalid values.
      renderCart();
      return;
    }
    setCartQty(pid, Math.floor(n));
    renderCart();
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      localStorage.removeItem("mn_cart_v1");
      renderCart();
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  renderCart();
})();

