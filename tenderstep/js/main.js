(function () {
  "use strict";

  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const cursorGlow = document.querySelector(".cursor-glow");
  const heroPhoto = document.querySelector(".hero-photo-wrap");

  /* Header scroll */
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );

  /* Mobile nav */
  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.classList.remove("active");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  if (!hasGsap) return;

  /* Cursor glow */
  if (cursorGlow && window.matchMedia("(min-width: 1024px)").matches) {
    window.addEventListener(
      "mousemove",
      (e) => {
        gsap.to(cursorGlow, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: "power2.out",
        });
      },
      { passive: true }
    );
  }

  if (heroPhoto) {
    heroPhoto.addEventListener("mousemove", (e) => {
      const rect = heroPhoto.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      gsap.to(heroPhoto, { x, y, duration: 0.35, ease: "power2.out" });
    });
    heroPhoto.addEventListener("mouseleave", () => {
      gsap.to(heroPhoto, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
    });
  }

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero .eyebrow", { opacity: 0, y: 24, duration: 0.7 })
    .from(".hero-title", { opacity: 0, y: 36, duration: 0.9 }, "-=0.4")
    .from(".hero-lead", { opacity: 0, y: 24, duration: 0.7 }, "-=0.5")
    .from(".hero-benefits li", { opacity: 0, x: -20, stagger: 0.1, duration: 0.5 }, "-=0.3")
    .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.2")
    .from(".hero-visual", { opacity: 0, scale: 0.92, duration: 1 }, "-=0.8")
    .from(".floating-tag", { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, "-=0.5");

  /* Scroll reveals */
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.closest(".hero")) return;

    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
    });
  });

  /* Stagger grids */
  ["benefits-grid", "ingredients-grid", "testimonials-grid", "catalog-preview", "product-grid"].forEach((cls) => {
    const grid = document.querySelector("." + cls);
    if (!grid) return;
    const items = grid.children;
    gsap.from(items, {
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
      },
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  /* Parallax blobs */
  gsap.to(".blob-1", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
    },
    y: 120,
    x: 40,
  });

  gsap.to(".blob-2", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
    y: -80,
    x: -30,
  });

  /* USP & offer – chỉ trượt nhẹ, không ẩn opacity */
  gsap.from(".usp-box", {
    scrollTrigger: {
      trigger: ".usp-box",
      start: "top 90%",
    },
    y: 24,
    duration: 0.7,
    ease: "power3.out",
  });

  gsap.from(".offer-card", {
    scrollTrigger: {
      trigger: ".offer-card",
      start: "top 88%",
    },
    y: 24,
    duration: 0.7,
    ease: "power3.out",
  });
})();
