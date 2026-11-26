/* ตลาดอุปกรณ์มือสอง: filters, category tabs, product card -> seller info, buyer / seller view (no AI features on this page) */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var items = Array.prototype.slice.call(document.querySelectorAll("#grid .item"));

  var SELLERS = [
    { av: "วส", name: "คุณวิชัย ส.", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~1 ชม. · ขายแล้ว 3 รายการ",
      sum: "ราคา <b>1,200 บาท/แผ่น</b> (รวม 24,000 บาท)<br>ประสิทธิภาพคงเหลือ 88% · ใบรับรองเลขที่ PT-2569-0142",
      msg: "สวัสดีครับ หน่วยงานของเราสนใจแผงทั้ง 20 แผ่น ขอนัดดูสินค้าและใบรับรองได้ไหมครับ", item: "แผงโซลาร์ 550W โมโน · 20 แผ่น" },
    { av: "อท", name: "คุณอรุณี ท.", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~3 ชม. · ขายแล้ว 1 รายการ",
      sum: "ราคา <b>72,000 บาท/ชุด</b><br>ความจุคงเหลือ 76% · ใบรับรองเลขที่ PT-2569-0187",
      msg: "สวัสดีครับ สนใจแบตเตอรี่ EV ชุดนี้ ขอดูผลตรวจความจุและนัดดูสินค้าได้ไหมครับ", item: "แบตเตอรี่ EV (LFP) 40 kWh · 1 ชุด" },
    { av: "ปจ", name: "คุณประเสริฐ จ.", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~2 ชม. · ขายแล้ว 5 รายการ",
      sum: "ราคา <b>1,050 บาท/แผ่น</b> (รวม 12,600 บาท)<br>ประสิทธิภาพคงเหลือ 81% · ใบรับรองเลขที่ PT-2569-0121",
      msg: "สวัสดีครับ สนใจแผงทั้ง 12 แผ่น ราคานี้รวมค่าถอดแผงจากหลังคาหรือไม่ครับ", item: "แผงโซลาร์ 450W โมโน · 12 แผ่น" },
    { av: "นร", name: "คุณนภา ร.", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~1 ชม. · ขายแล้ว 2 รายการ",
      sum: "ราคา <b>30,000 บาท/ชุด</b><br>ความจุคงเหลือ 84% · รอตรวจรับรอง (นัดตรวจ 5 พ.ย. 2569)",
      msg: "สวัสดีครับ สนใจแบตเตอรี่บ้านชุดนี้ ขอรอผลตรวจรับรองก่อนตัดสินใจได้ไหมครับ", item: "แบตเตอรี่บ้าน (BESS) 10 kWh · 1 ชุด" },
    { av: "สล", name: "คุณสมพงษ์ ล.", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~6 ชม. · ผู้ขายใหม่",
      sum: "ราคา <b>520 บาท/แผ่น</b> (รวม 15,600 บาท)<br>ประสิทธิภาพคงเหลือ 73% · ใบรับรองเลขที่ PT-2569-0098",
      msg: "สวัสดีครับ สนใจแผงทั้ง 30 แผ่น สำหรับติดตั้งที่ศูนย์ชุมชน ขอนัดดูสินค้าได้ไหมครับ", item: "แผงโซลาร์ 330W โพลี · 30 แผ่น" },
    { av: "อซ", name: "อู่ซ่อมรถยนต์ไฟฟ้า สามโคก", meta: "ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~1 ชม. · ขายแล้ว 8 รายการ",
      sum: "ราคา <b>99,000 บาท/ชุด</b><br>ความจุคงเหลือ 71% · ใบรับรองเลขที่ PT-2569-0156",
      msg: "สวัสดีครับ สนใจแบตเตอรี่ EV ชุดนี้ไปทำแบตเตอรี่สำรองของอาคาร มีบริการติดตั้งด้วยไหมครับ", item: "แบตเตอรี่ EV (NMC) 60 kWh · 1 ชุด" }
  ];

  /* ---------- pick a product -> contact card follows ---------- */
  var selected = 0;
  function select(i, scroll) {
    selected = i;
    items.forEach(function (it, j) {
      var on = j === i;
      it.classList.toggle("sel", on);
      var b = it.querySelector(".contact-btn");
      b.classList.toggle("pri", on);
      b.classList.toggle("sec", !on);
    });
    var s = SELLERS[i];
    $("cItem").textContent = s.item;
    $("cAv").textContent = s.av;
    $("cName").textContent = s.name;
    $("cMeta").textContent = s.meta;
    $("cSum").innerHTML = s.sum;
    $("cMsg").value = s.msg;
    if (scroll) items[i].scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $("grid").addEventListener("click", function (e) {
    var it = e.target.closest(".item");
    if (!it) return;
    select(+it.getAttribute("data-i"));
    if (e.target.closest(".contact-btn")) $("contact").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  items.forEach(function (it) { it.setAttribute("tabindex", "0"); it.setAttribute("role", "button"); });

  /* ---------- filters ---------- */
  var f = { q: "", type: "ทั้งหมด", health: 70, km: 25, cert: false, tab: "all" };
  function passBase(it) {
    var txt = it.textContent.toLowerCase();
    if (f.q && f.q.split(/\s+/).some(function (w) { return txt.indexOf(w) < 0; })) return false;
    var t = it.getAttribute("data-type");
    if (f.type === "แผงโซลาร์" && t !== "panel") return false;
    if (f.type === "แบตเตอรี่" && t !== "batt") return false;
    if (+it.getAttribute("data-health") < f.health) return false;
    if (+it.getAttribute("data-km") > f.km) return false;
    if (f.cert && it.getAttribute("data-cert") !== "1") return false;
    return true;
  }
  function apply() {
    var base = items.filter(passBase);
    var panels = base.filter(function (it) { return it.getAttribute("data-type") === "panel"; }).length;
    var tabs = $("tTabs").children;
    tabs[0].textContent = "ทั้งหมด (" + base.length + ")";
    tabs[1].textContent = "แผงโซลาร์ (" + panels + ")";
    tabs[2].textContent = "แบตเตอรี่ (" + (base.length - panels) + ")";
    var shown = 0;
    items.forEach(function (it) {
      var ok = base.indexOf(it) >= 0 && (f.tab === "all" || it.getAttribute("data-type") === f.tab);
      it.classList.toggle("is-hidden", !ok);
      if (ok) shown++;
    });
    var empty = $("grid").querySelector(".grid-empty");
    if (!empty) {
      empty = document.createElement("div");
      empty.className = "grid-empty";
      empty.textContent = "ไม่พบสินค้าที่ตรงกับตัวกรอง ลองล้างคำค้นหรือขยายระยะทาง";
      $("grid").appendChild(empty);
    }
    empty.classList.toggle("is-hidden", shown > 0);
  }
  $("q").addEventListener("input", function () { f.q = this.value.trim().toLowerCase(); apply(); });
  $("fType").addEventListener("ew:change", function (e) { f.type = e.detail.value; apply(); });
  $("fHealth").addEventListener("ew:change", function (e) { f.health = parseInt(e.detail.value, 10) || 0; apply(); });
  $("fDist").addEventListener("ew:change", function (e) { f.km = parseInt(e.detail.value.replace(/\D/g, ""), 10) || 999; apply(); });
  $("fCert").addEventListener("click", function () {
    f.cert = !f.cert;
    this.querySelector(".box").classList.toggle("off", !f.cert);
    this.setAttribute("aria-checked", f.cert);
    apply();
  });
  $("tTabs").addEventListener("ew:change", function (e) { f.tab = ["all", "panel", "batt"][e.detail.index]; apply(); });
  apply();

  /* ---------- seller view ---------- */
  var listCol = $("listCol"), contact = $("contact");
  var BUYER_LIST = null;
  var SELLER_LIST =
    '<div class="list-h"><div class="card-t">สินค้าที่คุณลงขาย</div><a class="btn pri sm" href="used-sell.html">' + EW.ic("plus", "#FFFFFF", 14) + " ลงขายสินค้าใหม่</a></div>" +
    '<div class="card" style="width:744px"><table class="mine"><tr><th>สินค้า</th><th>สถานะ</th><th class="r">ราคา</th><th class="r">เข้าชม</th><th class="r">ข้อความ</th><th></th></tr>' +
    '<tr><td><b>แผงโซลาร์ 400W โมโน · 10 แผ่น</b><div class="card-s" style="margin-top:2px">อ.คลองหลวง · ประสิทธิภาพคงเหลือ 85%</div></td><td><span class="st ok">ตรวจรับรองแล้ว</span></td><td class="r">950 บาท/แผ่น</td><td class="r">128</td><td class="r">3</td><td class="r"><a class="link-o" href="used-messages.html">ดูข้อความ</a></td></tr>' +
    '<tr><td><b>แบตเตอรี่บ้าน (BESS) 5 kWh · 1 ชุด</b><div class="card-s" style="margin-top:2px">อ.คลองหลวง · ความจุคงเหลือ 82%</div></td><td><span class="st grey">รอตรวจรับรอง</span></td><td class="r">14,500 บาท/ชุด</td><td class="r">41</td><td class="r">1</td><td class="r"><a class="link-o" href="used-messages.html">ดูข้อความ</a></td></tr>' +
    "</table></div>";
  var SELLER_CONTACT =
    '<div class="card-h" style="margin-bottom:6px"><div><div class="card-t">ข้อความจากผู้สนใจ</div><div class="card-s">4 ข้อความใหม่</div></div></div>' +
    '<div class="inq"><div class="av">อบ</div><div><div class="inq-t">อบต.คลองหก</div><div class="inq-d">สนใจแผงทั้ง 10 แผ่น ขอดูใบรับรองก่อนได้ไหมครับ</div><div class="inq-m">แผงโซลาร์ 400W · 10 นาทีที่แล้ว</div></div></div>' +
    '<div class="inq"><div class="av">มก</div><div><div class="inq-t">คุณมานพ ก.</div><div class="inq-d">ลดราคาได้ไหมครับ ถ้ารับเองที่บ้าน</div><div class="inq-m">แผงโซลาร์ 400W · 1 ชม.ที่แล้ว</div></div></div>' +
    '<div class="inq"><div class="av">ศช</div><div><div class="inq-t">ศูนย์พัฒนาเด็กเล็ก ต.คลองหก</div><div class="inq-d">แบตเตอรี่ชุดนี้ใช้กับอินเวอร์เตอร์ 3 kW ได้ไหมคะ</div><div class="inq-m">BESS 5 kWh · เมื่อวาน</div></div></div>' +
    '<a class="btn pri" href="used-messages.html" style="margin-top:12px">' + EW.ic("chat", "#FFFFFF", 15) + " เปิดกล่องข้อความ</a>";
  var BUYER_CONTACT = contact.innerHTML;

  $("role").addEventListener("ew:change", function (e) {
    var seller = e.detail.index === 0;
    if (seller) {
      if (!BUYER_LIST) BUYER_LIST = Array.prototype.slice.call(listCol.childNodes);
      BUYER_LIST.forEach(function (n) { if (n.nodeType === 1) n.classList.add("is-hidden"); });
      listCol.insertAdjacentHTML("beforeend", '<div id="sellerList">' + SELLER_LIST + "</div>");
      contact.innerHTML = SELLER_CONTACT;
    } else {
      var sl = $("sellerList");
      if (sl) sl.remove();
      (BUYER_LIST || []).forEach(function (n) { if (n.nodeType === 1) n.classList.remove("is-hidden"); });
      contact.innerHTML = BUYER_CONTACT;
      rebindContact();
      select(selected);
    }
    $("filters").classList.toggle("is-hidden", seller);
    EW.makeButtons();
  });
  function rebindContact() {
    $("cSend").addEventListener("click", function () { EW.toast("ข้อความถึง" + SELLERS[selected].name + "ยังไม่ได้ถูกส่งจริง"); });
    $("cCall").addEventListener("click", function () { EW.toast("ระบบโทรหาผู้ขายยังไม่ได้เชื่อมต่อ"); });
    $("cMeet").addEventListener("click", function () { EW.toast("การนัดดูสินค้ากับ" + SELLERS[selected].name + "ยังไม่ได้ถูกบันทึกจริง"); });
  }

  rebindContact();

  /* deep link from home: #item-N */
  var m = /^#item-(\d)$/.exec(location.hash);
  if (m && items[+m[1] - 1]) setTimeout(function () { select(+m[1] - 1, true); }, 60);
})();
