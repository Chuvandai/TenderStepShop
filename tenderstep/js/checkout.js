(function () {
  const root = document.getElementById("checkout-root");
  const cart = TenderStepCart;
  const fmt = TenderStepStore.formatPrice;

  function renderForm() {
    const items = cart.getLineItems();
    if (!items.length) {
      root.innerHTML = `
        <div class="cart-empty">
          <p>Giỏ hàng trống. Không thể đặt hàng.</p>
          <a href="shop.html" class="btn btn-primary">Về cửa hàng</a>
        </div>`;
      return;
    }

    const subtotal = cart.getSubtotal();
    const freeShip = cart.hasFreeShip();
    const shipping = freeShip ? 0 : 30000;
    const total = subtotal + shipping;

    root.innerHTML = `
      <div class="checkout-layout">
        <form class="checkout-form" id="checkout-form">
          <h2>Thông tin giao hàng</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="name">Họ và tên *</label>
              <input type="text" id="name" name="name" required placeholder="Nguyễn Thị ..." />
            </div>
            <div class="form-group">
              <label for="phone">Số điện thoại *</label>
              <input type="tel" id="phone" name="phone" required placeholder="09xx xxx xxx" pattern="[0-9\\s+]{9,15}" />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email (tuỳ chọn)</label>
            <input type="email" id="email" name="email" placeholder="email@example.com" />
          </div>
          <div class="form-group">
            <label for="address">Địa chỉ giao hàng *</label>
            <textarea id="address" name="address" rows="3" required placeholder="Số nhà, đường, phường, quận, tỉnh/thành"></textarea>
          </div>
          <div class="form-group">
            <label for="payment">Hình thức thanh toán</label>
            <select id="payment" name="payment">
              <option value="cod">COD – Thanh toán khi nhận hàng</option>
              <option value="bank">Chuyển khoản ngân hàng</option>
              <option value="momo">Ví MoMo / ZaloPay</option>
            </select>
          </div>
          <div class="form-group">
            <label for="note">Ghi chú đơn hàng</label>
            <textarea id="note" name="note" rows="2" placeholder="Giờ giao, lời nhắn..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%">Xác nhận đặt hàng</button>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:1rem;text-align:center">
            Đơn hàng demo – lưu trên trình duyệt, không gửi server. Shop sẽ liên hệ qua SĐT bạn nhập.
          </p>
        </form>
        <aside class="cart-summary">
          <h2>Đơn hàng (${items.reduce((s, i) => s + i.qty, 0)} sp)</h2>
          ${items
            .map(
              (i) => `
            <div class="summary-row" style="font-size:0.85rem">
              <span>${i.product.emoji} ${i.product.name} × ${i.qty}</span>
              <span>${fmt(i.lineTotal)}</span>
            </div>`
            )
            .join("")}
          <div class="summary-row" style="margin-top:1rem"><span>Tạm tính</span><span>${fmt(subtotal)}</span></div>
          <div class="summary-row"><span>Phí ship</span><span>${freeShip ? "Miễn phí" : fmt(shipping)}</span></div>
          <div class="summary-row total"><span>Tổng</span><span>${fmt(total)}</span></div>
        </aside>
      </div>
    `;
  }

  function renderSuccess(order) {
    document.getElementById("checkout-main").querySelector("h1").textContent = "Đặt hàng thành công!";
    root.innerHTML = `
      <div class="order-success">
        <div class="success-icon">✅</div>
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Đơn hàng demo đã được lưu. TenderStep sẽ liên hệ xác nhận qua số điện thoại.</p>
        <p class="order-id">Mã đơn: ${order.id}</p>
        <p style="color:var(--text-muted);font-size:0.9rem">
          ${order.customer.name} · ${order.customer.phone}<br />
          ${order.customer.address}
        </p>
        <p style="margin-top:1rem;font-weight:700;color:var(--sage-dark)">
          Tổng thanh toán: ${fmt(order.total)}
        </p>
        <div class="success-actions">
          <a href="orders.html" class="btn btn-primary">Xem đơn hàng của tôi</a>
          <a href="shop.html" class="btn btn-ghost">Tiếp tục mua sắm</a>
        </div>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", renderForm);

  root?.addEventListener("submit", (e) => {
    const form = e.target.closest("#checkout-form");
    if (!form) return;
    e.preventDefault();
    const fd = new FormData(form);
    const order = cart.saveOrder({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email") || "",
      address: fd.get("address"),
      payment: fd.get("payment"),
      note: fd.get("note") || "",
    });
    renderSuccess(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
