/* AI วิเคราะห์วิกฤต: open saved analyses, run a simulated analysis, filter history */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ORIGINAL_BODY = $("rBody").innerHTML;

  function rec(n, t, d) {
    return '<div class="rec"><div class="rec-n">' + n + '</div><div><div class="rec-t">' + t + '</div><div class="rec-d">' + d + "</div></div></div>";
  }
  function body(text, need, gap, plan, recs) {
    return '<div class="res-text">' + text + '</div><div class="res-kpis">' +
      '<div class="rk"><div class="rk-l">ความต้องการช่วงวิกฤต</div><div class="rk-v">' + need.toFixed(1) + ' <span class="kpi-u">ล้านลิตร/วัน</span></div></div>' +
      '<div class="rk"><div class="rk-l">ต้องจัดหาเพิ่ม</div><div class="rk-v" style="color:#C2410C">+' + gap.toFixed(1) + ' <span class="kpi-u">ล้านลิตร/วัน</span></div></div>' +
      '<div class="rk"><div class="rk-l">หาได้ตามแผน</div><div class="rk-v" style="color:#15803D">' + plan.toFixed(1) + ' <span class="kpi-u">ล้านลิตร/วัน</span></div></div></div>' +
      recs.map(function (r, i) { return rec(i + 1, r[0], r[1]); }).join("");
  }

  /* saved analyses (sample data) */
  var SAVED = {
    "สงขลา": { sub: "น้ำท่วม · ความรุนแรงสูง · 7 วัน · วิเคราะห์เมื่อ 09:15", conf: 82, html: ORIGINAL_BODY },
    "เชียงใหม่": { sub: "น้ำท่วม · ความรุนแรงกลาง · 5 วัน · วิเคราะห์เมื่อ 08:40", conf: 79,
      html: body("AI ประเมินว่าหากฝนตกต่อเนื่องอีก 2 วัน ความต้องการน้ำมันจะ<b>เพิ่มขึ้น 35%</b> จากเครื่องสูบน้ำในเขตเมืองและอำเภอริมแม่น้ำปิง สต็อกปัจจุบัน<b>พอใช้ 4.5 วัน</b> ควรเตรียมโยกน้ำมันจากคลังลำปางไว้ล่วงหน้า",
        5.8, 1.5, 1.7, [["เตรียมปล่อยน้ำมันสำรองคลังจังหวัด", "0.6 ล้านลิตร/วัน · ภายใน 6 ชม."], ["โยกจากคลัง จ.ลำปาง ทางถนนสายเอเชีย", "0.7 ล้านลิตร/วัน · ภายใน 12 ชม."], ["ขนส่งทางรถไฟจากคลังลำพูน", "0.4 ล้านลิตร/วัน · ภายใน 24 ชม."]]) },
    "ภูเก็ต": { sub: "ขนส่งล่าช้า · ความรุนแรงกลาง · 3 วัน · วิเคราะห์เมื่อ 22 ต.ค. 16:05", conf: 85,
      html: body("เรือขนส่งน้ำมันล่าช้า 2 วันจากคลื่นลมแรง AI ประเมินว่าความต้องการจะ<b>เพิ่มขึ้น 12%</b> จากการซื้อตุนในช่วงข่าวขาดแคลน สต็อกปัจจุบัน<b>พอใช้ 5.2 วัน</b> ยังเพียงพอ ควรขนส่งทางถนนจากพังงาเสริมและสื่อสารกับประชาชนเพื่อลดการกักตุน",
        2.0, 0.2, 0.4, [["ใช้น้ำมันสำรองคลังจังหวัด", "0.2 ล้านลิตร/วัน · ภายใน 6 ชม."], ["ขนส่งทางถนนจาก จ.พังงา ผ่านสะพานสารสิน", "0.2 ล้านลิตร/วัน · ภายใน 12 ชม."], ["ประกาศจำกัดการซื้อต่อคันชั่วคราว", "ลดการกักตุน · ทันที"]]) },
    "อุบลราชธานี": { sub: "น้ำท่วม · ความรุนแรงสูง · 10 วัน · วิเคราะห์เมื่อ 02 ก.ย. 11:20", conf: 80,
      html: body("แม่น้ำมูลล้นตลิ่ง AI ประเมินว่าความต้องการน้ำมันจะ<b>เพิ่มขึ้น 38%</b> สต็อกพอใช้ 3.2 วัน (สถานการณ์นี้ปิดแล้ว)",
        3.3, 0.9, 1.1, [["ปล่อยน้ำมันสำรองคลังจังหวัด", "0.4 ล้านลิตร/วัน · ภายใน 6 ชม."], ["โยกจากคลัง จ.ศรีสะเกษ", "0.4 ล้านลิตร/วัน · ภายใน 12 ชม."], ["ขนส่งทางรถไฟจากนครราชสีมา", "0.3 ล้านลิตร/วัน · ภายใน 24 ชม."]]) },
    "เชียงราย": { sub: "ไฟป่า/หมอกควัน · ความรุนแรงกลาง · 14 วัน · วิเคราะห์เมื่อ 14 มี.ค. 13:45", conf: 77,
      html: body("ไฟป่าและหมอกควันทำให้การขนส่งทางถนนบางเส้นล่าช้า AI ประเมินว่าความต้องการ<b>เพิ่มขึ้น 8%</b> จากรถดับไฟและเครื่องฟอกอากาศในสถานพยาบาล สต็อก<b>พอใช้ 6.8 วัน</b> (สถานการณ์นี้ปิดแล้ว)",
        2.2, 0.2, 0.3, [["สำรองน้ำมันให้หน่วยดับไฟป่า", "0.1 ล้านลิตร/วัน · ทันที"], ["ส่งเครื่องปั่นไฟให้สถานพยาบาล", "0.1 ล้านลิตร/วัน · ภายใน 12 ชม."], ["ปรับเส้นทางขนส่งเลี่ยงพื้นที่ไฟป่า", "0.1 ล้านลิตร/วัน · ภายใน 24 ชม."]]) }
  };
  var current = "สงขลา";

  function show(prov) {
    var d = SAVED[prov];
    if (!d) return;
    current = prov;
    $("rTitle").textContent = "ผลการวิเคราะห์ล่าสุด: " + prov;
    $("rSub").textContent = d.sub;
    $("rConf").textContent = "ความมั่นใจ " + d.conf + "%";
    $("rBody").innerHTML = d.html;
    document.querySelectorAll(".ac").forEach(function (a) { a.classList.toggle("pick", a.querySelector(".ac-n").textContent === prov); });
    $("result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelector(".active").addEventListener("click", function (e) {
    var l = e.target.closest(".ac-link");
    if (l) show(l.getAttribute("data-prov"));
  });
  $("hTable").addEventListener("click", function (e) {
    var o = e.target.closest(".open-link");
    if (!o) return;
    show(o.closest("tr").querySelector("b").textContent.trim());
  });

  /* ---------- simulation form ---------- */
  var days = 7;
  var slider = $("sSlider"), fill = slider.querySelector(".slider-fill"), knob = slider.querySelector(".slider-knob");
  function pctFor(d) { return d <= 7 ? (d - 1) / 6 * 33.333 : 33.333 + (d - 7) / 14 * 66.667; } // marks 1·7·14·21 are evenly spaced
  function dayFor(p) { return p <= 33.333 ? 1 + p / 33.333 * 6 : 7 + (p - 33.333) / 66.667 * 14; }
  function setDays(d) {
    days = Math.max(1, Math.min(21, Math.round(d)));
    var p = pctFor(days);
    fill.style.width = p + "%";
    knob.style.left = "calc(" + p + "% - 9px)";
    $("sDaysL").textContent = "ระยะเวลาที่คาดว่าจะเกิด: " + days + " วัน";
    slider.setAttribute("aria-valuenow", days);
  }
  function fromEvent(e) {
    var r = slider.getBoundingClientRect();
    setDays(dayFor(Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100))));
  }
  slider.addEventListener("pointerdown", function (e) {
    slider.setPointerCapture(e.pointerId);
    fromEvent(e);
    var move = function (ev) { fromEvent(ev); };
    var up = function () { slider.removeEventListener("pointermove", move); slider.removeEventListener("pointerup", up); };
    slider.addEventListener("pointermove", move);
    slider.addEventListener("pointerup", up);
  });
  slider.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { setDays(days + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setDays(days - 1); e.preventDefault(); }
  });
  setDays(7);

  var NORMAL = { "ปทุมธานี": 6.8, "สงขลา": 2.6, "เชียงใหม่": 4.3, "ภูเก็ต": 1.8, "นนทบุรี": 5.2, "อุบลราชธานี": 2.4, "เชียงราย": 2.0 };
  var STOCK = { "ปทุมธานี": 3.8, "สงขลา": 3.0, "เชียงใหม่": 6.1, "ภูเก็ต": 5.8, "นนทบุรี": 4.2, "อุบลราชธานี": 4.4, "เชียงราย": 7.3 };
  var TYPE = {
    "น้ำท่วม": [30, "เครื่องสูบน้ำ เครื่องปั่นไฟ และเรือกู้ภัย", [["ปล่อยน้ำมันสำรองคลังจังหวัดทันที", 6], ["โยกจากคลังจังหวัดใกล้เคียงผ่านเส้นทางที่น้ำไม่ท่วม", 18], ["ขนส่งทางเรือหรือทางรถไฟ", 36]]],
    "ไฟฟ้าดับ": [22, "เครื่องปั่นไฟของโรงพยาบาล โรงงาน และอาคารสูง", [["ส่งรถเติมน้ำมันเคลื่อนที่ให้โรงพยาบาลและประปา", 4], ["เปิดปั๊มที่มีเครื่องปั่นไฟสำรอง", 6], ["ส่งแบตเตอรี่เคลื่อนที่ไปศูนย์พักพิง", 12]]],
    "ขาดแคลนก๊าซ": [18, "โรงงานที่เปลี่ยนจากก๊าซมาใช้น้ำมันชั่วคราว", [["จัดสรร LPG ให้ครัวเรือนก่อน", 6], ["โยกน้ำมันเตาให้โรงงานที่จำเป็น", 12], ["เพิ่มการรับซื้อไฟจากโซลาร์ประชาชน", 24]]],
    "ราคา LNG พุ่ง": [6, "โรงงานที่เปลี่ยนเชื้อเพลิงเพื่อลดต้นทุน", [["ใช้น้ำมันสำรองคลังจังหวัด", 6], ["ลดการใช้ก๊าซผลิตไฟช่วงกลางวัน", 24], ["เจรจาสัญญา LNG ระยะยาว", 72]]],
    "ขนส่งล่าช้า": [12, "การซื้อตุนในช่วงข่าวขาดแคลน", [["ใช้น้ำมันสำรองคลังจังหวัด", 6], ["ขนส่งทางถนนจากคลังจังหวัดใกล้เคียง", 12], ["จัดรอบขนส่งสำรอง", 36]]],
    "ไฟป่า/หมอกควัน": [8, "รถดับไฟและเครื่องปั่นไฟของสถานพยาบาล", [["สำรองน้ำมันให้หน่วยดับไฟป่า", 0], ["ส่งเครื่องปั่นไฟให้สถานพยาบาล", 12], ["ปรับเส้นทางขนส่งเลี่ยงพื้นที่ไฟป่า", 24]]]
  };
  var SEV = { "ต่ำ": 0.5, "กลาง": 0.8, "สูง": 1 };

  $("newAnalysis").addEventListener("click", function () {
    $("simulate").scrollIntoView({ behavior: "smooth", block: "start" });
    EW.toast("กรอกข้อมูลสถานการณ์ แล้วกด «ให้ AI วิเคราะห์»", { plain: true });
  });

  $("sRun").addEventListener("click", function () {
    var prov = EW.getValue($("sProv")), type = EW.getValue($("sType"));
    var sev = document.querySelector("#sSev .on").textContent.trim();
    var t = TYPE[type];
    var pct = Math.round(t[0] * SEV[sev] * (1 + (days - 7) / 40));
    var normal = NORMAL[prov], need = normal * (1 + pct / 100), gap = need - normal, plan = gap * 1.2;
    var stock = (STOCK[prov] / (1 + pct / 100)).toFixed(1);
    var shares = [0.4, 0.35, 0.25];
    var note = $("sNote").value.trim();
    var text = "AI ประเมินว่าความต้องการน้ำมันจะ<b>เพิ่มขึ้น " + pct + "%</b> จาก" + t[1] + " ในช่วง " + days + " วันของสถานการณ์" + type +
      " สต็อกปัจจุบัน<b>พอใช้ " + stock + " วัน</b> จึงควร" + t[2][0][0] + "เป็นอันดับแรก" + (note ? " (ข้อมูลเพิ่มเติม: " + note.replace(/</g, "&lt;") + ")" : "");
    var recs = t[2].map(function (r, i) {
      return [r[0], (plan * shares[i]).toFixed(1) + " ล้านลิตร/วัน · " + (r[1] ? "ภายใน " + r[1] + " ชม." : "ทันที")];
    });
    var sub = type + " · ความรุนแรง" + sev + " · " + days + " วัน · วิเคราะห์เมื่อ 10:30";
    var conf = Math.max(70, 88 - Math.round(days / 3));
    SAVED[prov] = { sub: sub, conf: conf, html: body(text, need, gap, plan, recs) };

    var tr = document.createElement("tr");
    tr.className = "new";
    tr.innerHTML = '<td class="muted">30 ต.ค. 2569 10:30</td><td><b>' + prov + "</b></td><td>" + type + " · " + sev + "</td><td>+" + pct + "% · ขาด " + gap.toFixed(1) +
      ' ล้านลิตร/วัน</td><td><span class="st watch">รออนุมัติ</span></td><td class="r"><span class="open-link" role="button" tabindex="0">เปิด</span></td>';
    var first = $("hTable").querySelectorAll("tr")[1];
    first.parentNode.insertBefore(tr, first);
    filterHistory();
    show(prov);
    EW.toast("ผลการวิเคราะห์นี้คำนวณจากสูตรตัวอย่าง ไม่ได้มาจาก AI จริง");
  });

  $("rOpen").addEventListener("click", function () {
    if (current === "ปทุมธานี") location.href = "energy-dashboard.html#crisis";
    else EW.toast("แผนฉบับเต็มมีเฉพาะจังหวัดปทุมธานีในหน้าแดชบอร์ด");
  });

  /* ---------- history tabs ---------- */
  var tabFilter = "ทั้งหมด";
  function filterHistory() {
    $("hTable").querySelectorAll("tr").forEach(function (tr, i) {
      if (i === 0) return;
      var st = tr.querySelector(".st").textContent.trim();
      tr.classList.toggle("is-hidden", tabFilter !== "ทั้งหมด" && st !== tabFilter);
    });
  }
  $("hTabs").addEventListener("ew:change", function (e) { tabFilter = e.detail.value; filterHistory(); });

  /* deep links from the home page */
  var HASH = { "#songkhla": "สงขลา", "#chiangmai": "เชียงใหม่", "#phuket": "ภูเก็ต" };
  if (HASH[location.hash]) setTimeout(function () { show(HASH[location.hash]); }, 60);
  else if (location.hash === "#simulate") setTimeout(function () { $("simulate").scrollIntoView({ block: "start" }); }, 60);
})();
