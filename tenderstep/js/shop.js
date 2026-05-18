(function () {
  const grid = document.getElementById("product-grid");
  const filters = document.getElementById("shop-filters");
  const sortSelect = document.getElementById("shop-sort");
  let currentFilter = "all";

  function renderCard(p) {
    const fmt = TenderStepStore.formatPrice;
    return `
      <article class="product-card-shop" data-category="${p.category}">
        ${ProductUI.cardImage(p)}
        <div class="card-body">
          <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
          <p class="card-tagline">${p.tagline}</p>
          <p class="card-rating">★ ${p.rating} · ${p.reviews} đánh giá</p>
          <div class="card-prices">
            <span class="price-current">${fmt(p.price)}</span>
            <span class="price-old">${fmt(p.oldPrice)}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-primary" data-add-cart="${p.id}">Thêm giỏ</button>
            <a href="product.html?id=${p.id}" class="card-link">Chi tiết →</a>
          </div>
        </div>
      </article>
    `;
  }

  function sortProducts(list, sortBy) {
    const arr = [...list];
    switch (sortBy) {
      case "price-asc":
        return arr.sort((a, b) => a.price - b.price);
      case "price-desc":
        return arr.sort((a, b) => b.price - a.price);
      case "rating":
        return arr.sort((a, b) => b.rating - a.rating);
      default:
        return arr;
    }
  }

  function render() {
    let products = TenderStepProducts;
    if (currentFilter !== "all") {
      products = products.filter((p) => p.category === currentFilter);
    }
    products = sortProducts(products, sortSelect?.value || "featured");
    grid.innerHTML = products.length
      ? products.map(renderCard).join("")
      : `<p class="shop-empty">Không có sản phẩm trong danh mục này.</p>`;
  }

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });

  sortSelect?.addEventListener("change", render);

  grid?.addEventListener("click", (e) => {
    const id = e.target.closest("[data-add-cart]")?.dataset.addCart;
    if (id) {
      e.preventDefault();
      addToCart(id, 1);
    }
  });

  document.addEventListener("DOMContentLoaded", render);
})();
