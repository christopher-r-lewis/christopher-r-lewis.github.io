(function () {
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setTheme(theme, persist) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;

    if (themeToggle) {
      const oppositeTheme = nextTheme === "dark" ? "light" : "dark";
      themeToggle.setAttribute(
        "aria-label",
        "Switch to " + oppositeTheme + " theme",
      );
    }

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        nextTheme === "dark" ? "#071422" : "#f8fafb",
      );
    }

    if (persist) {
      localStorage.setItem("theme", nextTheme);
    }
  }

  setTheme(document.documentElement.dataset.theme, false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.dataset.theme;
      setTheme(currentTheme === "dark" ? "light" : "dark", true);
    });
  }

  function setMenuOpen(isOpen) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenuOpen(false);
  });

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        links.forEach(function (link) {
          const isActive =
            link.getAttribute("href") === "#" + visible.target.id;
          link.classList.toggle("is-active", isActive);
        });
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
