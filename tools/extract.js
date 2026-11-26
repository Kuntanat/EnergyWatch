// Reads each page's rendered layout (boxes, text, SVG icons) and POSTs it to /extract-<page>.json.
// Run in the browser on the save_server origin: await (await fetch('/tools/extract.js')).text() then eval with PAGES set.
async function extractPages(PAGES) {
  function hex(c) {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(",").map(s => parseFloat(s));
    const a = p.length > 3 ? p[3] : 1; if (a === 0) return null;
    return { h: "#" + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join(""), a: Math.round(a * 100) / 100 };
  }
  const R = v => Math.round(v * 10) / 10;
  const rows = rects => { const rs = [...rects].sort((a, b) => a.top - b.top); let n = 0, bottom = -1e9; for (const q of rs) { if (q.top >= bottom - 2) { n++; bottom = q.bottom; } else bottom = Math.max(bottom, q.bottom); } return n; };
  const out = {};
  for (const p of PAGES) {
    const html = await fetch(`/${p}.html`).then(r => r.text());
    const ifr = document.createElement("iframe");
    ifr.style.cssText = "position:absolute;left:0;top:0;width:1440px;height:900px;visibility:hidden;border:0";
    document.body.appendChild(ifr); ifr.srcdoc = html;
    await new Promise(r => ifr.onload = r);
    await ifr.contentDocument.fonts.ready;
    const d = ifr.contentDocument, w = ifr.contentWindow;
    const issues = [];
    for (const el of d.querySelectorAll(".card, .pillar, .col, .side, .main, .pillars, .cols, .row, .pros, .part, .mg-flow")) {
      const r = el.getBoundingClientRect();
      for (const c of el.querySelectorAll("*")) { const cr = c.getBoundingClientRect(); if (cr.width && cr.right > r.right + 1) { issues.push(`${el.className} > ${c.className || c.tagName} +${Math.round(cr.right - r.right)}`); break; } }
    }
    const nodes = [], svgs = [], handled = new Set();
    const op = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(w.getComputedStyle(e).opacity); return Math.round(o * 100) / 100; };
    const rectsOf = node => { const rg = d.createRange(); rg.selectNodeContents(node); return [...rg.getClientRects()].filter(q => q.width > 0); };
    for (const el of d.body.querySelectorAll("*")) {
      const tag = el.tagName.toLowerCase();
      if (handled.has(el)) continue;
      if (el.closest("svg") && tag !== "svg") continue;
      const cs = w.getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 0.5 || r.height < 0.5) continue;
      const o = op(el);
      if (tag === "svg") {
        const c = el.cloneNode(true); c.setAttribute("width", R(r.width)); c.setAttribute("height", R(r.height)); c.removeAttribute("style");
        let i = svgs.indexOf(c.outerHTML); if (i < 0) { svgs.push(c.outerHTML); i = svgs.length - 1; }
        nodes.push({ t: "v", x: R(r.left), y: R(r.top), w: R(r.width), h: R(r.height), i, o });
        continue;
      }
      const bg = hex(cs.backgroundColor);
      const grad = cs.backgroundImage.startsWith("linear-gradient") ? (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(hex).filter(Boolean) : null;
      const sides = ["Top", "Right", "Bottom", "Left"].map(s => ({ s, wd: parseFloat(cs[`border${s}Width`]), c: hex(cs[`border${s}Color`]), st: cs[`border${s}Style`] })).filter(b => b.wd > 0 && b.c && b.st !== "none");
      const rad = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(k => Math.min(parseFloat(cs[`border${k}Radius`]) || 0, r.width / 2, r.height / 2));
      const n = { t: "b", x: R(r.left), y: R(r.top), w: R(r.width), h: R(r.height), o };
      let keep = false;
      if (grad && grad.length >= 2) { n.g = [grad[0], grad[grad.length - 1]]; keep = true; }
      else if (bg) { n.f = bg; keep = true; }
      const lines = [];
      if (sides.length === 4 && sides.every(b => b.wd === sides[0].wd && b.c.h === sides[0].c.h)) { n.s = sides[0].c; n.sw = sides[0].wd; if (sides[0].st === "dashed") n.sd = 1; keep = true; }
      else for (const b of sides) {
        const L = { t: "b", o, f: b.c };
        if (b.s === "Top") Object.assign(L, { x: R(r.left), y: R(r.top), w: R(r.width), h: b.wd });
        if (b.s === "Bottom") Object.assign(L, { x: R(r.left), y: R(r.bottom - b.wd), w: R(r.width), h: b.wd });
        if (b.s === "Left") Object.assign(L, { x: R(r.left), y: R(r.top), w: b.wd, h: R(r.height) });
        if (b.s === "Right") Object.assign(L, { x: R(r.right - b.wd), y: R(r.top), w: b.wd, h: R(r.height) });
        if (b.st === "dashed") L.sd = 1;
        lines.push(L);
      }
      if (rad.some(v => v > 0)) n.r = rad.every(v => v === rad[0]) ? R(rad[0]) : rad.map(R);
      if (keep) nodes.push(n);
      nodes.push(...lines);
      const kids = [...el.childNodes];
      const hasText = kids.some(k => k.nodeType === 3 && k.textContent.trim());
      const elKids = kids.filter(k => k.nodeType === 1);
      const allInline = elKids.every(k => k.tagName === "BR" || (k.tagName.toLowerCase() !== "svg" && w.getComputedStyle(k).display === "inline" && !k.querySelector("svg")));
      if (hasText && elKids.some(k => k.tagName !== "BR") && allInline && rows(rectsOf(el)) > 1) {
        let s = "", ranges = [];
        const walk = (node, inh) => {
          for (const k of node.childNodes) {
            if (k.nodeType === 3) { const t = k.textContent.replace(/\s+/g, " "); const a = s.length; s += t; if (inh) ranges.push([a, s.length, inh]); }
            else if (k.tagName === "BR") { s = s.replace(/ $/, "") + "\n"; }
            else { const kcs = w.getComputedStyle(k); handled.add(k); walk(k, { fw: parseInt(kcs.fontWeight), c: hex(kcs.color).h.slice(1), fs: parseFloat(kcs.fontSize) }); }
          }
        };
        walk(el, null);
        let clean = "", map = [];
        for (let i = 0; i < s.length; i++) {
          const ch = s[i], prev = clean[clean.length - 1];
          if (ch === " " && (clean.length === 0 || prev === " " || prev === "\n")) { map.push(clean.length); continue; }
          if (ch === "\n" && prev === " ") { clean = clean.slice(0, -1); }
          map.push(clean.length); clean += ch;
        }
        map.push(clean.length);
        while (clean.endsWith(" ") || clean.endsWith("\n")) clean = clean.slice(0, -1);
        const rs = ranges.map(([a, b, st]) => { let A = map[a], B = Math.min(map[b], clean.length); while (A < B && clean[A] === " ") A++; while (B > A && clean[B - 1] === " ") B--; return [A, B, st.fw, st.c, st.fs]; }).filter(q => q[1] > q[0]);
        const rects = rectsOf(el);
        const x1 = Math.min(...rects.map(q => q.left)), y1 = Math.min(...rects.map(q => q.top)), x2 = Math.max(...rects.map(q => q.right)), y2 = Math.max(...rects.map(q => q.bottom));
        const c = hex(cs.color);
        nodes.push({ t: "x", x: R(x1), y: R(y1), w: R(x2 - x1), h: R(y2 - y1), s: clean, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight), c: c.h, o: Math.round(o * c.a * 100) / 100, wr: 1, lh: parseFloat(cs.lineHeight) || null, rs, ta: cs.textAlign === "center" ? "c" : "" });
        continue;
      }
      for (const tn of kids) {
        if (tn.nodeType !== 3) continue;
        const s = tn.textContent.replace(/\s+/g, " ").trim(); if (!s) continue;
        const rects = rectsOf(tn);
        if (!rects.length) continue;
        const x1 = Math.min(...rects.map(q => q.left)), y1 = Math.min(...rects.map(q => q.top)), x2 = Math.max(...rects.map(q => q.right)), y2 = Math.max(...rects.map(q => q.bottom));
        const lc = rows(rects);
        const c = hex(cs.color);
        const t = { t: "x", x: R(x1), y: R(y1), w: R(x2 - x1), h: R(y2 - y1), s, fs: parseFloat(cs.fontSize), fw: parseInt(cs.fontWeight), c: c.h, o: Math.round(o * c.a * 100) / 100 };
        if (lc > 1) { t.wr = 1; t.lh = parseFloat(cs.lineHeight) || null; if (cs.textAlign === "center") t.ta = "c"; }
        const al = cs.textAlign; if (lc === 1 && (al === "right" || al === "end" || al === "center")) t.al = al === "center" ? "c" : "r";
        nodes.push(t);
      }
    }
    const page = { name: p, w: 1440, h: d.body.scrollHeight, bg: hex(w.getComputedStyle(d.body).backgroundColor).h, nodes, svgs };
    await fetch(`/extract-${p}.json`, { method: "POST", body: JSON.stringify(page) });
    out[p] = { nodes: nodes.length, h: page.h, width: d.body.scrollWidth, issues: issues.slice(0, 5) };
    ifr.remove();
  }
  return out;
}
