(function () {
  function updateBadge() {
    const n = TenderStepCart.getCount();
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = n > 0 ? String(n) : "";
      el.classList.toggle("visible", n > 0);
    });
  }

  function showToast(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = "toast show";
    clearTimeout(window._homeToast);
    window._homeToast = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function renderHomeProducts() {
    const el = document.getElementById("home-products");
    if (!el) return;
    const fmt = TenderStepStore.formatPrice;

    el.innerHTML = TenderStepProducts.map(
      (p) => `
      <article class="product-card-shop">
        ${ProductUI.cardImage(p)}
        <div class="card-body">
          <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
          <p class="card-tagline">${p.tagline}</p>
          <div class="card-prices">
            <span class="price-current">${fmt(p.price)}</span>
            <span class="price-old">${fmt(p.oldPrice)}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-primary" data-add="${p.id}">Thêm giỏ</button>
            <a href="product.html?id=${p.id}" class="card-link">Chi tiết →</a>
          </div>
        </div>
      </article>`
    ).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHomeProducts();
    updateBadge();

    document.getElementById("home-products")?.addEventListener("click", (e) => {
      const id = e.target.closest("[data-add]")?.dataset.add;
      if (!id) return;
      TenderStepCart.add(id, 1);
      const p = TenderStepStore.getProduct(id);
      updateBadge();
      showToast(`Đã thêm "${p.name}" vào giỏ hàng`);
    });
  });

  window.addEventListener("cart-updated", updateBadge);
})();
