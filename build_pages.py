"""Generates the EnergyWatch sidebar pages as self-contained HTML (for html_to_figma)."""
import sys

# ---------- icons (line icons, no emoji) ----------
P = {
    "bolt": '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    "bars": '<path d="M3 3v18h18"/><path d="M8 17v-6M13 17V7M18 17v-4"/>',
    "chip": '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    "home": '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    "map": '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    "pin": '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    "doc": '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/>',
    "gear": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    "download": '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    "alert": '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
    "check": '<path d="M5 12l5 5 9-10"/>',
    "file": '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    "bell": '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
    "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    "db": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "x": '<path d="M6 6l12 12M18 6L6 18"/>',
    "swap": '<path d="M4 7h14l-4-4M20 17H6l4 4"/>',
    "package": '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    "panel": '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M3 8h18M3 12h18M9 4v12M15 4v12M12 16v4M8 20h8"/>',
    "battery": '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M6 10v4M10 10v4"/>',
    "building": '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    "factory": '<path d="M3 21V10l6 4V10l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
    "phone": '<path d="M5 3h4l2 5-3 2a11 11 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2z"/>',
    "chat": '<path d="M4 5h16v11H8l-4 4z"/>',
    "badge": '<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.8-5.5 7-5.5s6 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14.5c2 .8 3.4 2.6 4 5.5"/>',
    "heart": '<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 019-3 4.8 4.8 0 019 3c-2 4.6-9 9-9 9z"/>',
    "uni": '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
    "meter": '<path d="M4 18a8 8 0 1116 0"/><path d="M12 18l4-6"/>',
}

def ic(name, color, size=18, sw=2):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">{P[name]}</svg>')

BLUE = "#2F5D8A"
# Three equal main sections; each has its own sub-menu.
SECTIONS = {
    "dash": ("แดชบอร์ดพลังงาน", "bars", "#4F8BC9", "เมนูแดชบอร์ด", ["รายจังหวัด", "ข้อมูลย้อนหลัง", "AI วิเคราะห์วิกฤต", "รายงาน"]),
    "p2p": ("ตลาดไฟฟ้า P2P", "swap", "#22A06B", "เมนูตลาดไฟฟ้า", ["จับคู่ผู้ซื้อ", "สัญญาของฉัน", "ประวัติและรายได้"]),
    "used": ("ตลาดอุปกรณ์มือสอง", "package", "#F08C3A", "เมนูตลาดมือสอง", ["ค้นหาสินค้า", "ลงขายสินค้า", "ราคากลาง", "ข้อความ"]),
}
ACTIVE = {  # page label -> (section, active sub item)
    "รายจังหวัด": ("dash", "รายจังหวัด"), "ข้อมูลย้อนหลัง": ("dash", "ข้อมูลย้อนหลัง"),
    "AI วิเคราะห์วิกฤต": ("dash", "AI วิเคราะห์วิกฤต"), "รายงาน": ("dash", "รายงาน"), "ตั้งค่า": ("dash", None),
    "ตลาดไฟฟ้า P2P": ("p2p", "จับคู่ผู้ซื้อ"), "ตลาดอุปกรณ์มือสอง": ("used", "ค้นหาสินค้า"),
}
SIDE_CSS = """
.nav-item.sec { font-weight: 600; color: #CBD5E1; border-left: 3px solid transparent; }
.nav-item.sec.on { background: #1E293B; color: #FFFFFF; }
.nav-item.sub { padding: 9px 12px 9px 20px; font-size: 14px; color: #94A3B8; gap: 10px; }
.nav-item.sub.on { color: #FFFFFF; font-weight: 600; }
.sub-dot { width: 6px; height: 6px; border-radius: 3px; background: #334155; display: inline-block; }
"""

