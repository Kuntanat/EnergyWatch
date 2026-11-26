/* ข้อมูลย้อนหลัง: province / energy type / year range / yearly-monthly filters */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var fmt = EW.fmt;
  var MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  var YEARS = []; for (var y = 2555; y <= 2569; y++) YEARS.push(y);

  // เชียงใหม่ = the original design data
  var CM = {
    mTotal: [215, 210, 225, 230, 212, 196, 190, 188, 186, 195, 198, 190],
    mClean: [44, 46, 54, 57, 51, 44, 40, 39, 38, 42, 42, 43],
    yTotal: [2020, 2060, 2090, 2110, 2130, 2150, 2220, 2280, 2060, 2140, 2270, 2370, 2420, 2435, 2450],
    yClean: [180, 195, 210, 230, 245, 260, 290, 320, 340, 380, 420, 470, 510, 540, 570]
  };
  // ปทุมธานี = same yearly series as the dashboard; 2568 monthly follows the same seasonal shape
  function scaleTo(arr, total) {
    var sum = arr.reduce(function (a, b) { return a + b; }, 0);
    var out = arr.map(function (v) { return Math.round(v * total / sum); });
    out[11] += total - out.reduce(function (a, b) { return a + b; }, 0);
    return out;
  }
  var PT = {
    mTotal: scaleTo(CM.mTotal, 4300),
    mClean: scaleTo(CM.mClean, 450),
    yTotal: [3560, 3640, 3720, 3800, 3880, 3950, 4080, 4170, 3700, 3860, 4050, 4180, 4260, 4300, 4350],
    yClean: [120, 130, 140, 155, 165, 180, 200, 220, 240, 260, 300, 350, 400, 450, 500]
  };
  var DATA = { "ปทุมธานี": PT, "เชียงใหม่": CM };

  var state = { prov: "ปทุมธานี", type: "ทั้งหมด", start: 2555, res: "รายเดือน" };

  function bars(labels, totals, cleans) {
    var max = Math.max.apply(null, totals);
    var scale = 156 / (max / 230 * 240); // compact chart: tallest bar ~150px
    return labels.map(function (l, i) {
      var c = state.type === "ฟอสซิล" ? 0 : cleans[i];
      var f = state.type === "พลังงานสะอาด" ? 0 : totals[i] - cleans[i];
      var shown = state.type === "ทั้งหมด" ? totals[i] : c + f;
      return '<div class="m-col"><div class="m-tot">' + fmt(shown) + '</div><div class="m-stack">' +
        '<div class="clean" style="height:' + Math.round(c * scale) + 'px"></div><div class="fossil" style="height:' + Math.round(f * scale) + 'px"></div></div>' +
        '<div class="m-l">' + l + "</div></div>";
    }).join("");
  }
  function argmax(a) { return a.indexOf(Math.max.apply(null, a)); }
  function argmin(a) { return a.indexOf(Math.min.apply(null, a)); }

  function render() {
    var d = DATA[state.prov];
    var chart = $("mChart");
    if (state.res === "รายเดือน") {
      chart.classList.remove("yearly");
      chart.innerHTML = bars(MONTHS, d.mTotal, d.mClean);
      var sum = d.mTotal.reduce(function (a, b) { return a + b; }, 0);
      $("chartT").textContent = "การใช้พลังงานรายเดือน ปี 2568";
      $("chartS").textContent = state.prov + " · ktoe/เดือน · รวมทั้งปี " + fmt(sum);
      var hi = argmax(d.mTotal), lo = argmin(d.mTotal), ch = argmax(d.mClean);
      $("season").innerHTML =
        "<div><b>ใช้สูงสุด: " + MONTHS[hi] + "</b>" + d.mTotal[hi] + " ktoe · หน้าร้อน ใช้ไฟฟ้าทำความเย็นมาก</div>" +
        "<div><b>ใช้ต่ำสุด: " + MONTHS[lo] + "</b>" + d.mTotal[lo] + " ktoe · ช่วงฤดูฝน การเดินทางลดลง</div>" +
        "<div><b>สะอาดสูงสุด: " + MONTHS[ch] + "</b>" + d.mClean[ch] + " ktoe · แดดแรง โซลาร์ผลิตได้มาก</div>";
    } else {
      var idx = YEARS.map(function (y, i) { return i; }).filter(function (i) { return YEARS[i] >= state.start; });
      var t = idx.map(function (i) { return d.yTotal[i]; }), c = idx.map(function (i) { return d.yClean[i]; });
      chart.classList.add("yearly");
      chart.innerHTML = bars(idx.map(function (i) { return YEARS[i]; }), t, c);
      $("chartT").textContent = "การใช้พลังงานรายปี " + state.start + " – 2569";
      $("chartS").textContent = state.prov + " · ktoe/ปี";
      var hy = argmax(t), ly = argmin(t);
      $("season").innerHTML =
        "<div><b>ใช้สูงสุด: " + YEARS[idx[hy]] + "</b>" + fmt(t[hy]) + " ktoe · เศรษฐกิจและเมืองขยายตัว</div>" +
        "<div><b>ใช้ต่ำสุด: " + YEARS[idx[ly]] + "</b>" + fmt(t[ly]) + " ktoe" + (YEARS[idx[ly]] === 2563 ? " · ช่วงโควิด-19" : "") + "</div>" +
        "<div><b>พลังงานสะอาดเพิ่มขึ้น</b>" + (c[c.length - 1] / c[0]).toFixed(1) + " เท่า จากปี " + YEARS[idx[0]] + "</div>";
    }
    renderTable(d);
  }

  function renderTable(d) {
    var idx = YEARS.map(function (y, i) { return i; }).filter(function (i) { return YEARS[i] >= state.start; });
    var th = function (i) { return '<th class="r' + (YEARS[i] === 2563 ? " covid" : "") + '">' + YEARS[i] + "</th>"; };
    var row = function (cls, label, fn) { return '<tr class="' + cls + '"><td>' + label + "</td>" + idx.map(function (i) { return '<td class="r">' + fn(i) + "</td>"; }).join("") + "</tr>"; };
    var h = "<tr><th>ประเภท</th>" + idx.map(th).join("") + "</tr>";
    if (state.type !== "พลังงานสะอาด") h += row("", "ฟอสซิล", function (i) { return fmt(d.yTotal[i] - d.yClean[i]); });
    if (state.type !== "ฟอสซิล") h += row("", "พลังงานสะอาด", function (i) { return fmt(d.yClean[i]); });
    h += row("tot", "รวม", function (i) { return fmt(d.yTotal[i]); });
    h += row("shr", "สัดส่วนสะอาด", function (i) { return Math.round(d.yClean[i] / d.yTotal[i] * 100) + "%"; });
    $("yTable").innerHTML = h;
    $("tblT").textContent = "ข้อมูลรายปี " + state.start + " – 2569";
    $("tblS").textContent = state.prov + " · ktoe/ปี · แถบสีส้มคือปีที่ได้รับผลกระทบจากโควิด-19";
  }

  function setProv(v) {
    state.prov = v;
    EW.setValue($("provTop"), v);
    EW.setValue($("fProv"), v);
    render();
  }
  $("provTop").addEventListener("ew:change", function (e) { setProv(e.detail.value); });
  $("fProv").addEventListener("ew:change", function (e) { setProv(e.detail.value); });
  $("fType").addEventListener("ew:change", function (e) { state.type = e.detail.value; render(); });
  $("fRange").addEventListener("ew:change", function (e) { state.start = parseInt(e.detail.value, 10); render(); });
  $("fRes").addEventListener("ew:change", function (e) { state.res = e.detail.value; render(); });
  $("fApply").addEventListener("click", function () {
    render();
    EW.toast("แสดงข้อมูล " + state.prov + " · " + state.type + " · " + state.start + " – 2569 · " + state.res, { plain: true });
  });

  render();
})();
