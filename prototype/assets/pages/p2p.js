/* ตลาดไฟฟ้า P2P: seller / buyer view, radius filter, offers, contract type, history tabs (no AI features on this page) */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = EW.fmt;
  var BUILDING = '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>';
  var FACTORY = '<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>';
  var HOME = '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>';
  var USERS = '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .8 3.4 2.6 4 5.5"/>';
  function svg(p) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F5D8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }

  function party(icon, name, tag, tagCls, km, time, qty, price, match, btn) {
    var color = match >= 100 ? "#22A06B" : "#D97706";
    return '<div class="buyer" data-km="' + km + '"><div class="b-ic">' + svg(icon) + '</div><div class="b-info"><div class="b-n">' + name + '</div><div class="b-d"><span class="st ' + tagCls + '">' + tag +
      "</span><span>" + km + " กม.</span><span>" + time + "</span><span>" + qty + '</span></div></div><div class="b-right"><div class="b-p">' + price.toFixed(2) +
      ' <span>บาท/หน่วย</span></div><div class="b-ov"><div class="bar" style="width:90px"><div style="width:' + match + "%;background:" + color + '"></div></div><span>เวลาตรงกัน ' + match +
      '%</span></div><div class="btn ' + (match >= 100 ? "pri" : "sec") + ' sm">' + btn + "</div></div></div>";
  }

  /* ---------- seller view (original design) + one extra buyer outside 10 km ---------- */
  var match = $("matchCard");
  match.insertAdjacentHTML("beforeend", party(FACTORY, "นิคมอุตสาหกรรมนวนคร (อาคารส่วนกลาง)", "องค์กรเอกชน", "grey", 18.4, "ต้องการไฟ 07:00–19:00", "5,000 kWh/วัน", 3.05, 70, "เสนอขาย"));
  var SELLER_MATCH = match.innerHTML;

  /* ---------- buyer view ---------- */
  var BUYER_MATCH =
    '<div class="card-h"><div><div class="card-t">ผู้ขายไฟในพื้นที่</div><div class="card-s">เรียงตามระยะทาง และช่วงเวลาที่ผู้ขายผลิตไฟได้ตรงกับช่วงที่คุณต้องการ</div></div>' +
    '<div class="pill is-clickable" id="radius" data-options="รัศมี 5 กม.|รัศมี 10 กม.|รัศมี 25 กม.">รัศมี 10 กม.</div></div>' +
    '<div class="offer"><div class="of"><div class="of-l">ผู้ซื้อ</div><div class="of-v">อบจ.ปทุมธานี</div></div><div class="of"><div class="of-l">ไฟที่ต้องการ</div><div class="of-v">400 kWh/วัน</div></div>' +
    '<div class="of"><div class="of-l">ช่วงเวลาที่ต้องการ</div><div class="of-v">09:00–16:00</div></div><div class="of"><div class="of-l">ราคาที่เสนอซื้อ</div><div class="of-v">3.20 บาท/หน่วย</div></div></div>' +
    party(USERS, "กลุ่มบ้านโซลาร์ ต.คลองหก (ไมโครกริดชุมชน)", "ประชาชน 148 ครัวเรือน", "ok", 1.2, "ขายได้ 10:00–15:00", "1,800 kWh/วัน", 3.20, 100, "เสนอซื้อ") +
    party(HOME, "คุณมานพ ก. (บ้านโซลาร์ 10 kW)", "ประชาชน", "ok", 2.1, "ขายได้ 10:00–14:00", "30 kWh/วัน", 3.20, 90, "เสนอซื้อ") +
    party(BUILDING, "โรงเรียนวัดคลองหก (โซลาร์รูฟ 30 kW)", "หน่วยงานรัฐ", "info", 3.6, "ขายได้ 09:00–16:00", "80 kWh/วัน", 3.10, 100, "เสนอซื้อ") +
    party(USERS, "วิสาหกิจชุมชนโซลาร์ลำลูกกา", "วิสาหกิจชุมชน", "ok", 4.5, "ขายได้ 09:30–15:30", "600 kWh/วัน", 3.15, 100, "เสนอซื้อ") +
    party(HOME, "คุณสุดา พ. (บ้านโซลาร์ 5 kW)", "ประชาชน", "ok", 12.8, "ขายได้ 11:00–15:00", "12 kWh/วัน", 3.25, 60, "เสนอซื้อ");

  var income = $("incomeCard");
  // compact chart: design bars were up to 140px, now up to 100px
  income.querySelectorAll(".ic-bar").forEach(function (b) { b.style.height = Math.round(parseFloat(b.style.height) * 100 / 140) + "px"; });
  var SELLER_INCOME = income.innerHTML;
  var B_KWH = [9800, 8600, 8200, 8400, 8300, 9100];
  var B_SAVE = B_KWH.map(function (k) { return Math.round(k * 0.68); });
  var maxSave = Math.max.apply(null, B_SAVE);
  var BUYER_INCOME =
    '<div class="card-h"><div><div class="card-t">ค่าไฟที่ประหยัดได้</div><div class="card-s">6 เดือนล่าสุด · บาท</div></div></div>' +
    '<div class="inc-sum"><div class="is"><div class="is-l">ประหยัดรวม</div><div class="is-v" style="color:#15803D">' + fmt(B_SAVE.reduce(function (a, b) { return a + b; }, 0)) + ' บาท</div></div>' +
    '<div class="is"><div class="is-l">ไฟที่ซื้อจากประชาชน</div><div class="is-v">' + fmt(B_KWH.reduce(function (a, b) { return a + b; }, 0)) + ' kWh</div></div>' +
    '<div class="is"><div class="is-l">ประหยัดกว่าค่าไฟปกติ</div><div class="is-v">0.68 บาท/หน่วย</div></div></div>' +
    '<div class="ic-chart">' + B_SAVE.map(function (v) { return '<div class="ic-col"><div class="ic-v">' + fmt(v) + '</div><div class="ic-bar" style="height:' + Math.round(v / maxSave * 100) + 'px"></div></div>'; }).join("") + "</div>" +
    '<div class="ic-labels"><div class="ic-m">พ.ค.</div><div class="ic-m">มิ.ย.</div><div class="ic-m">ก.ค.</div><div class="ic-m">ส.ค.</div><div class="ic-m">ก.ย.</div><div class="ic-m">ต.ค.</div></div>';

  var table = $("hTable"), SELLER_TABLE = table.innerHTML;
  function trow(d, who, ct, kwh, price, st) {
    var cls = st === "ชำระแล้ว" ? "ok" : "watch";
    return '<tr><td class="muted">' + d + "</td><td><b>" + who + "</b></td><td>" + ct + '</td><td class="r">' + fmt(kwh, kwh % 1 ? 1 : 0) + '</td><td class="r">' + price.toFixed(2) +
      '</td><td class="r"><b>' + fmt(kwh * price, 2) + '</b></td><td><span class="st ' + cls + '">' + st + "</span></td></tr>";
  }
  var BUYER_TABLE = "<tr><th>วันที่</th><th>ผู้ขาย</th><th>สัญญา</th><th class=\"r\">ปริมาณ (kWh)</th><th class=\"r\">ราคา (บาท/หน่วย)</th><th class=\"r\">รวม (บาท)</th><th>สถานะ</th></tr>" +
    trow("28 ต.ค. 2569", "กลุ่มบ้านโซลาร์ ต.คลองหก", "รายเดือน", 1820, 3.20, "รอชำระ") +
    trow("27 ต.ค. 2569", "กลุ่มบ้านโซลาร์ ต.คลองหก", "รายเดือน", 1760, 3.20, "ชำระแล้ว") +
    trow("26 ต.ค. 2569", "วิสาหกิจชุมชนโซลาร์ลำลูกกา", "รายวัน", 590, 3.15, "ชำระแล้ว") +
    trow("25 ต.ค. 2569", "กลุ่มบ้านโซลาร์ ต.คลองหก", "รายเดือน", 1790, 3.20, "ชำระแล้ว") +
    trow("24 ต.ค. 2569", "คุณมานพ ก.", "รายวัน", 28, 3.20, "รอชำระ");

  var role = "seller";
  var radiusKm = 10;
  function applyRadius() {
    var shown = 0;
    $("matchCard").querySelectorAll(".buyer").forEach(function (b) {
      var km = b.getAttribute("data-km") || (/([\d.]+) กม\./.exec(b.querySelector(".b-d").textContent) || [])[1];
      var ok = parseFloat(km) <= radiusKm;
      b.classList.toggle("is-hidden", !ok);
      if (ok) shown++;
    });
    var n = $("matchCard").querySelector(".empty-n");
    if (!shown && !n) $("matchCard").insertAdjacentHTML("beforeend", '<div class="empty-n">ไม่พบ' + (role === "seller" ? "ผู้ซื้อ" : "ผู้ขาย") + "ในรัศมีนี้ ลองขยายรัศมีการค้นหา</div>");
    if (n) n.classList.toggle("is-hidden", shown > 0);
  }
  function bindMatch() {
    $("radius").textContent = "รัศมี " + radiusKm + " กม.";
    $("radius").setAttribute("data-value", "รัศมี " + radiusKm + " กม.");
    $("radius").addEventListener("ew:change", function (e) { radiusKm = parseInt(e.detail.value.replace(/\D/g, ""), 10); applyRadius(); });
    applyRadius();
    EW.makeButtons($("matchCard"));
  }

  function setRole(r) {
    role = r;
    var seller = r === "seller";
    match.innerHTML = seller ? SELLER_MATCH : BUYER_MATCH;
    income.innerHTML = seller ? SELLER_INCOME : BUYER_INCOME;
    table.innerHTML = seller ? SELLER_TABLE : BUYER_TABLE;
    $("ctaT").textContent = seller ? "ลงขายไฟฟ้า" : "ประกาศรับซื้อไฟ";
    $("dSub").textContent = "กับ " + (seller ? "อบจ.ปทุมธานี" : "คุณสมศรี ว.") + " · สัญญา" + ctLabel();
    $("dSt").textContent = seller ? "รอผู้ซื้อตรวจ" : "รอคุณตรวจ";
    $("kSeller").textContent = seller ? "คุณ (บ้านโซลาร์ 5 kW, ต.คลองหก)" : "คุณสมศรี ว. (บ้านโซลาร์ 5 kW, ต.คลองหก)";
    $("kBuyer").textContent = seller ? "อบจ.ปทุมธานี (อาคารสำนักงาน)" : "คุณ (อบจ.ปทุมธานี อาคารสำนักงาน)";
    $("dEdit").textContent = seller ? "แก้ไขสัญญา" : "ขอแก้ไขสัญญา";
    $("dSend").textContent = seller ? "ส่งให้ผู้ซื้อ" : "ตรวจแล้ว ลงนาม";
    bindMatch();
    filterHistory();
  }
  $("role").addEventListener("ew:change", function (e) { setRole(e.detail.index === 0 ? "seller" : "buyer"); });

  /* offer buttons */
  match.addEventListener("click", function (e) {
    var b = e.target.closest(".b-right .btn");
    if (!b || b.classList.contains("sent")) return;
    var name = b.closest(".buyer").querySelector(".b-n").textContent;
    b.classList.add("sent");
    b.textContent = role === "seller" ? "ส่งข้อเสนอแล้ว" : "ส่งคำขอซื้อแล้ว";
    EW.toast("ข้อเสนอถึง «" + name + "» ยังไม่ได้ถูกส่งจริง");
  });

  $("cta").addEventListener("click", function () {
    EW.toast(role === "seller" ? "หน้าลงขายไฟฟ้ายังไม่ได้ทำในต้นแบบนี้" : "หน้าประกาศรับซื้อไฟยังไม่ได้ทำในต้นแบบนี้");
  });

  /* ---------- contract type ---------- */
  var cts = Array.prototype.slice.call($("cts").querySelectorAll(".ct"));
  var currentCt = "รายเดือน";
  function ctLabel() { return currentCt === "รายปี" ? "รายปี (Direct PPA)" : currentCt; }
  var CT = {
    "รายวัน": { qty: "ตามไฟที่ผลิตได้จริง (~10 kWh/วัน)", term: "เริ่ม 1 พ.ย. 2569 · ต่ออายุอัตโนมัติรายวัน" },
    "รายเดือน": { qty: "300 kWh/เดือน", term: "1 – 30 พ.ย. 2569" },
    "รายปี": { qty: "3,600 kWh/ปี", term: "1 พ.ย. 2569 – 31 ต.ค. 2570" }
  };
  cts.forEach(function (ct) {
    var tag = ct.querySelector(".ct-t span:last-child");
    ct.setAttribute("data-tag", ct.classList.contains("on") ? "" : tag.textContent);
    ct.setAttribute("role", "radio");
    ct.setAttribute("tabindex", "0");
    ct.setAttribute("aria-checked", ct.classList.contains("on"));
  });
  cts[1].setAttribute("data-tag", "ราคาคงที่");
  cts.forEach(function (ct) {
    ct.addEventListener("click", function () {
      cts.forEach(function (c) {
        var on = c === ct, tag = c.querySelector(".ct-t span:last-child");
        c.classList.toggle("on", on);
        c.setAttribute("aria-checked", on);
        tag.textContent = on ? "เลือกอยู่" : c.getAttribute("data-tag");
        tag.className = on ? "" : "muted";
        tag.style.color = on ? "#2F5D8A" : "";
      });
      var name = ct.querySelector(".ct-t span").textContent.trim();
      currentCt = name.indexOf("รายปี") === 0 ? "รายปี" : name;
      $("dSub").textContent = $("dSub").textContent.replace(/สัญญา.*$/, "สัญญา" + ctLabel());
      $("kQty").textContent = CT[currentCt].qty;
      $("kTerm").textContent = CT[currentCt].term;
    });
  });

  $("dEdit").addEventListener("click", function () { EW.toast("หน้าแก้ไขสัญญายังไม่ได้ทำในต้นแบบนี้"); });
  $("dSend").addEventListener("click", function () {
    EW.toast(role === "seller" ? "ร่างสัญญายังไม่ได้ถูกส่งให้ผู้ซื้อจริง" : "สัญญานี้ยังไม่ได้ถูกลงนามจริง");
  });

  /* ---------- history tabs ---------- */
  var tabFilter = "ทั้งหมด";
  function filterHistory() {
    table.querySelectorAll("tr").forEach(function (tr, i) {
      if (i === 0) return;
      tr.classList.toggle("is-hidden", tabFilter !== "ทั้งหมด" && tr.querySelector(".st").textContent.trim() !== tabFilter);
    });
  }
  $("hTabs").addEventListener("ew:change", function (e) { tabFilter = e.detail.value; filterHistory(); });

  bindMatch();

  /* deep link from home: #buyer-N highlights that buyer */
  var m = /^#buyer-(\d)$/.exec(location.hash);
  if (m) {
    var b = match.querySelectorAll(".buyer")[+m[1] - 1];
    if (b) setTimeout(function () {
      b.scrollIntoView({ behavior: "smooth", block: "center" });
      b.classList.add("flash");
      setTimeout(function () { b.classList.remove("flash"); }, 1600);
    }, 80);
  }
})();