def sidebar(active):
    sec, sub = ACTIVE[active]
    NAV = "#94A3B8"
    mains = []
    for key, (name, icon, accent, _, _) in SECTIONS.items():
        on = key == sec
        style = f' style="border-left-color:{accent}"' if on else ""
        mains.append(f'<div class="nav-item sec{" on" if on else ""}"{style}>{ic(icon, accent if on else NAV)} {name}</div>')
    _, _, accent, menu_label, subs = SECTIONS[sec]
    items = []
    for s in subs:
        on = s == sub
        dot = '<div class="nav-dot"></div>' if s == "AI วิเคราะห์วิกฤต" else ""
        items.append(f'<div class="nav-item sub{" on" if on else ""}"><span class="sub-dot" style="background:{accent if on else "#334155"}"></span>{s}{dot}</div>')
    set_on = active == "ตั้งค่า"
    return f"""<div class="side">
  <div class="brand"><div class="brand-mark">{ic("bolt", "#FFFFFF")}</div>EnergyWatch</div>
  <div class="nav-item">{ic("home", NAV)} หน้าแรก</div>
  <div class="nav-label" style="margin-top:20px">ส่วนหลัก</div>
  {''.join(mains)}
  <div class="nav-label" style="margin-top:24px">{menu_label}</div>
  {''.join(items)}
  <div class="nav-label" style="margin-top:24px">ระบบ</div>
  <div class="nav-item{" active" if set_on else ""}">{ic("gear", "#FFFFFF" if set_on else NAV)} ตั้งค่า</div>
</div>"""

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1440px; font-family: "Inter", "Noto Sans Thai", sans-serif; background: #F4F6F9; color: #111827; }
.app { display: flex; width: 1440px; }
.side { width: 240px; background: #0F172A; color: #CBD5E1; padding: 28px 20px; }
.brand { display: flex; align-items: center; gap: 10px; color: #FFFFFF; font-size: 20px; font-weight: 800; margin-bottom: 40px; }
.brand-mark { width: 36px; height: 36px; border-radius: 10px; background: #22A06B; display: flex; align-items: center; justify-content: center; }
.nav-label { font-size: 12px; color: #64748B; font-weight: 600; letter-spacing: 1px; margin: 0 12px 12px; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; font-size: 15px; margin-bottom: 4px; }
.nav-item.active { background: #1E293B; color: #FFFFFF; font-weight: 600; }
.nav-dot { width: 8px; height: 8px; border-radius: 4px; background: #E5484D; margin-left: auto; }
.main { width: 1200px; padding: 28px 32px 48px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.crumb { font-size: 14px; color: #6B7280; margin-bottom: 6px; }
.crumb b { color: #2563EB; font-weight: 500; }
.title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.controls { display: flex; gap: 12px; align-items: center; }
.select { display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 10px 14px; font-size: 14px; }
.select .lbl { color: #6B7280; } .select .val { font-weight: 600; } .select .caret { color: #9CA3AF; font-size: 11px; }
.btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; }
.btn.pri { background: #2F5D8A; color: #FFFFFF; }
.btn.sec { background: #FFFFFF; border: 1px solid #D1D5DB; color: #111827; }
.btn.red { background: #E5484D; color: #FFFFFF; }
.card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; }
.card-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-t { font-size: 17px; font-weight: 700; }
.card-s { font-size: 13px; color: #6B7280; margin-top: 4px; }
.pill { font-size: 12px; font-weight: 600; padding: 6px 10px; border-radius: 999px; background: #F3F4F6; color: #4B5563; }
.row { display: flex; gap: 16px; margin-bottom: 20px; }
.kpis { display: flex; gap: 16px; margin-bottom: 20px; }
.kpi { width: 272px; }
.kpi-l { font-size: 13px; color: #6B7280; margin-bottom: 10px; }
.kpi-v { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; }
.kpi-u { font-size: 14px; color: #6B7280; font-weight: 500; }
.kpi-d { font-size: 13px; margin-top: 10px; font-weight: 600; }
.up { color: #16A34A; } .down { color: #DC2626; } .warn { color: #D97706; } .muted { color: #6B7280; }
.fossil { background: #F08C3A; } .clean { background: #22A06B; }
.sw { width: 12px; height: 12px; border-radius: 3px; }
.legend { display: flex; gap: 16px; font-size: 13px; color: #4B5563; }
.lg { display: flex; align-items: center; gap: 6px; }
.bar { display: flex; height: 10px; border-radius: 5px; overflow: hidden; background: #F3F4F6; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-size: 12px; color: #6B7280; font-weight: 600; padding: 10px 12px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB; }
td { padding: 12px; border-bottom: 1px solid #F3F4F6; }
.r { text-align: right; }
.st { display: inline-block; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
.st.ok { background: #DCFCE7; color: #166534; }
.st.watch { background: #FEF3C7; color: #92400E; }
.st.crit { background: #FEE2E2; color: #B91C1C; }
.st.info { background: #E2EAF3; color: #24496E; }
.st.grey { background: #F3F4F6; color: #4B5563; }
.tabs { display: flex; gap: 4px; background: #E9EDF2; border-radius: 10px; padding: 4px; }
.tab { padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; color: #6B7280; }
.tab.on { background: #FFFFFF; color: #111827; }
.ai-ic { width: 40px; height: 40px; border-radius: 12px; background: #2F5D8A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; }
.ai-title { display: flex; align-items: center; gap: 12px; }
.field { margin-bottom: 16px; }
.field-l { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.input { display: flex; align-items: center; justify-content: space-between; border: 1px solid #D1D5DB; border-radius: 10px; padding: 11px 14px; font-size: 14px; background: #FFFFFF; }
.input .ph { color: #9CA3AF; }
.seg { display: flex; border: 1px solid #D1D5DB; border-radius: 10px; overflow: hidden; }
.seg div { flex: 1; text-align: center; padding: 10px; font-size: 14px; font-weight: 600; color: #4B5563; border-right: 1px solid #D1D5DB; }
.seg div:last-child { border-right: none; }
.seg .on { background: #2F5D8A; color: #FFFFFF; }
.switch { width: 40px; height: 22px; border-radius: 11px; background: #D1D5DB; display: flex; align-items: center; padding: 2px; }
.switch.on { background: #2F5D8A; justify-content: flex-end; }
.knob { width: 18px; height: 18px; border-radius: 9px; background: #FFFFFF; }
.foot { font-size: 12px; color: #9CA3AF; margin-top: 8px; }
"""

def page(active, crumb, title, controls, body, extra_css=""):
    return f"""<!doctype html>
<html lang="th"><head><meta charset="utf-8"><title>EnergyWatch - {active}</title>
<style>{CSS}{SIDE_CSS}{extra_css}</style></head>
<body><div class="app">
{sidebar(active)}
<div class="main">
  <div class="topbar">
    <div><div class="crumb">{crumb}</div><div class="title">{title}</div></div>
    <div class="controls">{controls}</div>
  </div>
  {body}
  <div class="foot">ข้อมูลในหน้านี้เป็นข้อมูลตัวอย่างสำหรับการออกแบบ · อัปเดตล่าสุด 30 ต.ค. 2569 10:30</div>
</div>
</div></body></html>"""

def select(lbl, val):
    return f'<div class="select"><span class="lbl">{lbl}</span><span class="val">{val}</span><span class="caret">▼</span></div>'

def fmt(n):
    return f"{n:,}"

# =====================================================================
# 2) ข้อมูลย้อนหลัง
# =====================================================================
MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
M_TOTAL = [215, 210, 225, 230, 212, 196, 190, 188, 186, 195, 198, 190]
M_CLEAN = [44, 46, 54, 57, 51, 44, 40, 39, 38, 42, 42, 43]
assert sum(M_TOTAL) == 2435 and sum(M_CLEAN) == 540

YEARS = list(range(2555, 2570))
Y_TOTAL = [2020, 2060, 2090, 2110, 2130, 2150, 2220, 2280, 2060, 2140, 2270, 2370, 2420, 2435, 2450]
Y_CLEAN = [180, 195, 210, 230, 245, 260, 290, 320, 340, 380, 420, 470, 510, 540, 570]

def history():
    scale = 220 / 240
    cols = "".join(
        f'<div class="m-col"><div class="m-tot">{t}</div><div class="m-stack">'
        f'<div class="clean" style="height:{round(c * scale)}px"></div>'
        f'<div class="fossil" style="height:{round((t - c) * scale)}px"></div></div>'
        f'<div class="m-l">{m}</div></div>'
        for m, t, c in zip(MONTHS, M_TOTAL, M_CLEAN))
    head = "".join(f'<th class="r">{y}</th>' for y in YEARS)
    def row(label, vals, cls=""):
        return f'<tr class="{cls}"><td>{label}</td>' + "".join(f'<td class="r">{fmt(v)}</td>' for v in vals) + "</tr>"
    fossil = [t - c for t, c in zip(Y_TOTAL, Y_CLEAN)]
    share = [f"{round(c / t * 100)}%" for t, c in zip(Y_TOTAL, Y_CLEAN)]
    css = """
.filters { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 20px; }
.filters .field { margin-bottom: 0; width: 200px; }
.monthly { width: 744px; }
.m-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 260px; border-bottom: 1px solid #E5E7EB; padding: 0 8px; }
.m-col { width: 52px; display: flex; flex-direction: column; align-items: center; }
.m-tot { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 4px; }
.m-stack { width: 32px; display: flex; flex-direction: column; border-radius: 6px 6px 0 0; overflow: hidden; }
.m-labels { display: flex; justify-content: space-between; padding: 8px 8px 0; }
.m-l { width: 52px; text-align: center; font-size: 12px; color: #6B7280; }
.season { display: flex; gap: 10px; margin-top: 16px; }
.season div { flex: 1; background: #F9FAFB; border-radius: 10px; padding: 12px; font-size: 12px; color: #4B5563; line-height: 1.5; }
.season b { display: block; font-size: 14px; color: #111827; margin-bottom: 2px; }
.sources { width: 376px; }
.src { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
.src-ic { width: 36px; height: 36px; border-radius: 10px; background: #E2EAF3; display: flex; align-items: center; justify-content: center; }
.src-t { font-size: 14px; font-weight: 600; }
.src-d { font-size: 12px; color: #6B7280; margin-top: 2px; }
.ytable td, .ytable th { padding: 10px 6px; font-size: 13px; }
.ytable th:first-child, .ytable td:first-child { width: 120px; }
.ytable .tot td { font-weight: 800; border-top: 2px solid #E5E7EB; }
.ytable .shr td { color: #15803D; font-weight: 600; }
.ytable .covid { background: #FFF7ED; }
"""
    body = f"""
<div class="card filters">
  <div class="field"><div class="field-l">จังหวัด</div><div class="input">เชียงใหม่<span class="caret">▼</span></div></div>
  <div class="field"><div class="field-l">ประเภทพลังงาน</div><div class="input">ทั้งหมด<span class="caret">▼</span></div></div>
  <div class="field"><div class="field-l">ช่วงปี</div><div class="input">2555 – 2569<span class="caret">▼</span></div></div>
  <div class="field" style="width:220px"><div class="field-l">ความละเอียด</div><div class="seg"><div>รายปี</div><div class="on">รายเดือน</div></div></div>
  <div class="btn pri" style="margin-left:auto">ใช้ตัวกรอง</div>
</div>

<div class="row">
  <div class="card monthly">
    <div class="card-h"><div><div class="card-t">การใช้พลังงานรายเดือน ปี 2568</div><div class="card-s">เชียงใหม่ · ktoe/เดือน · รวมทั้งปี 2,435</div></div>
      <div class="legend"><div class="lg"><div class="sw fossil"></div>ฟอสซิล</div><div class="lg"><div class="sw clean"></div>พลังงานสะอาด</div></div></div>
    <div class="m-chart">{cols}</div>
    <div class="season">
      <div><b>ใช้สูงสุด: เม.ย.</b>230 ktoe · หน้าร้อน ใช้ไฟฟ้าทำความเย็นมาก</div>
      <div><b>ใช้ต่ำสุด: ก.ย.</b>186 ktoe · ช่วงฤดูฝน การเดินทางลดลง</div>
      <div><b>สะอาดสูงสุด: เม.ย.</b>57 ktoe · แดดแรง โซลาร์ผลิตได้มาก</div>
    </div>
  </div>
  <div class="card sources">
    <div class="card-h"><div><div class="card-t">แหล่งข้อมูล</div><div class="card-s">ข้อมูลที่ใช้ในหน้านี้</div></div></div>
    <div class="src"><div class="src-ic">{ic("db", BLUE)}</div><div><div class="src-t">สถิติการใช้พลังงานรายจังหวัด</div><div class="src-d">อัปเดตรายเดือน · ล่าสุด ก.ย. 2569</div></div></div>
    <div class="src"><div class="src-ic">{ic("bolt", BLUE)}</div><div><div class="src-t">การผลิตไฟฟ้าจากพลังงานหมุนเวียน</div><div class="src-d">อัปเดตรายเดือน · ล่าสุด ก.ย. 2569</div></div></div>
    <div class="src"><div class="src-ic">{ic("bars", BLUE)}</div><div><div class="src-t">ยอดจำหน่ายน้ำมันเชื้อเพลิง</div><div class="src-d">อัปเดตรายวัน · ล่าสุด 23 ต.ค. 2569</div></div></div>
    <div class="btn sec" style="margin-top:16px">{ic("download", "#111827", 16)} ดาวน์โหลดข้อมูลดิบ (CSV)</div>
  </div>
</div>

<div class="card" style="margin-bottom:20px">
  <div class="card-h"><div><div class="card-t">ข้อมูลรายปี 2555 – 2569</div><div class="card-s">เชียงใหม่ · ktoe/ปี · แถบสีส้มคือปีที่ได้รับผลกระทบจากโควิด-19</div></div>
    <div class="controls"><div class="btn sec">{ic("download", "#111827", 16)} Excel</div><div class="btn sec">{ic("download", "#111827", 16)} CSV</div></div></div>
  <table class="ytable">
    <tr><th>ประเภท</th>{head}</tr>
    {row("ฟอสซิล", fossil)}
    {row("พลังงานสะอาด", Y_CLEAN)}
    {row("รวม", Y_TOTAL, "tot")}
    <tr class="shr"><td>สัดส่วนสะอาด</td>{''.join(f'<td class="r">{s}</td>' for s in share)}</tr>
  </table>
</div>"""
    body = body.replace('<th class="r">2563</th>', '<th class="r covid">2563</th>')
    return page("ข้อมูลย้อนหลัง", "<b>หน้าแรก</b> / ข้อมูลย้อนหลัง", "ข้อมูลพลังงานย้อนหลัง",
                select("จังหวัด", "เชียงใหม่"), body, css)

# =====================================================================
# 3) AI วิเคราะห์วิกฤต (ศูนย์รวม)
# =====================================================================
def crisis():
    css = """
.active { display: flex; gap: 16px; margin-bottom: 20px; }
.ac { width: 368px; border-radius: 16px; padding: 20px; background: #FFFFFF; border: 1px solid #E5E7EB; }
.ac.crit { border: 2px solid #E5484D; }
.ac-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.ac-n { font-size: 18px; font-weight: 800; }
.ac-s { font-size: 13px; color: #6B7280; margin-top: 2px; }
.ac-stats { display: flex; gap: 10px; margin-bottom: 14px; }
.ac-stat { flex: 1; background: #F9FAFB; border-radius: 10px; padding: 10px; }
.ac-l { font-size: 11px; color: #6B7280; }
.ac-v { font-size: 18px; font-weight: 800; margin-top: 2px; }
.ac-foot { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6B7280; }
.ac-link { font-weight: 700; color: #2F5D8A; font-size: 13px; }
.sim { width: 440px; }
.result { width: 680px; }
.res-text { font-size: 15px; line-height: 1.7; color: #1F2937; margin-bottom: 18px; }
.res-text b { color: #24496E; }
.res-kpis { display: flex; gap: 12px; margin-bottom: 18px; }
.rk { flex: 1; border-radius: 12px; padding: 14px; background: #F9FAFB; }
.rk-l { font-size: 12px; color: #6B7280; }
.rk-v { font-size: 22px; font-weight: 800; margin-top: 4px; }
.rec { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
.rec-n { width: 24px; height: 24px; border-radius: 12px; background: #E2EAF3; color: #24496E; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.rec-t { font-size: 14px; font-weight: 600; }
.rec-d { font-size: 12px; color: #6B7280; margin-top: 2px; }
.res-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
.disc { font-size: 12px; color: #6B7280; width: 360px; }
.slider { position: relative; height: 6px; border-radius: 3px; background: #E5E7EB; margin: 14px 0 8px; }
.slider-fill { width: 33%; height: 6px; border-radius: 3px; background: #2F5D8A; }
.slider-knob { position: absolute; left: 31%; top: -6px; width: 18px; height: 18px; border-radius: 9px; background: #FFFFFF; border: 3px solid #2F5D8A; }
.slider-marks { display: flex; justify-content: space-between; font-size: 12px; color: #6B7280; }
"""
    hist = [
        ("24 ต.ค. 2569 09:15", "สงขลา", "น้ำท่วม · สูง", "+42% · ขาด 1.1 ล้านลิตร/วัน", ("info", "กำลังดำเนินการ")),
        ("24 ต.ค. 2569 08:40", "เชียงใหม่", "น้ำท่วม · กลาง", "+35% · ขาด 1.5 ล้านลิตร/วัน", ("watch", "รออนุมัติ")),
        ("22 ต.ค. 2569 16:05", "ภูเก็ต", "ขนส่งล่าช้า · กลาง", "+12% · สต็อกพอ 5.2 วัน", ("watch", "รออนุมัติ")),
        ("02 ก.ย. 2569 11:20", "อุบลราชธานี", "น้ำท่วม · สูง", "+38% · ขาด 0.9 ล้านลิตร/วัน", ("grey", "ปิดแล้ว")),
        ("14 มี.ค. 2569 13:45", "เชียงราย", "ไฟป่า/หมอกควัน · กลาง", "+8% · สต็อกพอ 6.8 วัน", ("grey", "ปิดแล้ว")),
    ]
    hrows = "".join(f'<tr><td class="muted">{d}</td><td><b>{p}</b></td><td>{s}</td><td>{r}</td>'
                    f'<td><span class="st {st[0]}">{st[1]}</span></td><td class="r" style="color:#2F5D8A;font-weight:700">เปิด</td></tr>'
                    for d, p, s, r, st in hist)
    body = f"""
<div class="card-t" style="margin-bottom:12px">สถานการณ์ที่กำลังเกิดขึ้น</div>
<div class="active">
  <div class="ac crit">
    <div class="ac-top"><div><div class="ac-n">สงขลา</div><div class="ac-s">น้ำท่วม 6 อำเภอ · วันที่ 3</div></div><span class="st crit">วิกฤต</span></div>
    <div class="ac-stats"><div class="ac-stat"><div class="ac-l">สต็อกพอใช้</div><div class="ac-v" style="color:#B91C1C">2.1 วัน</div></div><div class="ac-stat"><div class="ac-l">ความต้องการ</div><div class="ac-v">+42%</div></div></div>
    <div class="ac-foot"><span>แผนดำเนินการแล้ว 3/6 ขั้น</span><span class="ac-link">ดูแผน →</span></div>
  </div>
  <div class="ac">
    <div class="ac-top"><div><div class="ac-n">เชียงใหม่</div><div class="ac-s">เสี่ยงน้ำท่วม · ฝนตกหนัก 3 วัน</div></div><span class="st watch">เฝ้าระวัง</span></div>
    <div class="ac-stats"><div class="ac-stat"><div class="ac-l">สต็อกพอใช้</div><div class="ac-v">4.5 วัน</div></div><div class="ac-stat"><div class="ac-l">ถ้าเกิดวิกฤต</div><div class="ac-v">+35%</div></div></div>
    <div class="ac-foot"><span>แผนรออนุมัติ</span><span class="ac-link">ดูแผน →</span></div>
  </div>
  <div class="ac">
    <div class="ac-top"><div><div class="ac-n">ภูเก็ต</div><div class="ac-s">เรือขนส่งน้ำมันล่าช้า 2 วัน</div></div><span class="st watch">เฝ้าระวัง</span></div>
    <div class="ac-stats"><div class="ac-stat"><div class="ac-l">สต็อกพอใช้</div><div class="ac-v">5.2 วัน</div></div><div class="ac-stat"><div class="ac-l">ถ้าล่าช้าต่อ</div><div class="ac-v">+12%</div></div></div>
    <div class="ac-foot"><span>แผนรออนุมัติ</span><span class="ac-link">ดูแผน →</span></div>
  </div>
</div>

<div class="row">
  <div class="card sim">
    <div class="card-h"><div class="ai-title"><div class="ai-ic">AI</div><div><div class="card-t">จำลองสถานการณ์ใหม่</div><div class="card-s">กรอกข้อมูลแล้วให้ AI วิเคราะห์</div></div></div></div>
    <div class="field"><div class="field-l">จังหวัด</div><div class="input">สงขลา<span class="caret">▼</span></div></div>
    <div class="field"><div class="field-l">ประเภทวิกฤต</div><div class="input">น้ำท่วม<span class="caret">▼</span></div></div>
    <div class="field"><div class="field-l">ความรุนแรง</div><div class="seg"><div>ต่ำ</div><div>กลาง</div><div class="on">สูง</div></div></div>
    <div class="field"><div class="field-l">ระยะเวลาที่คาดว่าจะเกิด: 7 วัน</div>
      <div class="slider"><div class="slider-fill"></div><div class="slider-knob"></div></div>
      <div class="slider-marks"><span>1 วัน</span><span>7 วัน</span><span>14 วัน</span><span>21 วัน</span></div></div>
    <div class="field"><div class="field-l">ข้อมูลเพิ่มเติม (ไม่บังคับ)</div><div class="input" style="height:72px;align-items:flex-start"><span class="ph">เช่น ถนนสาย 43 ถูกตัดขาด</span></div></div>
    <div class="btn pri">ให้ AI วิเคราะห์</div>
  </div>

  <div class="card result">
    <div class="card-h"><div class="ai-title"><div class="ai-ic">AI</div><div><div class="card-t">ผลการวิเคราะห์ล่าสุด: สงขลา</div><div class="card-s">น้ำท่วม · ความรุนแรงสูง · 7 วัน · วิเคราะห์เมื่อ 09:15</div></div></div><span class="pill">ความมั่นใจ 82%</span></div>
    <div class="res-text">AI ประเมินว่าความต้องการน้ำมันจะ<b>เพิ่มขึ้น 42%</b> จากเครื่องสูบน้ำ เครื่องปั่นไฟ และเรือกู้ภัย ขณะที่ถนนเพชรเกษมบางช่วงถูกน้ำท่วม สต็อกปัจจุบัน<b>พอใช้ 2.1 วัน</b> จึงควรขนส่งทางรถไฟจากสุราษฎร์ธานีและใช้คลังน้ำมันริมทะเลเป็นหลัก</div>
    <div class="res-kpis">
      <div class="rk"><div class="rk-l">ความต้องการช่วงวิกฤต</div><div class="rk-v">3.7 <span class="kpi-u">ล้านลิตร/วัน</span></div></div>
      <div class="rk"><div class="rk-l">ต้องจัดหาเพิ่ม</div><div class="rk-v" style="color:#C2410C">+1.1 <span class="kpi-u">ล้านลิตร/วัน</span></div></div>
      <div class="rk"><div class="rk-l">หาได้ตามแผน</div><div class="rk-v" style="color:#15803D">1.3 <span class="kpi-u">ล้านลิตร/วัน</span></div></div>
    </div>
    <div class="rec"><div class="rec-n">1</div><div><div class="rec-t">ปล่อยน้ำมันสำรองคลังจังหวัดทันที</div><div class="rec-d">0.5 ล้านลิตร/วัน · ภายใน 6 ชม.</div></div></div>
    <div class="rec"><div class="rec-n">2</div><div><div class="rec-t">ขนส่งทางรถไฟจากคลังสุราษฎร์ธานี</div><div class="rec-d">0.5 ล้านลิตร/วัน · ภายใน 18 ชม.</div></div></div>
    <div class="rec"><div class="rec-n">3</div><div><div class="rec-t">ส่งทางเรือเข้าท่าเรือสงขลา</div><div class="rec-d">0.3 ล้านลิตร/วัน · ภายใน 36 ชม.</div></div></div>
    <div class="res-foot"><div class="disc">AI ช่วยเสนอแผนเท่านั้น ผู้มีอำนาจต้องตรวจสอบก่อนอนุมัติทุกครั้ง</div><div class="controls"><div class="btn sec">ส่งออก PDF</div><div class="btn pri">เปิดแผนฉบับเต็ม</div></div></div>
  </div>
</div>

<div class="card" style="margin-bottom:20px">
  <div class="card-h"><div><div class="card-t">ประวัติการวิเคราะห์</div><div class="card-s">การวิเคราะห์ทั้งหมดที่ผ่านมา</div></div><div class="tabs"><div class="tab on">ทั้งหมด</div><div class="tab">กำลังดำเนินการ</div><div class="tab">รออนุมัติ</div><div class="tab">ปิดแล้ว</div></div></div>
  <table>
    <tr><th>วันที่</th><th>จังหวัด</th><th>สถานการณ์</th><th>ผลที่ AI ประเมิน</th><th>สถานะ</th><th></th></tr>
    {hrows}
  </table>
</div>"""
    return page("AI วิเคราะห์วิกฤต", "<b>หน้าแรก</b> / AI วิเคราะห์วิกฤต", "ศูนย์วิเคราะห์วิกฤตพลังงาน",
                f'<div class="btn pri">{ic("plus", "#FFFFFF", 16)} วิเคราะห์ใหม่</div>', body, css)

# =====================================================================
# 4) รายงาน
# =====================================================================
def reports():
    css = """
.tpls { display: flex; gap: 16px; margin-bottom: 20px; }
.tpl { width: 368px; }
.tpl-ic { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.tpl-t { font-size: 16px; font-weight: 700; margin-bottom: 6px; }
.tpl-d { font-size: 13px; color: #6B7280; line-height: 1.6; margin-bottom: 16px; }
.tpl-f { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6B7280; }
.tpl-btn { font-size: 13px; font-weight: 700; color: #2F5D8A; }
.list { width: 744px; }
.fname { display: flex; align-items: center; gap: 10px; }
.ftype { font-size: 11px; font-weight: 800; padding: 3px 6px; border-radius: 4px; }
.ftype.pdf { background: #FEE2E2; color: #B91C1C; }
.ftype.xls { background: #DCFCE7; color: #166534; }
.dl { display: flex; justify-content: flex-end; }
.sched { width: 376px; }
.sc { padding: 14px 0; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
.sc-t { font-size: 14px; font-weight: 600; }
.sc-d { font-size: 12px; color: #6B7280; margin-top: 3px; display: flex; align-items: center; gap: 6px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.search { display: flex; align-items: center; gap: 10px; width: 280px; border: 1px solid #D1D5DB; border-radius: 10px; padding: 9px 12px; font-size: 14px; color: #9CA3AF; }
"""
    reps = [
        ("รายงานพลังงานประจำเดือน ก.ย. 2569", "เชียงใหม่", "ประจำเดือน", "1 ต.ค. 2569", "pdf", "1.2 MB"),
        ("สรุปวิกฤตน้ำท่วม สงขลา", "สงขลา", "สรุปวิกฤต", "24 ต.ค. 2569", "pdf", "860 KB"),
        ("เปรียบเทียบภาคเหนือ Q3/2569", "ภาคเหนือ", "เปรียบเทียบ", "15 ต.ค. 2569", "pdf", "2.4 MB"),
        ("ข้อมูลการใช้พลังงานรายเดือน 2568", "เชียงใหม่", "ข้อมูลดิบ", "10 ต.ค. 2569", "xls", "340 KB"),
        ("รายงานพลังงานประจำเดือน ส.ค. 2569", "เชียงใหม่", "ประจำเดือน", "1 ก.ย. 2569", "pdf", "1.1 MB"),
        ("สรุปวิกฤตน้ำท่วม อุบลราชธานี", "อุบลราชธานี", "สรุปวิกฤต", "9 ก.ย. 2569", "pdf", "910 KB"),
    ]
    rows = "".join(
        f'<tr><td><div class="fname"><span class="ftype {f}">{"PDF" if f == "pdf" else "XLSX"}</span><b>{n}</b></div></td>'
        f'<td>{p}</td><td><span class="st info">{t}</span></td><td class="muted">{d}</td><td class="muted">{s}</td>'
        f'<td><div class="dl">{ic("download", BLUE, 18)}</div></td></tr>'
        for n, p, t, d, f, s in reps)
    body = f"""
<div class="card-t" style="margin-bottom:12px">สร้างรายงานใหม่จากแม่แบบ</div>
<div class="tpls">
  <div class="card tpl"><div class="tpl-ic" style="background:#E2EAF3">{ic("calendar", BLUE, 22)}</div><div class="tpl-t">รายงานประจำเดือน</div><div class="tpl-d">สรุปการใช้พลังงานของจังหวัดรายเดือน เทียบกับเดือนและปีก่อน</div><div class="tpl-f"><span>PDF · 6 หน้า</span><span class="tpl-btn">ใช้แม่แบบนี้ →</span></div></div>
  <div class="card tpl"><div class="tpl-ic" style="background:#FEE2E2">{ic("alert", "#B91C1C", 22)}</div><div class="tpl-t">สรุปวิกฤต</div><div class="tpl-d">สรุปผลการวิเคราะห์ของ AI แผนที่อนุมัติ และผลการดำเนินงานจริง</div><div class="tpl-f"><span>PDF · 4 หน้า</span><span class="tpl-btn">ใช้แม่แบบนี้ →</span></div></div>
  <div class="card tpl"><div class="tpl-ic" style="background:#DCFCE7">{ic("bars", "#15803D", 22)}</div><div class="tpl-t">เปรียบเทียบภูมิภาค</div><div class="tpl-d">เทียบสัดส่วนพลังงานสะอาดและความเสี่ยงของจังหวัดในภาคเดียวกัน</div><div class="tpl-f"><span>PDF · 8 หน้า</span><span class="tpl-btn">ใช้แม่แบบนี้ →</span></div></div>
</div>

<div class="row">
  <div class="card list">
    <div class="toolbar"><div class="card-t">รายงานทั้งหมด</div><div class="search">{ic("search", "#9CA3AF", 16)} ค้นหารายงาน...</div></div>
    <table>
      <tr><th>ชื่อรายงาน</th><th>พื้นที่</th><th>ประเภท</th><th>สร้างเมื่อ</th><th>ขนาด</th><th></th></tr>
      {rows}
    </table>
  </div>
  <div class="card sched">
    <div class="card-h"><div><div class="card-t">ส่งรายงานอัตโนมัติ</div><div class="card-s">ส่งทางอีเมลตามเวลาที่ตั้งไว้</div></div></div>
    <div class="sc"><div><div class="sc-t">ประจำเดือน เชียงใหม่</div><div class="sc-d">{ic("clock", "#6B7280", 14)} วันที่ 1 ของทุกเดือน 08:00</div></div><div class="switch on"><div class="knob"></div></div></div>
    <div class="sc"><div><div class="sc-t">สรุปจังหวัดที่ต้องจับตา</div><div class="sc-d">{ic("clock", "#6B7280", 14)} ทุกวันจันทร์ 07:30</div></div><div class="switch on"><div class="knob"></div></div></div>
    <div class="sc"><div><div class="sc-t">เปรียบเทียบภาคเหนือ</div><div class="sc-d">{ic("clock", "#6B7280", 14)} ทุกไตรมาส</div></div><div class="switch"><div class="knob"></div></div></div>
    <div class="btn sec" style="margin-top:16px">{ic("plus", "#111827", 16)} เพิ่มการส่งอัตโนมัติ</div>
  </div>
</div>"""
    return page("รายงาน", "<b>หน้าแรก</b> / รายงาน", "รายงาน",
                f'<div class="btn pri">{ic("plus", "#FFFFFF", 16)} สร้างรายงาน</div>', body, css)

# =====================================================================
# 5) ตั้งค่า
# =====================================================================
def settings():
    css = """
.set { display: flex; gap: 20px; align-items: flex-start; }
.set-nav { width: 240px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; padding: 12px; }
.sn { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 10px; font-size: 14px; color: #4B5563; }
.sn.on { background: #E2EAF3; color: #24496E; font-weight: 700; }
.set-body { width: 876px; }
.sec { margin-bottom: 20px; }
.two { display: flex; gap: 16px; }
.two .field { width: 402px; }
.avatar { width: 64px; height: 64px; border-radius: 32px; background: #2F5D8A; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; }
.prof { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: #F3F4F6; font-size: 14px; font-weight: 600; }
.chip.add { background: #FFFFFF; border: 1px dashed #9CA3AF; color: #4B5563; }
.opt { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #F3F4F6; }
.opt:last-child { border-bottom: none; }
.opt-t { font-size: 14px; font-weight: 600; }
.opt-d { font-size: 12px; color: #6B7280; margin-top: 3px; }
.lock { font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 6px; }
.th { display: flex; gap: 16px; }
.th .field { width: 264px; }
.unit { color: #6B7280; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
"""
    def opt(t, d, on=True, extra=""):
        sw = f'<div class="switch{" on" if on else ""}"><div class="knob"></div></div>'
        return f'<div class="opt"><div><div class="opt-t">{t}</div><div class="opt-d">{d}</div></div>{extra or sw}</div>'
    provs = "".join(f'<div class="chip">{p} {ic("x", "#6B7280", 14)}</div>' for p in ["เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "สงขลา"])
    body = f"""
<div class="set">
  <div class="set-nav">
    <div class="sn on">{ic("user", "#24496E", 18)} บัญชีผู้ใช้</div>
    <div class="sn">{ic("pin", "#6B7280", 18)} จังหวัดที่ติดตาม</div>
    <div class="sn">{ic("bell", "#6B7280", 18)} การแจ้งเตือน</div>
    <div class="sn">{ic("alert", "#6B7280", 18)} เกณฑ์วิกฤต</div>
    <div class="sn">{ic("chip", "#6B7280", 18)} การตั้งค่า AI</div>
    <div class="sn">{ic("db", "#6B7280", 18)} ข้อมูลและการส่งออก</div>
    <div class="sn">{ic("shield", "#6B7280", 18)} ความปลอดภัย</div>
  </div>
  <div class="set-body">
    <div class="card sec">
      <div class="card-h"><div><div class="card-t">บัญชีผู้ใช้</div><div class="card-s">ข้อมูลส่วนตัวและบทบาท</div></div></div>
      <div class="prof"><div class="avatar">สช</div><div><div class="card-t">สมชาย ใจดี</div><div class="card-s">เจ้าหน้าที่พลังงานจังหวัด · สิทธิ์อนุมัติแผน</div></div><div class="btn sec" style="margin-left:auto">เปลี่ยนรูป</div></div>
      <div class="two"><div class="field"><div class="field-l">ชื่อ-นามสกุล</div><div class="input">สมชาย ใจดี</div></div><div class="field"><div class="field-l">อีเมล</div><div class="input">somchai@example.com</div></div></div>
      <div class="two"><div class="field"><div class="field-l">หน่วยงาน</div><div class="input">สำนักงานพลังงานจังหวัดเชียงใหม่</div></div><div class="field"><div class="field-l">บทบาท</div><div class="input">ผู้อนุมัติแผน<span class="caret">▼</span></div></div></div>
    </div>

    <div class="card sec">
      <div class="card-h"><div><div class="card-t">จังหวัดที่ติดตาม</div><div class="card-s">แสดงในหน้าแรกและส่งการแจ้งเตือนเมื่อมีวิกฤต</div></div></div>
      <div class="chips">{provs}<div class="chip add">{ic("plus", "#4B5563", 14)} เพิ่มจังหวัด</div></div>
    </div>

    <div class="card sec">
      <div class="card-h"><div><div class="card-t">การแจ้งเตือน</div><div class="card-s">เลือกช่องทางที่ต้องการรับแจ้งเตือน</div></div></div>
      {opt("อีเมล", "สรุปรายวันและแจ้งเตือนวิกฤตทันที")}
      {opt("SMS", "เฉพาะเมื่อจังหวัดที่ติดตามเข้าสู่ภาวะวิกฤต")}
      {opt("แจ้งเตือนในเว็บ", "แสดงจุดแดงที่เมนูเมื่อมีเรื่องใหม่")}
      {opt("สรุปประจำสัปดาห์", "ส่งทุกวันจันทร์ 07:30", on=False)}
    </div>

    <div class="card sec">
      <div class="card-h"><div><div class="card-t">เกณฑ์วิกฤต</div><div class="card-s">ระบบจะเปลี่ยนสถานะจังหวัดเมื่อถึงเกณฑ์เหล่านี้</div></div></div>
      <div class="th">
        <div class="field"><div class="field-l">สต็อกน้ำมันต่ำกว่า</div><div class="input">7<span class="unit">วัน</span></div></div>
        <div class="field"><div class="field-l">ความต้องการเพิ่มเกิน</div><div class="input">20<span class="unit">%</span></div></div>
        <div class="field"><div class="field-l">เตือนล่วงหน้า</div><div class="input">48<span class="unit">ชั่วโมง</span></div></div>
      </div>
    </div>

    <div class="card sec">
      <div class="card-h"><div class="ai-title"><div class="ai-ic">AI</div><div><div class="card-t">การตั้งค่า AI</div><div class="card-s">กำหนดวิธีที่ AI ช่วยวิเคราะห์</div></div></div></div>
      {opt("สรุปแนวโน้มอัตโนมัติทุกเช้า", "AI สรุปการเปลี่ยนแปลงของจังหวัดที่ติดตามเวลา 07:00")}
      {opt("วิเคราะห์ทันทีเมื่อมีเหตุวิกฤต", "AI เริ่มประเมินความต้องการน้ำมันเมื่อสถานะเปลี่ยนเป็นวิกฤต")}
      {opt("ต้องมีผู้อนุมัติก่อนใช้แผนของ AI", "ป้องกันไม่ให้แผนถูกนำไปใช้โดยไม่ผ่านการตรวจสอบ", extra=f'<div class="lock">{ic("shield", "#6B7280", 14)} เปิดตลอด</div>')}
      <div class="field" style="margin-top:16px;width:402px"><div class="field-l">ระดับรายละเอียดของคำอธิบาย</div><div class="seg"><div>สั้น</div><div class="on">ปานกลาง</div><div>ละเอียด</div></div></div>
    </div>

    <div class="actions"><div class="btn sec">ยกเลิก</div><div class="btn pri">บันทึกการเปลี่ยนแปลง</div></div>
  </div>
</div>
<div style="height:20px"></div>"""
    return page("ตั้งค่า", "<b>หน้าแรก</b> / ตั้งค่า", "ตั้งค่า", "", body, css)

# =====================================================================
# 6) ตลาดไฟฟ้า P2P (ไม่มี AI)
# =====================================================================
INCOME_MONTHS = ["พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค."]
INCOME_KWH = [350, 270, 245, 255, 240, 295]
P2P_PRICE, BUYBACK, GRID_PRICE, WHEELING = 3.20, 2.20, 4.18, 0.30

# Community microgrid (no AI on market pages): 2-way flow, smart-meter readings, battery, expected surplus.
MG = {"houses": 148, "online": 146, "gen": 0.62, "use": 0.44, "charge": 0.18, "batt_pct": 72, "batt_cap": 1.2}
MG_SURPLUS = [0.02, 0.06, 0.14, 0.24, 0.33, 0.41, 0.45, 0.42, 0.35, 0.25, 0.13, 0.05, 0.0]  # MW, 06:00-18:00
assert abs(MG["gen"] - MG["use"] - MG["charge"]) < 1e-9
MG_CSS = """
.mg { margin-bottom: 20px; }
.live { display: flex; align-items: center; gap: 6px; background: #DCFCE7; color: #166534; }
.live-dot { width: 8px; height: 8px; border-radius: 4px; background: #22A06B; }
.mg-row { display: flex; gap: 24px; }
.mg-flow { width: 500px; height: 236px; position: relative; background: #F8FAFC; border-radius: 14px; }
.nd { position: absolute; width: 132px; border-radius: 12px; padding: 10px 12px; background: #FFFFFF; border: 1px solid #E5E7EB; }
.nd.grid { border: 2px solid #22A06B; }
.nd-t { font-size: 13px; font-weight: 700; }
.nd-s { font-size: 11px; color: #6B7280; margin-top: 2px; }
.nd-v { font-size: 14px; font-weight: 800; margin-top: 6px; }
.fl-l { position: absolute; font-size: 11px; font-weight: 700; }
.mg-stats { width: 260px; display: flex; flex-wrap: wrap; gap: 10px; align-content: flex-start; }
.ms { width: 120px; background: #F9FAFB; border-radius: 12px; padding: 12px; }
.ms-l { font-size: 11px; color: #6B7280; }
.ms-v { font-size: 18px; font-weight: 800; margin-top: 4px; }
.ms-u { font-size: 11px; color: #6B7280; font-weight: 500; }
.mg-side { width: 280px; }
.bt-top { display: flex; justify-content: space-between; align-items: baseline; }
.bt-v { font-size: 26px; font-weight: 800; color: #15803D; }
.bt-bar { height: 12px; border-radius: 6px; background: #E5E7EB; overflow: hidden; margin: 8px 0 4px; }
.bt-fill { height: 12px; background: #22A06B; border-radius: 6px; }
.fc-t { font-size: 12px; font-weight: 700; margin: 16px 0 8px; }
.fc-bars { display: flex; align-items: flex-end; gap: 4px; height: 64px; border-bottom: 1px solid #E5E7EB; }
.fc-b { width: 18px; background: #86EFAC; border-radius: 3px 3px 0 0; }
.fc-x { display: flex; justify-content: space-between; font-size: 11px; color: #6B7280; margin-top: 4px; }
"""

def microgrid():
    m = MG
    stored = round(m["batt_cap"] * m["batt_pct"] / 100, 2)
    arrow = ('<svg width="500" height="236" viewBox="0 0 500 236" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0">'
             '<path d="M148 96h26" stroke="#22A06B" stroke-width="2.5"/><path d="M172 91l8 5-8 5z" fill="#22A06B"/>'
             '<path d="M180 126h-26" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 3"/><path d="M156 121l-8 5 8 5z" fill="#94A3B8"/>'
             '<path d="M320 96h26" stroke="#22A06B" stroke-width="2.5"/><path d="M344 91l8 5-8 5z" fill="#22A06B"/>'
             '<path d="M236 146v26" stroke="#22A06B" stroke-width="2.5"/><path d="M231 170l5 8 5-8z" fill="#22A06B"/>'
             '<path d="M264 178v-26" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 3"/><path d="M259 154l5-8 5 8z" fill="#94A3B8"/>'
             '</svg>')
    bars = "".join(f'<div class="fc-b" style="height:{max(2, round(v / max(MG_SURPLUS) * 60))}px"></div>' for v in MG_SURPLUS)
    return f"""
<div class="card mg">
  <div class="card-h"><div><div class="card-t">ไมโครกริดชุมชน ต.คลองหก</div><div class="card-s">ไฟไหลได้ 2 ทิศทาง · ข้อมูลจาก Smart Meter และอุปกรณ์ IoT แบบเรียลไทม์</div></div>
    <span class="pill live"><span class="live-dot"></span>ออนไลน์ · อัปเดต 13:45</span></div>
  <div class="mg-row">
    <div class="mg-flow">
      {arrow}
      <div class="nd" style="left:12px;top:60px"><div class="nd-t">บ้านโซลาร์</div><div class="nd-s">{m['houses']} ครัวเรือน</div><div class="nd-v" style="color:#15803D">ผลิต {m['gen']} MW</div></div>
      <div class="nd grid" style="left:184px;top:60px"><div class="nd-t">กริดชุมชน</div><div class="nd-s">Microgrid</div><div class="nd-v">สมดุล</div></div>
      <div class="nd" style="left:356px;top:60px"><div class="nd-t">ผู้ซื้อในพื้นที่</div><div class="nd-s">อบจ. เทศบาล โรงงาน</div><div class="nd-v">รับ {m['use']} MW</div></div>
      <div class="nd" style="left:184px;top:184px;padding:8px 12px"><div class="nd-t">แบตเตอรี่ชุมชน {m['batt_pct']}%</div></div>
      <div class="fl-l" style="left:150px;top:76px;color:#15803D">ขาย</div>
      <div class="fl-l" style="left:146px;top:132px;color:#64748B;font-size:10px">กลางคืน</div>
      <div class="fl-l" style="left:322px;top:76px;color:#15803D">{m['use']}</div>
      <div class="fl-l" style="left:200px;top:154px;color:#15803D">ชาร์จ</div>
      <div class="fl-l" style="left:272px;top:154px;color:#64748B">จ่ายกลับ</div>
      <div class="fl-l" style="left:12px;top:16px;color:#4B5563;font-weight:600">กลางวัน: บ้าน → กริด → ผู้ซื้อ / แบตเตอรี่ · กลางคืน: แบตเตอรี่ → บ้าน</div>
    </div>
    <div class="mg-stats">
      <div class="ms"><div class="ms-l">ผลิตตอนนี้</div><div class="ms-v">{m['gen']} <span class="ms-u">MW</span></div></div>
      <div class="ms"><div class="ms-l">ใช้ในชุมชน</div><div class="ms-v">{m['use']} <span class="ms-u">MW</span></div></div>
      <div class="ms"><div class="ms-l">ชาร์จแบตเตอรี่</div><div class="ms-v">{m['charge']} <span class="ms-u">MW</span></div></div>
      <div class="ms"><div class="ms-l">มิเตอร์ออนไลน์</div><div class="ms-v">{m['online']}<span class="ms-u">/{m['houses']}</span></div></div>
    </div>
    <div class="mg-side">
      <div class="bt-top"><div class="ms-l">แบตเตอรี่สำรองชุมชน</div><div class="bt-v">{m['batt_pct']}%</div></div>
      <div class="bt-bar"><div class="bt-fill" style="width:{m['batt_pct']}%"></div></div>
      <div class="ms-l">{stored} / {m['batt_cap']} MWh · สำรองไฟให้จุดสำคัญได้ช่วงไฟดับ</div>
      <div class="fc-t">ไฟส่วนเกินที่คาดว่าจะขายได้วันนี้ (MW)</div>
      <div class="fc-bars">{bars}</div>
      <div class="fc-x"><span>06:00</span><span>12:00</span><span>18:00</span></div>
    </div>
  </div>
</div>
"""

def p2p():
    income = [round(k * P2P_PRICE) for k in INCOME_KWH]
    tot_kwh, tot_inc = sum(INCOME_KWH), sum(income)
    extra = round(tot_kwh * (P2P_PRICE - BUYBACK))
    scale = 140 / max(income)
    inc_cols = "".join(
        f'<div class="ic-col"><div class="ic-v">{fmt(v)}</div><div class="ic-bar" style="height:{round(v * scale)}px"></div></div>'
        for v in income)
    inc_labels = "".join(f'<div class="ic-m">{m}</div>' for m in INCOME_MONTHS)
    buyers = [  # icon, name, type, km, window, need kWh/day, price, overlap %
        ("building", "อบจ.ปทุมธานี (อาคารสำนักงาน)", "หน่วยงานรัฐ", 3.2, "09:00–16:00", 400, 3.20, 100),
        ("building", "เทศบาลนครรังสิต (ศูนย์บริการสาธารณสุข)", "หน่วยงานรัฐ", 5.8, "08:00–17:00", 150, 3.25, 100),
        ("factory", "โรงงานแปรรูปอาหาร ต.คลองหนึ่ง", "องค์กรเอกชน", 7.5, "06:00–14:00", 2000, 3.10, 80),
        ("factory", "ห้างค้าปลีกชุมชน อ.ลำลูกกา", "องค์กรเอกชน", 9.1, "12:00–21:00", 300, 3.30, 60),
    ]
    brows = "".join(
        f'<div class="buyer"><div class="b-ic">{ic(i, BLUE, 20)}</div>'
        f'<div class="b-info"><div class="b-n">{n}</div><div class="b-d"><span class="st {"info" if t == "หน่วยงานรัฐ" else "grey"}">{t}</span>'
        f'<span>{km} กม.</span><span>ต้องการไฟ {w}</span><span>{fmt(need)} kWh/วัน</span></div></div>'
        f'<div class="b-right"><div class="b-p">{p:.2f} <span>บาท/หน่วย</span></div>'
        f'<div class="b-ov"><div class="bar" style="width:90px"><div style="width:{o}%;background:{"#22A06B" if o == 100 else "#D97706"}"></div></div><span>เวลาตรงกัน {o}%</span></div>'
        f'<div class="btn {"pri" if o == 100 else "sec"} sm">เสนอขาย</div></div></div>'
        for i, n, t, km, w, need, p, o in buyers)
    tx = [
        ("28 ต.ค. 2569", "อบจ.ปทุมธานี", "รายเดือน", 11.5, ("watch", "รอชำระ")),
        ("27 ต.ค. 2569", "อบจ.ปทุมธานี", "รายเดือน", 12.0, ("ok", "ชำระแล้ว")),
        ("26 ต.ค. 2569", "เทศบาลนครรังสิต", "รายวัน", 9.5, ("ok", "ชำระแล้ว")),
        ("25 ต.ค. 2569", "อบจ.ปทุมธานี", "รายเดือน", 10.0, ("ok", "ชำระแล้ว")),
        ("24 ต.ค. 2569", "อบจ.ปทุมธานี", "รายเดือน", 8.0, ("ok", "ชำระแล้ว")),
    ]
    txrows = "".join(
        f'<tr><td class="muted">{d}</td><td><b>{b}</b></td><td>{c}</td><td class="r">{k:.1f}</td>'
        f'<td class="r">{P2P_PRICE:.2f}</td><td class="r"><b>{k * P2P_PRICE:,.2f}</b></td><td><span class="st {s[0]}">{s[1]}</span></td></tr>'
        for d, b, c, k, s in tx)
    def pbar(label, v, color, note=""):
        return (f'<div class="pc"><div class="pc-top"><span>{label}</span><b>{v:.2f} บาท</b></div>'
                f'<div class="bar" style="height:12px"><div style="width:{round(v / GRID_PRICE * 100)}%;background:{color}"></div></div>'
                f'{f"<div class=pc-n>{note}</div>" if note else ""}</div>')
    css = """
.match { width: 744px; }
.offer { display: flex; gap: 12px; background: #F1F5F9; border-radius: 12px; padding: 14px; margin-bottom: 8px; }
.of { flex: 1; }
.of-l { font-size: 12px; color: #6B7280; }
.of-v { font-size: 16px; font-weight: 800; margin-top: 3px; }
.buyer { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid #F3F4F6; }
.b-ic { width: 40px; height: 40px; border-radius: 10px; background: #E2EAF3; display: flex; align-items: center; justify-content: center; }
.b-info { width: 420px; }
.b-n { font-size: 15px; font-weight: 700; }
.b-d { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 12px; color: #6B7280; margin-top: 5px; }
.b-right { width: 200px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.b-p { font-size: 18px; font-weight: 800; }
.b-p span { font-size: 12px; color: #6B7280; font-weight: 500; }
.b-ov { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #4B5563; }
.btn.sm { padding: 7px 14px; font-size: 13px; }
.pricing { width: 376px; }
.pc { margin-bottom: 14px; }
.pc-top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
.pc-n { font-size: 12px; color: #6B7280; margin-top: 4px; }
.gain { background: #F0FDF4; border-radius: 10px; padding: 12px; font-size: 13px; color: #166534; line-height: 1.6; margin-bottom: 18px; }
.ct-l { font-size: 13px; font-weight: 700; margin-bottom: 10px; }
.ct { border: 1px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; }
.ct.on { border: 2px solid #2F5D8A; background: #F1F5F9; }
.ct-t { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; }
.ct-d { font-size: 12px; color: #6B7280; margin-top: 4px; }
.draft { width: 560px; }
.kv { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
.kv span { color: #6B7280; }
.kv b { text-align: right; width: 300px; }
.flow { display: flex; align-items: center; gap: 8px; margin: 16px 0; font-size: 12px; }
.fs { display: flex; align-items: center; gap: 6px; color: #6B7280; }
.fs-d { width: 22px; height: 22px; border-radius: 11px; background: #E5E7EB; color: #6B7280; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; }
.fs.on { color: #24496E; font-weight: 700; }
.fs.on .fs-d { background: #2F5D8A; color: #FFFFFF; }
.fl { width: 24px; height: 2px; background: #E5E7EB; }
.income { width: 560px; }
.inc-sum { display: flex; gap: 12px; margin-bottom: 18px; }
.is { flex: 1; background: #F9FAFB; border-radius: 12px; padding: 12px; }
.is-l { font-size: 12px; color: #6B7280; }
.is-v { font-size: 20px; font-weight: 800; margin-top: 4px; }
.ic-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 180px; border-bottom: 1px solid #E5E7EB; }
.ic-col { width: 60px; display: flex; flex-direction: column; align-items: center; }
.ic-v { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
.ic-bar { width: 36px; background: #22A06B; border-radius: 6px 6px 0 0; }
.ic-labels { display: flex; justify-content: space-around; padding-top: 8px; }
.ic-m { width: 60px; text-align: center; font-size: 12px; color: #6B7280; }
""" + MG_CSS
    mg_html = microgrid()
    body = f"""
<div class="kpis">
  <div class="card kpi"><div class="kpi-l">ไฟที่เสนอขายในจังหวัดวันนี้</div><div class="kpi-v">18,400 <span class="kpi-u">kWh</span></div></div>
  <div class="card kpi"><div class="kpi-l">ผู้ขาย (ประชาชน)</div><div class="kpi-v">326 <span class="kpi-u">ครัวเรือน</span></div></div>
  <div class="card kpi"><div class="kpi-l">ผู้ซื้อที่เปิดรับซื้อ</div><div class="kpi-v">14 <span class="kpi-u">หน่วยงาน/องค์กร</span></div></div>
  <div class="card kpi"><div class="kpi-l">ราคาเฉลี่ยวันนี้</div><div class="kpi-v">{P2P_PRICE:.2f} <span class="kpi-u">บาท/หน่วย</span></div></div>
</div>
{mg_html}
<div class="row">
  <div class="card match">
    <div class="card-h"><div><div class="card-t">จับคู่กับผู้ซื้อในพื้นที่</div><div class="card-s">เรียงตามระยะทาง และช่วงเวลาที่ผู้ซื้อต้องการไฟตรงกับช่วงที่คุณผลิตได้</div></div><div class="pill">รัศมี 10 กม.</div></div>
    <div class="offer">
      <div class="of"><div class="of-l">โซลาร์ที่ติดตั้ง</div><div class="of-v">5 kW</div></div>
      <div class="of"><div class="of-l">ไฟเหลือขายเฉลี่ย</div><div class="of-v">10 kWh/วัน</div></div>
      <div class="of"><div class="of-l">ช่วงเวลาที่ขายได้</div><div class="of-v">10:00–15:00</div></div>
      <div class="of"><div class="of-l">ราคาที่ตั้งไว้</div><div class="of-v">{P2P_PRICE:.2f} บาท/หน่วย</div></div>
    </div>
    {brows}
  </div>

  <div class="card pricing">
    <div class="card-h"><div><div class="card-t">ราคาและสัญญา</div><div class="card-s">เทียบราคาต่อหน่วย (kWh)</div></div></div>
    {pbar("ขายคืนการไฟฟ้า", BUYBACK, "#9CA3AF")}
    {pbar("ราคาตลาด P2P", P2P_PRICE, "#22A06B", f"ผู้ซื้อจ่ายค่าผ่านสายส่งเพิ่ม {WHEELING:.2f} บาท/หน่วย")}
    {pbar("ค่าไฟที่ผู้ซื้อจ่ายปกติ", GRID_PRICE, "#F08C3A")}
    <div class="gain">ผู้ขายได้มากกว่าขายคืนการไฟฟ้า <b>{P2P_PRICE - BUYBACK:.2f} บาท/หน่วย</b><br>ผู้ซื้อประหยัดกว่าค่าไฟปกติ <b>{GRID_PRICE - P2P_PRICE - WHEELING:.2f} บาท/หน่วย</b></div>
    <div class="ct-l">เลือกรูปแบบสัญญา</div>
    <div class="ct"><div class="ct-t"><span>รายวัน</span><span class="muted">ยกเลิกได้ทุกวัน</span></div><div class="ct-d">ซื้อขายตามไฟที่ผลิตได้จริงในแต่ละวัน</div></div>
    <div class="ct on"><div class="ct-t"><span>รายเดือน</span><span style="color:#2F5D8A">เลือกอยู่</span></div><div class="ct-d">ราคาคงที่ 1 เดือน · ขั้นต่ำ 200 kWh/เดือน</div></div>
    <div class="ct"><div class="ct-t"><span>รายปี (Direct PPA)</span><span class="muted">สำหรับองค์กร</span></div><div class="ct-d">ราคาคงที่ 12 เดือน · ทำสัญญาตรงกับผู้ซื้อ</div></div>
  </div>
</div>

<div class="row">
  <div class="card draft">
    <div class="card-h"><div><div class="card-t">ร่างสัญญาซื้อขายไฟฟ้า</div><div class="card-s">กับ อบจ.ปทุมธานี · สัญญารายเดือน</div></div><span class="st watch">รอผู้ซื้อตรวจ</span></div>
    <div class="flow">
      <div class="fs on"><div class="fs-d">1</div>ร่างสัญญา</div><div class="fl"></div>
      <div class="fs on"><div class="fs-d">2</div>ผู้ซื้อตรวจ</div><div class="fl"></div>
      <div class="fs"><div class="fs-d">3</div>ลงนามทั้งสองฝ่าย</div><div class="fl"></div>
      <div class="fs"><div class="fs-d">4</div>เริ่มซื้อขาย</div>
    </div>
    <div class="kv"><span>ผู้ขาย</span><b>คุณ (บ้านโซลาร์ 5 kW, ต.คลองหก)</b></div>
    <div class="kv"><span>ผู้ซื้อ</span><b>อบจ.ปทุมธานี (อาคารสำนักงาน)</b></div>
    <div class="kv"><span>ปริมาณ</span><b>300 kWh/เดือน</b></div>
    <div class="kv"><span>ราคา</span><b>{P2P_PRICE:.2f} บาท/หน่วย</b></div>
    <div class="kv"><span>ระยะเวลา</span><b>1 – 30 พ.ย. 2569</b></div>
    <div class="kv"><span>การวัดปริมาณไฟ</span><b>มิเตอร์อัจฉริยะของการไฟฟ้า</b></div>
    <div class="kv"><span>การชำระเงิน</span><b>โอนเข้าบัญชีทุกสิ้นเดือน</b></div>
    <div class="controls" style="margin-top:16px;justify-content:flex-end"><div class="btn sec">แก้ไขสัญญา</div><div class="btn pri">ส่งให้ผู้ซื้อ</div></div>
  </div>

  <div class="card income">
    <div class="card-h"><div><div class="card-t">รายได้จากการขายไฟ</div><div class="card-s">6 เดือนล่าสุด · บาท</div></div></div>
    <div class="inc-sum">
      <div class="is"><div class="is-l">รายได้รวม</div><div class="is-v" style="color:#15803D">{fmt(tot_inc)} บาท</div></div>
      <div class="is"><div class="is-l">ไฟที่ขายได้</div><div class="is-v">{fmt(tot_kwh)} kWh</div></div>
      <div class="is"><div class="is-l">ได้มากกว่าขายคืนการไฟฟ้า</div><div class="is-v">+{fmt(extra)} บาท</div></div>
    </div>
    <div class="ic-chart">{inc_cols}</div>
    <div class="ic-labels">{inc_labels}</div>
  </div>
</div>

<div class="card" style="margin-bottom:20px">
  <div class="card-h"><div><div class="card-t">ประวัติการซื้อขาย</div><div class="card-s">รายการล่าสุด</div></div><div class="tabs"><div class="tab on">ทั้งหมด</div><div class="tab">ชำระแล้ว</div><div class="tab">รอชำระ</div></div></div>
  <table>
    <tr><th>วันที่</th><th>ผู้ซื้อ</th><th>สัญญา</th><th class="r">ปริมาณ (kWh)</th><th class="r">ราคา (บาท/หน่วย)</th><th class="r">รวม (บาท)</th><th>สถานะ</th></tr>
    {txrows}
  </table>
</div>"""
    controls = (select("จังหวัด", "ปทุมธานี") +
                '<div class="seg" style="width:220px;background:#FFFFFF"><div class="on">ฉันเป็นผู้ขาย</div><div>ฉันเป็นผู้ซื้อ</div></div>' +
                f'<div class="btn pri">{ic("plus", "#FFFFFF", 16)} ลงขายไฟฟ้า</div>')
    return page("ตลาดไฟฟ้า P2P", "<b>หน้าแรก</b> / ตลาดไฟฟ้า P2P", "ตลาดซื้อขายไฟฟ้า P2P", controls, body, css)

# =====================================================================
# 7) ตลาดอุปกรณ์มือสอง (ไม่มี AI)
# =====================================================================
REF_PANEL = [("ของใหม่", 5.5), ("90% ขึ้นไป", 2.7), ("80–89%", 2.3), ("70–79%", 1.7)]      # บาท/วัตต์
REF_BATT = [("ของใหม่", 7000), ("80% ขึ้นไป", 3500), ("70–79%", 2500)]                    # บาท/kWh ที่เหลือ

def panel_ref(health):
    return 2.7 if health >= 90 else 2.3 if health >= 80 else 1.7

def batt_ref(health):
    return 3500 if health >= 80 else 2500

def used_market():
    items = [  # kind, title, spec, health, age, place, km, price, unit, qty/watt/kwh, certified
        ("panel", "แผงโซลาร์ 550W โมโน", "20 แผ่น", 88, 5, "อ.คลองหลวง", 8, 1200, "แผ่น", 550, True),
        ("battery", "แบตเตอรี่ EV (LFP) 40 kWh", "1 ชุด", 76, 6, "อ.ลำลูกกา", 15, 72000, "ชุด", 40, True),
        ("panel", "แผงโซลาร์ 450W โมโน", "12 แผ่น", 81, 7, "อ.ธัญบุรี", 4, 1050, "แผ่น", 450, True),
        ("battery", "แบตเตอรี่บ้าน (BESS) 10 kWh", "1 ชุด", 84, 4, "อ.เมืองปทุมธานี", 2, 30000, "ชุด", 10, False),
        ("panel", "แผงโซลาร์ 330W โพลี", "30 แผ่น", 73, 10, "อ.หนองเสือ", 22, 520, "แผ่น", 330, True),
        ("battery", "แบตเตอรี่ EV (NMC) 60 kWh", "1 ชุด", 71, 8, "อ.สามโคก", 12, 99000, "ชุด", 60, True),
    ]
    cards = []
    for i, (kind, title, qty, h, age, place, km, price, unit, size, cert) in enumerate(items):
        ref = round(panel_ref(h) * size) if kind == "panel" else round(batt_ref(h) * size * h / 100)
        diff = round((price - ref) / ref * 100)
        cmp = (f'<span style="color:#15803D">ต่ำกว่าราคากลาง {abs(diff)}%</span>' if diff < 0 else
               f'<span style="color:#B45309">สูงกว่าราคากลาง {diff}%</span>' if diff > 0 else '<span>เท่าราคากลาง</span>')
        hl = "ประสิทธิภาพคงเหลือ" if kind == "panel" else "ความจุคงเหลือ"
        badge = (f'<span class="st ok">{ic("badge", "#166534", 12)} ตรวจรับรองแล้ว</span>' if cert
                 else '<span class="st grey">รอตรวจรับรอง</span>')
        cards.append(f"""
    <div class="item{' sel' if i == 0 else ''}">
      <div class="thumb">{ic(kind, "#24496E", 44, 1.5)}</div>
      <div class="it-b">
        <div class="it-top">{badge}<span class="muted" style="font-size:12px">ใช้งานมา {age} ปี</span></div>
        <div class="it-t">{title}</div>
        <div class="it-s">{qty} · {place} · {km} กม.</div>
        <div class="it-h"><span>{hl}</span><b>{h}%</b></div>
        <div class="bar" style="height:6px"><div style="width:{h}%;background:{'#22A06B' if h >= 80 else '#D97706'}"></div></div>
        <div class="it-p">{fmt(price)} <span>บาท/{unit}</span></div>
        <div class="it-c">ราคากลาง {fmt(ref)} บาท · {cmp}</div>
        <div class="btn {'pri' if i == 0 else 'sec'} sm" style="margin-top:12px">ติดต่อผู้ขาย</div>
      </div>
    </div>""")
    ref_panel = "".join(f'<tr><td>{l}</td><td class="r">{v:.1f}</td></tr>' for l, v in REF_PANEL)
    ref_batt = "".join(f'<tr><td>{l}</td><td class="r">{fmt(v)}</td></tr>' for l, v in REF_BATT)
    css = """
.filters { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 16px; }
.filters .field { margin-bottom: 0; width: 170px; }
.search { display: flex; align-items: center; gap: 10px; width: 340px; border: 1px solid #D1D5DB; border-radius: 10px; padding: 11px 14px; font-size: 14px; color: #9CA3AF; background: #FFFFFF; }
.chk { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; padding-bottom: 10px; }
.box { width: 18px; height: 18px; border-radius: 5px; background: #2F5D8A; display: flex; align-items: center; justify-content: center; }
.list-h { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.grid { width: 744px; display: flex; flex-wrap: wrap; gap: 16px; }
.item { width: 364px; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; }
.item.sel { border: 2px solid #2F5D8A; }
.thumb { height: 110px; background: #E2EAF3; display: flex; align-items: center; justify-content: center; }
.it-b { padding: 16px; }
.it-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.st svg { vertical-align: -2px; }
.it-t { font-size: 16px; font-weight: 700; }
.it-s { font-size: 12px; color: #6B7280; margin-top: 4px; }
.it-h { display: flex; justify-content: space-between; font-size: 12px; color: #4B5563; margin: 12px 0 6px; }
.it-p { font-size: 22px; font-weight: 800; margin-top: 12px; }
.it-p span { font-size: 13px; color: #6B7280; font-weight: 500; }
.it-c { font-size: 12px; color: #6B7280; margin-top: 4px; }
.btn.sm { padding: 9px 14px; font-size: 13px; }
.side-col { width: 376px; display: flex; flex-direction: column; gap: 16px; }
.ref table td, .ref table th { padding: 8px 6px; font-size: 13px; }
.ref-sub { font-size: 13px; font-weight: 700; margin: 14px 0 6px; }
.ref-n { font-size: 12px; color: #6B7280; margin-top: 12px; line-height: 1.5; }
.seller { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.av { width: 44px; height: 44px; border-radius: 22px; background: #E2EAF3; color: #24496E; display: flex; align-items: center; justify-content: center; font-weight: 800; }
.sel-sum { background: #F9FAFB; border-radius: 10px; padding: 12px; font-size: 13px; line-height: 1.6; margin-bottom: 12px; }
.msg { border: 1px solid #D1D5DB; border-radius: 10px; padding: 12px; font-size: 13px; color: #4B5563; height: 88px; line-height: 1.5; margin-bottom: 12px; }
.c-btns { display: flex; gap: 8px; }
.c-btns .btn { flex: 1; padding: 10px 8px; font-size: 13px; }
.warn-n { display: flex; gap: 8px; font-size: 12px; color: #92400E; background: #FFFBEB; border-radius: 10px; padding: 10px; margin-top: 12px; line-height: 1.5; }
"""
    body = f"""
<div class="kpis">
  <div class="card kpi"><div class="kpi-l">รายการขายในจังหวัด</div><div class="kpi-v">48 <span class="kpi-u">รายการ</span></div></div>
  <div class="card kpi"><div class="kpi-l">แผงโซลาร์</div><div class="kpi-v">31 <span class="kpi-u">รายการ</span></div></div>
  <div class="card kpi"><div class="kpi-l">แบตเตอรี่ EV / BESS</div><div class="kpi-v">17 <span class="kpi-u">รายการ</span></div></div>
  <div class="card kpi"><div class="kpi-l">ตรวจรับรองแล้ว</div><div class="kpi-v">39 <span class="kpi-u">รายการ</span></div><div class="kpi-d muted">โดยมหาวิทยาลัยในพื้นที่</div></div>
</div>

<div class="card filters">
  <div class="field" style="width:340px"><div class="field-l">ค้นหา</div><div class="search">{ic("search", "#9CA3AF", 16)} เช่น แผง 550W, แบต LFP</div></div>
  <div class="field"><div class="field-l">ประเภท</div><div class="input">ทั้งหมด<span class="caret">▼</span></div></div>
  <div class="field"><div class="field-l">สภาพคงเหลือ</div><div class="input">70% ขึ้นไป<span class="caret">▼</span></div></div>
  <div class="field"><div class="field-l">ระยะทาง</div><div class="input">ไม่เกิน 25 กม.<span class="caret">▼</span></div></div>
  <div class="chk"><div class="box">{ic("check", "#FFFFFF", 12, 3)}</div>เฉพาะที่ตรวจรับรองแล้ว</div>
</div>

<div class="row">
  <div>
    <div class="list-h"><div class="tabs"><div class="tab on">ทั้งหมด (6)</div><div class="tab">แผงโซลาร์ (3)</div><div class="tab">แบตเตอรี่ (3)</div></div><span class="muted" style="font-size:13px">เรียงตามระยะทาง</span></div>
    <div class="grid">{''.join(cards)}
    </div>
  </div>

  <div class="side-col">
    <div class="card ref">
      <div class="card-h" style="margin-bottom:6px"><div><div class="card-t">ราคากลางอ้างอิง</div><div class="card-s">อัปเดต ต.ค. 2569 จากราคาซื้อขายจริงในระบบ</div></div></div>
      <div class="ref-sub">แผงโซลาร์ (บาท/วัตต์)</div>
      <table><tr><th>สภาพ (ประสิทธิภาพคงเหลือ)</th><th class="r">ราคา</th></tr>{ref_panel}</table>
      <div class="ref-sub">แบตเตอรี่ (บาท/kWh ของความจุคงเหลือ)</div>
      <table><tr><th>สภาพ (ความจุคงเหลือ)</th><th class="r">ราคา</th></tr>{ref_batt}</table>
      <div class="ref-n">ของมือสองที่ผ่านการตรวจรับรอง ราคาถูกกว่าของใหม่ราว 50–70%</div>
    </div>

    <div class="card">
      <div class="card-h" style="margin-bottom:14px"><div><div class="card-t">ติดต่อผู้ขาย</div><div class="card-s">แผงโซลาร์ 550W โมโน · 20 แผ่น</div></div></div>
      <div class="seller"><div class="av">วส</div><div><div style="font-weight:700">คุณวิชัย ส.</div><div class="card-s" style="margin-top:2px">ยืนยันตัวตนแล้ว · ตอบกลับภายใน ~1 ชม. · ขายแล้ว 3 รายการ</div></div></div>
      <div class="sel-sum">ราคา <b>1,200 บาท/แผ่น</b> (รวม 24,000 บาท)<br>ประสิทธิภาพคงเหลือ 88% · ใบรับรองเลขที่ PT-2569-0142</div>
      <div class="msg">สวัสดีครับ หน่วยงานของเราสนใจแผงทั้ง 20 แผ่น ขอนัดดูสินค้าและใบรับรองได้ไหมครับ</div>
      <div class="btn pri" style="margin-bottom:8px">{ic("chat", "#FFFFFF", 15)} ส่งข้อความถึงผู้ขาย</div>
      <div class="c-btns"><div class="btn sec">{ic("phone", "#111827", 15)} โทร</div><div class="btn sec">{ic("calendar", "#111827", 15)} นัดดูสินค้า</div></div>
      <div class="warn-n">{ic("alert", "#92400E", 16)}<span>ตรวจใบรับรองและสภาพอุปกรณ์ก่อนชำระเงิน ระบบไม่ได้รับชำระเงินแทนผู้ขาย</span></div>
    </div>
  </div>
</div>"""
    controls = (select("จังหวัด", "ปทุมธานี") +
                '<div class="seg" style="width:220px;background:#FFFFFF"><div>ฉันเป็นผู้ขาย</div><div class="on">ฉันเป็นผู้ซื้อ</div></div>' +
                f'<div class="btn pri">{ic("plus", "#FFFFFF", 16)} ลงขายอุปกรณ์</div>')
    return page("ตลาดอุปกรณ์มือสอง", "<b>หน้าแรก</b> / ตลาดอุปกรณ์มือสอง", "ตลาดอุปกรณ์พลังงานมือสอง", controls, body, css)

PAGES = {
    "energy-p2p.html": p2p,
    "energy-used-market.html": used_market,
    "energy-history.html": history,
    "energy-crisis.html": crisis,
    "energy-reports.html": reports,
    "energy-settings.html": settings,
}

if __name__ == "__main__":
    for name, fn in PAGES.items():
        html = fn()
        bad = [c for c in set(html) if 0x2600 <= ord(c) <= 0x27BF or ord(c) >= 0x1F000 or ord(c) == 0xFE0F]
        if bad:
            sys.exit(f"{name}: emoji found {[hex(ord(c)) for c in bad]}")
        open(name, "w", encoding="utf-8").write(html)
        print("wrote", name, len(html))
