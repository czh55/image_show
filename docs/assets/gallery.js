(function () {
  var dataUrl = "photos.json";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function makeTile(photo) {
    var tile = el("button", "tile");
    tile.type = "button";
    tile.style.setProperty("--aspect", photo.aspect || "3/2");
    tile.dataset.id = photo.id;

    var img = el("img", "tile-media");
    img.src = photo.src;
    img.alt = photo.title;
    img.loading = "lazy";

    var meta = el("div", "tile-meta");
    meta.appendChild(el("div", "tile-title", photo.title));
    meta.appendChild(
      el("div", "tile-sub", [photo.place, photo.year].filter(Boolean).join(" · "))
    );

    tile.appendChild(img);
    tile.appendChild(meta);
    tile.addEventListener("click", function () {
      openLightbox(photo);
    });
    return tile;
  }

  function openLightbox(photo) {
    var box = document.getElementById("lightbox");
    document.getElementById("lightboxImg").src = photo.src;
    document.getElementById("lightboxImg").alt = photo.title;
    document.getElementById("lightboxTitle").textContent = photo.title;
    document.getElementById("lightboxNote").textContent =
      photo.note || [photo.place, photo.year].filter(Boolean).join(" · ");
    box.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("active");
    document.body.style.overflow = "";
  }

  function render(data) {
    if (data.site) {
      if (data.site.title) {
        document.title = data.site.title + " · 个人图片画廊";
        var brand = document.querySelector(".brand");
        var heroBrand = document.querySelector(".hero-brand");
        if (brand) brand.textContent = data.site.title;
        if (heroBrand) heroBrand.textContent = data.site.title;
      }
      if (data.site.tagline) {
        var line = document.querySelector(".hero-line");
        if (line) line.textContent = data.site.tagline;
      }
    }

    var photos = data.photos || [];
    var series = data.series || [];
    var bySeries = {};
    photos.forEach(function (p) {
      (bySeries[p.series] = bySeries[p.series] || []).push(p);
    });

    var featuredRoot = document.getElementById("featuredGrid");
    featuredRoot.innerHTML = "";
    photos
      .filter(function (p) {
        return p.featured;
      })
      .forEach(function (p) {
        featuredRoot.appendChild(makeTile(p));
      });

    var seriesRoot = document.getElementById("seriesRoot");
    seriesRoot.innerHTML = "";
    series.forEach(function (s) {
      var block = el("div", "series-block");
      block.id = "series-" + s.id;

      var head = el("div", "section-head");
      head.appendChild(el("div", "section-kicker", "Series"));
      head.appendChild(el("h2", "section-title", s.title));
      if (s.desc) head.appendChild(el("p", "section-desc", s.desc));
      block.appendChild(head);

      var rail = el("div", "series-rail");
      (bySeries[s.id] || []).forEach(function (p) {
        rail.appendChild(makeTile(p));
      });
      block.appendChild(rail);
      seriesRoot.appendChild(block);
    });
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightbox").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  var yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  fetch(dataUrl)
    .then(function (res) {
      if (!res.ok) throw new Error("failed to load photos.json");
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      console.error(err);
      document.getElementById("featuredGrid").textContent =
        "无法加载 photos.json，请用本地服务器打开 docs/。";
    });
})();
