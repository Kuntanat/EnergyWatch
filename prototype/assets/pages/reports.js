/* รายงาน: create from template, search, auto-send switches */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var table = $("rTable");

  $("newReport").addEventListener("click", function () {
    $("tpls").scrollIntoView({ behavior: "smooth", block: "center" });
    EW.toast("เลือกแม่แบบรายงานที่ต้องการด้านล่าง", { plain: true });
  });

  var TYPE = { "รายงานประจำเดือน": "ประจำเดือน", "สรุปวิกฤต": "สรุปวิกฤต", "เปรียบเทียบภูมิภาค": "เปรียบเทียบ" };
  var NAME = { "รายงานประจำเดือน": "รายงานพลังงานประจำเดือน ต.ค. 2569", "สรุปวิกฤต": "สรุปสถานการณ์เฝ้าระวัง ปทุมธานี", "เปรียบเทียบภูมิภาค": "เปรียบเทียบภาคกลาง ต.ค. 2569" };
  $("tpls").addEventListener("click", function (e) {
    var b = e.target.closest(".tpl-btn");
    if (!b) return;
    var t = b.closest(".tpl").querySelector(".tpl-t").textContent.trim();
    var area = t === "เปรียบเทียบภูมิภาค" ? "ภาคกลาง" : "ปทุมธานี";
    var tr = document.createElement("tr");
    tr.className = "new";
    tr.innerHTML = '<td><div class="fname"><span class="ftype pdf">PDF</span><b>' + NAME[t] + "</b></div></td><td>" + area +
      '</td><td><span class="st info">' + TYPE[t] + '</span></td><td class="muted">30 ต.ค. 2569</td><td class="muted">กำลังสร้าง</td><td></td>';
    var first = table.querySelectorAll("tr")[1];
    first.parentNode.insertBefore(tr, first);
    EW.toast("เพิ่ม «" + NAME[t] + "» ในรายการแล้ว แต่ยังไม่มีไฟล์จริง");
  });

  $("rSearch").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase(), shown = 0;
    table.querySelectorAll("tr").forEach(function (tr, i) {
      if (i === 0 || tr.classList.contains("empty")) return;
      var hit = !q || tr.textContent.toLowerCase().indexOf(q) >= 0;
      tr.classList.toggle("is-hidden", !hit);
      if (hit) shown++;
    });
    var empty = table.querySelector(".empty");
    if (!shown && !empty) {
      empty = document.createElement("tr");
      empty.className = "empty";
      empty.innerHTML = '<td colspan="6">ไม่พบรายงานที่ตรงกับคำค้น</td>';
      table.appendChild(empty);
    }
    if (empty) empty.classList.toggle("is-hidden", shown > 0);
  });

  $("sched").addEventListener("ew:change", function (e) {
    var name = e.target.closest(".sc").querySelector(".sc-t").textContent.trim();
    EW.toast((e.detail.on ? "เปิด" : "ปิด") + "การส่งอัตโนมัติ «" + name + "»", { plain: true });
  });
})();
