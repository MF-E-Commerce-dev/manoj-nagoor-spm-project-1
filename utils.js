(() => {
  const CART_KEY = "mn_cart_v1";
  const FAV_KEY = "mn_favs_v1";

  function safeParseJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

function formatPrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "₹0.00";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

  function loadCart() {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = safeParseJson(raw, []);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.productId === "string")
      .map((x) => ({ productId: x.productId, qty: Math.max(1, Number(x.qty) || 1) }));
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function normalizeCart(cart) {
    const map = new Map();
    for (const item of cart) {
      const id = item.productId;
      const qty = Math.max(1, Number(item.qty) || 1);
      map.set(id, (map.get(id) || 0) + qty);
    }
    return Array.from(map.entries()).map(([productId, qty]) => ({ productId, qty }));
  }

  function getCart() {
    return normalizeCart(loadCart());
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, x) => sum + x.qty, 0);
  }

  function upsertCartItem(productId, deltaQty) {
    const cart = getCart();
    const idx = cart.findIndex((x) => x.productId === productId);
    if (idx >= 0) {
      const nextQty = Math.max(0, cart[idx].qty + Number(deltaQty));
      if (nextQty <= 0) cart.splice(idx, 1);
      else cart[idx] = { productId, qty: nextQty };
    } else if (deltaQty > 0) {
      cart.push({ productId, qty: Number(deltaQty) });
    }
    saveCart(cart);
    return cart;
  }

  function addToCart(productId, qty = 1) {
    return upsertCartItem(productId, qty);
  }

  function removeFromCart(productId) {
    return upsertCartItem(productId, -999999);
  }

  function setCartQty(productId, qty) {
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) return removeFromCart(productId);
    const cart = getCart();
    const idx = cart.findIndex((x) => x.productId === productId);
    if (idx >= 0) cart[idx] = { productId, qty: Math.floor(n) };
    else cart.push({ productId, qty: Math.floor(n) });
    saveCart(cart);
    return cart;
  }

  function loadFavorites() {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = safeParseJson(raw, []);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  }

  function saveFavorites(ids) {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  }

  function getFavorites() {
    // Keep it array for localStorage readability.
    return Array.from(new Set(loadFavorites()));
  }

  function isFavorite(productId) {
    return getFavorites().includes(productId);
  }

  function toggleFavorite(productId) {
    const favs = getFavorites();
    const idx = favs.indexOf(productId);
    let nextIsFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(productId);
      nextIsFav = true;
    }
    saveFavorites(favs);
    return nextIsFav;
  }

  function getProductById(productId) {
    if (!Array.isArray(window.PRODUCTS)) return null;
    return window.PRODUCTS.find((p) => p.id === productId) || null;
  }

  function calcCartTotal(cart) {
    const items = cart ?? getCart();
    let total = 0;
    for (const line of items) {
      const product = getProductById(line.productId);
      if (!product) continue;
      total += product.price * line.qty;
    }
    return total;
  }

  function getCartDetailed() {
    const cart = getCart();
    return cart
      .map((line) => {
        const product = getProductById(line.productId);
        if (!product) return null;
        return { product, qty: line.qty, lineTotal: product.price * line.qty };
      })
      .filter(Boolean);
  }

  window.MNUtils = {
    formatPrice,
    getCart,
    getCartCount,
    addToCart,
    removeFromCart,
    setCartQty,
    getFavorites,
    isFavorite,
    toggleFavorite,
    getProductById,
    calcCartTotal,
    getCartDetailed,
  };
})();

