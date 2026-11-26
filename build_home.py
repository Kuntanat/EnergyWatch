"""Home page: three equal main sections (dashboard, P2P electricity market, used-equipment market)."""
import sys
from build_pages import ic, SECTIONS

DASH, P2P, USED = (SECTIONS[k][2] for k in ("dash", "p2p", "used"))

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1440px; font-family: "Inter", "Noto Sans Thai", sans-serif; background: #F4F6F9; color: #111827; }
.hero { background: linear-gradient(160deg, #0F172A 0%, #1E293B 70%, #14532D 100%); color: #FFFFFF; padding-bottom: 150px; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 96px; }
.brand { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; }
.brand-mark { width: 36px; height: 36px; border-radius: 10px; background: #22A06B; display: flex; align-items: center; justify-content: center; }
.links { display: flex; gap: 36px; font-size: 15px; color: #CBD5E1; }
.links .on { color: #FFFFFF; font-weight: 600; }
.login { padding: 10px 20px; border-radius: 10px; border: 1px solid #334155; font-size: 14px; font-weight: 600; }
.hero-body { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 96px 0; }
.tag { background: #1E3A5F; color: #CBD8E6; padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; margin-bottom: 22px; }
h1 { font-size: 48px; line-height: 1.25; font-weight: 800; letter-spacing: -1px; margin-bottom: 18px; }
h1 span { color: #4ADE80; }
.lead { font-size: 18px; line-height: 1.7; color: #CBD5E1; width: 760px; margin-bottom: 28px; }
.prov { display: flex; align-items: center; gap: 12px; background: #FFFFFF; color: #111827; border-radius: 12px; padding: 10px 10px 10px 18px; font-size: 15px; }
.prov .l { color: #6B7280; }
.prov .v { font-weight: 700; }
.prov .chg { background: #F3F4F6; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-weight: 600; color: #374151; }
.pillars { display: flex; gap: 24px; padding: 0 96px; margin-top: -110px; }
.pillar { width: 400px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; padding: 28px; border-top: 5px solid #E5E7EB; }
.p-ic { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.p-t { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
.p-d { font-size: 15px; line-height: 1.6; color: #4B5563; height: 72px; }
.p-stats { display: flex; gap: 12px; margin: 20px 0; }
.p-s { flex: 1; background: #F9FAFB; border-radius: 12px; padding: 12px; }
.p-sv { font-size: 20px; font-weight: 800; }
.p-sl { font-size: 12px; color: #6B7280; margin-top: 2px; }
.p-list { font-size: 14px; color: #374151; line-height: 1.9; margin-bottom: 22px; }
.p-btn { display: flex; justify-content: center; align-items: center; gap: 8px; padding: 13px; border-radius: 12px; color: #FFFFFF; font-size: 15px; font-weight: 700; }
.section { padding: 64px 96px 0; }
.sec-t { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
.sec-s { font-size: 15px; color: #6B7280; margin-bottom: 24px; }
.cols { display: flex; gap: 24px; }
.col { width: 400px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 18px; padding: 22px; }
.c-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.c-t { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 700; }
.c-dot { width: 10px; height: 10px; border-radius: 5px; }
.c-more { font-size: 13px; font-weight: 700; }
.row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #F3F4F6; }
.r-t { font-size: 14px; font-weight: 600; }
.r-s { font-size: 12px; color: #6B7280; margin-top: 2px; }
.r-v { font-size: 14px; font-weight: 800; text-align: right; }
.st { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
.st.crit { background: #FEE2E2; color: #B91C1C; }
.st.watch { background: #FEF3C7; color: #92400E; }
.pros { margin: 40px 96px 0; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 20px; padding: 28px; }
.pros-h { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
.pros-t { font-size: 22px; font-weight: 800; }
.pros-s { font-size: 14px; color: #6B7280; margin-top: 4px; }
.pros-tag { font-size: 12px; font-weight: 700; color: #166534; background: #DCFCE7; padding: 6px 12px; border-radius: 999px; }
.pros-stats { display: flex; gap: 16px; margin-bottom: 22px; }
.pst { width: 286px; background: #F9FAFB; border-radius: 14px; padding: 16px; }
.pst-v { font-size: 26px; font-weight: 800; }
.pst-u { font-size: 14px; color: #6B7280; font-weight: 600; }
.pst-l { font-size: 13px; color: #6B7280; margin-top: 4px; }
.goal-top { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
.goal-bar { height: 14px; border-radius: 7px; background: #E5E7EB; overflow: hidden; }
.goal-fill { height: 14px; border-radius: 7px; background: #22A06B; }
.goal-n { font-size: 13px; color: #4B5563; margin-top: 10px; }
.parts { display: flex; flex-wrap: wrap; gap: 24px; }
.part { width: 400px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; display: flex; gap: 14px; }
.pt-ic { width: 44px; height: 44px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pt-n { font-size: 16px; font-weight: 700; }
.pt-d { font-size: 13px; color: #4B5563; line-height: 1.6; margin-top: 4px; }
.pt-tags { display: flex; gap: 6px; margin-top: 10px; }
.pt-tag { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; }
.footer { margin-top: 72px; background: #0F172A; color: #94A3B8; padding: 36px 96px; display: flex; justify-content: space-between; font-size: 13px; }
"""

def pillar(color, tint, icon, title, desc, stats, bullets, cta):
    st = "".join(f'<div class="p-s"><div class="p-sv">{v}</div><div class="p-sl">{l}</div></div>' for v, l in stats)
    bl = "".join(f"<div>· {b}</div>" for b in bullets)
    return f"""
  <div class="pillar" style="border-top-color:{color}">
    <div class="p-ic" style="background:{tint}">{ic(icon, color, 26)}</div>
    <div class="p-t">{title}</div>
    <div class="p-d">{desc}</div>
    <div class="p-stats">{st}</div>
    <div class="p-list">{bl}</div>
    <div class="p-btn" style="background:{color}">{cta} →</div>
  </div>"""

PROS = {"households": 3420, "mw": 18.6, "sellers": 326, "goal_mw": 60}
PROS_PCT = round(PROS["mw"] / PROS["goal_mw"] * 100)
TAGS = {"d": ("แดชบอร์ด", DASH, "#E2EAF3"), "p": ("ตลาด P2P", P2P, "#DCFCE7"), "u": ("ตลาดมือสอง", USED, "#FFEDD5")}
PARTNERS = [
    ("building", "สำนักงานพลังงานจังหวัด", "วางนโยบายพลังงานของจังหวัดจากผลวิเคราะห์ของ AI", "d"),
    ("building", "อบจ. และเทศบาล", "ลงทุนโครงสร้างพื้นฐาน และเป็นผู้ซื้อไฟรายใหญ่ในพื้นที่", "dp"),
    ("uni", "มหาวิทยาลัยในพื้นที่", "ดูแลระบบ AI และตรวจรับรองอุปกรณ์มือสอง", "du"),
    ("users", "ชุมชนและวิสาหกิจชุมชน", "ผลิตไฟใช้เอง บริหารไมโครกริดและแบตเตอรี่ร่วมกัน", "p"),
    ("factory", "ภาคเอกชน", "ซื้อไฟสะอาดผ่าน Direct PPA และติดโซลาร์บนหลังคาโรงงาน", "p"),
    ("heart", "องค์กรภาคประชาสังคม (NGOs)", "สร้างความรู้ด้านพลังงาน และช่วยกลุ่มเปราะบางเข้าถึงอุปกรณ์ราคาถูก", "du"),
]

def partner(icon, name, desc, tags):
    tg = "".join(f'<span class="pt-tag" style="background:{TAGS[t][2]};color:{TAGS[t][1]}">{TAGS[t][0]}</span>' for t in tags)
    return f"""
    <div class="part"><div class="pt-ic">{ic(icon, "#2F5D8A", 22)}</div><div><div class="pt-n">{name}</div><div class="pt-d">{desc}</div><div class="pt-tags">{tg}</div></div></div>"""

def col(color, title, more, rows):
    rs = "".join(f'<div class="row"><div><div class="r-t">{t}</div><div class="r-s">{s}</div></div><div class="r-v">{v}</div></div>' for t, s, v in rows)
    return f"""
  <div class="col">
    <div class="c-h"><div class="c-t"><div class="c-dot" style="background:{color}"></div>{title}</div><div class="c-more" style="color:{color}">{more} →</div></div>
    {rs}
  </div>"""

html = f"""<!doctype html>
<html lang="th"><head><meta charset="utf-8"><title>EnergyWatch Home</title><style>{CSS}</style></head>
<body>
<div class="hero">
  <div class="nav">
    <div class="brand"><div class="brand-mark">{ic("bolt", "#FFFFFF")}</div>EnergyWatch</div>
    <div class="links"><div class="on">หน้าแรก</div><div>แดชบอร์ดพลังงาน</div><div>ตลาดไฟฟ้า P2P</div><div>ตลาดอุปกรณ์มือสอง</div></div>
    <div class="login">เข้าสู่ระบบ</div>
  </div>
  <div class="hero-body">
    <div class="tag">แพลตฟอร์มพลังงานระดับจังหวัด</div>
    <h1>ดูข้อมูลพลังงาน ซื้อขายไฟ<br>และอุปกรณ์พลังงาน <span>ในที่เดียว</span></h1>
    <div class="lead">ติดตามการใช้พลังงานของจังหวัด ขายไฟโซลาร์ส่วนเกินให้หน่วยงานในพื้นที่ และซื้อขายแผงโซลาร์หรือแบตเตอรี่มือสองที่ผ่านการตรวจรับรอง</div>
    <div class="prov"><span class="l">จังหวัดของคุณ</span><span class="v">ปทุมธานี</span><span class="chg">เปลี่ยนจังหวัด ▼</span></div>
  </div>
</div>

<div class="pillars">
{pillar(DASH, "#E2EAF3", "bars", "แดชบอร์ดพลังงาน",
        "ดูการใช้พลังงานฟอสซิลและพลังงานสะอาดย้อนหลัง พยากรณ์ 3 ปี และให้ AI ช่วยรับมือวิกฤต",
        [("4,350", "ktoe/ปี ใช้รวม"), ("11%", "พลังงานสะอาด")],
        ["ข้อมูลย้อนหลัง 10 ปี และพยากรณ์ 3 ปี", "AI แนะนำพลังงานหมุนเวียนตามพื้นที่", "AI วิเคราะห์วิกฤตน้ำท่วมและราคา LNG"],
        "เปิดแดชบอร์ด")}
{pillar(P2P, "#DCFCE7", "swap", "ตลาดไฟฟ้า P2P",
        "ประชาชนขายไฟโซลาร์ส่วนเกินให้หน่วยงานรัฐและองค์กรในพื้นที่ ได้ราคาดีกว่าขายคืนการไฟฟ้า",
        [("18,400", "kWh เสนอขายวันนี้"), ("3.20", "บาท/หน่วย เฉลี่ย")],
        ["จับคู่กับผู้ซื้อใกล้บ้านตามช่วงเวลา", "สัญญารายวัน รายเดือน หรือรายปี", "ดูประวัติการขายและรายได้"],
        "เข้าตลาดไฟฟ้า")}
{pillar(USED, "#FFEDD5", "package", "ตลาดอุปกรณ์มือสอง",
        "ซื้อขายแผงโซลาร์และแบตเตอรี่มือสองที่ผ่านการตรวจรับรองจากมหาวิทยาลัยในพื้นที่",
        [("48", "รายการขายในจังหวัด"), ("50–70%", "ถูกกว่าของใหม่")],
        ["ลงขายและค้นหาแผงหรือแบตเตอรี่", "เทียบกับราคากลางอ้างอิง", "ติดต่อผู้ขายได้โดยตรง"],
        "เข้าตลาดมือสอง")}
</div>

<div class="pros">
  <div class="pros-h">
    <div><div class="pros-t">ประชาชนผู้ผลิตไฟในปทุมธานี</div><div class="pros-s">จากผู้ซื้อไฟ สู่ผู้ผลิตและผู้ใช้ไฟเอง (Prosumer)</div></div>
    <span class="pros-tag">ร่วมรองรับความต้องการไฟฟ้า 50,900 MW ตามร่างแผน PDP2026</span>
  </div>
  <div class="pros-stats">
    <div class="pst"><div class="pst-v">{PROS['households']:,} <span class="pst-u">ครัวเรือน</span></div><div class="pst-l">เป็นผู้ผลิตไฟ (Prosumer)</div></div>
    <div class="pst"><div class="pst-v">{PROS['mw']} <span class="pst-u">MW</span></div><div class="pst-l">กำลังผลิตโซลาร์ภาคประชาชน</div></div>
    <div class="pst"><div class="pst-v">{PROS['sellers']} <span class="pst-u">ครัวเรือน</span></div><div class="pst-l">ขายไฟผ่านตลาด P2P วันนี้</div></div>
    <div class="pst"><div class="pst-v">+1.00 <span class="pst-u">บาท/หน่วย</span></div><div class="pst-l">รายได้มากกว่าขายคืนการไฟฟ้า</div></div>
  </div>
  <div class="goal-top"><span>เป้าหมายจังหวัด: โซลาร์ภาคประชาชน {PROS['goal_mw']} MW ภายในปี 2572</span><b>ทำได้แล้ว {PROS_PCT}%</b></div>
  <div class="goal-bar"><div class="goal-fill" style="width:{PROS_PCT}%"></div></div>
  <div class="goal-n">ไฟที่ประชาชนผลิตได้ ช่วยลดการพึ่งพาโรงไฟฟ้าส่วนกลาง และเพิ่มความมั่นคงทางพลังงานของจังหวัด</div>
</div>

<div class="section">
  <div class="sec-t">ภาคีในพื้นที่ (Area-Based)</div>
  <div class="sec-s">เชื่อมนโยบายรัฐลงสู่ท้องถิ่น ให้ทุกฝ่ายในจังหวัดทำงานร่วมกันบนแพลตฟอร์มเดียว</div>
  <div class="parts">{''.join(partner(*p) for p in PARTNERS)}
  </div>
</div>

<div class="section">
  <div class="sec-t">อัปเดตล่าสุดในปทุมธานี</div>
  <div class="sec-s">ความเคลื่อนไหวล่าสุดจากทั้ง 3 ส่วน</div>
  <div class="cols">
{col(DASH, "จังหวัดที่ต้องจับตา", "ดูแดชบอร์ด", [
    ("ปทุมธานี", "เสี่ยงน้ำท่วม · ราคา LNG เกินเกณฑ์", '<span class="st watch">เฝ้าระวัง</span>'),
    ("สงขลา", "น้ำท่วม 6 อำเภอ · สต็อก 2.1 วัน", '<span class="st crit">วิกฤต</span>'),
    ("ภูเก็ต", "เรือขนส่งน้ำมันล่าช้า 2 วัน", '<span class="st watch">เฝ้าระวัง</span>')])}
{col(P2P, "ผู้ซื้อที่เปิดรับซื้อไฟ", "ดูตลาดไฟฟ้า", [
    ("อบจ.ปทุมธานี", "3.2 กม. · 400 kWh/วัน", "3.20 บาท"),
    ("เทศบาลนครรังสิต", "5.8 กม. · 150 kWh/วัน", "3.25 บาท"),
    ("โรงงานแปรรูปอาหาร", "7.5 กม. · 2,000 kWh/วัน", "3.10 บาท")])}
{col(USED, "ลงขายล่าสุด", "ดูตลาดมือสอง", [
    ("แผงโซลาร์ 550W × 20 แผ่น", "เหลือ 88% · อ.คลองหลวง", "1,200 บาท/แผ่น"),
    ("แบตเตอรี่ EV (LFP) 40 kWh", "เหลือ 76% · อ.ลำลูกกา", "72,000 บาท"),
    ("แบตเตอรี่บ้าน (BESS) 10 kWh", "เหลือ 84% · อ.เมืองปทุมธานี", "30,000 บาท")])}
  </div>
</div>

<div class="footer"><div>© 2569 EnergyWatch · ข้อมูลในหน้านี้เป็นข้อมูลตัวอย่างสำหรับการออกแบบ</div><div>แหล่งข้อมูล · นโยบายความเป็นส่วนตัว · ติดต่อเรา</div></div>
</body></html>"""

bad = [c for c in set(html) if 0x2600 <= ord(c) <= 0x27BF or ord(c) >= 0x1F000 or ord(c) == 0xFE0F]
assert not bad, bad
open("energy-home.html", "w", encoding="utf-8").write(html)
print("wrote energy-home.html", len(html))
