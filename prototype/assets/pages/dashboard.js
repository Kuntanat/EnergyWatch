/* แดชบอร์ดพลังงาน ปทุมธานี: year-range chart, type table, crisis mode, crisis scenarios, AI chat (canned answers) */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = EW.fmt;

  /* ---------------- yearly data (ktoe/ปี), ปทุมธานี ---------------- */
  var YEARS = [], TOTAL = {}, CLEAN = {};
  var rows = [
    [2555, 3560, 120], [2556, 3640, 130], [2557, 3720, 140], [2558, 3800, 155], [2559, 3880, 165],
    [2560, 3950, 180], [2561, 4080, 200], [2562, 4170, 220], [2563, 3700, 240], [2564, 3860, 260],
    [2565, 4050, 300], [2566, 4180, 350], [2567, 4260, 400], [2568, 4300, 450], [2569, 4350, 500],
    [2570, 4420, 600], [2571, 4480, 710], [2572, 4540, 830]
  ];
  rows.forEach(function (r) { YEARS.push(r[0]); TOTAL[r[0]] = r[1]; CLEAN[r[0]] = r[2]; });
  var NOW = 2569, PX = 0.036; // 180px = 5,000 ktoe (compact chart, 220px tall)

  var RANGE = { "3 ปี": 2567, "5 ปี": 2565, "10 ปี": 2560, "ทั้งหมด": 2555 };
  var SEL_TO_RANGE = { "2567 – 2572": "3 ปี", "2565 – 2572": "5 ปี", "2560 – 2572": "10 ปี", "2555 – 2572": "ทั้งหมด" };
  var DEFAULT_NOTE = $("histNote").innerHTML;

  function col(y, w) {
    var c = CLEAN[y], f = TOTAL[y] - c;
    var cls = y === NOW ? " now" : y > NOW ? " fc" : "";
    return '<div class="col' + cls + '" data-year="' + y + '" style="width:' + w + 'px" role="button" tabindex="0" aria-label="ปี ' + y + '">' +
      '<div class="tot">' + fmt(TOTAL[y]) + '</div><div class="stack" style="width:' + Math.min(40, w - 16) + 'px">' +
      '<div class="clean" style="height:' + Math.round(c * PX) + 'px"></div><div class="fossil" style="height:' + Math.round(f * PX) + 'px"></div></div></div>';
  }
  function xl(y, w) {
    var cls = y === NOW ? " now" : y > NOW ? " fc" : "";
    var roomy = w >= 72; // short labels when columns are narrow
    var t = y === NOW ? (roomy ? y + " (ปัจจุบัน)" : y) : y > NOW ? (roomy ? y + " · ปี " + (y - NOW) : y) : y;
    return '<div class="xl' + cls + '" style="width:' + w + 'px">' + t + "</div>";
  }
  // the bars and the x-axis scroll together when the card is too narrow
  var scroller = document.createElement("div");
  scroller.className = "hist-scroll";
  var plot = $("histBars").parentNode;
  plot.parentNode.insertBefore(scroller, plot);
  scroller.appendChild(plot);
  scroller.appendChild($("histX"));
  var currentStart = 2560;

  function renderChart(start) {
    currentStart = start;
    var past = YEARS.filter(function (y) { return y >= start && y <= NOW; });
    var fc = YEARS.filter(function (y) { return y > NOW; });
    var n = past.length + fc.length;
    var avail = scroller.clientWidth - 48; // minus the y-axis
    var w = Math.max(38, Math.min(Math.floor(avail / n), 130));
    scroller.classList.toggle("is-scrolling", w * n > avail);
    $("histBars").innerHTML = past.map(function (y) { return col(y, w); }).join("") +
      '<div class="fc-zone"><div class="fc-label" style="width:' + w * fc.length + 'px">' + (w * fc.length >= 150 ? "พยากรณ์โดย AI →" : "พยากรณ์ →") + '</div>' +
      fc.map(function (y) { return col(y, w); }).join("") + "</div>";
    $("histX").innerHTML = past.concat(fc).map(function (y) { return xl(y, w); }).join("");
    $("histNote").innerHTML = DEFAULT_NOTE;
  }
  function setRange(label, start) {
    Array.prototype.forEach.call($("ranges").children, function (r) { r.classList.toggle("on", r.textContent.trim() === label); });
    var selLabel = start + " – 2572";
    EW.setValue($("yearSel"), selLabel);
    renderChart(start);
  }

  $("ranges").addEventListener("ew:change", function (e) {
    var v = e.detail.value;
    if (RANGE[v]) setRange(v, RANGE[v]);
  });
  // "กำหนดเอง" opens a start-year menu
  var custom = Array.prototype.filter.call($("ranges").children, function (r) { return r.textContent.trim() === "กำหนดเอง"; })[0];
  custom.setAttribute("data-options", YEARS.filter(function (y) { return y <= 2567; }).map(function (y) { return "เริ่มปี " + y; }).join("|"));
  custom.setAttribute("data-keep", "");
  custom.addEventListener("ew:change", function (e) {
    e.stopPropagation();
    setRange("กำหนดเอง", parseInt(e.detail.value.replace(/\D/g, ""), 10));
  });
  $("yearSel").addEventListener("ew:change", function (e) {
    var lbl = SEL_TO_RANGE[e.detail.value];
    setRange(lbl, RANGE[lbl]);
  });

  $("histBars").addEventListener("click", function (e) {
    var c = e.target.closest(".col");
    if (!c) return;
    var y = +c.getAttribute("data-year"), t = TOTAL[y], cl = CLEAN[y], prev = TOTAL[y - 1];
    document.querySelectorAll("#histBars .col").forEach(function (x) { x.classList.toggle("pick", x === c); });
    var chg = prev ? ((t - prev) / prev * 100) : null;
    $("histNote").innerHTML = EW.ic("info", "#6B7280", 16) + " ปี " + y + (y > NOW ? " (พยากรณ์)" : "") +
      " ใช้พลังงานรวม <b>" + fmt(t) + " ktoe</b> · ฟอสซิล " + fmt(t - cl) + " (" + Math.round((t - cl) / t * 100) + "%) · พลังงานสะอาด " +
      fmt(cl) + " (" + Math.round(cl / t * 100) + "%)" + (chg !== null ? " · " + (chg >= 0 ? "เพิ่มขึ้น " : "ลดลง ") + Math.abs(chg).toFixed(1) + "% จากปีก่อน" : "");
  });

  renderChart(2560);
  var resizeTimer, lastW = scroller.clientWidth;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (scroller.clientWidth !== lastW) { lastW = scroller.clientWidth; renderChart(currentStart); }
    }, 120);
  });

  /* ---------------- type table: 2565–2572 <-> 2560–2564 ---------------- */
  var table = $("typeTable"), TABLE_NOW = table.innerHTML, showingOld = false;
  var FOSSIL_SUB = [["น้ำมันดีเซล", 1430], ["น้ำมันเบนซิน", 640], ["ก๊าซ LPG", 380], ["ก๊าซธรรมชาติ (อุตสาหกรรมและผลิตไฟฟ้า)", 1300]];
  var CLEAN_SUB = [["พลังงานแสงอาทิตย์", 150], ["ชีวมวล", 60], ["ก๊าซชีวภาพและพลังงานจากขยะ", 80], ["พลังงานอื่นๆ", 10]];
  function split(total, parts, base) {
    var out = parts.map(function (p) { return Math.round(total * p[1] / base / 5) * 5; });
    out[0] += total - out.reduce(function (a, b) { return a + b; }, 0);
    return out;
  }
  function oldTable() {
    var ys = [2560, 2561, 2562, 2563, 2564];
    var fs = ys.map(function (y) { return split(TOTAL[y] - CLEAN[y], FOSSIL_SUB, 3750); });
    var cs = ys.map(function (y) { return split(CLEAN[y], CLEAN_SUB, 300); });
    var td = function (v) { return "<td>" + fmt(v) + "</td>"; };
    var h = "<tr><th>ประเภท</th>" + ys.map(function (y) { return "<th>" + y + "</th>"; }).join("") + "</tr>";
    h += '<tr class="grp"><td><span class="tag"><span class="sw fossil"></span>ฟอสซิล</span></td>' + ys.map(function (y) { return td(TOTAL[y] - CLEAN[y]); }).join("") + "</tr>";
    FOSSIL_SUB.forEach(function (p, i) { h += "<tr><td>" + p[0] + "</td>" + fs.map(function (r) { return td(r[i]); }).join("") + "</tr>"; });
    h += '<tr class="grp"><td><span class="tag"><span class="sw clean"></span>พลังงานสะอาด</span></td>' + ys.map(function (y) { return td(CLEAN[y]); }).join("") + "</tr>";
    CLEAN_SUB.forEach(function (p, i) { h += "<tr><td>" + p[0] + "</td>" + cs.map(function (r) { return td(r[i]); }).join("") + "</tr>"; });
    h += '<tr class="total"><td>รวม</td>' + ys.map(function (y) { return td(TOTAL[y]); }).join("") + "</tr>";
    return h;
  }
  $("tblPrev").addEventListener("click", function () {
    showingOld = !showingOld;
    table.innerHTML = showingOld ? oldTable() : TABLE_NOW;
    this.textContent = showingOld ? "2565–2572 ▶" : "◀ 2560–2564";
  });

  /* ---------------- crisis mode ---------------- */
  var toggle = $("crisisToggle"), zone = $("crisisZone");
  function setCrisis(on) {
    toggle.querySelector(".switch").classList.toggle("on", on);
    toggle.classList.toggle("off", !on);
    zone.classList.toggle("is-hidden", !on);
  }
  toggle.addEventListener("click", function (e) {
    if (e.target.closest(".switch")) return; // switch handled by app.js, then ew:change below
    var on = !toggle.querySelector(".switch").classList.contains("on");
    setCrisis(on);
  });
  toggle.addEventListener("ew:change", function (e) { setCrisis(e.detail.on); });

  /* ---------------- crisis scenarios ---------------- */
  var CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  var ORIGINAL = {};
  ["aiSum", "demand", "supply", "alloc", "steps"].forEach(function (id) { ORIGINAL[id] = $(id).innerHTML; });
  var ALLOC_COLORS = ["#E5484D", "#F08C3A", "#2563EB", "#9CA3AF"];
  var ST = { ok: "พร้อม", go: "กำลังส่ง", wait: "รออนุมัติ" };

  var SCEN = {
    "ไฟฟ้าดับ": {
      conf: 81,
      text: 'AI ประเมินว่าความต้องการน้ำมันดีเซลจะ<b>เพิ่มขึ้น 22%</b> (ช่วง 15–28%) ภายใน 24 ชั่วโมง เพราะโรงพยาบาล โรงงาน และอาคารสูงต้องเดินเครื่องปั่นไฟสำรอง ขณะที่ปั๊มน้ำมันหลายแห่งจ่ายน้ำมันไม่ได้เพราะไม่มีไฟ ทำให้สต็อกที่เข้าถึงได้<b>เหลือพอใช้ 3.4 วัน</b><br>AI แนะนำให้<b>ส่งรถเติมน้ำมันเคลื่อนที่ไปโรงพยาบาลและประปาก่อน</b> แล้วนำแบตเตอรี่ชุมชนและโซลาร์เคลื่อนที่ไปศูนย์พักพิง เพื่อลดการใช้ดีเซลของเครื่องปั่นไฟ',
      factors: ["ข้อมูลการใช้ 10 ปี", "เหตุไฟดับปี 2566", "แผนที่สถานีไฟฟ้าย่อย", "สต็อกคลังรายวัน", "จำนวนเครื่องปั่นไฟในพื้นที่"],
      normal: 6.8, crisis: 8.3, pct: 22, stock: 3.4,
      supply: [
        ["รถเติมน้ำมันเคลื่อนที่จากคลังจังหวัด", "ปั๊มจ่ายน้ำมันไม่ได้ ต้องนำน้ำมันไปถึงจุดใช้งานโดยตรง", 0.5, "0–4 ชม.", "ok"],
        ["เปิดปั๊มที่มีเครื่องปั่นไฟสำรอง", "มี 18 ปั๊มในจังหวัดที่จ่ายน้ำมันได้ทันทีแม้ไฟดับ", 0.4, "2 ชม.", "ok"],
        ["โยกจากคลังในกรุงเทพฯ และนนทบุรี", "ใกล้ที่สุดราว 30 กม. ถนนใช้งานได้ปกติ", 0.6, "6 ชม.", "go"],
        ["แบตเตอรี่ชุมชนและโซลาร์เคลื่อนที่", "ลดการใช้ดีเซลของเครื่องปั่นไฟที่ศูนย์พักพิง (เทียบเท่า)", 0.3, "12 ชม.", "wait"]
      ],
      alloc: [["โรงพยาบาลและกู้ภัย", 35], ["เครื่องปั่นไฟชุมชน", 20], ["ขนส่งสินค้าจำเป็น", 20], ["ประชาชนทั่วไป", 25]],
      allocNote: "AI เพิ่มสัดส่วนโรงพยาบาลจาก 20% เป็น 35% เพราะทุกแห่งต้องเดินเครื่องปั่นไฟตลอด 24 ชั่วโมงจนกว่าไฟจะกลับมา",
      steps: [["ประกาศเหตุไฟดับ ประสานการไฟฟ้า", "ชม. 0", "ตั้งศูนย์บัญชาการร่วมกับการไฟฟ้าส่วนภูมิภาค"], ["ส่งน้ำมันให้โรงพยาบาลและประปา", "0–4 ชม.", "ใช้รถเติมน้ำมันเคลื่อนที่จากคลังจังหวัด"],
        ["เปิดปั๊มที่มีไฟสำรอง", "2–6 ชม.", "ประกาศรายชื่อปั๊มที่เปิดให้ประชาชนทราบ"], ["ส่งแบตเตอรี่เคลื่อนที่ไปศูนย์พักพิง", "6–12 ชม.", "ลดการใช้ดีเซลของเครื่องปั่นไฟ"], ["ทยอยคืนระบบไฟ", "12 ชม.+", "เริ่มจากโรงพยาบาลและระบบประปา"]],
      done: 2
    },
    "ขาดแคลนก๊าซ": {
      conf: 78,
      text: 'ก๊าซธรรมชาติที่ส่งเข้านิคมอุตสาหกรรมลดลง 25% ทำให้โรงงานหันมาใช้น้ำมันเตาและดีเซลแทน AI ประเมินว่าความต้องการน้ำมันจะ<b>เพิ่มขึ้น 18%</b> (ช่วง 12–24%) และ LPG สำหรับครัวเรือนอาจขาดช่วงในบางอำเภอ สต็อกในจังหวัด<b>เหลือพอใช้ 4.1 วัน</b><br>AI แนะนำให้<b>รับซื้อไฟจากโซลาร์ประชาชนผ่านตลาด P2P</b> เพื่อลดก๊าซที่ใช้ผลิตไฟช่วงกลางวัน และจัดสรร LPG ให้ครัวเรือนก่อนภาคอุตสาหกรรม',
      factors: ["ข้อมูลการใช้ 10 ปี", "ปริมาณก๊าซจากท่อส่ง", "การใช้ก๊าซของนิคมฯ", "สต็อก LPG รายวัน", "กำลังผลิตโซลาร์ประชาชน"],
      normal: 6.8, crisis: 8.0, pct: 18, stock: 4.1,
      supply: [
        ["รับซื้อไฟโซลาร์ประชาชนผ่านตลาด P2P", "ลดก๊าซที่ใช้ผลิตไฟช่วงกลางวัน (เทียบเท่า)", 0.3, "ทันที", "ok"],
        ["โยกน้ำมันเตาจากคลังในกรุงเทพฯ", "รองรับโรงงานที่เปลี่ยนมาใช้น้ำมันชั่วคราว", 0.4, "6 ชม.", "go"],
        ["นำเข้า LPG จากคลัง จ.ชลบุรี", "เพิ่ม LPG ให้ครัวเรือนในอำเภอที่ขาดช่วง", 0.5, "12 ชม.", "go"],
        ["ขอให้โรงงานเลื่อนกะผลิต", "ลดความต้องการก๊าซช่วงพีค", 0.2, "24 ชม.", "wait"]
      ],
      alloc: [["โรงพยาบาลและบริการสาธารณะ", 20], ["ครัวเรือน (LPG หุงต้ม)", 30], ["ขนส่งสินค้าจำเป็น", 25], ["ภาคอุตสาหกรรม", 25]],
      allocNote: "AI ให้ครัวเรือนได้ LPG ก่อนภาคอุตสาหกรรม เพราะไม่มีเชื้อเพลิงทดแทนสำหรับหุงต้ม",
      steps: [["ประกาศภาวะขาดแคลนก๊าซ", "ชม. 0", "แจ้งนิคมอุตสาหกรรมและผู้ค้า LPG ทุกราย"], ["เปิดรับซื้อไฟโซลาร์ผ่านตลาด P2P", "0–6 ชม.", "ลดการใช้ก๊าซผลิตไฟช่วงกลางวัน"],
        ["จัดสรร LPG ให้ครัวเรือนก่อน", "6–24 ชม.", "จำกัดการซื้อต่อครัวเรือน"], ["ประสานโรงงานเลื่อนกะผลิต", "ต่อเนื่อง", "ลดความต้องการช่วงพีค"], ["ทบทวนแผนรายวัน", "24 ชม.+", "ตามปริมาณก๊าซจากท่อส่ง"]],
      done: 1
    },
    "ราคา LNG พุ่ง": {
      conf: 84,
      text: 'ราคา Spot LNG อยู่ที่ <b>19.6 USD/MMBtu</b> สูงกว่าเกณฑ์เฝ้าระวัง ปริมาณเชื้อเพลิงยังไม่ขาดแคลน แต่ต้นทุนก๊าซของโรงงานเพิ่มขึ้น 18% และค่าไฟรอบ Ft ถัดไปอาจเพิ่ม 0.30 บาท/หน่วย ความต้องการน้ำมันจะ<b>เพิ่มขึ้น 6%</b> จากโรงงานที่เปลี่ยนเชื้อเพลิงชั่วคราว สต็อก<b>พอใช้ 3.6 วัน</b><br>AI แนะนำให้<b>ลดการใช้ก๊าซผลิตไฟช่วงกลางวัน</b> ด้วยการรับซื้อไฟโซลาร์ผ่านตลาด P2P และช่วยค่าไฟครัวเรือนรายได้น้อยที่ได้รับผลกระทบ',
      factors: ["ราคา Spot LNG 12 สัปดาห์", "สัดส่วนก๊าซในจังหวัด", "สูตรค่าไฟ Ft", "การใช้ไฟรายชั่วโมง", "กำลังผลิตโซลาร์ประชาชน"],
      normal: 6.8, crisis: 7.2, pct: 6, stock: 3.6,
      supply: [
        ["รับซื้อไฟโซลาร์ประชาชนผ่านตลาด P2P", "ลดก๊าซที่ใช้ผลิตไฟช่วงกลางวัน (เทียบเท่า)", 0.3, "ทันที", "ok"],
        ["ใช้น้ำมันสำรองคลังจังหวัด", "อยู่ในพื้นที่ ส่งได้ทันที", 0.2, "0–6 ชม.", "ok"],
        ["โยกจากคลังในกรุงเทพฯ และนนทบุรี", "ใกล้ที่สุดราว 30 กม.", 0.3, "6 ชม.", "go"],
        ["ขยายสัญญาซื้อ LNG ระยะยาว", "ราคาคงที่ ลดการพึ่งตลาดจร", 0.1, "30 วัน", "wait"]
      ],
      alloc: [["โรงพยาบาลและกู้ภัย", 20], ["ขนส่งสินค้าจำเป็น", 25], ["ภาคอุตสาหกรรม", 30], ["ประชาชนทั่วไป", 25]],
      allocNote: "ปริมาณเชื้อเพลิงยังเพียงพอ AI จึงคงสัดส่วนใกล้ภาวะปกติ และเน้นลดต้นทุนแทนการจำกัดปริมาณ",
      steps: [["ประกาศเฝ้าระวังราคา", "ชม. 0", "แจ้งโรงงานที่ใช้ก๊าซเป็นหลัก"], ["เปิดรับซื้อไฟโซลาร์ผ่านตลาด P2P", "0–24 ชม.", "ลดการใช้ก๊าซผลิตไฟช่วงกลางวัน"],
        ["ช่วยค่าไฟครัวเรือนรายได้น้อย", "สัปดาห์ 1", "ประสานการไฟฟ้าและ อบจ."], ["เจรจาสัญญา LNG ระยะยาว", "สัปดาห์ 2–4", "ลดความผันผวนของราคา"], ["ทบทวนเกณฑ์ราคาทุกสัปดาห์", "ต่อเนื่อง", "ปรับแผนตามราคาตลาด"]],
      done: 2
    }
  };

  function renderScenario(name) {
    var d = SCEN[name];
    if (!d) { // น้ำท่วม = original design content
      Object.keys(ORIGINAL).forEach(function (id) { $(id).innerHTML = ORIGINAL[id]; });
      tagAllocButtons();
      EW.makeButtons();
      return;
    }
    var gap = +(d.crisis - d.normal).toFixed(1);
    var sum = d.supply.reduce(function (a, s) { return a + s[2]; }, 0);
    var maxCap = 0.8;

    $("aiSum").innerHTML = '<div class="ai-h"><div class="ai-title"><div class="ai-ic">AI</div><div><div class="card-t">ผลการวิเคราะห์ของ AI</div><div class="card-s">สถานการณ์: ' + name + ' · วิเคราะห์เมื่อ 10:30</div></div></div>' +
      '<div class="conf">ความมั่นใจ<div class="conf-bar"><div class="conf-fill" style="width:' + d.conf + '%"></div></div><b style="color:#2F5D8A">' + d.conf + "%</b></div></div>" +
      '<div class="ai-text">' + d.text + '</div><div class="factor-l">ปัจจัยที่ AI ใช้วิเคราะห์</div><div class="factors">' +
      d.factors.map(function (f) { return '<div class="factor">' + f + "</div>"; }).join("") + "</div>";

    $("demand").innerHTML = '<div class="card-h"><div><div class="card-t">ความต้องการน้ำมันที่ AI คาดการณ์</div><div class="card-s">ดีเซล + เบนซิน + LPG (ล้านลิตร/วัน)</div></div></div>' +
      '<div class="dm-row"><div class="dm-box n"><div class="dm-l">ภาวะปกติ</div><div class="dm-v">' + d.normal.toFixed(1) + '</div><div class="dm-u">ล้านลิตร/วัน</div></div>' +
      '<div class="dm-box c"><div class="dm-l">ช่วงวิกฤต</div><div class="dm-v" style="color:#B91C1C">' + d.crisis.toFixed(1) + '</div><div class="dm-u">ล้านลิตร/วัน (+' + d.pct + "%)</div></div></div>" +
      '<div class="gap-box"><div class="dm-l">ต้องจัดหาเพิ่ม</div><div class="gap-v">+' + gap.toFixed(1) + " ล้านลิตร/วัน</div></div>" +
      '<div class="gauge-l"><span>น้ำมันสำรองพอใช้</span><b style="color:#B91C1C">' + d.stock + ' / 7 วัน</b></div>' +
      '<div class="gauge"><div style="width:' + Math.round(d.stock / 7 * 100) + '%;background:#E5484D"></div></div>' +
      '<div class="gauge-note">เกณฑ์ปลอดภัย 7 วัน (สต็อก 25.8 ล้านลิตร)</div>';

    $("supply").innerHTML = '<div class="card-h"><div><div class="card-t">แหล่งจัดหาที่ AI แนะนำ</div><div class="card-s">เรียงตามคะแนนความเร็วและความคุ้มค่า</div></div><div class="pill">รวม ' + sum.toFixed(1) + " ล้านลิตร/วัน</div></div>" +
      d.supply.map(function (s, i) {
        return '<div class="src"><div class="src-n">' + (i + 1) + '</div><div class="src-main"><div class="src-t">' + s[0] + '</div><div class="src-why">เหตุผล: ' + s[1] + "</div></div>" +
          '<div class="src-cap"><div class="src-s">' + s[2].toFixed(1) + ' ล้านลิตร/วัน</div><div class="cap-bar"><div class="cap-fill" style="width:' + Math.min(100, Math.round(s[2] / maxCap * 100)) + '%"></div></div></div>' +
          '<div class="src-eta">' + s[3] + '</div><div class="src-st"><span class="st ' + s[4] + '">' + ST[s[4]] + "</span></div></div>";
      }).join("") +
      '<div class="sum"><span>จัดหาได้ ' + sum.toFixed(1) + " จากที่ต้องการเพิ่ม " + gap.toFixed(1) + " ล้านลิตร/วัน</span><b>เพียงพอ (+" + (sum - gap).toFixed(1) + ")</b></div>";

    $("alloc").innerHTML = '<div class="card-h"><div><div class="card-t">การจัดสรรที่ AI เสนอ</div><div class="card-s">จาก ' + d.crisis.toFixed(1) + " ล้านลิตร/วัน</div></div></div>" +
      '<div class="al-bar">' + d.alloc.map(function (a, i) { return '<div class="al-seg" style="width:' + a[1] + "%;background:" + ALLOC_COLORS[i] + '">' + a[1] + "%</div>"; }).join("") + "</div>" +
      d.alloc.map(function (a, i) {
        return '<div class="al-item"><div class="al-name"><div class="sw" style="background:' + ALLOC_COLORS[i] + '"></div>' + a[0] + '</div><div class="al-v">' + (d.crisis * a[1] / 100).toFixed(2) + "</div></div>";
      }).join("") +
      '<div class="al-ai">' + d.allocNote + '</div><div class="btn-row"><div class="btn sec" data-action="adjust">ปรับเอง</div><div class="btn pri" data-action="approve">อนุมัติแผน</div></div>';

    $("steps").innerHTML = '<div class="card-h"><div><div class="card-t">ขั้นตอนที่ AI แนะนำ</div><div class="card-s">เรียงตามลำดับเวลา</div></div><div class="pill">เสร็จแล้ว ' + d.done + " / " + d.steps.length + "</div></div>" +
      d.steps.map(function (s, i) {
        var last = i === d.steps.length - 1, done = i < d.done;
        return '<div class="step"><div class="rail"><div class="dot' + (done ? "" : " todo") + '">' + (done ? CHECK : i + 1) + "</div>" + (last ? "" : '<div class="line"></div>') + "</div>" +
          '<div class="step-b"><div class="step-top"><div class="step-t">' + s[0] + '</div><div class="step-time">' + s[1] + '</div></div><div class="step-d">' + s[2] + "</div></div></div>";
      }).join("");
    EW.makeButtons();
  }

  var currentScen = "น้ำท่วม";
  $("scen").addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    Array.prototype.forEach.call(this.children, function (c) { c.classList.toggle("on", c === chip); });
    currentScen = chip.textContent.trim();
    renderScenario(currentScen);
    resetChat();
  });

  // approve / adjust buttons (original markup has no data-action, so tag them once)
  function tagAllocButtons() {
    $("alloc").querySelectorAll(".btn").forEach(function (b) {
      if (!b.hasAttribute("data-action")) b.setAttribute("data-action", b.textContent.indexOf("อนุมัติ") >= 0 ? "approve" : "adjust");
    });
  }
  tagAllocButtons();
  $("alloc").addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b) return;
    if (b.getAttribute("data-action") === "approve") {
      EW.toast("แผนนี้ยังไม่ได้ถูกส่งให้ผู้มีอำนาจอนุมัติจริง");
      b.textContent = "อนุมัติแล้ว";
    } else {
      EW.toast("หน้าปรับสัดส่วนเองยังไม่ได้ทำในต้นแบบนี้");
    }
  });

  /* ---------------- chat with canned answers ---------------- */
  var chat = $("chat"), msgs = chat.querySelector(".msgs"), sugs = chat.querySelector(".sugs");
  var ORIGINAL_MSGS = msgs.innerHTML, ORIGINAL_SUGS = sugs.innerHTML;
  var FLOOD_ANSWERS = {
    "เทียบกับน้ำท่วมปี 2554": "ปี 2554 ปทุมธานีถูกน้ำท่วมนานกว่า 45 วัน ความต้องการน้ำมันเพิ่มสูงสุด<b>ราว 40%</b> ครั้งนี้ AI ประเมินว่ารุนแรงน้อยกว่า (+30%) เพราะมีทางยกระดับและคันกั้นน้ำเพิ่มขึ้น แต่ควรเตรียมแผนสำรองหากระดับน้ำสูงเกินปี 2554",
    "ถ้าขนส่งทางเรือไม่ได้?": "ถ้าขนส่งทางเรือไม่ได้ จะขาดไป 0.6 ล้านลิตร/วัน ทำให้จัดหาได้ 1.8 จาก 2.0 ที่ต้องการ แนะนำให้<b>อนุมัติรถบรรทุกจากคลังสระบุรีทันที</b> (แหล่งที่ 4) ซึ่งจะกลับมาเพียงพอ (+0.2)",
    "ค่าใช้จ่ายรวมเท่าไร": "ประมาณการค่าขนส่งและบริหารจัดการเพิ่ม<b>ราว 4.2 ล้านบาท/วัน</b> ส่วนใหญ่เป็นค่าขนส่งทางเรือและรถบรรทุก (ไม่รวมค่าน้ำมัน) ควรตรวจตัวเลขกับผู้ค้าน้ำมันอีกครั้ง"
  };
  function genericAnswers(name) {
    var d = SCEN[name];
    var sum = d.supply.reduce(function (a, s) { return a + s[2]; }, 0), gap = d.crisis - d.normal;
    return {
      "ขั้นตอนแรกคืออะไร": "ขั้นตอนแรกคือ<b>" + d.steps[0][0] + "</b> (" + d.steps[0][1] + ") จากนั้น" + d.steps[1][0] + " (" + d.steps[1][1] + ")",
      "ใครควรได้รับก่อน": d.allocNote,
      "จัดหาได้พอไหม": "จัดหาได้ <b>" + sum.toFixed(1) + " ล้านลิตร/วัน</b> จากที่ต้องการเพิ่ม " + gap.toFixed(1) + " จึงเพียงพอ (+" + (sum - gap).toFixed(1) + ") แหล่งที่เร็วที่สุดคือ" + d.supply[0][0]
    };
  }
  function answers() { return currentScen === "น้ำท่วม" ? FLOOD_ANSWERS : genericAnswers(currentScen); }
  function bubble(cls, html) {
    var row = document.createElement("div");
    row.className = cls === "u" ? "msg-u" : "msg-a";
    row.innerHTML = cls === "u" ? '<div class="bub-u"></div>' : '<div class="av">AI</div><div class="bub-a">' + html + "</div>";
    if (cls === "u") row.firstChild.textContent = html;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function ask(q) {
    bubble("u", q);
    var a = answers()[q];
    setTimeout(function () {
      bubble("a", a || "ต้นแบบนี้ยังไม่ได้เชื่อมต่อ AI จริง คำตอบในหน้านี้เป็นตัวอย่างที่เตรียมไว้ ลองกดคำถามแนะนำด้านบนได้");
      if (!a) EW.toast("แชต AI ยังไม่ได้เชื่อมต่อระบบจริง");
    }, 450);
  }
  function resetChat() {
    if (currentScen === "น้ำท่วม") { msgs.innerHTML = ORIGINAL_MSGS; sugs.innerHTML = ORIGINAL_SUGS; }
    else {
      msgs.innerHTML = '<div class="msg-a"><div class="av">AI</div><div class="bub-a">วิเคราะห์สถานการณ์<b>' + currentScen + "</b> ของปทุมธานีเรียบร้อยแล้ว ถามเกี่ยวกับแผนนี้ได้เลย</div></div>";
      sugs.innerHTML = Object.keys(genericAnswers(currentScen)).map(function (k) { return '<div class="sug">' + k + "</div>"; }).join("");
    }
    EW.makeButtons(chat);
  }
  sugs.addEventListener("click", function (e) {
    var s = e.target.closest(".sug");
    if (s) ask(s.textContent.trim());
  });
  $("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("chatIn").value.trim();
    if (!v) return;
    $("chatIn").value = "";
    ask(v);
  });

  if (location.hash === "#crisis") setTimeout(function () { $("crisis").scrollIntoView({ block: "start" }); }, 50);
})();
