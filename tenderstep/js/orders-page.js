(function () {
  const root = document.getElementById("orders-root");
  const fmt = TenderStepStore.formatPrice;

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function paymentLabel(method) {
    const map = {
      cod: "COD – Thanh toán khi nhận",
      bank: "Chuyển khoản",
      momo: "MoMo / ZaloPay",
    };
    return map[method] || method || "—";
  }

  function renderOrderItems(items) {
    if (!items?.length) return "<p class='order-empty-items'>Không có sản phẩm</p>";
    return items
      .map((line) => {
        const p = line.product;
        const img = p?.image ? TenderStepStore.imgSrc(p.image) : "";
        const name = p?.name || "Sản phẩm";
        return `
          <li class="order-item-row">
            <a href="${p ? `product.html?id=${p.id}` : "#"}" class="order-item-thumb">
              ${img ? `<img src="${img}" alt="${name}" />` : ""}
            </a>
            <div class="order-item-info">
              <a href="${p ? `product.html?id=${p.id}` : "#"}"><strong>${name}</strong></a>
              <span>Số lượng: ${line.qty}</span>
            </div>
            <span class="order-item-price">${fmt(line.lineTotal)}</span>
          </li>`;
      })
      .join("");
  }

  function renderOrderCard(order) {
    const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0;
    return `
      <article class="order-card" data-order-id="${order.id}">
        <header class="order-card-head">
          <div class="order-card-meta">
            <span class="order-id">${order.id}</span>
            <time datetime="${order.createdAt}">${formatDate(order.createdAt)}</time>
          </div>
          <span class="order-status">Đã đặt</span>
        </header>
        <ul class="order-items-list">${renderOrderItems(order.items)}</ul>
        <div class="order-card-customer">
          <p><strong>${order.customer?.name || "—"}</strong> · ${order.customer?.phone || ""}</p>
          <p class="order-address">${order.customer?.address || ""}</p>
          <p class="order-payment">${paymentLabel(order.customer?.payment)}</p>
          ${order.customer?.note ? `<p class="order-note">Ghi chú: ${order.customer.note}</p>` : ""}
        </div>
        <footer class="order-card-foot">
          <div class="order-totals">
            <span>Tạm tính: ${fmt(order.subtotal)}</span>
            <span>Ship: ${order.shipping === 0 ? "Miễn phí" : fmt(order.shipping)}</span>
            <strong>Tổng: ${fmt(order.total)}</strong>
          </div>
          <span class="order-item-count">${itemCount} sản phẩm</span>
        </footer>
      </article>`;
  }

  function render() {
    const orders = TenderStepCart.getOrders();

    if (!orders.length) {
      root.innerHTML = `
        <div class="orders-empty">
          <span class="orders-empty-icon">📦</span>
          <h2>Chưa có đơn hàng</h2>
          <p>Bạn chưa đặt hàng nào. Hãy chọn sản phẩm và thanh toán nhé!</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Mua sắm ngay</a>
        </div>`;
      return;
    }

    root.innerHTML = `
      <p class="orders-count">${orders.length} đơn hàng</p>
      <div class="orders-list">
        ${orders.map(renderOrderCard).join("")}
      </div>`;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
