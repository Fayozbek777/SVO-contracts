(function () {
  "use strict";

  const FORM_ENDPOINT = "https://formspree.io/f/xbjnqozv";

  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }

  burger.addEventListener("click", toggleMenu);

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (mobileMenu.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      toggleMenu();
    }
  });

  const overlay = document.getElementById("modalOverlay");
  const openTriggers = [
    "btn-open-modal-1",
    "btn-open-modal-2",
    "btn-open-modal-mobile",
  ];

  openTriggers.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${window.scrollY}px`;

        if (mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
          burger.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(document.body.style.top || "0") * -1);
  }

  document.getElementById("modalClose").addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  async function handleSubmit(form, statusEl, successMsg) {
    const data = Object.fromEntries(new FormData(form).entries());
    statusEl.classList.remove("ok", "err");
    statusEl.classList.add("show");
    statusEl.textContent = "Отправляем…";

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        statusEl.textContent = successMsg;
        statusEl.classList.add("ok");
        form.reset();
      } else {
        throw new Error("bad response");
      }
    } catch (err) {
      statusEl.textContent =
        "Не удалось отправить. Попробуйте ещё раз или напишите на почту напрямую.";
      statusEl.classList.add("err");
    }
  }

  document.getElementById("modalForm").addEventListener("submit", function (e) {
    e.preventDefault();
    handleSubmit(
      this,
      document.getElementById("modalStatus"),
      "Заявка отправлена. Свяжемся с вами в течение рабочего дня.",
    ).then(() => setTimeout(closeModal, 1400));
  });

  document
    .getElementById("footerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      handleSubmit(
        this,
        document.getElementById("footerStatus"),
        "Сообщение отправлено. Ответим на указанный email.",
      );
    });

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  const statNums = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString("ru-RU");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const statIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    statNums.forEach((el) => statIo.observe(el));
  } else {
    statNums.forEach((el) => {
      el.textContent = el.dataset.count;
    });
  }

  const liveCounter = document.getElementById("liveCounter");
  const dailyCounter = document.getElementById("dailyCounter");
  let leadId = 4180 + Math.floor(Math.random() * 60);
  let dailyLeads = 0;

  function bumpLead() {
    leadId += 1;
    liveCounter.textContent = "лид #" + leadId;
    if (dailyLeads < 300) {
      dailyLeads += Math.floor(Math.random() * 4) + 1;
      if (dailyLeads > 300) dailyLeads = 300;
      dailyCounter.textContent = dailyLeads.toLocaleString("ru-RU");
    }
  }
  setInterval(bumpLead, 4500);

  const topBtn = document.getElementById("topBtn");
  window.addEventListener(
    "scroll",
    () => {
      topBtn.classList.toggle("show", window.scrollY > 600);
    },
    { passive: true },
  );
  topBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  document.getElementById("year").textContent = new Date().getFullYear();
})();
