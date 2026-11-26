/* ตั้งค่า: section nav, followed provinces, save / cancel */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var ALL = ["ปทุมธานี", "นนทบุรี", "พระนครศรีอยุธยา", "กรุงเทพมหานคร", "สมุทรปราการ", "สระบุรี", "สงขลา", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น"];

  /* left section menu */
  var navs = Array.prototype.slice.call($("setNav").children);
  navs.forEach(function (n, i) {
    n.addEventListener("click", function () {
      var card = $("set-" + (i + 1));
      if (!card) { EW.toast("ส่วน «" + n.textContent.trim() + "» ยังไม่ได้ทำในต้นแบบนี้"); return; }
      navs.forEach(function (x) { x.classList.toggle("on", x === n); });
      card.scrollIntoView({ behavior: "smooth", block: "start" });
      card.classList.add("flash");
      setTimeout(function () { card.classList.remove("flash"); }, 900);
    });
  });

  /* followed provinces */
  var chips = $("chips"), add = $("addProv");
  function followed() {
    return Array.prototype.map.call(chips.querySelectorAll(".chip[data-prov]"), function (c) { return c.getAttribute("data-prov"); });
  }
  function refreshOptions() {
    var left = ALL.filter(function (p) { return followed().indexOf(p) < 0; });
    add.setAttribute("data-options", left.join("|"));
    add.classList.toggle("is-hidden", !left.length);
  }
  chips.addEventListener("click", function (e) {
    var x = e.target.closest(".chip-x");
    if (!x) return;
    var chip = x.closest(".chip"), name = chip.getAttribute("data-prov");
    if (name === "ปทุมธานี") { EW.toast("ปทุมธานีเป็นจังหวัดหลักของบัญชีนี้ จึงนำออกไม่ได้", { plain: true }); return; }
    chip.remove();
    refreshOptions();
  });
  add.addEventListener("ew:change", function (e) {
    var name = e.detail.value;
    var chip = document.createElement("div");
    chip.className = "chip";
    chip.setAttribute("data-prov", name);
    chip.innerHTML = name + ' <span class="chip-x" role="button" tabindex="0" aria-label="นำ ' + name + ' ออก">' + EW.ic("x", "#6B7280", 14) + "</span>";
    chips.insertBefore(chip, add);
    refreshOptions();
  });
  refreshOptions();

  $("save").addEventListener("click", function () { EW.toast("การเปลี่ยนแปลงยังไม่ได้ถูกบันทึกลงระบบจริง"); });
  $("cancel").addEventListener("click", function () {
    EW.toast("ยกเลิกการเปลี่ยนแปลงแล้ว", { plain: true });
    setTimeout(function () { location.reload(); }, 700);
  });
})();
