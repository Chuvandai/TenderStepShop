/** Giỏ hàng – localStorage, không backend */
(function () {
  const CART_KEY = "tenderstep_cart";
  const ORDERS_KEY = "tenderstep_orders";
  const FREE_SHIP_MIN = 99000;

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: items }));
  }

  window.TenderStepCart = {
    FREE_SHIP_MIN,

    getItems() {
      return readCart();
    },

    getCount() {
      return readCart().reduce((s, i) => s + i.qty, 0);
    },

    getSubtotal() {
      return readCart().reduce((s, i) => {
        const p = window.TenderStepStore?.getProduct(i.productId);
        return s + (p ? p.price * i.qty : 0);
      }, 0);
    },

    hasFreeShip() {
      return this.getSubtotal() >= FREE_SHIP_MIN;
    },

    add(productId, qty = 1) {
      const items = readCart();
      const found = items.find((i) => i.productId === productId);
      if (found) found.qty += qty;
      else items.push({ productId, qty });
      writeCart(items);
    },

    setQty(productId, qty) {
      let items = readCart();
      if (qty <= 0) {
        items = items.filter((i) => i.productId !== productId);
      } else {
        const found = items.find((i) => i.productId === productId);
        if (found) found.qty = qty;
      }
      writeCart(items);
    },

    remove(productId) {
      writeCart(readCart().filter((i) => i.productId !== productId));
    },

    clear() {
      writeCart([]);
    },

    getLineItems() {
      return readCart()
        .map((item) => {
          const product = window.TenderStepStore?.getProduct(item.productId);
          if (!product) return null;
          return {
            ...item,
            product,
            lineTotal: product.price * item.qty,
          };
        })
        .filter(Boolean);
    },

    saveOrder(formData) {
      const order = {
        id: "TS" + Date.now(),
        createdAt: new Date().toISOString(),
        items: this.getLineItems(),
        subtotal: this.getSubtotal(),
        shipping: this.hasFreeShip() ? 0 : 30000,
        customer: formData,
        total:
          this.getSubtotal() + (this.hasFreeShip() ? 0 : 30000),
      };
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      this.clear();
      return order;
    },

    getOrders() {
      try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
      } catch {
        return [];
      }
    },

    getOrder(orderId) {
      return this.getOrders().find((o) => o.id === orderId);
    },
  };
})();
