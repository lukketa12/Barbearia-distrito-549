(() => {
  "use strict";

  const business = Object.freeze({
    name: "Distrito 549 Barbearia",
    whatsappNumber: "5519987815442",
    whatsappMessage: "Olá! Vim pelo site e gostaria de agendar um horário."
  });

  const whatsappUrl = "https://wa.me/" + business.whatsappNumber + "?text=" + encodeURIComponent(business.whatsappMessage);
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const phone = business.whatsappNumber.slice(2);
  document.querySelectorAll("[data-phone]").forEach((link) => {
    link.href = "tel:+" + business.whatsappNumber;
    link.textContent = "(" + phone.slice(0, 2) + ") " + phone.slice(2, 7) + "-" + phone.slice(7);
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-logo]").forEach((img) => {
    const fallback = img.parentElement.querySelector("[data-logo-fallback]");
    const update = () => {
      const ready = img.complete && img.naturalWidth > 0;
      img.hidden = !ready;
      if (fallback) fallback.hidden = ready;
    };
    img.addEventListener("load", update);
    img.addEventListener("error", update);
    update();
  });

  document.querySelectorAll("[data-photo]").forEach((img) => {
    const update = () => {
      const ready = img.complete && img.naturalWidth > 1;
      img.closest("[data-photo-frame]")?.classList.toggle("has-photo", ready);
      img.hidden = !ready;
    };
    img.addEventListener("load", update);
    img.addEventListener("error", update);
    if (img.complete) update();
  });

  const header = document.querySelector("#cabecalho");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#menu-principal");
  const desktop = window.matchMedia("(min-width: 1024px)");

  if (header && toggle && menu) {
    document.documentElement.classList.add("js-enabled");
    toggle.hidden = false;
    const setMenu = (open, restoreFocus = false) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false, true);
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setMenu(false);
    });
    header.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!header.contains(document.activeElement)) setMenu(false);
      });
    });
    desktop.addEventListener("change", () => setMenu(false));
    const measureHeader = () => document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
    if ("ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);
    else window.addEventListener("resize", measureHeader);
    measureHeader();
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let revealObserver;
  const configureReveal = () => {
    revealObserver?.disconnect();
    const elements = document.querySelectorAll("[data-reveal]");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.remove("reveal-pending"));
      return;
    }
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("reveal-pending");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;
      element.classList.add("reveal-pending");
      revealObserver.observe(element);
    });
  };
  configureReveal();
  reducedMotion.addEventListener("change", configureReveal);

  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: business.name,
    description: "Barbearia em Americana - SP. Corte de cabelo e barba.",
    telephone: "+" + business.whatsappNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: "R. Tuiuti, 549 – Vila Santa Catarina",
      addressLocality: "Americana",
      addressRegion: "SP",
      postalCode: "13466-260",
      addressCountry: "BR"
    }
  });
  document.head.append(schema);
})();
