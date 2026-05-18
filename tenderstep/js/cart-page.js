(function () {
  const root = document.getElementById("cart-content");
  const fmt = TenderStepStore.formatPrice;
  const cart = TenderStepCart;

  function render() {
    const items = cart.getLineItems();

    if (!items.length) {
      root.className = "";
      root.innerHTML = `
        <div class="cart-empty" style="grid-column:1/-1">
          <span style="font-size:3rem">🛒</span>
          <p>Giỏ hàng trống. Hãy chọn sản phẩm TenderStep nhé!</p>
          <a href="shop.html" class="btn btn-primary btn-lg">Mua sắm ngay</a>
        </div>`;
      return;
    }

    root.className = "cart-layout";
    const subtotal = cart.getSubtotal();
    const freeShip = cart.hasFreeShip();
    const shipping = freeShip ? 0 : 30000;
    const total = subtotal + shipping;
    const remain = cart.FREE_SHIP_MIN - subtotal;

    root.innerHTML = `
      <div class="cart-items">
        ${items
          .map(
            (item) => `
          <div class="cart-item" data-id="${item.productId}">
            <a href="product.html?id=${item.productId}" class="cart-item-thumb">
              <img src="${TenderStepStore.imgSrc(item.product.image)}" alt="${item.product.name}" loading="lazy" />
            </a>
            <div class="cart-item-info">
              <h3><a href="product.html?id=${item.productId}">${item.product.name}</a></h3>
              <p style="font-size:0.85rem;color:var(--text-muted)">${item.product.tagline}</p>
              <div class="qty-control" style="margin-top:0.75rem;width:fit-content">
                <button type="button" data-qty-minus="${item.productId}">−</button>
                <input type="number" value="${item.qty}" min="1" max="20" data-qty-input="${item.productId}" aria-label="Số lượng" />
                <button type="button" data-qty-plus="${item.productId}">+</button>
              </div>
              <p class="line-price">${fmt(item.lineTotal)}</p>
            </div>
            <div class="cart-item-actions">
              <button type="button" class="btn-remove" data-remove="${item.productId}">Xóa</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <aside class="cart-summary">
        <h2>Tóm tắt đơn</h2>
        <div class="summary-row"><span>Tạm tính</span><span>${fmt(subtotal)}</span></div>
        <div class="summary-row"><span>Phí ship</span><span>${freeShip ? "Miễn phí" : fmt(shipping)}</span></div>
        ${
          !freeShip && remain > 0
            ? `<p class="ship-note">Mua thêm ${fmt(remain)} để được freeship (đơn từ 99K)</p>`
            : freeShip
              ? `<p class="ship-note">✓ Bạn được miễn phí vận chuyển</p>`
              : ""
        }
        <div class="summary-row total"><span>Tổng cộng</span><span>${fmt(total)}</span></div>
        <a href="checkout.html" class="btn btn-primary btn-lg" style="width:100%;margin-top:1rem">Tiến hành đặt hàng</a>
        <a href="shop.html" class="btn btn-ghost" style="width:100%;margin-top:0.5rem">Tiếp tục mua</a>
      </aside>
    `;
  }

  root?.addEventListener("click", (e) => {
    const id = e.target.dataset.remove;
    if (id) {
      cart.remove(id);
      showToast("Đã xóa sản phẩm khỏi giỏ");
      render();
      return;
    }
    const minus = e.target.dataset.qtyMinus;
    const plus = e.target.dataset.qtyPlus;
    if (minus || plus) {
      const pid = minus || plus;
      const input = root.querySelector(`[data-qty-input="${pid}"]`);
      let q = parseInt(input?.value, 10) || 1;
      q = plus ? q + 1 : q - 1;
      cart.setQty(pid, q);
      render();
    }
  });

  root?.addEventListener("change", (e) => {
    const input = e.target.closest("[data-qty-input]");
    if (input) {
      cart.setQty(input.dataset.qtyInput, parseInt(input.value, 10) || 1);
      render();
    }
  });

  document.addEventListener("DOMContentLoaded", render);
  window.addEventListener("cart-updated", render);
})();
