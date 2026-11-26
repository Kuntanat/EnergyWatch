/* EnergyWatch shared sidebar.
   Usage: <aside class="side" data-section="dash|p2p|used" data-sub="<sub id>"></aside>
   data-sub="settings" highlights the settings item instead of a sub-menu item. */
(function () {
  var NAV = "#94A3B8";
  var ICONS = {
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    bars: '<path d="M3 3v18h18"/><path d="M8 17v-6M13 17V7M18 17v-4"/>',
    swap: '<path d="M4 7h14l-4-4M20 17H6l4 4"/>',
    package: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'
  };
  function ic(name, color) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="' + color +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  var SECTIONS = [
    { id: "dash", name: "แดชบอร์ดพลังงาน", icon: "bars", color: "#4F8BC9", href: "energy-dashboard.html", menu: "เมนูแดชบอร์ด",
      subs: [
        { id: "province", name: "รายจังหวัด", href: "energy-dashboard.html" },
        { id: "history", name: "ข้อมูลย้อนหลัง", href: "energy-history.html" },
        { id: "crisis", name: "AI วิเคราะห์วิกฤต", href: "energy-crisis.html", dot: true },
        { id: "reports", name: "รายงาน", href: "energy-reports.html" }
      ] },
    { id: "p2p", name: "ตลาดไฟฟ้า P2P", icon: "swap", color: "#22A06B", href: "energy-p2p.html", menu: "เมนูตลาดไฟฟ้า",
      subs: [
        { id: "match", name: "จับคู่ผู้ซื้อ", href: "energy-p2p.html" },
        { id: "contracts", name: "สัญญาของฉัน", href: "p2p-contracts.html" },
        { id: "income", name: "ประวัติและรายได้", href: "p2p-income.html" }
      ] },
    { id: "used", name: "ตลาดอุปกรณ์มือสอง", icon: "package", color: "#F08C3A", href: "energy-used-market.html", menu: "เมนูตลาดมือสอง",
      subs: [
        { id: "search", name: "ค้นหาสินค้า", href: "energy-used-market.html" },
        { id: "sell", name: "ลงขายสินค้า", href: "used-sell.html" },
        { id: "prices", name: "ราคากลาง", href: "used-prices.html" },
        { id: "messages", name: "ข้อความ", href: "used-messages.html" }
      ] }
  ];
  window.EW_SECTIONS = SECTIONS;

  var el = document.querySelector("aside.side");
  if (!el) return;
  var secId = el.getAttribute("data-section") || "dash";
  var subId = el.getAttribute("data-sub");
  var cur = SECTIONS.filter(function (s) { return s.id === secId; })[0] || SECTIONS[0];

  var mains = SECTIONS.map(function (s) {
    var on = s.id === cur.id;
    return '<a class="nav-item sec' + (on ? " on" : "") + '" href="' + s.href + '"' +
      (on ? ' style="border-left-color:' + s.color + '" aria-current="true"' : "") + ">" +
      ic(s.icon, on ? s.color : NAV) + " " + s.name + "</a>";
  }).join("");

  var subs = cur.subs.map(function (s) {
    var on = s.id === subId;
    return '<a class="nav-item sub' + (on ? " on" : "") + '" href="' + s.href + '"' + (on ? ' aria-current="page"' : "") + ">" +
      '<span class="sub-dot" style="background:' + (on ? cur.color : "#334155") + '"></span>' + s.name +
      (s.dot ? '<div class="nav-dot"></div>' : "") + "</a>";
  }).join("");

  var setOn = subId === "settings";
  el.innerHTML =
    '<a class="brand" href="index.html"><div class="brand-mark">' + ic("bolt", "#FFFFFF") + "</div>EnergyWatch</a>" +
    '<a class="nav-item" href="index.html">' + ic("home", NAV) + " หน้าแรก</a>" +
    '<div class="nav-label" style="margin-top:20px">ส่วนหลัก</div>' + mains +
    '<div class="nav-label" style="margin-top:24px">' + cur.menu + "</div>" + subs +
    '<div class="nav-label" style="margin-top:24px">ระบบ</div>' +
    '<a class="nav-item' + (setOn ? " active" : "") + '" href="energy-settings.html"' + (setOn ? ' aria-current="page"' : "") + ">" +
    ic("gear", setOn ? "#FFFFFF" : NAV) + " ตั้งค่า</a>";
  el.setAttribute("aria-label", "เมนูหลัก");
  el.id = "sideNav";

  /* small screens: top bar with a menu button; the sidebar slides in over the page */
  var main = document.querySelector(".main");
  if (main) {
    var bar = document.createElement("div");
    bar.className = "mbar";
    bar.innerHTML =
      '<button class="mbar-btn" type="button" aria-label="เปิดเมนู" aria-controls="sideNav" aria-expanded="false">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<a class="mbar-brand" href="index.html"><span class="brand-mark">' + ic("bolt", "#FFFFFF") + "</span>EnergyWatch</a>" +
      '<span class="mbar-sec" style="color:' + cur.color + '">' + cur.name + "</span>";
    main.insertBefore(bar, main.firstChild);
    var backdrop = document.createElement("div");
    backdrop.className = "ew-backdrop";
    document.body.appendChild(backdrop);
    var btn = bar.querySelector(".mbar-btn");
    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", open);
    };
    btn.addEventListener("click", function () { setOpen(!document.body.classList.contains("nav-open")); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1024) setOpen(false); });
  }
})();
