/** Render ảnh sản phẩm thống nhất */
window.ProductUI = {
  imageTag(file, alt, className) {
    const cls = className ? ` class="${className}"` : "";
    return `<img src="${TenderStepStore.imgSrc(file)}" alt="${alt}"${cls} loading="lazy" decoding="async" />`;
  },

  cardImage(product) {
    return `
      <a href="product.html?id=${product.id}" class="card-image">
        ${this.imageTag(product.image, product.name, "card-img")}
        ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ""}
      </a>`;
  },

  thumbImage(file, alt, active) {
    return `
      <button type="button" class="gallery-thumb${active ? " active" : ""}" data-gallery="${file}" aria-label="Xem ảnh">
        ${this.imageTag(file, alt, "thumb-img")}
      </button>`;
  },
};
