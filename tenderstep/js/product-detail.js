(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const root = document.getElementById("product-root");
  const related = document.getElementById("related-products");
  const product = id ? TenderStepStore.getProduct(id) : null;

  if (!product) {
    root.innerHTML = `
      <div class="cart-empty" style="margin-top:2rem">
        <p>Không tìm thấy sản phẩm.</p>
        <a href="shop.html" class="btn btn-primary">Về cửa hàng</a>
      </div>`;
    document.title = "Không tìm thấy – TenderStep";
    return;
  }

  document.title = `${product.name} – TenderStep`;
  const fmt = TenderStepStore.formatPrice;
  const gallery = product.gallery || [product.image];

  root.innerHTML = `
    <nav class="breadcrumb" style="margin-top:0.5rem">
      <a href="index.html">Trang chủ</a><span>/</span>
      <a href="shop.html">Sản phẩm</a><span>/</span>
      <span>${product.name}</span>
    </nav>
    <div class="detail-grid">
      <div class="detail-gallery">
        <div class="detail-image" id="detail-main-image">
          ${ProductUI.imageTag(product.image, product.name, "detail-img")}
          <span class="detail-badge">${product.badge}</span>
        </div>
        <div class="gallery-thumbs" id="gallery-thumbs">
          ${gallery.map((f, i) => ProductUI.thumbImage(f, product.name, i === 0)).join("")}
        </div>
      </div>
      <div class="detail-info">
        <h1>${product.name}</h1>
        <p class="detail-meta">★ ${product.rating} (${product.reviews} đánh giá) · Còn ${product.stock} sản phẩm</p>
        <p class="price-range-note">${product.priceNote || ""}</p>
        <div class="detail-prices">
          <span class="price-current">${fmt(product.price)}</span>
          <span class="price-old">${fmt(product.oldPrice)}</span>
        </div>
        <p class="detail-desc">${product.description}</p>
        <p class="wholesale-note">📦 Giá nhập dự kiến (sản xuất số lượng): <strong>12.000 – 25.000đ / đôi</strong></p>
        <ul class="detail-highlights">
          ${product.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
        <div class="qty-row">
          <span>Số lượng:</span>
          <div class="qty-control">
            <button type="button" id="qty-minus" aria-label="Giảm">−</button>
            <input type="number" id="qty-input" value="1" min="1" max="20" aria-label="Số lượng" />
            <button type="button" id="qty-plus" aria-label="Tăng">+</button>
          </div>
        </div>
        <div class="detail-actions">
          <button type="button" class="btn btn-primary btn-lg" id="btn-add-cart">Thêm vào giỏ</button>
          <a href="cart.html" class="btn btn-ghost btn-lg">Xem giỏ hàng</a>
        </div>
        <div class="detail-tabs">
          <div class="tab-pills">
            <button type="button" class="tab-pill active" data-tab="ingredients">Thành phần</button>
            <button type="button" class="tab-pill" data-tab="howto">Cách dùng</button>
          </div>
          <div class="tab-panel active" id="tab-ingredients">
            <ul>${product.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
          </div>
          <div class="tab-panel" id="tab-howto">
            <ul>${product.howToUse.map((s) => `<li>${s}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </div>
  `;

  const mainWrap = document.getElementById("detail-main-image");
  document.getElementById("gallery-thumbs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gallery]");
    if (!btn) return;
    const file = btn.dataset.gallery;
    document.querySelectorAll(".gallery-thumb").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    mainWrap.innerHTML = `
      ${ProductUI.imageTag(file, product.name, "detail-img")}
      <span class="detail-badge">${product.badge}</span>`;
  });

  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus")?.addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  document.getElementById("qty-plus")?.addEventListener("click", () => {
    qtyInput.value = Math.min(20, parseInt(qtyInput.value, 10) + 1);
  });

  document.getElementById("btn-add-cart")?.addEventListener("click", () => {
    addToCart(product.id, parseInt(qtyInput.value, 10) || 1);
  });

  document.querySelectorAll(".tab-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".tab-pill").forEach((p) => p.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      document.getElementById("tab-" + pill.dataset.tab)?.classList.add("active");
    });
  });

  const others = TenderStepProducts.filter((p) => p.id !== product.id).slice(0, 3);
  related.innerHTML = others
    .map(
      (p) => `
        <article class="product-card-shop">
          ${ProductUI.cardImage(p)}
          <div class="card-body">
            <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
            <div class="card-prices">
              <span class="price-current">${fmt(p.price)}</span>
            </div>
            <a href="product.html?id=${p.id}" class="card-link" style="display:block;margin-top:0.35rem">Chi tiết →</a>
          </div>
        </article>`
    )
    .join("");
})();
