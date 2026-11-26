"""Turns extracted page layouts (tools/extract/*.json) into use_figma Plugin API scripts.

Usage: python tools/figma_code.py rebuild <page> "<frame name>" [<page> "<frame name>" ...]
Each page becomes 1+ scripts in tools/figma_code/. The first script of a page deletes the existing frame
with that name (keeping its x position) and rebuilds it; the last script of the run arranges frames in ORDER.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = os.path.join(HERE, "extract"), os.path.join(HERE, "figma_code")
os.makedirs(OUT, exist_ok=True)
LIMIT = 34000
ORDER = ["1 · หน้าแรก", "2 · Dashboard ปทุมธานี", "3 · ตลาดไฟฟ้า P2P", "4 · ตลาดอุปกรณ์มือสอง"]

# Node tuples:
#  ["b", x, y, w, h, fill, radius, stroke, strokeWidth, dashed, opacity]   fill: "" | "rrggbb[aa]" | ["g", c1, c2]
#  ["v", x, y, svgIndex, opacity]
#  ["x", x, y, w, h, text, fontSize, fontWeight, color, opacity, mode, lineHeight, ranges?]
#      mode: "" | "r" | "c" | "w" (wrap) | "wc" (wrap, centered); ranges: [[start, end, weight, color, size]]
BUILD = r"""
async function build(NAME,FIRST,H,BG,S,N){
function col(s){const c={r:parseInt(s.slice(0,2),16)/255,g:parseInt(s.slice(2,4),16)/255,b:parseInt(s.slice(4,6),16)/255};return {c,a:s.length>6?parseInt(s.slice(6,8),16)/255:1};}
const TH=/[฀-๿]/,cache={};
async function lf(fam,st){const k=fam+"|"+st;if(k in cache)return cache[k];try{await figma.loadFontAsync({family:fam,style:st});cache[k]={family:fam,style:st};}catch(e){cache[k]=null;}return cache[k];}
const STY={400:["Regular"],500:["Medium","Regular"],600:["Semi Bold","SemiBold","Bold"],700:["Bold"],800:["Extra Bold","ExtraBold","Bold"]};
async function pick(thai,fw){const fams=thai?["Noto Sans Thai","Sarabun","IBM Plex Sans Thai"]:["Inter"];const w=fw>=750?800:fw>=650?700:fw>=550?600:fw>=450?500:400;for(const fam of fams)for(const st of STY[w]){const f=await lf(fam,st);if(f)return f;}return await lf("Inter","Regular");}
let root;
if(FIRST){let mx=0;for(const c of figma.currentPage.children)mx=Math.max(mx,c.x+c.width+200);root=figma.createFrame();root.name=NAME;root.resize(1440,H);root.x=mx;root.y=0;root.fills=[{type:"SOLID",color:col(BG).c}];root.clipsContent=true;}
else root=figma.currentPage.findOne(n=>n.type==="FRAME"&&n.name===NAME&&n.parent.type==="PAGE");
if(!root)throw new Error("root frame not found: "+NAME);
let count=0;
for(const n of N){let node;const t=n[0];
 if(t==="b"){const [,x,y,w,h,f,r,s,sw,d,o]=n;
  if(d&&!s&&typeof f==="string"){node=figma.createLine();root.appendChild(node);node.resize(Math.max(w,h),0);const k=col(f);node.strokes=[{type:"SOLID",color:k.c,opacity:k.a}];node.strokeWeight=Math.min(w,h);node.dashPattern=[5,4];if(h>w){node.rotation=-90;node.x=x;node.y=y+h;}else{node.x=x;node.y=y+h/2;}}
  else{node=figma.createRectangle();root.appendChild(node);node.resize(Math.max(w,0.01),Math.max(h,0.01));node.x=x;node.y=y;
   if(Array.isArray(f))node.fills=[{type:"GRADIENT_LINEAR",gradientTransform:[[1,0,0],[0,1,0]],gradientStops:[f[1],f[2]].map((s,i)=>{const k=col(s);return {position:i,color:{...k.c,a:k.a}};})}];
   else if(f){const k=col(f);node.fills=[{type:"SOLID",color:k.c,opacity:k.a}];}else node.fills=[];
   if(s){const k=col(s);node.strokes=[{type:"SOLID",color:k.c,opacity:k.a}];node.strokeWeight=sw;node.strokeAlign="INSIDE";if(d)node.dashPattern=[5,4];}
   if(Array.isArray(r)){node.topLeftRadius=r[0];node.topRightRadius=r[1];node.bottomRightRadius=r[2];node.bottomLeftRadius=r[3];}else if(r)node.cornerRadius=r;}
  if(o<1)node.opacity=o;}
 else if(t==="v"){node=figma.createNodeFromSvg(S[n[3]]);root.appendChild(node);node.x=n[1];node.y=n[2];if(n[4]<1)node.opacity=n[4];}
 else{const [,x,y,w,h,s,fs,fw,c,o,m,lh]=n;const f=await pick(TH.test(s),fw);
  node=figma.createText();node.fontName=f;node.characters=s;node.fontSize=fs;const k=col(c);node.fills=[{type:"SOLID",color:k.c,opacity:k.a*o}];root.appendChild(node);
  if(n[12])for(const [a,b,rw,rc,rf] of n[12]){const f2=await pick(TH.test(s),rw);node.setRangeFontName(a,b,f2);const k2=col(rc);node.setRangeFills(a,b,[{type:"SOLID",color:k2.c,opacity:k2.a*o}]);if(rf&&rf!==fs)node.setRangeFontSize(a,b,rf);}
  if(m==="w"||m==="wc"){if(lh)node.lineHeight={unit:"PIXELS",value:lh};node.textAutoResize="HEIGHT";if(m==="wc"){node.textAlignHorizontal="CENTER";node.resize(w+16,node.height);node.x=x-8;}else{node.resize(w+6,node.height);node.x=x;}node.y=y;}
  else{node.textAutoResize="WIDTH_AND_HEIGHT";node.x=m==="r"?x+w-node.width:m==="c"?x+(w-node.width)/2:x;node.y=y+(h-node.height)/2;}}
 count++;}
return {rootId:root.id,name:NAME,created:count};
}
"""

def num(v):
    return int(v) if isinstance(v, float) and v.is_integer() else v

def c8(c):
    if not c:
        return ""
    h = c["h"].lstrip("#")
    return h if c["a"] >= 1 else h + format(round(c["a"] * 255), "02x")

def tup(n):
    if n["t"] == "b":
        f = ["g", c8(n["g"][0]), c8(n["g"][1])] if "g" in n else c8(n.get("f"))
        r = n.get("r", 0)
        r = [num(v) for v in r] if isinstance(r, list) else num(r)
        return ["b", num(n["x"]), num(n["y"]), num(n["w"]), num(n["h"]), f, r, c8(n.get("s")), num(n.get("sw", 0)), n.get("sd", 0), n.get("o", 1)]
    if n["t"] == "v":
        return ["v", num(n["x"]), num(n["y"]), n["i"], n.get("o", 1)]
    mode = ("wc" if n.get("ta") == "c" else "w") if n.get("wr") else n.get("al", "")
    t = ["x", num(n["x"]), num(n["y"]), num(n["w"]), num(n["h"]), n["s"], num(n["fs"]), n["fw"], n["c"].lstrip("#"), n.get("o", 1), mode, num(n.get("lh") or 0)]
    if n.get("rs"):
        t.append([[a, b, fw, c, num(fs)] for a, b, fw, c, fs in n["rs"]])
    return t

def dump(v):
    return json.dumps(v, ensure_ascii=False, separators=(",", ":"))

def rebuild(pairs):
    for f in os.listdir(OUT):
        os.remove(os.path.join(OUT, f))
    scripts = []
    for page, name in pairs:
        data = json.load(open(os.path.join(SRC, f"extract-{page}.json"), encoding="utf-8"))
        svgs = dump(data["svgs"])
        lines = [dump(tup(n)) for n in data["nodes"]]
        chunks, cur, size = [], [], 0
        for ln in lines:
            if cur and len(BUILD) + len(svgs) + size + len(ln) > LIMIT:
                chunks.append(cur); cur, size = [], 0
            cur.append(ln); size += len(ln) + 2
        chunks.append(cur)
        for i, ch in enumerate(chunks):
            head = f"const NAME={dump(name)};\nconst S={svgs};\nconst N=[\n" + ",\n".join(ch) + "\n];\n" + BUILD
            if i == 0:
                body = ("const old=figma.currentPage.findOne(z=>z.type===\"FRAME\"&&z.name===NAME&&z.parent.type===\"PAGE\");const oldX=old?old.x:null;if(old)old.remove();\n"
                        f"const res=await build(NAME,true,{data['h']},{dump(data['bg'].lstrip('#'))},S,N);\n"
                        "if(oldX!==null){const fr=await figma.getNodeByIdAsync(res.rootId);fr.x=oldX;}\n")
            else:
                body = "const res=await build(NAME,false,0,'',S,N);\n"
            scripts.append([page, i, head + body])
    last = scripts[-1]
    last[2] += (f"const ORDER={dump(ORDER)};let px=0;const frames=[];\n"
                "for(const nm of ORDER){const fr=figma.currentPage.findOne(z=>z.type===\"FRAME\"&&z.name===nm&&z.parent.type===\"PAGE\");if(fr){fr.x=px;fr.y=0;px+=fr.width+200;frames.push({id:fr.id,name:nm});}}\n")
    for page, i, code in scripts:
        ret = "return {...res,frames};" if code is last[2] else "return res;"
        fn = os.path.join(OUT, f"{page}-{i + 1}.js")
        open(fn, "w", encoding="utf-8").write(code + ret)
        print(os.path.basename(fn), len(code))

if __name__ == "__main__":
    args = sys.argv[1:]
    assert args and args[0] == "rebuild" and len(args) % 2 == 1, __doc__
    rebuild(list(zip(args[1::2], args[2::2])))
