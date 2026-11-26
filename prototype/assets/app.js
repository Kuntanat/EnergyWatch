/* EnergyWatch prototype: shared helpers and generic interactions.
   - EW.toast(msg)        : bottom notice, prefixed with "นี่คือต้นแบบ" unless {plain:true}
   - [data-toast="..."]    : click shows that notice
   - .tabs .tab, .seg > div: single-choice groups (fires "ew:change" on the group, detail {index, value})
   - .switch               : on/off (fires "ew:change", detail {on})
   - [data-options="a|b"]  : dropdown; writes the choice into .val (or the element text) and fires "ew:change"
   - .crumb b "หน้าแรก"     : becomes a link to index.html */
(function () {
  var EW = (window.EW = window.EW || {});

  /* layout is responsive CSS (assets/responsive.css); no page zoom */
  EW.zoom = 1;

  /* home page: menu button for the top links on small screens */
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".nav-toggle");
    if (!t) return;
    var nav = t.closest(".nav");
    var open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    t.setAttribute("aria-expanded", open);
  });

  var ICONS = {
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/>',
    send: '<path d="M4 12l16-8-6 16-2-6z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    building: '<rect x="4" y="3" width="18" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    file: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    tool: '<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    swap: '<path d="M4 7h14l-4-4M20 17H6l4 4"/>',
    package: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
  };
  EW.ic = function (name, color, size) {
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || "currentColor") +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  };

  /* ---------- toast ---------- */
  var wrap;
  EW.toast = function (msg, opts) {
    opts = opts || {};
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "ew-toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var t = document.createElement("div");
    t.className = "ew-toast";
    t.innerHTML = EW.ic(opts.plain ? "check" : "info", opts.plain ? "#4ADE80" : "#7DB3E8", 18) +
      "<span>" + (opts.plain ? "" : "<b>นี่คือต้นแบบ</b> — ") + msg + "</span>";
    wrap.appendChild(t);
    while (wrap.children.length > 3) wrap.removeChild(wrap.firstChild);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 250);
    }, opts.ms || 3200);
  };

  EW.fire = function (el, detail) {
    el.dispatchEvent(new CustomEvent("ew:change", { detail: detail, bubbles: true }));
  };

  EW.fmt = function (n, d) {
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  };

  /* ---------- dropdown ---------- */
  var menu, menuOwner;
  function closeMenu() {
    if (menu) { menu.remove(); menu = null; menuOwner = null; }
  }
  function valueEl(el) { return el.querySelector(".val") || el; }
  EW.getValue = function (el) {
    if (el.hasAttribute("data-value")) return el.getAttribute("data-value");
    var v = valueEl(el);
    return (v.firstChild && v.firstChild.nodeType === 3 ? v.firstChild.nodeValue : v.textContent).trim();
  };
  EW.setValue = function (el, value) {
    el.setAttribute("data-value", value);
    var v = valueEl(el);
    if (v.firstChild && v.firstChild.nodeType === 3) v.firstChild.nodeValue = value;
    else v.textContent = value;
  };
  function openMenu(el) {
    closeMenu();
    var opts = el.getAttribute("data-options").split("|");
    var current = EW.getValue(el);
    menu = document.createElement("div");
    menu.className = "ew-menu";
    menu.setAttribute("role", "listbox");
    opts.forEach(function (o) {
      var d = document.createElement("div");
      d.textContent = o;
      d.setAttribute("role", "option");
      if (o === current) d.className = "on";
      d.addEventListener("click", function (e) {
        e.stopPropagation();
        closeMenu();
        if (el.hasAttribute("data-keep")) { EW.fire(el, { value: o }); return; }
        EW.setValue(el, o);
        EW.fire(el, { value: o });
      });
      menu.appendChild(d);
    });
    document.body.appendChild(menu);
    // fixed position, converted back from screen px to the zoomed page's CSS px
    var r = el.getBoundingClientRect(), z = EW.zoom || 1;
    menu.style.position = "fixed";
    menu.style.left = r.left / z + "px";
    menu.style.top = r.bottom / z + 4 + "px";
    menu.style.minWidth = Math.max(160, r.width / z) + "px";
    menuOwner = el;
  }
  document.addEventListener("click", function (e) {
    if (menu && !menu.contains(e.target) && (!menuOwner || !menuOwner.contains(e.target))) closeMenu();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("scroll", closeMenu, { passive: true });
  window.addEventListener("resize", closeMenu);

  /* ---------- generic click handling ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;

    var dd = t.closest("[data-options]");
    if (dd) { if (menuOwner === dd) closeMenu(); else openMenu(dd); return; }

    var tab = t.closest(".tabs .tab, .seg > div, .ranges .rg");
    if (tab && !tab.closest("[data-static]")) {
      var group = tab.parentNode;
      var items = Array.prototype.slice.call(group.children);
      items.forEach(function (x) { x.classList.toggle("on", x === tab); x.setAttribute("aria-selected", x === tab); });
      EW.fire(group, { index: items.indexOf(tab), value: tab.textContent.trim() });
      return;
    }

    var sw = t.closest(".switch");
    if (sw && !sw.closest("[data-static]")) {
      var on = !sw.classList.contains("on");
      sw.classList.toggle("on", on);
      sw.setAttribute("aria-checked", on);
      EW.fire(sw, { on: on });
      return;
    }

    var toastEl = t.closest("[data-toast]");
    if (toastEl) { EW.toast(toastEl.getAttribute("data-toast")); return; }
  });

  /* keyboard: Enter / Space activate div-buttons */
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute && e.target.getAttribute("role") === "button" && e.target.tagName !== "BUTTON") {
      e.preventDefault();
      e.target.click();
    }
  });

  EW.makeButtons = function (root) {
    (root || document).querySelectorAll(
      ".btn, .tab, .seg > div, .switch, .rg, .chip, .ct, .sn, .p-btn, .ai-btn, .tpl-btn, .dl, .sug, .select, [data-options], [data-toast], [data-action], .is-clickable"
    ).forEach(function (el) {
      if (el.tagName === "A" || el.tagName === "BUTTON" || el.hasAttribute("role")) return;
      el.setAttribute("role", el.classList.contains("switch") ? "switch" : "button");
      el.setAttribute("tabindex", "0");
      if (el.classList.contains("switch")) el.setAttribute("aria-checked", el.classList.contains("on"));
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".crumb b").forEach(function (b) {
      if (b.textContent.trim() === "หน้าแรก") {
        var a = document.createElement("a");
        a.href = "index.html";
        a.textContent = "หน้าแรก";
        b.replaceWith(a);
      }
    });
    EW.makeButtons();
  });
})();
