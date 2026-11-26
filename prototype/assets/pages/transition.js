/* เปลี่ยนผ่านพลังงาน: Net Zero path, Demand Response, Data Center demand, Adaptive Optimization, Energy for All */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = EW.fmt;
  var NOW = 2569;

  /* draws a column chart; cols = [{label, parts:[[value,color]], total, fc, now, mark, hl}] */
  function draw(chartId, xId, cols, max, opts) {
    opts = opts || {};
    var H = 160; // px for the tallest possible bar
    $(chartId).innerHTML = cols.map(function (c) {
      // first part sits at the bottom of the stack
      var stack = c.parts.slice().reverse().map(function (p) { return '<div style="height:' + Math.round(p[0] / max * H) + "px;background:" + p[1] + '"></div>'; }).join("");
      var mark = c.mark != null ? '<div class="mark" style="bottom:' + Math.round(c.mark / max * H) + 'px" title="เส้นทาง Net Zero"></div>' : "";
      return '<div class="vc' + (c.fc ? " fc" : "") + '">' + (c.hl ? '<div class="hl" style="left:-3px;right:-3px"></div>' : "") +
        '<div class="vc-v">' + c.total + '</div><div class="vc-b">' + stack + "</div>" + mark + "</div>";
    }).join("") + (opts.limit ? '<div class="limit" style="bottom:' + Math.round(opts.limit / max * H) + 'px"><span>' + opts.limitLabel + "</span></div>" : "");
    $(xId).innerHTML = cols.map(function (c) { return '<div class="' + (c.now ? "now" : "") + '">' + c.label + "</div>"; }).join("");
  }

  /* ---------- Decarbonization: emissions and Net Zero path ---------- */
  var FOSSIL = { 2560: 3770, 2561: 3880, 2562: 3950, 2563: 3460, 2564: 3600, 2565: 3750, 2566: 3830, 2567: 3860, 2568: 3850, 2569: 3850, 2570: 3820, 2571: 3770, 2572: 3710 };
  var AI_PLAN = { 2570: 3790, 2571: 3720, 2572: 3620 }; // fossil if the renewable recommendations are followed
  var EF = 2.6 / 1000; // MtCO2e per ktoe of fossil fuel (sample factor)
  var BASE = FOSSIL[NOW] * EF;
  function nzPath(y) { return y <= NOW ? null : BASE * (1 - (y - NOW) / (2593 - NOW)); }
  function renderNZ(plan) {
    var cols = [];
    for (var y = 2560; y <= 2572; y++) {
      var f = plan && AI_PLAN[y] ? AI_PLAN[y] : FOSSIL[y];
      var v = f * EF;
      cols.push({ label: y === NOW ? y + "*" : y, total: v.toFixed(1), parts: [[v, "#F08C3A"]], fc: y > NOW, now: y === NOW, mark: nzPath(y) });
    }
    // Net Zero milestones shown as green target bars
    [2580, 2593].forEach(function (y) {
      var t = nzPath(y);
      cols.push({ label: y === 2593 ? "2593 (2050)" : "เป้า " + y, total: t < 0.05 ? "Net Zero" : t.toFixed(1), parts: [[Math.max(t, 0.12), "#22A06B"]] });
    });
    draw("nzChart", "nzX", cols, 11);
    var end = (plan ? AI_PLAN[2572] : FOSSIL[2572]) * EF, target = nzPath(2572);
    $("nzNote").innerHTML = (plan ? "<b>ตามแผนของ AI:</b> ใช้ฟางข้าวและโซลาร์รูฟท็อปแทนฟอสซิล การปล่อยปี 2572 เหลือ " : "<b>ตามแนวโน้ม:</b> การปล่อยปี 2572 จะอยู่ที่ ") +
      "<b>" + end.toFixed(1) + " MtCO₂e</b> ขณะที่เส้นทาง Net Zero 2050 ต้องไม่เกิน <b>" + target.toFixed(1) + " MtCO₂e</b> · ยังเกินอยู่ " + (end - target).toFixed(1) +
      " Mt" + (plan ? " ต้องเพิ่มไมโครกริดและ Demand Response ร่วมด้วย" : " จึงต้องเร่งพลังงานหมุนเวียนตามคำแนะนำของ AI") + " · *ปีปัจจุบัน";
  }
  $("nzTabs").addEventListener("ew:change", function (e) { renderNZ(e.detail.index === 1); });
  renderNZ(false);

  /* ---------- Demand Response ---------- */
  var LIMIT = 1850;
  var TODAY = [1250, 1210, 1180, 1160, 1170, 1230, 1360, 1480, 1580, 1640, 1690, 1720, 1730, 1740, 1720, 1700, 1730, 1800, 1880, 1920, 1900, 1820, 1620, 1420];
  var DR = {
    today: { load: TODAY, cut: { 18: 45, 19: 80, 20: 70 }, window: "18:00 – 21:00", total: 80, status: "กำหนดการวันนี้",
      src: [["โรงงาน 12 แห่ง เลื่อนกะผลิต", 45], ["แบตเตอรี่ชุมชนและ BESS จ่ายไฟ", 20], ["แอร์อัจฉริยะ 860 ครัวเรือน", 15]] },
    tomorrow: { load: TODAY.map(function (v) { return Math.round(v * 1.03); }), cut: { 17: 20, 18: 95, 19: 135, 20: 115 }, window: "17:00 – 21:00", total: 135, status: "พยากรณ์พรุ่งนี้",
      src: [["โรงงาน 15 แห่ง เลื่อนกะผลิต", 70], ["แบตเตอรี่ชุมชนและ BESS จ่ายไฟ", 35], ["แอร์อัจฉริยะ 1,400 ครัวเรือน", 30]] }
  };
  var drKey = "today";
  function renderDR() {
    var d = DR[drKey];
    var peak = Math.max.apply(null, d.load), peakH = d.load.indexOf(peak);
    var cols = d.load.map(function (v, h) {
      var cut = d.cut[h] || 0;
      return { label: h % 3 === 0 ? (h < 10 ? "0" : "") + h + ":00" : "", total: h === peakH ? fmt(v) : "", hl: !!cut,
        parts: cut ? [[v - cut, "#4F8BC9"], [cut, "#22A06B"]] : [[v, "#4F8BC9"]] };
    });
    draw("drChart", "drX", cols, 2100, { limit: LIMIT, limitLabel: "กำลังจ่ายสูงสุด " + fmt(LIMIT) + " MW" });
    var after = Math.max.apply(null, d.load.map(function (v, h) { return v - (d.cut[h] || 0); }));
    $("drNote").innerHTML = "ช่วงพีค " + (peakH < 10 ? "0" : "") + peakH + ":00 ความต้องการสูงถึง <b>" + fmt(peak) + " MW</b> เกินกำลังจ่าย " + fmt(peak - LIMIT) +
      " MW · ถ้าใช้ Demand Response ช่วง " + d.window + " จะเหลือสูงสุด <b>" + fmt(after) + " MW</b> ไม่ต้องเดินโรงไฟฟ้าก๊าซเพิ่ม";
    $("drEv").innerHTML = "ช่วง <b>" + d.window + "</b> ลดโหลดรวม <b>" + d.total + " MW</b> โดยให้ส่วนลดค่าไฟแก่ผู้เข้าร่วม";
    $("drSrc").innerHTML = d.src.map(function (s) { return '<div class="dr-src"><span>' + s[0] + "</span><b>−" + s[1] + " MW</b></div>"; }).join("");
    $("drSt").textContent = d.status;
  }
  $("drTabs").addEventListener("ew:change", function (e) { drKey = e.detail.index === 0 ? "today" : "tomorrow"; renderDR(); });
  $("drAuto").addEventListener("ew:change", function (e) {
    EW.toast(e.detail.on ? "เปิดให้ AI สั่งลดโหลดอัตโนมัติแล้ว" : "ปิดการลดโหลดอัตโนมัติ ผู้ดูแลต้องสั่งเองทุกครั้ง", { plain: true });
  });
  $("drAnnounce").addEventListener("click", function () {
    EW.toast("ประกาศ Demand Response ช่วง " + DR[drKey].window + " ยังไม่ได้ถูกส่งถึงผู้เข้าร่วมจริง");
  });
  renderDR();

  /* ---------- Data Center & AI demand ---------- */
  var DC_YEARS = [2569, 2570, 2571, 2572, 2573, 2574, 2575];
  var DC_BASE = [1920, 1960, 2000, 2040, 2080, 2120, 2160];
  var DC_ADD = [0, 0, 60, 100, 140, 180, 180];
  var CAPACITY = 2100;
  function renderDC(withDC) {
    var cols = DC_YEARS.map(function (y, i) {
      var add = withDC ? DC_ADD[i] : 0;
      return { label: y === NOW ? y + "*" : y, total: fmt(DC_BASE[i] + add), fc: y > NOW, now: y === NOW,
        parts: add ? [[DC_BASE[i], "#4F8BC9"], [add, "#7C3AED"]] : [[DC_BASE[i], "#4F8BC9"]] };
    });
    draw("dcChart", "dcX", cols, 2500, { limit: CAPACITY, limitLabel: "กำลังจ่ายปัจจุบัน " + fmt(CAPACITY) + " MW" });
    var last = DC_BASE[6] + (withDC ? DC_ADD[6] : 0);
    $("dcNote").innerHTML = withDC
      ? "Data Center และ AI จะเพิ่มความต้องการไฟสูงสุด <b>+180 MW</b> ภายในปี 2574 ทำให้ปี 2575 ต้องการ <b>" + fmt(last) + " MW</b> เกินกำลังจ่ายปัจจุบัน " + fmt(last - CAPACITY) + " MW ต้องวางแผนโซลาร์ แบตเตอรี่ และสถานีไฟฟ้าเพิ่มตั้งแต่ตอนนี้"
      : "ถ้าไม่มี Data Center ความต้องการจะโต 2% ต่อปี ปี 2575 อยู่ที่ <b>" + fmt(last) + " MW</b> เกินกำลังจ่ายปัจจุบัน " + fmt(last - CAPACITY) + " MW";
  }
  $("dcSeg").addEventListener("ew:change", function (e) { renderDC(e.detail.index === 1); });
  renderDC(true);

  /* ---------- Adaptive Optimization: confirm or reject AI adjustments ---------- */
  function pending() { return $("adList").querySelectorAll(".ad-a .btn").length / 2; }
  $("adList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var ad = b.closest(".ad"), yes = b.getAttribute("data-act") === "yes";
    ad.querySelector(".ad-a").innerHTML = yes ? '<span class="st info">ผู้ดูแลยืนยันแล้ว</span>' : '<span class="st grey">ไม่ใช้</span>';
    var n = pending();
    $("adCount").textContent = n ? "รอยืนยัน " + n + " รายการ" : "ยืนยันครบแล้ว";
    if (yes) EW.toast("แผนที่ปรับนี้ยังไม่ได้ถูกส่งไปยังระบบควบคุมจริง");
  });

  /* ---------- Energy for All: burden by district ---------- */
  var LEVEL = { "เร่งด่วน": "crit", "สูง": "watch", "ปานกลาง": "info", "ต่ำ": "ok" };
  var DIST = [
    ["หนองเสือ", 14.2, 5600, 1.0, "เร่งด่วน"], ["ลาดหลุมแก้ว", 13.5, 4900, 1.2, "เร่งด่วน"], ["สามโคก", 11.0, 3100, 2.0, "สูง"],
    ["ลำลูกกา", 9.8, 9200, 3.8, "สูง"], ["คลองหลวง", 8.1, 6300, 4.1, "ปานกลาง"], ["เมืองปทุมธานี", 7.2, 4100, 2.9, "ปานกลาง"], ["ธัญบุรี", 6.4, 4800, 3.6, "ต่ำ"]
  ];
  var head = $("efTable").innerHTML;
  function renderEF(onlyUrgent) {
    $("efTable").innerHTML = head + DIST.filter(function (d) { return !onlyUrgent || d[4] === "เร่งด่วน" || d[4] === "สูง"; }).map(function (d) {
      var color = d[1] >= 12 ? "#E5484D" : d[1] >= 9 ? "#F08C3A" : "#22A06B";
      return "<tr><td><b>อ." + d[0] + '</b></td><td><div class="burden"><div class="bar"><div style="width:' + Math.round(d[1] / 15 * 100) + "%;background:" + color + '"></div></div>' + d[1].toFixed(1) +
        '%</div></td><td class="r">' + fmt(d[2]) + '</td><td class="r">' + d[3].toFixed(1) + ' MW</td><td><span class="st ' + LEVEL[d[4]] + '">' + d[4] +
        '</span></td><td class="r"><span class="tpl-btn is-clickable" role="button" tabindex="0" data-toast="แผนช่วยเหลือ อ.' + d[0] + ' ยังไม่ได้ทำเป็นหน้าแยกในต้นแบบนี้">ดูแผนช่วยเหลือ</span></td></tr>';
    }).join("");
  }
  $("efTabs").addEventListener("ew:change", function (e) { renderEF(e.detail.index === 1); });
  renderEF(false);

  /* deep links (#demand-response, #data-center, #adaptive, #energy-for-all, #netzero) */
  if (location.hash && $(location.hash.slice(1))) setTimeout(function () { $(location.hash.slice(1)).scrollIntoView({ block: "start" }); }, 60);
})();
