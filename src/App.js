import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from "recharts";

/* ─── Fonts ─── */
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(_fl);

/* ─── Blue Design System ─── */
const F = { h:"'Bebas Neue', sans-serif", b:"'Outfit', system-ui, sans-serif", m:"'Space Mono', monospace" };

const C = {
  bg:     "#050810",
  card:   "#090D1A",
  card2:  "#0D1220",
  bdr:    "#152038",
  bdr2:   "#1E2D44",
  white:  "#E8F0FF",
  pri:    "#C8D8F8",
  sec:    "#7A90B8",
  mut:    "#3A4D6A",
  faint:  "#111A2E",
  // Blues — primary palette
  blue:   "#3D8BF8",
  sky:    "#60A5FA",
  indigo: "#818CF8",
  cyan:   "#22D3EE",
  // Functional
  green:  "#34D399",
  yellow: "#FCD34D",
  orange: "#F97316",
  red:    "#F87171",
  pink:   "#F472B6",
  // Race accents (all in blue family)
  police: "#34D399",   // completed  → teal
  namma:  "#60A5FA",   // upcoming   → sky blue
  tcs:    "#818CF8",   // goal race  → indigo
};

/* ─── Tiny helpers ─── */
const sp = (n=8) => <div style={{height:n}}/>;
const Pill = ({c=C.blue,children}) => (
  <span style={{display:"inline-flex",padding:"2px 8px",borderRadius:20,fontSize:9,
    fontFamily:F.m,fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}33`,
    letterSpacing:"0.07em",textTransform:"uppercase"}}>{children}</span>
);
const SLabel = ({children,col=C.mut}) => (
  <div style={{fontSize:11,color:col,textTransform:"uppercase",letterSpacing:"0.12em",
    fontWeight:700,fontFamily:F.b,marginBottom:12}}>{children}</div>
);
const SHead = ({label,accent=C.blue,right}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingTop:24}}>
    <div style={{width:3,height:18,background:accent,borderRadius:2}}/>
    <span style={{fontSize:12,fontFamily:F.h,fontWeight:700,color:accent,
      textTransform:"uppercase",letterSpacing:"0.14em",flex:1}}>{label}</span>
    {right && <span style={{fontSize:10,fontFamily:F.m,color:C.mut}}>{right}</span>}
  </div>
);
const Divider = () => <div style={{height:1,background:C.bdr}}/>;
function IBar({val,color,h=4}){
  return <div style={{height:h,background:C.bdr,borderRadius:2}}>
    <div style={{height:"100%",width:`${val*100}%`,background:color,borderRadius:2}}/>
  </div>;
}

/* ════════════════════════════════════════
   DATA
════════════════════════════════════════ */

/* — Latest run HR stream (Mar 10) — */
const latestRunHR = [
  {d:0,hr:99},{d:0.66,hr:123},{d:1.33,hr:134},{d:1.99,hr:142},{d:2.65,hr:145},
  {d:3.31,hr:145},{d:3.99,hr:142},{d:4.66,hr:142},{d:5.31,hr:145},{d:5.98,hr:147},
  {d:6.63,hr:144},{d:7.30,hr:146},{d:7.97,hr:149},{d:8.62,hr:149},{d:9.28,hr:146},
  {d:9.97,hr:149},{d:10.62,hr:152},{d:11.28,hr:151},{d:11.95,hr:152},{d:12.60,hr:150},
  {d:16.59,hr:150},{d:17.25,hr:149},{d:17.91,hr:152},{d:22.55,hr:151},{d:23.22,hr:152},
  {d:29.20,hr:154},{d:29.87,hr:155},{d:30.52,hr:151},{d:35.16,hr:154},{d:38.49,hr:155},
  {d:40.47,hr:161},{d:41.14,hr:161},{d:44.47,hr:164},{d:45.11,hr:167},{d:46.44,hr:168},
  {d:47.78,hr:172},{d:48.43,hr:171},{d:49.10,hr:169},{d:49.77,hr:164},{d:50.43,hr:161},
  {d:51.09,hr:154},{d:51.76,hr:152},{d:53.76,hr:156},{d:56.08,hr:160},{d:57.41,hr:160},
  {d:58.75,hr:147},{d:60.75,hr:161},{d:62.04,hr:172},{d:63.69,hr:161},{d:65.69,hr:170},
];

/* — Police Run data — */
const policeHRData = [
  {d:0,hr:117},{d:0.3,hr:141},{d:0.7,hr:153},{d:1.0,hr:159},{d:1.5,hr:162},{d:2.0,hr:168},
  {d:2.5,hr:170},{d:3.0,hr:170},{d:3.5,hr:174},{d:4.0,hr:176},{d:4.5,hr:178},{d:5.0,hr:180},
  {d:5.5,hr:180},{d:6.0,hr:181},{d:6.5,hr:183},{d:7.0,hr:183},{d:7.5,hr:185},{d:8.0,hr:185},
  {d:8.5,hr:187},{d:9.0,hr:188},{d:9.5,hr:190},{d:10.0,hr:188},
];
const policePaceData = [
  {km:"1",pace:5.78,hr:158},{km:"2",pace:5.90,hr:168},{km:"3",pace:5.85,hr:172},
  {km:"4",pace:5.82,hr:174},{km:"5",pace:5.88,hr:178},{km:"6",pace:5.90,hr:180},
  {km:"7",pace:5.95,hr:182},{km:"8",pace:6.05,hr:184},{km:"9",pace:6.08,hr:187},{km:"10",pace:5.72,hr:190},
];
const policeZones = [
  {zone:"Z1",name:"Recovery", bpm:"0–118",  pct:2,  color:"#1E3A5F"},
  {zone:"Z2",name:"Aerobic",  bpm:"118–147",pct:5,  color:C.green},
  {zone:"Z3",name:"Tempo",    bpm:"147–162",pct:8,  color:C.yellow},
  {zone:"Z4",name:"Threshold",bpm:"162–177",pct:28, color:C.blue},
  {zone:"Z5",name:"Max",      bpm:"177+",   pct:57, color:C.indigo},
];

/* — SBI analysis — */
const sbiKmData = [
  {km:"Km 1",pace:6.17,hr:160,elev:0,  flag:false},{km:"Km 2",pace:6.88,hr:174,elev:27, flag:false},
  {km:"Km 3",pace:6.35,hr:171,elev:-3, flag:false},{km:"Km 4",pace:5.30,hr:178,elev:-2, flag:true},
  {km:"Km 5",pace:6.00,hr:178,elev:0,  flag:false},{km:"Km 6",pace:6.42,hr:178,elev:5,  flag:false},
  {km:"Km 7",pace:7.08,hr:182,elev:24, flag:true}, {km:"Km 8",pace:6.68,hr:175,elev:-3, flag:false},
  {km:"Km 9",pace:5.77,hr:177,elev:-1, flag:false},{km:"Km 10",pace:5.52,hr:176,elev:-2,flag:false},
];

/* — Namma segments — */
const nammaSegs = [
  {km:"0–1 km",   terrain:"Flat Start",       pace:"6:10",  hr:"~155",intensity:0.35,color:C.green, tip:"Don't surge with the crowd. Start easy, HR under 160."},
  {km:"1–2.5 km", terrain:"⬆️ The Climb",     pace:"6:35",  hr:"~172",intensity:0.75,color:C.orange,tip:"5.7% avg grade, max 13%. Shorten stride, keep cadence 85+."},
  {km:"2.5–5 km", terrain:"Flat/Rolling",      pace:"5:50",  hr:"~168",intensity:0.60,color:C.sky,   tip:"Recover on the flat. Gentle downhill — bank the time here."},
  {km:"5–7 km",   terrain:"Turnaround+Flat",   pace:"5:45",  hr:"~172",intensity:0.65,color:C.sky,   tip:"Fastest stretch. Feel strong. Push now."},
  {km:"7–8.5 km", terrain:"⬆️ Climb Again",    pace:"6:25",  hr:"~182",intensity:0.90,color:C.indigo,tip:"Shorten stride. Keep moving. Cadence 88+."},
  {km:"8.5–10 km",terrain:"⬇️ Downhill Finish",pace:"5:35",  hr:"~185",intensity:0.85,color:C.indigo,tip:"Gravity is your friend. Open up and empty the tank."},
];
const nammaTraining = [
  {date:"Fri Mar 6", emoji:"🏸",label:"Badminton ✓",        light:C.green, done:true,  isRace:false,
   desc:"67 min · HR 133 · 547 kcal. Cross-training, legs fresh. ✅"},
  {date:"Sat Mar 7", emoji:"✅",label:"Long Run ✓",          light:C.sky,   done:true,  isRace:false,
   desc:"14.08 km · 1:40:20 · 7:08/km · HR 159 · 150m elev · 1244 kcal. EXCEEDED 10–12km plan. ✅"},
  {date:"Sun Mar 8", emoji:"🏸",label:"Badminton ✓",          light:C.green, done:true,  isRace:false,
   desc:"1:44:11 · HR 132 · 822 kcal. Active recovery. ✅"},
  {date:"Mon Mar 9", emoji:"✅",label:"Morning Run ✓",        light:C.green, done:true,  isRace:false,
   desc:"5.15km · 31:00 · 6:01/km · HR 171 · 221W. Taper mode from here. ✅"},
  {date:"Tue Mar 10",emoji:"✅",label:"Shakeout + Strides ✓", light:C.green, done:true,  isRace:false,
   desc:"6.57km · 46:43 · HR 153 · 4 strides (top 16.9 km/h, cad 91!) · 188W. ✅"},
  {date:"Wed Mar 11",emoji:"🏃",label:"Recovery Run",          light:C.green, done:false, isRace:false,
   desc:"5km @ 8:00/km or full rest if legs feel heavy."},
  {date:"Thu Mar 12",emoji:"💨",label:"Shakeout + Strides",    light:C.sky,   done:false, isRace:false,
   desc:"4km easy + 4×80m strides at race effort."},
  {date:"Fri Mar 13",emoji:"🛌",label:"Full Rest",              light:C.sec,   done:false, isRace:false,
   desc:"Nothing. Carb load at dinner. Sleep by 10pm."},
  {date:"Sat Mar 14",emoji:"🎽",label:"Shakeout + BIB",         light:C.blue,  done:false, isRace:false,
   desc:"20 min easy + 2 strides. BIB at Swaasthya Fitness, Whitefield."},
  {date:"Sun Mar 15",emoji:"🏅",label:"RACE DAY",               light:C.namma, done:false, isRace:true,
   desc:"Namma Power Run · Target: 57:30–58:30 · NICE Road, Hoskerehalli"},
];
const NAMMA_ELEV=[0,3,6,12,22,35,45,52,58,62,65,67,68,66,63,58,52,45,38,30,24,18,14,10,7,5,4,3,2,2,2,3,5,8,12,18,25,33,42,50,57,63,67,68,67,65,62,58,53,47,40,33,26,20,15,10,7,4,2,0];

/* — TCS data — */
const tcsElev = [
  {d:0,alt:908,grade:0},{d:0.3,alt:904,grade:-1.3},{d:0.7,alt:900,grade:-1.1},{d:1.0,alt:897,grade:-1.0},
  {d:1.4,alt:893,grade:-1.0},{d:1.8,alt:889,grade:-1.1},{d:2.0,alt:889,grade:0},{d:2.3,alt:892,grade:1.0},
  {d:2.7,alt:896,grade:1.3},{d:3.0,alt:895,grade:-0.3},{d:3.5,alt:895,grade:0},{d:4.0,alt:894,grade:-0.2},
  {d:4.3,alt:895,grade:0.3},{d:4.6,alt:899,grade:1.3},{d:4.8,alt:903,grade:2.0},{d:5.0,alt:908,grade:2.5},
  {d:5.3,alt:906,grade:-0.7},{d:5.7,alt:904,grade:-0.5},{d:6.0,alt:903,grade:-0.3},{d:6.4,alt:901,grade:-0.5},
  {d:6.8,alt:899,grade:-0.5},{d:7.0,alt:899,grade:0},{d:7.3,alt:901,grade:0.7},{d:7.6,alt:903,grade:0.7},
  {d:8.0,alt:901,grade:-0.5},{d:8.3,alt:899,grade:-0.7},{d:8.6,alt:901,grade:0.7},{d:9.0,alt:905,grade:1.0},
  {d:9.3,alt:903,grade:-0.7},{d:9.6,alt:901,grade:-0.7},{d:10.0,alt:899,grade:-0.5},
];
const tcsKms = [
  {km:"Km 1",terrain:"Net Downhill",  pace:"5:45",hr:158,elev:-11,color:C.green, intensity:0.35,tip:"Cruise the downhill. Resist the wave-start surge."},
  {km:"Km 2",terrain:"Down then Up",  pace:"5:35",hr:163,elev:0,  color:C.green, intensity:0.45,tip:"Short sharp uphill in latter half."},
  {km:"Km 3",terrain:"Uphill+Headwind",pace:"5:35",hr:168,elev:7, color:C.yellow,intensity:0.55,tip:"U-turn #1. Headwinds on return. Maintain cadence."},
  {km:"Km 4",terrain:"FLATTEST 🔑",   pace:"5:20",hr:170,elev:-1, color:C.sky,   intensity:0.65,tip:"Surge here! Flattest km — bank 10–15 seconds."},
  {km:"Km 5",terrain:"HARDEST KM ⚠",  pace:"5:45",hr:178,elev:19, color:C.red,   intensity:0.90,tip:"Short sharp up → protracted uphill. Shorten stride. Cadence 88+. Survive."},
  {km:"Km 6",terrain:"Recovery",       pace:"5:25",hr:172,elev:-5, color:C.blue,  intensity:0.55,tip:"Mental reset. Recover here."},
  {km:"Km 7",terrain:"Down then Up",   pace:"5:25",hr:173,elev:4,  color:C.sky,   intensity:0.60,tip:"Vidhana Soudha, Cubbon Park. Draw from the crowd."},
  {km:"Km 8",terrain:"Down→U-turn",    pace:"5:25",hr:174,elev:-7, color:C.yellow,intensity:0.65,tip:"Steady downhill. U-turn #3 at KR Circle."},
  {km:"Km 9",terrain:"Up then Down",   pace:"5:30",hr:179,elev:6,  color:C.red,   intensity:0.85,tip:"Grunt time. Steady uphill. At top → gentle downhill."},
  {km:"Km 10",terrain:"SPRINT",        pace:"5:05",hr:185,elev:-2, color:C.indigo,intensity:1.00,tip:"THE STRAIGHTAWAY. Empty every last reserve."},
];
const tcsWeeks = [
  {week:"Wk 1",dates:"Mar 16–22",label:"Recovery",   km:16,color:C.green, intensity:0.15},
  {week:"Wk 2",dates:"Mar 23–29",label:"Rebuild",    km:33,color:C.sky,   intensity:0.40},
  {week:"Wk 3",dates:"Mar 30–Apr 5",label:"Speed 🔑",km:42,color:C.blue,  intensity:0.70},
  {week:"Wk 4",dates:"Apr 6–12", label:"Race Sim 🔑",km:40,color:C.indigo,intensity:0.75},
  {week:"Wk 5",dates:"Apr 13–19",label:"Sharpening", km:32,color:C.blue,  intensity:0.65},
  {week:"Wk 6",dates:"Apr 20–26",label:"Race Week",  km:18,color:C.indigo,intensity:0.20},
];

/* — Season / stats data — */
const MONTHLY = [
  {m:"Nov '25",km:78.7, runs:10,avgPace:"6:48",color:C.sky   },
  {m:"Dec '25",km:90.1, runs:9, avgPace:"7:40",color:C.indigo},
  {m:"Jan '26",km:106.3,runs:15,avgPace:"7:25",color:C.sky   },
  {m:"Feb '26",km:133.9,runs:18,avgPace:"7:22",color:C.blue  },
  {m:"Mar '26",km:51.1, runs:7, avgPace:"6:45",color:C.cyan  },
];
const WEEKLY = [
  {w:"Jan W1",km:22.0},{w:"Jan W2",km:32.1},{w:"Jan W3",km:29.1},{w:"Jan W4",km:23.1},
  {w:"Feb W1",km:17.9},{w:"Feb W2",km:14.6},{w:"Feb W3",km:24.3},{w:"Feb W4",km:46.6},
  {w:"Mar W1",km:53.9},{w:"Mar W2",km:11.7},
];
const PACE_TREND = [
  {r:"Nov 16",pace:6.55,hr:178,km:10.3,tag:"TRAIL"},{r:"Nov 26",pace:5.90,hr:175,km:9.2, tag:"TEMPO"},
  {r:"Dec 21",pace:7.67,hr:161,km:25.0,tag:"ULTRA"},{r:"Dec 31",pace:7.05,hr:162,km:12.5,tag:"LONG"},
  {r:"Jan 19",pace:6.95,hr:157,km:8.1, tag:"EASY"}, {r:"Feb 6", pace:6.13,hr:168,km:5.5, tag:"TEMPO"},
  {r:"Feb 13",pace:6.93,hr:162,km:10.1,tag:"EASY"}, {r:"Feb 26",pace:7.47,hr:155,km:10.0,tag:"LONG"},
  {r:"Mar 1", pace:5.88,hr:180,km:10.0,tag:"RACE"}, {r:"Mar 5", pace:7.32,hr:162,km:8.2, tag:"EASY"},
  {r:"Mar 7", pace:7.13,hr:159,km:14.1,tag:"LONG"}, {r:"Mar 9", pace:6.02,hr:171,km:5.2, tag:"TEMPO"},
  {r:"Mar 10",pace:7.12,hr:153,km:6.6, tag:"STRIDES"},
];
const RACE_HISTORY = [
  {name:"Kaveri Trail 10K",    date:"Nov 16 '25",dist:"10.3 km",time:"1:07:25",pace:"6:33/km",hr:"178/192",elev:"+5m",  temp:"~26°C",color:C.indigo,status:"done",kcal:840, note:"Trail debut. HR 192 all-time max. Fast training 10K."},
  {name:"SBI Green 10K",       date:"Nov 30 '25",dist:"10.14 km",time:"1:03:09",pace:"6:14/km",hr:"175/187",elev:"+111m",temp:"~22°C",color:C.mut,   status:"done",kcal:760, note:"Season benchmark. Km 4 surge → km 7 blowup. Key lessons."},
  {name:"Bengaluru Ultra 25K", date:"Dec 21 '25",dist:"25.04 km",time:"3:12:04",pace:"7:40/km",hr:"161/188",elev:"+169m",temp:"~20°C",color:C.yellow,status:"done",kcal:2582,note:"Longest race ever. 169m elev, 3h12m. Massive aerobic base."},
  {name:"Karnataka Police Run",date:"Mar 1 '26", dist:"10.02 km",time:"58:53",  pace:"5:53/km",hr:"180/190",elev:"+39m", temp:"~24°C",color:C.green, status:"done",kcal:889, note:"Season opener. Sub-60 smashed. PR by 4:16. 57% in Z5."},
  {name:"Namma Power Run",     date:"Mar 15 '26",dist:"10K",     time:"Target 57:30",pace:"5:45/km",hr:"—",  elev:"+90m", temp:"~33°C",color:C.sky,   status:"next",kcal:"~870",note:"NICE Road. Double climb. 5 days out."},
  {name:"TCS World 10K",       date:"Apr 26 '26",dist:"10K",     time:"Target 54:50",pace:"5:29/km",hr:"—",  elev:"+50m", temp:"~32°C",color:C.indigo,status:"goal",kcal:"~850",note:"Season goal. Sub-55 = redemption complete."},
];
const ACTIVITY_LOG = [
  {date:"Mar 10",name:"Shakeout + 4 Strides",km:6.57, time:"46:43",pace:"7:07",hr:153,tl:131,gear:"Novablast 5",tag:"STRIDES"},
  {date:"Mar 9", name:"Morning Run",          km:5.15, time:"31:00",pace:"6:01",hr:171,tl:153,gear:"Nimbus 27",  tag:"TEMPO"},
  {date:"Mar 7", name:"NICE Road Long Run",   km:14.08,time:"1:40:20",pace:"7:08",hr:159,tl:353,gear:"Novablast 5",tag:"LONG"},
  {date:"Mar 5", name:"Evening Run",          km:8.21, time:"1:00:00",pace:"7:19",hr:162,tl:197,gear:"Nimbus 27",  tag:"EASY"},
  {date:"Mar 4", name:"Evening Slow Run",     km:7.02, time:"51:56",pace:"7:24",hr:155,tl:165,gear:"Novablast 5",tag:"EASY"},
  {date:"Mar 1", name:"Karnataka Police Run", km:10.02,time:"58:53",pace:"5:53",hr:180,tl:336,gear:"Novablast 5",tag:"RACE"},
  {date:"Feb 27",name:"Evening Training",     km:10.05,time:"1:21:00",pace:"8:04",hr:148,tl:198,gear:"Nimbus 27", tag:"EASY"},
  {date:"Feb 26",name:"Evening Slow Run",     km:10.04,time:"1:15:00",pace:"7:28",hr:155,tl:189,gear:"Novablast 5",tag:"LONG"},
  {date:"Feb 25",name:"Morning Run",          km:9.07, time:"1:15:00",pace:"8:16",hr:149,tl:175,gear:"Nimbus 27", tag:"EASY"},
  {date:"Feb 24",name:"Morning Run",          km:9.01, time:"1:10:00",pace:"7:46",hr:155,tl:181,gear:"Nimbus 27", tag:"EASY"},
  {date:"Feb 20",name:"Strides Session",      km:6.52, time:"53:42",pace:"8:14",hr:142,tl:130,gear:"Novablast 5",tag:"STRIDES"},
  {date:"Feb 19",name:"Evening Run",          km:10.15,time:"1:13:00",pace:"7:11",hr:161,tl:221,gear:"Nimbus 27", tag:"LONG"},
];
const HR_ZONES = [
  {z:"Z1",name:"Recovery",  bpm:"0–118",  pct:4, hrs:"6.2h",  c:"#1E3A5F"},
  {z:"Z2",name:"Aerobic",   bpm:"118–147",pct:18,hrs:"27.8h", c:C.green  },
  {z:"Z3",name:"Tempo",     bpm:"147–162",pct:24,hrs:"37.1h", c:C.yellow },
  {z:"Z4",name:"Threshold", bpm:"162–177",pct:37,hrs:"57.2h", c:C.blue   },
  {z:"Z5",name:"Max",       bpm:"177+",   pct:17,hrs:"26.3h", c:C.indigo },
];
const CLUBS = [
  {name:"Bengaluru Runners",        n:13267,  local:true,  icon:"🏃"},
  {name:"ODONA BANNI",              n:1204,   local:true,  icon:"🏃"},
  {name:"Doddakallasandra Runners", n:30,     local:true,  icon:"🏃"},
  {name:"2026 TCS World 10K",       n:1859,   local:true,  icon:"🏅"},
  {name:"Red Bull India",           n:45417,  local:false, icon:"⚡"},
  {name:"The Strava Club",          n:6864548,local:false, icon:"📱"},
];
const RACE_PHOTOS = [
  "https://dgtzuqphqg23d.cloudfront.net/vxKiGn2oacikweuoUL6yH9DUXfycHTzayJZRHNTG0m0-768x576.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/II20MgiGijGy_lyVGhq7aHQ1-D8gVd-EgNMlphYE0mk-576x768.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/zDiERLmR--Ct0HfiMArXUUpc_UT1s8FQdAYjurCibYU-768x576.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/YyOPrZ7I5cLQIgm0fjK-RAtl3N-Ta64XbiNqZlnLVoI-576x768.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/Yekpedx4fhIPOlthemrgoA4QFB2BCVyX1nVyMFEz2mw-576x768.jpg",
];

const tagColor = t=>({RACE:C.red,TEMPO:C.orange,LONG:C.indigo,STRIDES:C.green,EASY:C.sky,ULTRA:C.yellow,TRAIL:C.cyan}[t]||C.mut);
const fmtPace = p=>{const m=Math.floor(p);const s=Math.round((p-m)*60);return`${m}:${s<10?"0"+s:s}`;};
const fmtK = n=>n>=1000?`${(n/1000).toFixed(1)}K`:`${n}`;

/* ════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════ */

/* — Photo Gallery — */
function PhotoGallery(){
  const [active,setActive]=useState(0);
  return(
    <div>
      <div style={{height:240,overflow:"hidden",position:"relative",background:"#000"}}>
        <img src={RACE_PHOTOS[active]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.85}}
          onError={e=>{e.target.style.display="none"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,8,16,0.88) 0%,transparent 50%)"}}/>
        <div style={{position:"absolute",bottom:14,left:18}}>
          <div style={{fontSize:9,color:C.green,fontFamily:F.m,fontWeight:700,letterSpacing:"0.15em",marginBottom:4}}>📸 KARNATAKA POLICE RUN · MAR 1, 2026</div>
          <div style={{fontSize:24,fontFamily:F.h,color:C.white,fontWeight:700,letterSpacing:"1px"}}>{active+1} / {RACE_PHOTOS.length}</div>
        </div>
        {[-1,1].map(d=>(
          <button key={d} onClick={()=>setActive(a=>(a+d+RACE_PHOTOS.length)%RACE_PHOTOS.length)}
            style={{position:"absolute",top:"50%",transform:"translateY(-50%)",
              [d<0?"left":"right"]:12,background:"rgba(0,0,0,0.5)",
              border:`1px solid ${C.bdr2}`,color:C.white,width:34,height:34,
              borderRadius:"50%",fontSize:13,cursor:"pointer",display:"flex",
              alignItems:"center",justifyContent:"center"}}>
            {d<0?"◀":"▶"}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:3,padding:3,background:C.bg}}>
        {RACE_PHOTOS.map((p,i)=>(
          <div key={i} onClick={()=>setActive(i)} style={{flex:1,height:48,overflow:"hidden",
            cursor:"pointer",border:`2px solid ${i===active?C.blue:"transparent"}`,
            borderRadius:4,opacity:i===active?1:0.45,transition:"opacity .2s"}}>
            <img src={p} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}
              onError={e=>{e.target.parentElement.style.background=C.card}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* — Namma elevation SVG — */
function NammaElevSVG(){
  const W=560,H=80,pad=10,mx=Math.max(...NAMMA_ELEV),n=NAMMA_ELEV.length;
  const pts=NAMMA_ELEV.map((v,i)=>[pad+(i/(n-1))*(W-2*pad),H-pad-(v/mx)*(H-2*pad)]);
  return(
    <svg viewBox={`0 0 ${W} ${H+18}`} style={{width:"100%",height:"auto"}}>
      <defs><linearGradient id="ne" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.sky} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={C.sky} stopOpacity="0.03"/>
      </linearGradient></defs>
      {[[8,18],[38,50]].map(([s,e],i)=>{
        const x1=pad+(s/(n-1))*(W-2*pad),x2=pad+(e/(n-1))*(W-2*pad);
        return <rect key={i} x={x1} y={pad} width={x2-x1} height={H-2*pad} fill={C.indigo} opacity=".12" rx="2"/>;
      })}
      <path d={`M ${pad},${H-pad} L ${pts.map(p=>p.join(",")).join(" L ")} L ${W-pad},${H-pad} Z`} fill="url(#ne)"/>
      <path d={`M ${pts.map(p=>p.join(",")).join(" L ")}`} fill="none" stroke={C.sky} strokeWidth="2" strokeLinejoin="round"/>
      {[0,2.5,5,7.5,10].map((km,i)=>(
        <text key={km} x={pad+(i/4)*(W-2*pad)} y={H+14} textAnchor="middle" fill={C.mut} fontSize="9" fontFamily="monospace">{km}km</text>
      ))}
    </svg>
  );
}

/* — SBI Analysis content — */
function SBIContent(){
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
        <SLabel children="Km-by-Km Blueprint" col={C.sky}/>
        {sbiKmData.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",
            borderBottom:i<sbiKmData.length-1?`1px solid ${C.bdr}`:"none"}}>
            <div style={{width:38,fontSize:13,fontFamily:F.h,color:d.flag?C.red:C.sec,fontWeight:700,flexShrink:0}}>{d.km}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontFamily:F.h,color:C.white}}>{fmtPace(d.pace)}/km</span>
                <span style={{fontSize:11,color:d.hr>178?C.red:d.hr>170?C.orange:C.sec,fontFamily:F.b}}>❤️ {d.hr}</span>
              </div>
              <div style={{height:4,background:C.bdr,borderRadius:2}}>
                <div style={{height:"100%",width:`${Math.min(100,d.elev>0?d.elev/30*100:5)}%`,
                  background:d.elev>20?C.red:d.elev>0?C.orange:C.green,borderRadius:2}}/>
              </div>
            </div>
            {d.flag&&<div style={{width:22,height:22,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,flexShrink:0}}>⚠</div>}
          </div>
        ))}
      </div>
      <div style={{background:"rgba(248,113,113,0.06)",border:`1px solid ${C.red}33`,borderRadius:12,padding:14,marginBottom:12}}>
        <SLabel children="3 Mistakes at SBI" col={C.red}/>
        {[["Km 4 surge (5:18)","Ran 30+ sec/km faster than the rest. Burned matches early."],
          ["Km 7 blowup (7:05)","Direct consequence of km 4. HR hit 182+ on the climb."],
          ["Km 8 power collapse (198W)","Lowest wattage of the race. Tank was empty."]].map(([t,d],i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<2?`1px solid ${C.bdr}`:"none"}}>
            <span style={{color:C.red,fontWeight:700,fontFamily:F.b,minWidth:22}}>#{i+1}</span>
            <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
            <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
          </div>
        ))}
      </div>
      <div style={{background:`rgba(96,165,250,0.06)`,border:`1px solid ${C.sky}33`,borderRadius:12,padding:14}}>
        <SLabel children="The One Rule for Namma" col={C.sky}/>
        <div style={{fontSize:16,fontWeight:700,color:C.white,lineHeight:1.5,fontFamily:F.b}}>
          "At km 4, do NOT run faster than 5:50/km — no matter how good you feel."
        </div>
        <div style={{marginTop:10,display:"flex",justifyContent:"space-between",
          padding:"10px 14px",background:C.faint,borderRadius:8}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontFamily:F.h,color:C.red}}>63:09</div><div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>SBI (mistakes)</div></div>
          <div style={{fontSize:20,color:C.mut,alignSelf:"center"}}>→</div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontFamily:F.h,color:C.sky}}>58:30</div><div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>Namma (fixed)</div></div>
          <div style={{fontSize:20,color:C.mut,alignSelf:"center"}}>→</div>
          <div style={{textAlign:"center"}}><div style={{fontSize:18,fontFamily:F.h,color:C.indigo}}>54:50</div><div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>TCS (goal)</div></div>
        </div>
      </div>
    </div>
  );
}

/* — Police Run component — */
function PoliceRun(){
  const [tab,setTab]=useState(0);
  const tabs=["Race Stats","Heart Rate","Pace Analysis","Takeaways"];
  const accent=C.police;
  return(
    <>
      <div style={{background:"#081410",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>COMPLETED — Mar 1, 2026 · Bengaluru</span>
          <div style={{marginLeft:"auto",background:"#0D2010",border:`1px solid ${accent}44`,borderRadius:20,
            padding:"2px 10px",fontSize:10,color:accent,fontWeight:700,fontFamily:F.b}}>✓ SUB-60 ACHIEVED</div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 6px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[["🏁","Distance","10.02 km"],["⏱","Official Time","58:53"],["⚡","Avg Pace","5:53/km"],
                ["❤️","Avg HR","180 bpm"],["🔥","Max HR","190 bpm"],["💪","Power","228W NP"]].map(([ic,l,v])=>(
                <div key={l} style={{background:C.faint,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:15,marginBottom:4}}>{ic}</div>
                  <div style={{fontSize:16,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{v}</div>
                  <div style={{fontSize:9,color:C.mut,fontFamily:F.b,textTransform:"uppercase",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.card,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
              <SLabel children="HR Zone Distribution" col={accent}/>
              {policeZones.map((z,i)=>(
                <div key={z.zone} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i<4?8:0}}>
                  <span style={{width:22,fontSize:11,fontFamily:F.h,color:z.color,fontWeight:700}}>{z.zone}</span>
                  <div style={{flex:1,height:6,background:C.bdr,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${z.pct}%`,background:z.color,borderRadius:3}}/>
                  </div>
                  <span style={{width:28,textAlign:"right",fontSize:12,fontFamily:F.h,color:z.color}}>{z.pct}%</span>
                  <span style={{width:55,fontSize:10,color:C.mut,fontFamily:F.b}}>{z.bpm}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab===1&&(
          <div>
            <SLabel children="Heart Rate · Full Race" col={accent}/>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={policeHRData} margin={{left:0,right:0,top:4,bottom:0}}>
                <defs><linearGradient id="phr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={accent} stopOpacity={0.02}/>
                </linearGradient></defs>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[110,195]} hide/>
                <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"5px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.sec}}>{payload[0].payload.d}km</div><div style={{color:accent}}>{payload[0].value} bpm</div></div>);}}/>
                <ReferenceLine y={180} stroke={accent} strokeDasharray="3 3" strokeOpacity={0.4}/>
                <Area type="monotone" dataKey="hr" stroke={accent} strokeWidth={2} fill="url(#phr)" dot={false} activeDot={{r:3,fill:accent}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {tab===2&&(
          <div>
            <SLabel children="Pace per Km" col={accent}/>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={policePaceData} barSize={28}>
                <XAxis dataKey="km" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`km ${v}`}/>
                <YAxis hide domain={[5.5,6.3]}/>
                <Tooltip content={({active,payload,label})=>{if(!active||!payload?.length)return null;const d=policePaceData.find(p=>p.km===label);return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"7px 12px",fontSize:12,fontFamily:F.b}}><div style={{color:C.sec}}>Km {label}</div><div style={{color:accent}}>{fmtPace(payload[0].value)}/km</div><div style={{color:C.pink}}>HR {d?.hr} bpm</div></div>);}}/>
                <ReferenceLine y={5.88} stroke={accent} strokeDasharray="3 3" strokeOpacity={0.5}/>
                <Bar dataKey="pace" radius={[4,4,0,0]}>{policePaceData.map((d,i)=><Cell key={i} fill={d.pace<5.9?accent:d.pace<6.0?C.sky:C.mut}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:12}}>
              <SLabel children="What Worked ✅" col={accent}/>
              {[["Even splits","First 5km: 29:15 · Second 5km: 29:38. Only 23 sec positive split — textbook."],
                ["Power output","228W Normalized Power. Highest ever race watt. Cardio aerobic base is there."],
                ["Race execution","Started controlled, built pace, finished strong. HR management excellent."]].map(([t,d],i,arr)=>(
                <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                  <span style={{fontSize:16,width:20}}>✅</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14}}>
              <SLabel children="Season Progression"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[["Police Run","58:53","✓ Done",C.police],["Namma Power","57:30","Mar 15",C.namma],["TCS Open","54:50","Apr 26",C.tcs]].map(([r,t,d,col])=>(
                  <div key={r} style={{background:C.faint,borderRadius:8,padding:10,textAlign:"center",border:`1px solid ${col}44`}}>
                    <div style={{fontSize:10,color:col,fontFamily:F.b,fontWeight:600,marginBottom:3}}>{r}</div>
                    <div style={{fontSize:19,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{t}</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10,height:5,background:C.bdr,borderRadius:3}}>
                <div style={{height:"100%",width:"33%",background:`linear-gradient(to right,${C.police},${C.namma})`,borderRadius:3}}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* — Namma Run component — */
function NammaRun(){
  const [tab,setTab]=useState(0);
  const tabs=["Race Plan","SBI Analysis","Route & Elev","Training Week","Race Morning"];
  const accent=C.namma;
  return(
    <>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 6px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
              <SLabel children="Km-by-Km Race Strategy"/>
              {nammaSegs.map((s,i)=>(
                <div key={i} style={{background:C.faint,borderRadius:10,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${s.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:13,fontWeight:700,color:s.color,minWidth:78,fontFamily:F.h,letterSpacing:"0.3px"}}>{s.km}</span>
                      <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{s.terrain}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontFamily:F.h,color:C.white}}>{s.pace}/km</div>
                      <div style={{fontSize:11,color:C.mut}}>HR {s.hr}</div>
                    </div>
                  </div>
                  <IBar val={s.intensity} color={s.color}/>
                  {sp(5)}
                  <div style={{fontSize:12,color:C.sec,lineHeight:1.6,fontFamily:F.b}}>{s.tip}</div>
                </div>
              ))}
            </div>
            <div style={{background:`rgba(96,165,250,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
              <SLabel children="⚡ Mental Cue — Km 7–8" col={accent}/>
              <div style={{fontSize:16,fontWeight:700,color:C.white,lineHeight:1.5,fontFamily:F.b}}>"Shorten stride. Keep cadence 88+. Keep moving."</div>
              <div style={{fontSize:12,color:C.sec,marginTop:8,lineHeight:1.6,fontFamily:F.b}}>Your HR will be 182–185. Every other runner feels the same. The ones who hold form here win.</div>
            </div>
          </div>
        )}
        {tab===1&&<SBIContent/>}
        {tab===2&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
              <SLabel children="NICE Road Elevation Profile (Out & Back)"/>
              <NammaElevSVG/>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
              <SLabel children="Route Facts"/>
              {[["📍","Start/Finish","Hoskerehalli Toll Junction, NICE Road"],["↕️","Key Climb","0.83km at 5.7% avg grade, max 13%"],["🔄","Format","Out-and-back — climb appears twice"],["🌡️","Weather","~33°C at 6am start · Heats up fast"]].map(([ic,l,v],i,arr)=>(
                <div key={l} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                  <span style={{fontSize:18}}>{ic}</span>
                  <div><div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,fontFamily:F.b}}>{l}</div>
                  <div style={{fontSize:13,color:C.pri,marginTop:2,fontFamily:F.b}}>{v}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab===3&&(
          <div>
            {nammaTraining.map((day,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8,padding:"12px 14px",
                background:day.isRace?`rgba(96,165,250,0.06)`:day.done?`rgba(52,211,153,0.04)`:C.card,
                border:`1px solid ${day.isRace?accent+"55":day.done?day.light+"44":C.bdr}`,
                borderRadius:10,borderLeft:`3px solid ${day.light}`,opacity:(!day.done&&!day.isRace&&i>4)?.72:1}}>
                <div style={{fontSize:20,lineHeight:1,paddingTop:2}}>{day.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:15,fontWeight:700,color:day.light,fontFamily:F.h,letterSpacing:"0.5px"}}>{day.label}</span>
                      {day.done&&<Pill c={C.green}>✓ Done</Pill>}
                      {day.isRace&&<Pill c={accent}>Race Day</Pill>}
                    </div>
                    <span style={{fontSize:11,color:C.mut,fontFamily:F.b}}>{day.date}</span>
                  </div>
                  <div style={{fontSize:12,color:day.done?"#86EFAC88":C.sec,marginTop:2,lineHeight:1.6,fontFamily:F.b}}>{day.desc}</div>
                </div>
              </div>
            ))}
            <div style={{background:`rgba(52,211,153,0.05)`,border:`1px solid ${C.green}33`,borderRadius:12,padding:12,marginTop:4}}>
              <div style={{fontSize:12,color:"#86EFAC",fontFamily:F.b,lineHeight:1.7}}>
                📊 <strong>Week progress: 5/9 done</strong> · <strong style={{color:C.white}}>25.8km</strong> running + 2 badminton · <strong style={{color:C.green}}>✅ HR trending down — legs recovering</strong> · <strong style={{color:C.white}}>5 days to race</strong>. Next: 🛌 full rest Wed.
              </div>
            </div>
          </div>
        )}
        {tab===4&&(
          <div>
            <SLabel children="Mar 15 Morning Timeline"/>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:52,top:16,bottom:16,width:1,background:`linear-gradient(to bottom,${accent}44,${accent},${accent}44)`}}/>
              {[{t:"4:45 AM",a:"Wake Up",ic:"💧",d:"Drink 400ml water immediately.",fire:false},
                {t:"5:00 AM",a:"Pre-race Fuel",ic:"🍌",d:"2 bananas + pinch of salt in 200ml water.",fire:false},
                {t:"5:20 AM",a:"Leave Home",ic:"🚗",d:"Arrive early. Beat traffic, beat heat.",fire:false},
                {t:"5:40 AM",a:"Dynamic Warmup",ic:"🤸",d:"Leg swings → hip circles → high knees → A-skips.",fire:false},
                {t:"5:50 AM",a:"Race Strides",ic:"⚡",d:"80m × 2 at 5:50/km.",fire:false},
                {t:"5:55 AM",a:"Seed Yourself",ic:"🏁",d:"58–60 min pace group. Don't go to the front.",fire:false},
                {t:"6:00 AM",a:"🏅 RACE START",ic:"🔥",d:"Namma Power Run 2026.",fire:true},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14,position:"relative"}}>
                  <div style={{width:52,textAlign:"right",fontSize:11,color:C.sec,fontWeight:600,paddingTop:8,flexShrink:0,fontFamily:F.b}}>{item.t}</div>
                  <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,zIndex:1,marginTop:6,
                    background:item.fire?accent:C.bdr2,border:`2px solid ${item.fire?accent:"#334155"}`,
                    boxShadow:item.fire?`0 0 14px ${accent}88`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {item.fire&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                  <div style={{flex:1,background:item.fire?`rgba(96,165,250,0.08)`:C.card,
                    border:`1px solid ${item.fire?accent+"44":C.bdr}`,borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:13,fontWeight:700,color:item.fire?accent:C.pri,fontFamily:F.h,letterSpacing:"0.5px"}}>{item.ic} {item.a.toUpperCase()}</div>
                    <div style={{fontSize:12,color:C.mut,marginTop:3,lineHeight:1.6,fontFamily:F.b}}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* — TCS Run component — */
function TCSRun(){
  const [tab,setTab]=useState(0);
  const [hovWk,setHovWk]=useState(null);
  const tabs=["Km Breakdown","Elevation","6-Week Plan","Race Morning"];
  const accent=C.tcs;
  return(
    <>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 6px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(
          <div>
            {tcsKms.map((km,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:10,
                padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${km.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:700,color:km.color,minWidth:52,fontFamily:F.h}}>{km.km}</span>
                    <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{km.terrain}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontFamily:F.h,color:C.white}}>{km.pace}/km</div>
                    <div style={{fontSize:11,color:C.mut}}>HR ~{km.hr}</div>
                  </div>
                </div>
                <IBar val={km.intensity} color={km.color} h={5}/>
                {sp(6)}
                <div style={{display:"flex",gap:12}}>
                  <div style={{fontSize:11,color:km.elev>0?C.red:km.elev<0?C.green:C.mut,fontFamily:F.b}}>
                    {km.elev>0?`+${km.elev}m ↑`:km.elev<0?`${km.elev}m ↓`:"Flat"}
                  </div>
                </div>
                <div style={{fontSize:12,color:C.sec,marginTop:6,lineHeight:1.6,fontFamily:F.b}}>💬 {km.tip}</div>
              </div>
            ))}
          </div>
        )}
        {tab===1&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
              <SLabel children="Elevation Profile — TCS Course"/>
              <div style={{fontSize:11,color:C.mut,marginBottom:10,fontFamily:F.b}}>826m–908m range · +50m total gain · Max grade 7.5%</div>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={tcsElev} margin={{left:0,right:0,top:8,bottom:0}}>
                  <defs><linearGradient id="te" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={accent} stopOpacity={0.02}/>
                  </linearGradient></defs>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                  <YAxis domain={[880,915]} tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}m`} width={36}/>
                  <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d=payload[0].payload;return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white}}>{d.d}km</div><div style={{color:accent}}>Alt: {d.alt}m</div><div style={{color:d.grade>1?C.red:d.grade<-.5?C.green:C.sec}}>{d.grade>0?"+":""}{d.grade}%</div></div>);}}/>
                  <ReferenceLine x={4.3} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <ReferenceLine x={5.0} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <Area type="monotone" dataKey="alt" stroke={accent} strokeWidth={2.5} fill="url(#te)" dot={false} activeDot={{r:4,fill:accent}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
              <SLabel children="Grade % Per Section"/>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={tcsElev} barSize={7}>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                  <YAxis domain={[-2,3]} hide/>
                  <ReferenceLine y={0} stroke={C.bdr2} strokeWidth={1}/>
                  <Bar dataKey="grade" radius={[2,2,0,0]}>{tcsElev.map((d,i)=><Cell key={i} fill={d.grade>1.5?C.red:d.grade>.3?C.orange:d.grade<-.5?C.green:C.bdr2}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {tab===2&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
              <SLabel children="6-Week Volume (km/week)"/>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={tcsWeeks} barSize={36}>
                  <XAxis dataKey="week" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const d=payload[0].payload;return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"8px 12px",fontSize:12,fontFamily:F.b}}><div style={{color:d.color,fontWeight:700}}>{d.label}</div><div style={{color:C.sec}}>{d.km} km · {d.dates}</div></div>);}}/>
                  <Bar dataKey="km" radius={[5,5,0,0]}>{tcsWeeks.map((w,i)=><Cell key={i} fill={hovWk===i?w.color:w.color+"88"}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {tcsWeeks.map((wk,i)=>(
              <div key={i} onMouseEnter={()=>setHovWk(i)} onMouseLeave={()=>setHovWk(null)}
                style={{background:C.card,border:`1px solid ${hovWk===i?wk.color+"44":C.bdr}`,
                  borderLeft:`3px solid ${wk.color}`,borderRadius:10,padding:12,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                  <div><span style={{fontSize:15,fontWeight:700,color:wk.color,fontFamily:F.h,marginRight:8}}>{wk.week}</span>
                    <span style={{fontSize:13,fontWeight:600,color:C.pri,fontFamily:F.b}}>{wk.label}</span></div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:18,fontFamily:F.h,color:C.white}}>{wk.km}km</span>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{wk.dates}</div></div>
                </div>
                <div style={{marginTop:6}}><IBar val={wk.intensity} color={wk.color}/></div>
              </div>
            ))}
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginBottom:12}}>
              <SLabel children="Apr 26 Morning Timeline"/>
              {[{t:"4:30 AM",a:"Wake Up",      d:"400ml water. Light stretch."},
                {t:"5:00 AM",a:"Pre-race Fuel", d:"2 bananas + salt water. Oats optional."},
                {t:"5:45 AM",a:"Leave Home",    d:"Cubbon Park area. Arrive 6:00 AM."},
                {t:"6:00 AM",a:"Dynamic Warmup",d:"Leg swings, A-skips, short strides."},
                {t:"6:10 AM",a:"WAVE START",    d:"TCS World 10K 2026. Target: Sub-55:00."},
              ].map((it,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",
                  borderBottom:i<4?`1px solid ${C.bdr}`:"none"}}>
                  <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{it.a}</div>
                    <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:`rgba(129,140,248,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
              <SLabel children="BIB Info" col={accent}/>
              <div style={{fontSize:13,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
                Apr 23–24 at <strong style={{color:C.white}}>Get Active Expo</strong> · Submit Namma result for wave seeding.
                Register under Open category. Aim for the 55–60 min wave. Wear COROS and Novablast 5.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════
   ROOT APP
════════════════════════════════════════ */
const TOP_TABS = ["TODAY","RACES","SEASON","LOG","STATS","PROFILE"];
const RACE_SWITCHER = [
  {id:0,short:"Police Run",  sub:"Mar 1 · Done",   badge:"✓ COMPLETED",  accent:C.police,bgGrad:"linear-gradient(135deg,#060F0A,#081208)",target:"58:53",pace:"5:53/km",
   stats:[["🏁","Distance","10.02 km"],["⏱","Time","58:53"],["❤️","Avg HR","180"],["💪","Power","228W"]]},
  {id:1,short:"Namma Power", sub:"Mar 15 · 5 days", badge:"⚡ 5 DAYS OUT",  accent:C.namma, bgGrad:"linear-gradient(135deg,#060A18,#08101A)",target:"57:30",pace:"5:45/km",
   stats:[["📅","Date","Mar 15"],["📍","Course","NICE Road"],["⛰","Elev","+90m"],["🌡","Temp","~33°C"]]},
  {id:2,short:"TCS Open",    sub:"Apr 26 · Goal",   badge:"🎯 GOAL RACE",   accent:C.tcs,   bgGrad:"linear-gradient(135deg,#060A18,#080A1A)",target:"54:50",pace:"5:29/km",
   stats:[["📅","Date","Apr 26"],["📍","Course","Cubbon Rd"],["⛰","Elev","+50m"],["🌡","Temp","~32°C"]]},
];

export default function App(){
  const [topTab,setTopTab] = useState(0);
  const [race,setRace]     = useState(0);
  const r = RACE_SWITCHER[race];

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.pri,fontFamily:F.b,maxWidth:800,margin:"0 auto",paddingBottom:48,
      backgroundImage:"radial-gradient(ellipse 70% 40% at 100% 0%,rgba(61,139,248,0.06),transparent),radial-gradient(ellipse 50% 40% at 0% 80%,rgba(129,140,248,0.04),transparent)"}}>

      {/* ── HERO HEADER ── */}
      <div style={{background:"linear-gradient(160deg,#060A14 0%,#0A1028 60%,#060C10 100%)",
        padding:"26px 20px 0",borderBottom:`1px solid ${C.bdr}`,position:"relative",overflow:"hidden"}}>
        {/* Grid texture */}
        <div style={{position:"absolute",inset:0,opacity:0.025,
          backgroundImage:"linear-gradient(rgba(96,165,250,1) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,1) 1px,transparent 1px)",
          backgroundSize:"36px 36px"}}/>
        {/* Glow */}
        <div style={{position:"absolute",top:-80,right:-80,width:240,height:240,borderRadius:"50%",
          background:"rgba(61,139,248,0.1)",filter:"blur(70px)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:10,color:C.blue,fontFamily:F.m,fontWeight:700,letterSpacing:"0.2em",marginBottom:10}}>
            ● ATHLETE · STRAVA #99703920 · 2026 SEASON
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:20}}>
            <div>
              <h1 style={{margin:0,fontFamily:F.h,fontSize:52,lineHeight:.88,letterSpacing:"2px",color:C.white,marginBottom:8}}>
                SACHIN<br/>
                <span style={{WebkitTextStroke:`1.5px ${C.blue}`,WebkitTextFillColor:"transparent",color:"transparent"}}>K G</span>
              </h1>
              <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>📍 Bangalore, Karnataka · ♂ 75 kg · ASICS · COROS · Strava Summit</div>
            </div>
            {/* VO2 badge */}
            <div style={{background:"rgba(61,139,248,0.08)",border:`1px solid ${C.blue}33`,borderRadius:14,
              padding:"14px 20px",textAlign:"center",flexShrink:0,boxShadow:`0 0 40px rgba(61,139,248,0.1)`}}>
              <div style={{fontSize:9,color:C.blue,fontFamily:F.m,fontWeight:700,letterSpacing:"0.15em",marginBottom:2}}>VO₂ MAX</div>
              <div style={{fontSize:42,fontFamily:F.h,fontWeight:900,color:C.white,lineHeight:1,letterSpacing:"1px"}}>~38</div>
              <div style={{fontSize:9,color:C.sec,fontFamily:F.b}}>mL/kg/min · Fair→Good</div>
            </div>
          </div>
          {/* KPI strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,borderTop:`1px solid ${C.bdr}`,borderLeft:`1px solid ${C.bdr}`}}>
            {[
              {v:"57",   s:"",    l:"Season Runs",   sub:"Nov–Mar",   c:C.blue  },
              {v:"460",  s:"km",  l:"Season Volume", sub:"5 months",  c:C.sky   },
              {v:"58:53",s:"",    l:"10K PR",        sub:"Mar 1 2026",c:C.green },
              {v:"25",   s:"km",  l:"Longest Race",  sub:"Ultra Dec", c:C.yellow},
              {v:"100",  s:"",    l:"All-Time Runs", sub:"Since 2022",c:C.indigo},
            ].map(k=>(
              <div key={k.l} style={{padding:"12px 8px",textAlign:"center",borderRight:`1px solid ${C.bdr}`,borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:20,fontFamily:F.h,fontWeight:900,color:k.c,letterSpacing:"0.5px",lineHeight:1}}>
                  {k.v}<span style={{fontSize:11}}>{k.s}</span>
                </div>
                <div style={{fontSize:10,color:C.white,fontFamily:F.b,fontWeight:600,marginTop:4}}>{k.l}</div>
                <div style={{fontSize:9,color:C.mut,fontFamily:F.b,marginTop:1}}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STICKY TOP NAV ── */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(5,8,16,0.95)",
        backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.bdr}`,display:"flex",overflowX:"auto"}}>
        {TOP_TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTopTab(i)} style={{flex:1,padding:"13px 4px",background:"transparent",
            border:"none",borderBottom:`2px solid ${topTab===i?C.blue:"transparent"}`,
            color:topTab===i?C.blue:C.mut,fontSize:11,fontFamily:F.h,fontWeight:700,
            letterSpacing:"0.12em",cursor:"pointer",textTransform:"uppercase",
            whiteSpace:"nowrap",transition:"color 0.15s"}}>{t}</button>
        ))}
      </div>

      {/* ══════════════════════════
          TAB: TODAY
      ══════════════════════════ */}
      {topTab===0&&(
        <div>
          {/* Latest run card */}
          <div style={{background:"linear-gradient(135deg,#070A18,#080C1A)",borderBottom:`1px solid ${C.blue}22`,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 90% 10%,rgba(61,139,248,0.08) 0%,transparent 50%)`}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:C.blue,boxShadow:`0 0 8px ${C.blue}`}}/>
                    <span style={{fontSize:11,color:C.blue,fontWeight:700,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.12em"}}>Latest Run · Today</span>
                    <Pill c={C.blue}>Mar 10</Pill>
                    <Pill c={C.green}>⚡ Strides</Pill>
                  </div>
                  <div style={{fontSize:20,fontFamily:F.h,letterSpacing:"1px",color:C.white}}>SHAKEOUT + 4 STRIDES 💨</div>
                  <div style={{fontSize:11,color:C.mut,fontFamily:F.b,marginTop:2}}>5 days to Namma Power Run · 👟 Novablast 5</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:28,fontFamily:F.h,color:C.blue,letterSpacing:"1px",lineHeight:1}}>6.57<span style={{fontSize:14,color:C.mut}}> km</span></div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>46:43 · 7:07/km</div>
                </div>
              </div>
              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
                {[["❤️","Avg HR","153"],["📈","Max HR","173"],["⚡","Power","188W"],["💨","Top Speed","16.9 km/h"],["🔥","Calories","537"]].map(([ic,l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${C.bdr}`,borderRadius:8,padding:"7px 5px",textAlign:"center"}}>
                    <div style={{fontSize:13,marginBottom:2}}>{ic}</div>
                    <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.h,letterSpacing:"0.3px"}}>{v}</div>
                    <div style={{fontSize:9,color:C.mut,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Strides breakdown */}
              <div style={{fontSize:10,color:C.mut,marginBottom:6,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.1em"}}>Stride Breakdown · 4×80m</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:12}}>
                {[{n:"S1",speed:"12.8",cad:88,hr:160,color:C.green},{n:"S2",speed:"10.7",cad:86,hr:167,color:C.green},{n:"S3",speed:"15.8",cad:91,hr:168,color:C.yellow},{n:"S4",speed:"11.1",cad:85,hr:173,color:C.yellow}].map(s=>(
                  <div key={s.n} style={{background:C.faint,border:`1px solid ${s.color}33`,borderRadius:8,padding:"7px 8px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:s.color,fontWeight:700,fontFamily:F.h,marginBottom:3}}>{s.n}</div>
                    <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.h}}>{s.speed}<span style={{fontSize:9,color:C.mut}}> km/h</span></div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>cad {s.cad} · {s.hr}bpm</div>
                  </div>
                ))}
              </div>
              {/* HR chart */}
              <div style={{fontSize:10,color:C.mut,marginBottom:6,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.1em"}}>Heart Rate · Distance</div>
              <ResponsiveContainer width="100%" height={68}>
                <AreaChart data={latestRunHR} margin={{left:0,right:0,top:4,bottom:0}}>
                  <defs><linearGradient id="lrg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.blue} stopOpacity={0.4}/>
                    <stop offset="100%" stopColor={C.blue} stopOpacity={0.02}/>
                  </linearGradient></defs>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`} ticks={[0,1.5,3,4.5,6,6.57]}/>
                  <YAxis domain={[90,180]} hide/>
                  <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"5px 10px",fontSize:11,fontFamily:F.b}}><div style={{color:C.sec}}>{payload[0].payload.d}km</div><div style={{color:C.blue}}>{payload[0].value} bpm</div></div>);}}/>
                  <ReferenceLine y={153} stroke={C.blue} strokeDasharray="3 3" strokeOpacity={0.4}/>
                  <Area type="monotone" dataKey="hr" stroke={C.blue} strokeWidth={2} fill="url(#lrg)" dot={false} activeDot={{r:3,fill:C.blue}}/>
                </AreaChart>
              </ResponsiveContainer>
              <div style={{marginTop:10,padding:"9px 12px",background:"rgba(52,211,153,0.06)",borderRadius:8,border:`1px solid ${C.green}33`}}>
                <div style={{fontSize:12,color:"#86EFAC",lineHeight:1.6,fontFamily:F.b}}>
                  ✅ <strong>Coach:</strong> 30-min easy base (HR 149 — Z2!) + 4 strides hitting <strong style={{color:C.white}}>16.9 km/h & cadence 91 spm</strong>. HR down 171→153 from yesterday. <strong style={{color:C.green}}>5 days out: perfect execution. Tomorrow — full rest.</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Weather strip */}
          <div style={{background:"linear-gradient(135deg,#060A10,#060C0E)",borderBottom:`1px solid ${C.bdr}`,padding:"14px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:C.mut,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Bengaluru · Live Weather</div>
                <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.b}}>☀️ 27°C now · <span style={{color:C.red}}>Race day: 33°C 🔥</span></div>
                <div style={{fontSize:11,color:C.mut,fontFamily:F.b,marginTop:2}}>🏃 Today's run: ~22°C at 6:40 AM — ideal</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
              {[{d:"Tue 10",h:30,ic:"✅",done:true},{d:"Wed 11",h:32,ic:"☀️"},{d:"Thu 12",h:33,ic:"☀️"},{d:"Fri 13",h:33,ic:"☀️"},{d:"Sat 14",h:33,ic:"🌤️"},{d:"Sun 15",h:33,ic:"🔥",race:true}].map((d,i)=>(
                <div key={i} style={{background:d.race?"rgba(61,139,248,0.1)":d.done?"rgba(52,211,153,0.05)":"rgba(255,255,255,0.02)",
                  border:`1px solid ${d.race?C.blue+"55":d.done?C.green+"33":C.bdr}`,borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
                  <div style={{fontSize:8,color:d.race?C.blue:d.done?C.green:C.mut,fontFamily:F.b,fontWeight:600,marginBottom:2}}>{d.d}</div>
                  <div style={{fontSize:14}}>{d.ic}</div>
                  <div style={{fontSize:12,fontWeight:700,color:d.h>=32?C.red:C.sec,fontFamily:F.h}}>{d.h}°</div>
                  {d.race&&<div style={{fontSize:8,color:C.blue,fontFamily:F.b,fontWeight:700,marginTop:2}}>RACE</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Recovery countdown */}
          <div style={{background:"linear-gradient(135deg,#060D0A,#060E0C)",borderBottom:`1px solid ${C.bdr}`,padding:"14px 18px"}}>
            <div style={{fontSize:11,color:C.green,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>⚡ Race Week Recovery · 5 Days Out</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
              {[{d:"Wed",n:"11",ic:"🛌",l:"Full Rest",c:C.green,note:"OFF"},{d:"Thu",n:"12",ic:"🤸",l:"Shakeout",c:C.yellow,note:"20min"},{d:"Fri",n:"13",ic:"🛌",l:"Rest+Carbs",c:C.green,note:"OFF"},{d:"Sat",n:"14",ic:"👟",l:"Light Jog",c:C.sky,note:"BIB"},{d:"Sun",n:"15",ic:"🏅",l:"RACE",c:C.blue,note:"6 AM"}].map((d,i)=>(
                <div key={i} style={{background:C.faint,border:`1px solid ${d.c}33`,borderRadius:10,padding:"9px 6px",textAlign:"center",borderTop:`2px solid ${d.c}`}}>
                  <div style={{fontSize:8,color:C.mut,fontFamily:F.b}}>{d.d} {d.n}</div>
                  <div style={{fontSize:18,margin:"4px 0"}}>{d.ic}</div>
                  <div style={{fontSize:10,color:d.c,fontFamily:F.b,fontWeight:700,lineHeight:1.2}}>{d.l}</div>
                  <div style={{fontSize:8,color:C.mut,fontFamily:F.b,marginTop:2}}>{d.note}</div>
                </div>
              ))}
            </div>
            <div style={{height:7,background:C.bdr,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:"72%",background:`linear-gradient(to right,${C.blue},${C.green})`,borderRadius:4}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:C.mut,fontFamily:F.b}}>
              <span>Now (recovering)</span><span style={{color:C.green}}>Race day → HIGH freshness ✅</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          TAB: RACES
      ══════════════════════════ */}
      {topTab===1&&(
        <div>
          {/* Race switcher */}
          <div style={{background:"#08090F",borderBottom:`1px solid ${C.bdr}`,padding:"14px 16px 0"}}>
            <div style={{fontSize:9,color:C.mut,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10,fontWeight:700,fontFamily:F.b}}>Sachin K G · 2026 Race Season</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {RACE_SWITCHER.map(rc=>(
                <button key={rc.id} onClick={()=>setRace(rc.id)} style={{padding:"10px 10px 0",
                  background:race===rc.id?C.faint:"transparent",
                  border:`1px solid ${race===rc.id?rc.accent+"55":C.bdr}`,
                  borderBottom:`2px solid ${race===rc.id?rc.accent:"transparent"}`,
                  borderRadius:"8px 8px 0 0",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
                  <div style={{fontSize:9,color:race===rc.id?rc.accent:C.mut,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,fontFamily:F.b,marginBottom:2}}>{rc.badge}</div>
                  <div style={{fontSize:13,fontWeight:700,fontFamily:F.h,letterSpacing:"0.8px",color:race===rc.id?C.white:C.mut,lineHeight:1.2,marginBottom:4}}>{rc.short.toUpperCase()}</div>
                  <div style={{fontSize:10,color:race===rc.id?C.mut:C.faint,fontFamily:F.b,marginBottom:8}}>{rc.sub}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Race hero */}
          <div style={{background:r.bgGrad,padding:"20px 18px 16px",borderBottom:`1px solid ${C.bdr}`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 85% 15%,${r.accent}18 0%,transparent 50%)`}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
                <div>
                  <div style={{fontSize:11,color:r.accent,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontWeight:600,fontFamily:F.b}}>{r.sub}</div>
                  <h2 style={{margin:0,fontSize:28,fontFamily:F.h,letterSpacing:"1px",color:C.white}}>{r.short.toUpperCase()}</h2>
                  <Pill c={r.accent}>{r.badge}</Pill>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,fontFamily:F.b}}>{race===0?"Official Time":"Target"}</div>
                  <div style={{fontSize:40,fontFamily:F.h,color:r.accent,lineHeight:1,letterSpacing:"1px"}}>{r.target}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{r.pace}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${r.stats.length},1fr)`,gap:8}}>
                {r.stats.map(([ic,l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"9px 6px",textAlign:"center"}}>
                    <div style={{fontSize:15,marginBottom:3}}>{ic}</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:F.h,letterSpacing:"0.5px"}}>{v}</div>
                    <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:F.b}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {race===0&&<PoliceRun/>}
          {race===1&&<NammaRun/>}
          {race===2&&<TCSRun/>}
        </div>
      )}

      {/* ══════════════════════════
          TAB: SEASON
      ══════════════════════════ */}
      {topTab===2&&(
        <div style={{padding:"0 18px"}}>
          {/* Race photo gallery */}
          <div style={{margin:"24px -18px 0"}}>
            <PhotoGallery/>
          </div>

          <SHead label="Monthly Volume" accent={C.cyan} right="Nov 2025 – Mar 2026"/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <ResponsiveContainer width="100%" height={155}>
              <BarChart data={MONTHLY} barSize={36} margin={{left:0,right:0,top:4,bottom:0}}>
                <XAxis dataKey="m" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,160]}/>
                <Tooltip content={({active,payload,label})=>{
                  if(!active||!payload?.length)return null;
                  const d=MONTHLY.find(m=>m.m===label);
                  return(<div style={{background:C.card,border:`1px solid ${C.bdr2}`,borderRadius:10,padding:"10px 14px",fontFamily:F.b,fontSize:12}}>
                    <div style={{color:C.sec,marginBottom:4,fontWeight:600}}>{label}</div>
                    <div style={{color:C.white}}>📏 {payload[0].value} km · {d?.runs} runs</div>
                    <div style={{color:C.sec,marginTop:2}}>avg {d?.avgPace}/km</div>
                  </div>);
                }}/>
                <Bar dataKey="km" radius={[5,5,0,0]}>{MONTHLY.map((m,i)=><Cell key={i} fill={m.color} opacity={0.85}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <SHead label="Season Race History" accent={C.blue}/>
          <div style={{position:"relative",paddingLeft:20,marginBottom:24}}>
            <div style={{position:"absolute",left:6,top:8,bottom:8,width:2,
              background:`linear-gradient(to bottom,${C.indigo},${C.yellow},${C.green},${C.sky},${C.blue},${C.indigo})`}}/>
            {RACE_HISTORY.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:12,position:"relative"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:r.color,flexShrink:0,marginTop:4,
                  position:"relative",left:-3,boxShadow:`0 0 10px ${r.color}88`,
                  border:r.status!=="done"?`2px dashed ${r.color}`:"none"}}/>
                <div style={{flex:1,background:C.card,border:`1px solid ${r.color}22`,borderLeft:`3px solid ${r.color}`,borderRadius:10,padding:"11px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:6}}>
                    <div>
                      <div style={{display:"flex",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <Pill c={r.color}>{r.status==="done"?"✓ DONE":r.status==="next"?"5 DAYS":"GOAL"}</Pill>
                      </div>
                      <div style={{fontSize:15,fontFamily:F.h,fontWeight:700,color:C.white,letterSpacing:"0.5px"}}>{r.name}</div>
                      <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginTop:1}}>{r.date} · {r.dist}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:24,fontFamily:F.h,color:r.color,lineHeight:1}}>{r.time}</div>
                      <div style={{fontSize:11,color:C.sec,fontFamily:F.b}}>{r.pace}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>
                    {[`🌡 ${r.temp}`,`⛰ ${r.elev}`,`❤️ ${r.hr}`,`🔥 ${r.kcal} kcal`].map(t=>(
                      <span key={t} style={{fontSize:10,color:C.mut,fontFamily:F.b,background:C.faint,borderRadius:6,padding:"2px 8px"}}>{t}</span>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:C.sec,lineHeight:1.6,fontFamily:F.b,fontStyle:"italic"}}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════
          TAB: LOG
      ══════════════════════════ */}
      {topTab===3&&(
        <div style={{padding:"0 18px"}}>
          <SHead label="Recent Activity Log" accent={C.sky} right="Last 12 runs"/>
          {ACTIVITY_LOG.map((a,i)=>(
            <div key={i}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                <div style={{width:46,flexShrink:0,textAlign:"right"}}>
                  <div style={{fontSize:12,fontFamily:F.m,color:C.sec}}>{a.date.split(" ")[1]}</div>
                  <div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{a.date.split(" ")[0]}</div>
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:tagColor(a.tag),flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.name}</div>
                  <div style={{fontSize:10,color:C.mut,fontFamily:F.b,marginTop:1}}>👟 {a.gear} · TL {a.tl}</div>
                </div>
                <div style={{display:"flex",gap:12,flexShrink:0}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontFamily:F.m,color:C.white,fontWeight:700}}>{a.km}<span style={{fontSize:10,color:C.mut}}> km</span></div>
                    <div style={{fontSize:10,color:C.sec,fontFamily:F.b}}>{a.time}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontFamily:F.m,color:tagColor(a.tag)}}>{a.pace}<span style={{fontSize:9,color:C.mut}}>/km</span></div>
                    <div style={{fontSize:10,color:C.pink,fontFamily:F.b}}>♥ {a.hr}</div>
                  </div>
                  <div style={{width:44,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    <Pill c={tagColor(a.tag)}>{a.tag}</Pill>
                  </div>
                </div>
              </div>
              {i<ACTIVITY_LOG.length-1&&<Divider/>}
            </div>
          ))}
          <SHead label="Gear Tracker" accent={C.yellow}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {[{n:"ASICS Novablast 5",s:"Daily trainer · Race shoe",km:"~148km in 2026",c:C.blue,ic:"👟"},{n:"ASICS Gel Nimbus 27",s:"Easy & recovery runs",km:"~113km in 2026",c:C.sky,ic:"👟"}].map(g=>(
              <div key={g.n} style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"14px 16px",borderTop:`2px solid ${g.c}`}}>
                <div style={{fontSize:20,marginBottom:8}}>{g.ic}</div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:F.b,color:C.white,marginBottom:2}}>{g.n}</div>
                <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginBottom:8}}>{g.s}</div>
                <div style={{fontSize:14,fontFamily:F.m,color:g.c,fontWeight:700}}>{g.km}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════
          TAB: STATS
      ══════════════════════════ */}
      {topTab===4&&(
        <div style={{padding:"0 18px"}}>
          <SHead label="Weekly Mileage" accent={C.indigo} right="Jan–Mar 10"/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <ResponsiveContainer width="100%" height={145}>
              <BarChart data={WEEKLY} barSize={24} margin={{left:0,right:0,top:4,bottom:0}}>
                <XAxis dataKey="w" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,65]}/>
                <Tooltip content={({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.card,border:`1px solid ${C.bdr2}`,borderRadius:10,padding:"10px 14px",fontFamily:F.b,fontSize:12}}><div style={{color:C.sec,marginBottom:4,fontWeight:600}}>{label}</div><div style={{color:C.sky}}>{payload[0].value} km</div></div>);}}/>
                <ReferenceLine y={40} stroke={C.bdr2} strokeDasharray="4 3"/>
                <Bar dataKey="km" radius={[4,4,0,0]}>{WEEKLY.map((w,i)=><Cell key={i} fill={w.km>40?C.green:w.km>25?C.sky:C.indigo} opacity={0.85}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <SHead label="Pace Trend · 13 Runs" accent={C.sky}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {["RACE","TRAIL","ULTRA","TEMPO","LONG","STRIDES","EASY"].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:tagColor(t)}}/>
                  <span style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{t}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={PACE_TREND} margin={{left:0,right:8,top:4,bottom:0}}>
                <XAxis dataKey="r" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis domain={[5.5,8.5]} hide/>
                <Tooltip content={({active,payload,label})=>{
                  if(!active||!payload?.length)return null;
                  const d=PACE_TREND.find(p=>p.r===label);
                  const pv=payload[0].value;
                  return(<div style={{background:C.card,border:`1px solid ${C.bdr2}`,borderRadius:10,padding:"10px 14px",fontFamily:F.b,fontSize:12}}>
                    <div style={{color:C.sec,marginBottom:6,fontWeight:600}}>{label} · {d?.km}km</div>
                    <div style={{color:tagColor(d?.tag||""),marginBottom:3}}>⚡ {fmtPace(pv)}/km</div>
                    <div style={{color:C.pink}}>❤️ {d?.hr} bpm</div>
                  </div>);
                }}/>
                <ReferenceLine y={5.88} stroke={C.green} strokeDasharray="3 3" strokeOpacity={0.6}/>
                <Line type="monotone" dataKey="pace" stroke={C.sky} strokeWidth={2}
                  dot={p=>{const d=PACE_TREND[p.index];return <circle key={p.key} cx={p.cx} cy={p.cy} r={5} fill={tagColor(d?.tag||"")} stroke={C.bg} strokeWidth={2}/>;}}
                  activeDot={{r:6,fill:C.white,stroke:C.sky,strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{fontSize:10,color:C.green,fontFamily:F.b,marginTop:6}}>── PR pace ref (5:53/km · Police Run)</div>
          </div>

          <SHead label="Personal Bests" accent={C.yellow}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
            {[["🏅","58:53","10K PR","5:53/km · Mar 1"],["🏃","25 km","Longest Race","Bengaluru Ultra"],["🔥","228W","Peak Power","Police Run NP"],["❤️","192","Max HR Ever","Kaveri Trail Run"],["👣","91 spm","Max Cadence","Mar 10 stride S3"],["⛰️","169m","Most Elev","Bengaluru Ultra"]].map(([ic,v,l,sub])=>(
              <div key={l} style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"13px 12px",borderTop:`2px solid ${C.bdr2}`}}>
                <div style={{fontSize:18,marginBottom:6}}>{ic}</div>
                <div style={{fontSize:18,fontFamily:F.h,fontWeight:900,color:C.white,letterSpacing:"0.5px",lineHeight:1}}>{v}</div>
                <div style={{fontSize:11,color:C.white,fontFamily:F.b,fontWeight:600,marginTop:5}}>{l}</div>
                <div style={{fontSize:9,color:C.mut,fontFamily:F.b,marginTop:2}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════
          TAB: PROFILE
      ══════════════════════════ */}
      {topTab===5&&(
        <div style={{padding:"0 18px"}}>
          {/* VO2 max */}
          <SHead label="VO₂ Max & Physiology" accent={C.blue}/>
          <div style={{background:"linear-gradient(135deg,#08102A,#0A1230)",border:`1px solid ${C.blue}33`,borderRadius:14,padding:"16px 18px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:C.blue,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3}}>🫁 Estimated VO2 Max</div>
                <div style={{fontSize:11,color:C.mut,fontFamily:F.b}}>Jack Daniels VDOT · Police Run 10K (58:53)</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:42,fontFamily:F.h,color:C.blue,letterSpacing:"1px",lineHeight:1}}>~38</div>
                <div style={{fontSize:9,color:C.sec,fontFamily:F.m}}>mL / kg / min</div>
              </div>
            </div>
            <div style={{height:8,borderRadius:4,overflow:"hidden",marginBottom:6,
              background:`linear-gradient(to right,#1E3A5F 0%,${C.cyan} 33%,${C.yellow} 55%,${C.orange} 75%,${C.red} 90%,${C.indigo} 100%)`}}>
              <div style={{position:"relative",height:"100%"}}>
                <div style={{position:"absolute",top:0,bottom:0,left:"63%",width:3,background:C.white,borderRadius:2,boxShadow:"0 0 8px rgba(255,255,255,0.8)"}}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.mut,fontFamily:F.b,marginBottom:14}}>
              {[["20","Beginner"],["30","Fair"],["38","◆ You"],["50","Excellent"],["60","Elite"]].map(([v,l])=>(
                <div key={v} style={{textAlign:"center"}}>
                  <div style={{fontWeight:700,color:v==="38"?C.blue:C.mut}}>{v}</div>
                  <div style={{color:v==="38"?C.sky:C.mut}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[["Easy","7:30–8:15",C.green],["Tempo","6:20–6:35",C.yellow],["Interval","5:55–6:05",C.orange],["Race","5:50–6:00",C.red]].map(([t,p,c])=>(
                <div key={t} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${c}22`,borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:c,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{t}</div>
                  <div style={{fontSize:12,fontFamily:F.m,color:C.white}}>{p}</div>
                  <div style={{fontSize:8,color:C.mut,fontFamily:F.b,marginTop:2}}>/km</div>
                </div>
              ))}
            </div>
          </div>

          {/* HR Zones */}
          <SHead label="Heart Rate Zones" accent={C.pink} right="Live from Strava"/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 18px",marginBottom:16}}>
            {HR_ZONES.map((z,i)=>(
              <div key={z.z} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<HR_ZONES.length-1?12:0}}>
                <div style={{width:26,fontSize:12,fontFamily:F.h,fontWeight:700,color:z.c,flexShrink:0}}>{z.z}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:C.white,fontFamily:F.b,fontWeight:600}}>{z.name}</span>
                    <span style={{fontSize:10,color:C.sec,fontFamily:F.m}}>{z.bpm} bpm</span>
                  </div>
                  <div style={{height:6,background:C.bdr,borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${z.pct*2.2}%`,background:z.c,borderRadius:3}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",minWidth:52,flexShrink:0}}>
                  <div style={{fontSize:16,fontFamily:F.h,fontWeight:900,color:z.c}}>{z.pct}%</div>
                  <div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{z.hrs}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Clubs */}
          <SHead label="Running Clubs" accent={C.sky}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {CLUBS.map((cl,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${cl.local?C.blue+"44":C.bdr}`,
                borderRadius:12,padding:"14px 14px",borderLeft:`3px solid ${cl.local?C.blue:C.bdr2}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <span style={{fontSize:22}}>{cl.icon}</span>
                  {cl.local&&<Pill c={C.sky}>LOCAL</Pill>}
                </div>
                <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.b,lineHeight:1.3,marginBottom:4}}>{cl.name}</div>
                <div style={{fontSize:12,fontFamily:F.m,color:C.sec}}>{fmtK(cl.n)} members</div>
              </div>
            ))}
          </div>

          {/* Bangalore segments */}
          <SHead label="Bangalore Running Spots" accent={C.cyan}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,overflow:"hidden",marginBottom:24}}>
            {[
              {n:"Cubbon Park Full Loop",       d:"3.73 km",g:"0%",  t:"City loop"},
              {n:"One Mile Loop – Lalbagh",     d:"1.66 km",g:"0%",  t:"Park loop"},
              {n:"TCS 10K Course (2018)",       d:"9.69 km",g:"0%",  t:"Race route"},
              {n:"Sarakki Lake Loop",           d:"2.54 km",g:"-0.1%",t:"Lake loop"},
              {n:"JP Nagar Mini Forest",        d:"2.25 km",g:"0%",  t:"Trail"},
            ].map((s,i,arr)=>(
              <div key={i}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px"}}>
                  <span style={{fontSize:18}}>📍</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{s.n}</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b,marginTop:1}}>{s.t}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontFamily:F.m,color:C.sky}}>{s.d}</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>grade {s.g}</div>
                  </div>
                </div>
                {i<arr.length-1&&<Divider/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{borderTop:`1px solid ${C.bdr}`,padding:"20px 20px 32px",display:"flex",
        justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,background:C.faint}}>
        <div>
          <div style={{fontSize:28,fontFamily:F.h,fontWeight:900,color:C.white,letterSpacing:"1.5px"}}>SACHIN K G</div>
          <div style={{fontSize:10,color:C.mut,fontFamily:F.b,marginTop:2}}>Bangalore · 2026 Running Season · Strava #99703920</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:C.mut,fontFamily:F.m}}>Updated Mar 10, 2026</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,justifyContent:"flex-end"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            <span style={{fontSize:10,color:C.green,fontFamily:F.m}}>Strava Live</span>
          </div>
        </div>
      </div>

    </div>
  );
}