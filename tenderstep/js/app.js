/** Header, footer, toast – dùng chung mọi trang shop */
(function () {
  const path = window.location.pathname;
  const page = path.includes("shop")
    ? "shop"
    : path.includes("product")
      ? "product"
      : path.includes("orders")
        ? "orders"
        : path.includes("cart")
          ? "cart"
          : path.includes("checkout")
            ? "checkout"
            : "home";

  function cartCount() {
    return window.TenderStepCart?.getCount() || 0;
  }

  window.renderSiteHeader = function (active) {
    const act = active || page;
    const count = cartCount();
    return `
      <header class="header scrolled" id="top">
        <nav class="nav container">
          <a href="index.html" class="logo">
            <img src="images/lg.jpg" alt="TenderStep" class="logo-img" width="180" height="64" />
          </a>
          <button class="nav-toggle" aria-label="Mở menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links">
            <li><a href="index.html" class="${act === "home" ? "active" : ""}">Trang chủ</a></li>
            <li><a href="shop.html" class="${act === "shop" ? "active" : ""}">Sản phẩm</a></li>
            <li><a href="orders.html" class="${act === "orders" ? "active" : ""}">Đơn hàng</a></li>
            <li>
              <a href="cart.html" class="nav-cart ${act === "cart" ? "active" : ""}" aria-label="Giỏ hàng">
                🛒
                <span class="cart-badge" data-cart-badge>${count > 0 ? count : ""}</span>
              </a>
            </li>
            <li><a href="shop.html" class="btn btn-sm btn-primary">Mua ngay</a></li>
          </ul>
        </nav>
      </header>
    `;
  };

  window.renderSiteFooter = function () {
    return `
      <footer class="footer">
        <div class="container footer-inner">
          <div class="footer-main">
            <div class="footer-brand-col">
              <a href="index.html" class="footer-logo-link">
                <img src="images/lg2.jpg" alt="TenderStep" class="footer-logo" />
              </a>
              <p class="footer-tagline-brand">Bước chân dịu dàng 🌿</p>
              <p class="footer-desc">Tất ủ gót chân nha đam – chăm sóc dịu nhẹ dành cho phụ nữ hiện đại.</p>
            </div>
            <div class="footer-nav-col">
              <h4 class="footer-col-title">Khám phá</h4>
              <nav class="footer-nav">
                <a href="index.html">Trang chủ</a>
                <a href="shop.html">Sản phẩm</a>
                <a href="index.html#benefits">Công dụng</a>
                <a href="cart.html">Giỏ hàng</a>
                <a href="orders.html">Đơn hàng của tôi</a>
              </nav>
            </div>
            <div class="footer-contact-col">
              <h4 class="footer-col-title">Liên hệ</h4>
              <div class="footer-contact-cards">
                <div class="footer-contact-item">
                  <span class="icon">📞</span>
                  <span><a href="tel:0389715205">0389 715 205</a></span>
                </div>
                <div class="footer-contact-item">
                  <span class="icon">✉️</span>
                  <span><a href="mailto:hainguyennhu59@gmail.com">hainguyennhu59@gmail.com</a></span>
                </div>
                <div class="footer-contact-item">
                  <span class="icon">📍</span>
                  <span>Hà Nội, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p class="footer-copy">© TenderStep · Chăm sóc gót chân từ thiên nhiên</p>
            <p class="footer-made">Hà Nội, Việt Nam</p>
          </div>
        </div>
      </footer>
    `;
  };

  function initNav() {
    const header = document.querySelector(".header");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!header?.classList.contains("scrolled")) {
      window.addEventListener(
        "scroll",
        () => header?.classList.toggle("scrolled", window.scrollY > 40),
        { passive: true }
      );
    }

    navToggle?.addEventListener("click", () => {
      const open = navLinks?.classList.toggle("open");
      navToggle.classList.toggle("active", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks?.classList.remove("open");
        navToggle?.classList.remove("active");
        navToggle?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function updateBadge() {
    const n = cartCount();
    document.querySelectorAll("[data-cart-badge]").forEach((el) => {
      el.textContent = n > 0 ? String(n) : "";
      el.classList.toggle("visible", n > 0);
    });
  }

  window.showToast = function (message, type = "success") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");
    if (headerSlot) {
      headerSlot.innerHTML = renderSiteHeader();
      initNav();
    }
    if (footerSlot) footerSlot.innerHTML = renderSiteFooter();
    updateBadge();
  });

  window.addEventListener("cart-updated", updateBadge);

  window.addToCart = function (productId, qty = 1) {
    const p = window.TenderStepStore.getProduct(productId);
    if (!p) return;
    window.TenderStepCart.add(productId, qty);
    showToast(`Đã thêm "${p.name}" vào giỏ hàng`);
    updateBadge();
  };
})();
