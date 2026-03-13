import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from "recharts";
import {
  getAuthURL, exchangeCode, refreshAccessToken, fetchActivities,
  getStoredAuth, storeAuth, clearAuth, isTokenExpired, mapActivity
} from './strava';

/* ─── Fonts ─── */
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
document.head.appendChild(_fl);

const F = { h:"'Bebas Neue', sans-serif", b:"'Outfit', system-ui, sans-serif", m:"'Space Mono', monospace" };

const C = {
  bg:"#050810", card:"#090D1A", card2:"#0D1220",
  bdr:"#152038", bdr2:"#1E2D44",
  white:"#E8F0FF", pri:"#C8D8F8", sec:"#7A90B8", mut:"#3A4D6A", faint:"#111A2E",
  blue:"#3D8BF8", sky:"#60A5FA", indigo:"#818CF8", cyan:"#22D3EE",
  green:"#34D399", yellow:"#FCD34D", orange:"#F97316", red:"#F87171", pink:"#F472B6",
  violet:"#A78BFA",
  // Race palette
  police:"#34D399",  // ✓ done
  namma:"#60A5FA",   // Mar 15
  tcs:"#818CF8",     // Apr 26
  freedom:"#22D3EE", // May 24 HM
  jatre:"#F472B6",   // Jun 14
  b10k:"#A78BFA",    // Jul 5
  ultra:"#FCD34D",   // Jul 25
};

/* ── Helpers ── */
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
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,paddingTop:20}}>
    <div style={{width:3,height:18,background:accent,borderRadius:2}}/>
    <span style={{fontSize:12,fontFamily:F.h,color:accent,textTransform:"uppercase",
      letterSpacing:"0.14em",flex:1}}>{label}</span>
    {right&&<span style={{fontSize:10,fontFamily:F.m,color:C.mut}}>{right}</span>}
  </div>
);
const Divider = () => <div style={{height:1,background:C.bdr}}/>;
function IBar({val,color,h=4}){
  return <div style={{height:h,background:C.bdr,borderRadius:2}}>
    <div style={{height:"100%",width:`${Math.min(100,val*100)}%`,background:color,borderRadius:2}}/>
  </div>;
}
const tagColor = t=>({RACE:C.red,TEMPO:C.orange,LONG:C.indigo,STRIDES:C.green,EASY:C.sky,ULTRA:C.yellow,TRAIL:C.cyan,CROSS:C.pink}[t]||C.mut);
const fmtPace = p=>{const m=Math.floor(p);const s=Math.round((p-m)*60);return`${m}:${s<10?"0"+s:s}`;};

/* ════════════════════ DATA ════════════════════ */

// Mar 11 Badminton HR stream (from Strava live pull)

const policeHRData=[
  {d:0,hr:117},{d:1,hr:159},{d:2,hr:168},{d:3,hr:170},{d:4,hr:176},{d:5,hr:180},
  {d:6,hr:181},{d:7,hr:183},{d:8,hr:185},{d:9,hr:190},{d:10,hr:188},
];
const policePaceData=[
  {km:"1",pace:5.78},{km:"2",pace:5.90},{km:"3",pace:5.85},{km:"4",pace:5.82},
  {km:"5",pace:5.88},{km:"6",pace:5.90},{km:"7",pace:5.95},{km:"8",pace:6.05},
  {km:"9",pace:6.08},{km:"10",pace:5.72},
];
const policeZones=[
  {zone:"Z1",name:"Recovery", bpm:"0–118",  pct:2,  color:"#1E3A5F"},
  {zone:"Z2",name:"Aerobic",  bpm:"118–147",pct:5,  color:C.green},
  {zone:"Z3",name:"Tempo",    bpm:"147–162",pct:8,  color:C.yellow},
  {zone:"Z4",name:"Threshold",bpm:"162–177",pct:28, color:C.blue},
  {zone:"Z5",name:"Max",      bpm:"177+",   pct:57, color:C.indigo},
];
const sbiKmData=[
  {km:"Km 1",pace:6.17,hr:160,flag:false},{km:"Km 2",pace:6.88,hr:174,flag:false},
  {km:"Km 3",pace:6.35,hr:171,flag:false},{km:"Km 4",pace:5.30,hr:178,flag:true},
  {km:"Km 5",pace:6.00,hr:178,flag:false},{km:"Km 6",pace:6.42,hr:178,flag:false},
  {km:"Km 7",pace:7.08,hr:182,flag:true}, {km:"Km 8",pace:6.68,hr:175,flag:false},
  {km:"Km 9",pace:5.77,hr:177,flag:false},{km:"Km 10",pace:5.52,hr:176,flag:false},
];
const nammaSegs=[
  {km:"0–1 km",  terrain:"Flat Start",       pace:"6:10",hr:"~155",intensity:.35,color:C.green, tip:"Don't surge with the crowd. Start easy, HR under 160."},
  {km:"1–2.5 km",terrain:"⬆️ The Climb",     pace:"6:35",hr:"~172",intensity:.75,color:C.orange,tip:"5.7% avg grade, max 13%. Shorten stride, keep cadence 85+."},
  {km:"2.5–5 km",terrain:"Flat/Rolling",      pace:"5:50",hr:"~168",intensity:.60,color:C.sky,  tip:"Recover on the flat. Gentle downhill — bank time here."},
  {km:"5–7 km",  terrain:"Turnaround+Flat",   pace:"5:45",hr:"~172",intensity:.65,color:C.sky,  tip:"Fastest stretch. Feel strong. Push now."},
  {km:"7–8.5 km",terrain:"⬆️ Climb Again",    pace:"6:25",hr:"~182",intensity:.90,color:C.indigo,tip:"Shorten stride. Keep moving. Cadence 88+."},
  {km:"8.5–10",  terrain:"⬇️ Downhill Finish",pace:"5:35",hr:"~185",intensity:.85,color:C.indigo,tip:"Gravity is your friend. Open up and empty the tank."},
];
const nammaTraining=[
  {date:"Mar 6", emoji:"🏸",label:"Badminton ✓",        light:C.green,done:true, isRace:false,desc:"67 min · HR 133 · 547 kcal ✅"},
  {date:"Mar 7", emoji:"✅",label:"Long Run ✓",          light:C.sky,  done:true, isRace:false,desc:"14.08km · 1:40:20 · 7:08/km · HR 159 · 150m elev ✅"},
  {date:"Mar 8", emoji:"🏸",label:"Badminton ✓",          light:C.green,done:true, isRace:false,desc:"1:44:11 · HR 132 · 822 kcal ✅"},
  {date:"Mar 9", emoji:"✅",label:"Morning Run ✓",        light:C.green,done:true, isRace:false,desc:"5.15km · 6:01/km · HR 171 ✅"},
  {date:"Mar 10",emoji:"✅",label:"Shakeout + Strides ✓", light:C.green,done:true, isRace:false,desc:"6.57km · HR 153 · 4 strides (16.9 km/h!) ✅"},
  {date:"Mar 11",emoji:"🏸",label:"Morning Badminton ✓",    light:C.green,done:true, isRace:false,desc:"1:25:43 · Avg HR 134 · Max HR 173 · 689 kcal. Active recovery instead of easy run — smart choice. Legs stay fresh. ✅"},
  {date:"Mar 12",emoji:"💨",label:"Shakeout + Strides",    light:C.sky,  done:false,isRace:false,desc:"4km easy + 4×80m strides at race effort."},
  {date:"Mar 13",emoji:"🛌",label:"Full Rest",              light:C.sec,  done:false,isRace:false,desc:"Nothing. Carb load at dinner. Sleep by 10pm."},
  {date:"Mar 14",emoji:"🎽",label:"Shakeout + BIB",         light:C.blue, done:false,isRace:false,desc:"20min easy + 2 strides. BIB at Swaasthya Fitness, Whitefield."},
  {date:"Mar 15",emoji:"🏅",label:"RACE DAY",               light:C.namma,done:false,isRace:true, desc:"Namma Power Run · 57:30–58:30 · NICE Road, Hoskerehalli"},
];
const NAMMA_ELEV=[0,3,6,12,22,35,45,52,58,62,65,67,68,66,63,58,52,45,38,30,24,18,14,10,7,5,4,3,2,2,2,3,5,8,12,18,25,33,42,50,57,63,67,68,67,65,62,58,53,47,40,33,26,20,15,10,7,4,2,0];

const tcsElev=[
  {d:0,alt:908,grade:0},{d:.3,alt:904,grade:-1.3},{d:.7,alt:900,grade:-1.1},{d:1,alt:897,grade:-1},
  {d:1.4,alt:893,grade:-1},{d:1.8,alt:889,grade:-1.1},{d:2,alt:889,grade:0},{d:2.3,alt:892,grade:1},
  {d:2.7,alt:896,grade:1.3},{d:3,alt:895,grade:-.3},{d:3.5,alt:895,grade:0},{d:4,alt:894,grade:-.2},
  {d:4.3,alt:895,grade:.3},{d:4.6,alt:899,grade:1.3},{d:4.8,alt:903,grade:2},{d:5,alt:908,grade:2.5},
  {d:5.3,alt:906,grade:-.7},{d:5.7,alt:904,grade:-.5},{d:6,alt:903,grade:-.3},{d:6.4,alt:901,grade:-.5},
  {d:6.8,alt:899,grade:-.5},{d:7,alt:899,grade:0},{d:7.3,alt:901,grade:.7},{d:7.6,alt:903,grade:.7},
  {d:8,alt:901,grade:-.5},{d:8.3,alt:899,grade:-.7},{d:8.6,alt:901,grade:.7},{d:9,alt:905,grade:1},
  {d:9.3,alt:903,grade:-.7},{d:9.6,alt:901,grade:-.7},{d:10,alt:899,grade:-.5},
];
const tcsKms=[
  {km:"Km 1",terrain:"Net Downhill",  pace:"5:45",hr:158,elev:-11,color:C.green, intensity:.35,tip:"Cruise the downhill. Resist the wave-start surge."},
  {km:"Km 2",terrain:"Down then Up",  pace:"5:35",hr:163,elev:0,  color:C.green, intensity:.45,tip:"Short sharp uphill in latter half."},
  {km:"Km 3",terrain:"Uphill+Headwind",pace:"5:35",hr:168,elev:7, color:C.yellow,intensity:.55,tip:"U-turn #1. Headwinds on return. Maintain cadence."},
  {km:"Km 4",terrain:"FLATTEST 🔑",   pace:"5:20",hr:170,elev:-1, color:C.sky,   intensity:.65,tip:"Surge here! Flattest km — bank 10–15 seconds."},
  {km:"Km 5",terrain:"HARDEST KM ⚠",  pace:"5:45",hr:178,elev:19, color:C.red,   intensity:.90,tip:"Short sharp up → protracted uphill. Shorten stride. Cadence 88+. Survive."},
  {km:"Km 6",terrain:"Recovery",       pace:"5:25",hr:172,elev:-5, color:C.blue,  intensity:.55,tip:"Mental reset. Recover here."},
  {km:"Km 7",terrain:"Down then Up",   pace:"5:25",hr:173,elev:4,  color:C.sky,   intensity:.60,tip:"Vidhana Soudha, Cubbon Park. Draw from the crowd."},
  {km:"Km 8",terrain:"Down→U-turn",    pace:"5:25",hr:174,elev:-7, color:C.yellow,intensity:.65,tip:"Steady downhill. U-turn #3 at KR Circle."},
  {km:"Km 9",terrain:"Up then Down",   pace:"5:30",hr:179,elev:6,  color:C.red,   intensity:.85,tip:"Grunt time. Steady uphill. At top → gentle downhill."},
  {km:"Km 10",terrain:"SPRINT",        pace:"5:05",hr:185,elev:-2, color:C.indigo,intensity:1.0, tip:"THE STRAIGHTAWAY. Empty every last reserve."},
];
const tcsWeeks=[
  {week:"Wk 1",dates:"Mar 16–22",label:"Recovery",   km:16,color:C.green, intensity:.15},
  {week:"Wk 2",dates:"Mar 23–29",label:"Rebuild",    km:33,color:C.sky,   intensity:.40},
  {week:"Wk 3",dates:"Mar 30–Apr 5",label:"Speed 🔑",km:42,color:C.blue,  intensity:.70},
  {week:"Wk 4",dates:"Apr 6–12", label:"Race Sim 🔑",km:40,color:C.indigo,intensity:.75},
  {week:"Wk 5",dates:"Apr 13–19",label:"Sharpening", km:32,color:C.blue,  intensity:.65},
  {week:"Wk 6",dates:"Apr 20–26",label:"Race Week",  km:18,color:C.indigo,intensity:.20},
];

// ─── FREEDOM HM data ───
const FREEDOM_ELEV=[
  0,2,5,10,18,28,38,47,54,60,64,67,68,65,60,54,47,40,33,27,22,18,14,11,8,6,4,3,2,1,
  1,2,3,6,10,16,22,28,35,42,48,53,58,62,65,67,68,67,64,60,55,49,43,37,31,25,20,15,11,8,
  6,4,3,2,1,1,2,4,7,11,16,22,28,35,43,50,56,62,66,68,68,66,62,56,49,42,35,28,21,15,10,6,3,1,0
];
const freedomSegs=[
  {km:"0–1 km",   terrain:"Flat Start",         pace:"6:20",hr:"~148",intensity:.30,color:C.green,  tip:"Controlled exit from Hoskerehalli. HR under 155. Find your rhythm, ignore the crowd."},
  {km:"1–2.5 km", terrain:"⬆️ First Climb",     pace:"6:45",hr:"~168",intensity:.70,color:C.orange, tip:"Same hill as Namma Power Run. 5.7% avg, 13% max. Walk is okay. Protect legs."},
  {km:"2.5–6 km", terrain:"Rolling Expressway", pace:"6:10",hr:"~162",intensity:.55,color:C.cyan,   tip:"Recover and cruise. Save energy — you have 15km left."},
  {km:"6–8 km",   terrain:"⬆️ Second Climb",    pace:"6:40",hr:"~172",intensity:.70,color:C.orange, tip:"Second hill going out. Maintain form, don't fight it."},
  {km:"8–10.55 km",terrain:"Out to Turnaround", pace:"6:15",hr:"~166",intensity:.60,color:C.cyan,   tip:"Reach halfway mentally fresh. Don't rush. This is where HM beginners blow up."},
  {km:"10.55–13", terrain:"Back — Rolling",      pace:"6:15",hr:"~168",intensity:.60,color:C.sky,   tip:"You're heading home. Lock into your rhythm. HR should feel comfortable."},
  {km:"13–14.5",  terrain:"⬇️ Hill Returns",    pace:"6:00",hr:"~164",intensity:.55,color:C.sky,   tip:"Gravity in your favour. Open stride slightly. Don't hammer yet."},
  {km:"14.5–17",  terrain:"Rolling Expressway", pace:"6:05",hr:"~168",intensity:.60,color:C.blue,   tip:"Steady effort. Count km. Each one down is a win."},
  {km:"17–18.5",  terrain:"⬆️ Final Climb",     pace:"6:45",hr:"~178",intensity:.85,color:C.indigo, tip:"Last major hill. It hurts. Everyone hurts. Shorten stride, keep cadence 88+."},
  {km:"18.5–21.1",terrain:"⬇️ Home Straight",  pace:"5:55",hr:"~182",intensity:.82,color:C.freedom,tip:"Final descent to Hoskerehalli. Tuck in and go! Sub-2:20 is yours."},
];
const freedomWeeks=[
  {week:"Wk 1",dates:"Apr 27–May 3", label:"Recovery",       km:20,color:C.green,  intensity:.20},
  {week:"Wk 2",dates:"May 4–10",     label:"Rebuild Aerobic", km:40,color:C.cyan,   intensity:.50},
  {week:"Wk 3",dates:"May 11–17",    label:"HM Sim Long Run 🔑",km:48,color:C.freedom,intensity:.75},
  {week:"Wk 4",dates:"May 18–24",    label:"Race Week Taper", km:22,color:C.freedom,intensity:.25},
];

// ─── DISHA JATRE 10K data ───
const jatre10kSegs=[
  {km:"Km 1",terrain:"Park Start, Flat",     pace:"5:35",hr:"~160",intensity:.55,color:C.green, tip:"Community run — pace carefully. Ignore fast starters. Find your 5:30/km rhythm early."},
  {km:"Km 2",terrain:"Neighbourhood Roads",  pace:"5:25",hr:"~166",intensity:.65,color:C.sky,   tip:"Settle in. This course is flat — build effort gradually."},
  {km:"Km 3",terrain:"Flat Road, Mild Rise", pace:"5:25",hr:"~169",intensity:.68,color:C.sky,   tip:"If you feel good, hold back 5% — you have 7km left."},
  {km:"Km 4",terrain:"Flats → Turning Loop", pace:"5:20",hr:"~172",intensity:.72,color:C.blue,  tip:"Start building now. Sub-5:20 if legs feel good."},
  {km:"Km 5",terrain:"Turnaround/Midpoint",  pace:"5:20",hr:"~174",intensity:.74,color:C.blue,  tip:"Check split. Target: 26:45–27:00 at halfway."},
  {km:"Km 6",terrain:"Flat Return",          pace:"5:20",hr:"~175",intensity:.76,color:C.indigo,tip:"Mirror your outbound pace. Slight acceleration."},
  {km:"Km 7",terrain:"Flat, Crowd Support",  pace:"5:15",hr:"~177",intensity:.80,color:C.indigo,tip:"Turn up the effort. Crowd support in this section."},
  {km:"Km 8",terrain:"Pick Up the Pace",     pace:"5:15",hr:"~179",intensity:.83,color:C.pink,  tip:"You should feel the burn. Lean into it."},
  {km:"Km 9",terrain:"Almost Home",          pace:"5:10",hr:"~183",intensity:.88,color:C.pink,  tip:"One more km after this. Give everything you have."},
  {km:"Km 10",terrain:"FINISH SPRINT",       pace:"4:55",hr:"~188",intensity:1.0,color:C.jatre, tip:"Full sprint! Cross the finish line strong. Sub-54 is a huge benchmark."},
];
const jatreWeeks=[
  {week:"Wk 1",dates:"May 25–31",label:"Recovery from HM",km:18,color:C.green, intensity:.15},
  {week:"Wk 2",dates:"Jun 1–7",  label:"Speed Sharpening",km:35,color:C.pink,  intensity:.65},
  {week:"Wk 3",dates:"Jun 8–14", label:"Race Week Taper", km:18,color:C.jatre, intensity:.20},
];

// ─── BENGALURU 10K CHALLENGE data ───
const b10kSegs=[
  {km:"Km 1",terrain:"Down 400m, Up 600m",      pace:"5:55",hr:"~160",intensity:.50,color:C.green, tip:"Settle nerves. Don't surge. First 400m gentle down, then gentle up. Find rhythm."},
  {km:"Km 2",terrain:"⬆️ Steep Uphill",         pace:"6:25",hr:"~173",intensity:.80,color:C.orange,tip:"Count steps, focus on breathing. These are still early miles — legs can take it."},
  {km:"Km 3",terrain:"Crest + Down 400m + Up 600m",pace:"6:10",hr:"~170",intensity:.72,color:C.orange,tip:"Use the downhill to coast. Momentum carries you up the second hill to HIGHEST point."},
  {km:"Km 4",terrain:"⬇️⬇️ Long Downhill",      pace:"5:20",hr:"~165",intensity:.60,color:C.cyan,   tip:"FASTEST km — run free, but don't go all out! Half the race still remains."},
  {km:"Km 5",terrain:"⬇️ Continue Downhill",    pace:"5:20",hr:"~163",intensity:.58,color:C.cyan,   tip:"Bank time here. But controlled — 5.5km of hard running still to come."},
  {km:"Km 6",terrain:"U-turn + Steady Up",       pace:"5:55",hr:"~174",intensity:.76,color:C.blue,   tip:"Post U-turn: steady up 500m, gentle up 500m. Mentally prepare for Godzilla."},
  {km:"Km 7",terrain:"⬆️ GODZILLA HILL 🦖",     pace:"6:40",hr:"~184",intensity:.98,color:C.red,    tip:"THE hardest km. Steep uphill entire way. Count, breathe, shuffle. EVERYONE slows here."},
  {km:"Km 8",terrain:"Crest + Sharp Down",       pace:"5:35",hr:"~177",intensity:.75,color:C.sky,    tip:"Toughest km is behind you! Short uphill, then 400m sharp downhill. Open stride!"},
  {km:"Km 9",terrain:"⬇️⬇️ Long Downhill",      pace:"5:10",hr:"~179",intensity:.80,color:C.violet, tip:"If paced right, you have gas in the tank. This is your reward. FLY."},
  {km:"Km 10",terrain:"⬇️ Sprint Finish",        pace:"4:55",hr:"~186",intensity:1.0,color:C.b10k,  tip:"Pure flat/downhill sprint. Empty the tank. Sub-55:30 is yours!"},
];
const b10kElev=[
  {d:0,alt:910,g:0},{d:.4,alt:908,g:-0.5},{d:1,alt:912,g:0.7},{d:1.5,alt:916,g:0.8},
  {d:2,alt:920,g:0.8},{d:2.4,alt:918,g:-0.5},{d:3,alt:922,g:0.7},{d:3.4,alt:928,g:1.5},
  {d:4,alt:920,g:-1.3},{d:4.5,alt:914,g:-1.2},{d:5,alt:908,g:-1.2},{d:5.5,alt:912,g:0.8},
  {d:6,alt:918,g:1.2},{d:6.5,alt:922,g:0.8},{d:7,alt:930,g:1.6},{d:7.1,alt:932,g:2.0},
  {d:7.5,alt:928,g:-1.0},{d:8,alt:918,g:-2.0},{d:8.5,alt:912,g:-1.2},
  {d:9,alt:906,g:-1.2},{d:9.5,alt:900,g:-1.2},{d:10,alt:896,g:-0.8},
];
const b10kWeeks=[
  {week:"Wk 1",dates:"Jun 15–21",label:"Recovery from Jatre",km:20,color:C.green, intensity:.20},
  {week:"Wk 2",dates:"Jun 22–28",label:"Hill Training 🔑",   km:38,color:C.violet,intensity:.70},
  {week:"Wk 3",dates:"Jun 29–Jul 5",label:"Race Week",       km:18,color:C.b10k,  intensity:.20},
];

// ─── BENGALURU ULTRA 25K data ───
const ultraSegs=[
  {km:"Km 0–4",   terrain:"GKVK Campus Loop 1A",  pace:"7:30",hr:"~150",intensity:.45,color:C.green,  tip:"First 4km: settle in. Slow and controlled. Campus roads, gentle rolling. HR under 158."},
  {km:"Km 4–6",   terrain:"Adjacent Road Ext",     pace:"7:20",hr:"~155",intensity:.50,color:C.green,  tip:"Exit campus onto adjacent road. Flat. This is where you hit first aid station. Eat/drink."},
  {km:"Km 6–9",   terrain:"Rolling Campus Return", pace:"7:25",hr:"~158",intensity:.52,color:C.sky,    tip:"Back through campus. Rolling terrain. Enjoy the greenery. Stay mentally fresh."},
  {km:"Km 9–12.5",terrain:"Loop 1 Home Stretch",  pace:"7:15",hr:"~160",intensity:.55,color:C.sky,    tip:"Aid station at 12.5K. Stock up on electrolytes, banana, jaggery. Fuel for loop 2."},
  {km:"Km 12.5–16",terrain:"LOOP 2 — Start Fresh",pace:"7:30",hr:"~162",intensity:.58,color:C.blue,   tip:"Loop 2 start. HR will be same km, but effort feels harder. Expected. Stay patient."},
  {km:"Km 16–18", terrain:"Adjacent Road Return",  pace:"7:20",hr:"~165",intensity:.62,color:C.blue,   tip:"Second pass on adjacent road. Second aid station. Take electrolytes and keep moving."},
  {km:"Km 18–21", terrain:"Final Campus Stretch",  pace:"7:15",hr:"~168",intensity:.65,color:C.indigo, tip:"3–4km left. The body is tired, the mind knows it's close. Shorten stride, keep cadence."},
  {km:"Km 21–23", terrain:"Last Push",             pace:"7:05",hr:"~172",intensity:.72,color:C.indigo, tip:"Under 3km! Dig deep. This is where 25K winners are made. Drive knees forward."},
  {km:"Km 23–25", terrain:"FINISH SPRINT",         pace:"6:45",hr:"~178",intensity:.85,color:C.ultra,  tip:"FINAL 2KM — give everything. Target sub-2:55:00. Improve 17 minutes on Dec result!"},
];
const ultraWeeks=[
  {week:"Wk 1",dates:"Jul 6–12", label:"B10K Recovery",      km:20,color:C.green, intensity:.15},
  {week:"Wk 2",dates:"Jul 13–19",label:"Ultra Base + LSD 🔑",km:36,color:C.yellow,intensity:.55},
  {week:"Wk 3",dates:"Jul 20–25",label:"Race Week",          km:18,color:C.ultra, intensity:.20},
];

// ─── SEASON & LOG data ───
const MONTHLY=[
  {m:"Nov '25",km:78.7, runs:10,avgPace:"6:48",color:C.sky},
  {m:"Dec '25",km:90.1, runs:9, avgPace:"7:40",color:C.indigo},
  {m:"Jan '26",km:106.3,runs:15,avgPace:"7:25",color:C.sky},
  {m:"Feb '26",km:133.9,runs:18,avgPace:"7:22",color:C.blue},
  {m:"Mar '26",km:51.1, runs:7, avgPace:"6:45",color:C.cyan},
];
const WEEKLY=[
  {w:"Jan W1",km:22.0},{w:"Jan W2",km:32.1},{w:"Jan W3",km:29.1},{w:"Jan W4",km:23.1},
  {w:"Feb W1",km:17.9},{w:"Feb W2",km:14.6},{w:"Feb W3",km:24.3},{w:"Feb W4",km:46.6},
  {w:"Mar W1",km:53.9},{w:"Mar W2",km:11.7},
];
const PACE_TREND=[
  {r:"Nov 16",pace:6.55,hr:178,km:10.3,tag:"TRAIL"},{r:"Nov 26",pace:5.90,hr:175,km:9.2,tag:"TEMPO"},
  {r:"Dec 21",pace:7.67,hr:161,km:25.0,tag:"ULTRA"},{r:"Dec 31",pace:7.05,hr:162,km:12.5,tag:"LONG"},
  {r:"Jan 19",pace:6.95,hr:157,km:8.1, tag:"EASY"}, {r:"Feb 6", pace:6.13,hr:168,km:5.5,tag:"TEMPO"},
  {r:"Feb 26",pace:7.47,hr:155,km:10.0,tag:"LONG"}, {r:"Mar 1", pace:5.88,hr:180,km:10.0,tag:"RACE"},
  {r:"Mar 7", pace:7.13,hr:159,km:14.1,tag:"LONG"}, {r:"Mar 9", pace:6.02,hr:171,km:5.2,tag:"TEMPO"},
  {r:"Mar 10",pace:7.12,hr:153,km:6.6, tag:"STRIDES"},
];
const RACE_HISTORY=[
  {name:"Kaveri Trail 10K",      date:"Nov 16 '25",dist:"10.3km", time:"1:07:25",  pace:"6:33/km",hr:"178/192",elev:"+5m",  temp:"~26°C",color:C.mut,    status:"done",kcal:840, note:"Trail debut. HR 192 all-time max."},
  {name:"SBI Green 10K",         date:"Nov 30 '25",dist:"10.14km",time:"1:03:09",  pace:"6:14/km",hr:"175/187",elev:"+111m",temp:"~22°C",color:C.mut,    status:"done",kcal:760, note:"Km 4 surge → km 7 blowup. Key lesson learned."},
  {name:"Bengaluru Ultra 25K",   date:"Dec 21 '25",dist:"25.04km",time:"3:12:04",  pace:"7:40/km",hr:"161/188",elev:"+169m",temp:"~20°C",color:C.yellow, status:"done",kcal:2582,note:"Longest race. 169m elev, 3h12m. Massive aerobic base."},
  {name:"Karnataka Police Run",  date:"Mar 1 '26", dist:"10.02km",time:"58:53",    pace:"5:53/km",hr:"180/190",elev:"+39m", temp:"~24°C",color:C.green,  status:"done",kcal:889, note:"Season opener. Sub-60 smashed. PR by 4:16."},
  {name:"Namma Power Run",       date:"Mar 15 '26",dist:"10K",    time:"Target 57:30",pace:"5:45/km",hr:"—",  elev:"+90m", temp:"~33°C",color:C.namma,  status:"next",kcal:"~870",note:"NICE Road double climb. 4 days out. ⚡"},
  {name:"TCS World 10K",         date:"Apr 26 '26",dist:"10K",    time:"Target 54:50",pace:"5:29/km",hr:"—",  elev:"+50m", temp:"~32°C",color:C.tcs,    status:"goal",kcal:"~850",note:"Season 10K goal. Cubbon Road. Sub-55 target."},
  {name:"Freedom Bengaluru HM",  date:"May 24 '26",dist:"21.1km", time:"Target 2:20:00",pace:"6:38/km",hr:"—",elev:"+190m",temp:"~30°C",color:C.freedom,status:"new", kcal:"~1800",note:"First Half Marathon! NICE Road. Kalki Sports."},
  {name:"Bengaluru Runners Jatre 10K",date:"Jun 14 '26",dist:"10K",time:"Target 54:00",pace:"5:24/km",hr:"—",elev:"+20m", temp:"~26°C",color:C.jatre,  status:"new", kcal:"~820",note:"Community fun race. Bengaluru Runners Jatre. Flat fast course."},
  {name:"Bengaluru 10K Challenge",date:"Jul 5 '26", dist:"10K",   time:"Target 55:30",pace:"5:33/km",hr:"—",  elev:"+110m",temp:"~23°C",color:C.b10k,  status:"new", kcal:"~840",note:"The Tougher 10K. NICE Road. Godzilla Hill at km 7. Monsoon 🌧"},
  {name:"Bengaluru Ultra 25K",   date:"Jul 25 '26",dist:"25K",    time:"Target 2:55:00",pace:"7:00/km",hr:"—",elev:"+170m",temp:"~23°C",color:C.ultra,  status:"new", kcal:"~2200",note:"2-loop GKVK campus. Monsoon running. Improve on Dec 3:12:04."},
];
const ACTIVITY_LOG=[
  {date:"Mar 11",name:"Morning Badminton",    km:"—",  time:"1:25:43",pace:"—",   hr:134,tl:112,gear:"Court shoes",tag:"CROSS"},
  {date:"Mar 10",name:"Shakeout + 4 Strides",km:6.57, time:"46:43",  pace:"7:07",hr:153,tl:131,gear:"Novablast 5",tag:"STRIDES"},
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
const HR_ZONES=[
  {z:"Z1",name:"Recovery",  bpm:"0–118",  pct:4, hrs:"6.2h", c:"#1E3A5F"},
  {z:"Z2",name:"Aerobic",   bpm:"118–147",pct:18,hrs:"27.8h",c:C.green},
  {z:"Z3",name:"Tempo",     bpm:"147–162",pct:24,hrs:"37.1h",c:C.yellow},
  {z:"Z4",name:"Threshold", bpm:"162–177",pct:37,hrs:"57.2h",c:C.blue},
  {z:"Z5",name:"Max",       bpm:"177+",   pct:17,hrs:"26.3h",c:C.indigo},
];
const RACE_PHOTOS=[
  "https://dgtzuqphqg23d.cloudfront.net/vxKiGn2oacikweuoUL6yH9DUXfycHTzayJZRHNTG0m0-768x576.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/II20MgiGijGy_lyVGhq7aHQ1-D8gVd-EgNMlphYE0mk-576x768.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/zDiERLmR--Ct0HfiMArXUUpc_UT1s8FQdAYjurCibYU-768x576.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/YyOPrZ7I5cLQIgm0fjK-RAtl3N-Ta64XbiNqZlnLVoI-576x768.jpg",
  "https://dgtzuqphqg23d.cloudfront.net/Yekpedx4fhIPOlthemrgoA4QFB2BCVyX1nVyMFEz2mw-576x768.jpg",
];

const RACE_SWITCHER=[
  {id:0,short:"Police Run",   sub:"Mar 1 · Done",    badge:"✓ DONE",     accent:C.police, bgGrad:"linear-gradient(135deg,#060F0A,#081208)",target:"58:53",    pace:"5:53/km",   dist:"10K",
   stats:[["🏁","Dist","10.02km"],["⏱","Time","58:53"],["❤️","Avg HR","180"],["💪","Power","228W"]]},
  {id:1,short:"Namma Power",  sub:"Mar 15 · 4 days", badge:"⚡ 4 DAYS",   accent:C.namma,  bgGrad:"linear-gradient(135deg,#060A18,#08101A)",target:"57:30",    pace:"5:45/km",   dist:"10K",
   stats:[["📅","Date","Mar 15"],["📍","Course","NICE Road"],["⛰","Elev","+90m"],["🌡","Temp","~33°C"]]},
  {id:2,short:"TCS Open",     sub:"Apr 26 · 47 days",badge:"🎯 GOAL 10K",  accent:C.tcs,    bgGrad:"linear-gradient(135deg,#060A18,#080A1A)",target:"54:50",    pace:"5:29/km",   dist:"10K",
   stats:[["📅","Date","Apr 26"],["📍","Course","Cubbon Rd"],["⛰","Elev","+50m"],["🌡","Temp","~32°C"]]},
  {id:3,short:"Freedom HM",   sub:"May 24 · First HM",badge:"🏆 FIRST HM",  accent:C.freedom,bgGrad:"linear-gradient(135deg,#051418,#06181A)",target:"2:20:00",  pace:"6:38/km",   dist:"21.1K",
   stats:[["📅","Date","May 24"],["📍","Course","NICE Road"],["⛰","Elev","+190m"],["🌡","Temp","~30°C"]]},
  {id:4,short:"Jatre 10K",    sub:"Jun 14 · Fun Run", badge:"🎉 COMMUNITY",  accent:C.jatre,  bgGrad:"linear-gradient(135deg,#180614,#1A0816)",target:"54:00",    pace:"5:24/km",   dist:"10K",
   stats:[["📅","Date","Jun 14"],["📍","Course","City Roads"],["⛰","Elev","+20m"],["🌡","Temp","~26°C"]]},
  {id:5,short:"B10K Challenge",sub:"Jul 5 · Toughest",badge:"🦖 TOUGHEST",   accent:C.b10k,   bgGrad:"linear-gradient(135deg,#08061A,#0A081E)",target:"55:30",    pace:"5:33/km",   dist:"10K",
   stats:[["📅","Date","Jul 5"],["📍","Course","NICE Road"],["⛰","Elev","+110m"],["🌡","Temp","~23°C"]]},
  {id:6,short:"Ultra 25K",    sub:"Jul 25 · 2-Loop",  badge:"🔥 ULTRA",      accent:C.ultra,  bgGrad:"linear-gradient(135deg,#141005,#1A1408)",target:"2:55:00",  pace:"7:00/km",   dist:"25K",
   stats:[["📅","Date","Jul 25"],["📍","Course","GKVK Campus"],["⛰","Elev","+170m"],["🌡","Temp","~23°C"]]},
];

/* ════════════════════ SMALL SHARED COMPONENTS ════════════════════ */

function PhotoGallery(){
  const[active,setActive]=useState(0);
  return(
    <div>
      <div style={{height:240,overflow:"hidden",position:"relative",background:"#000"}}>
        <img src={RACE_PHOTOS[active]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.85}}
          onError={e=>{e.target.style.display="none"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(5,8,16,0.88),transparent 50%)"}}/>
        <div style={{position:"absolute",bottom:14,left:18}}>
          <div style={{fontSize:9,color:C.green,fontFamily:F.m,fontWeight:700,letterSpacing:"0.15em",marginBottom:4}}>📸 KARNATAKA POLICE RUN · MAR 1, 2026</div>
          <div style={{fontSize:22,fontFamily:F.h,color:C.white}}>{active+1} / {RACE_PHOTOS.length}</div>
        </div>
        {[-1,1].map(d=>(
          <button key={d} onClick={()=>setActive(a=>(a+d+RACE_PHOTOS.length)%RACE_PHOTOS.length)}
            style={{position:"absolute",top:"50%",transform:"translateY(-50%)",[d<0?"left":"right"]:12,
              background:"rgba(0,0,0,0.5)",border:`1px solid ${C.bdr2}`,color:C.white,
              width:34,height:34,borderRadius:"50%",fontSize:13,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            {d<0?"◀":"▶"}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:3,padding:3,background:C.bg}}>
        {RACE_PHOTOS.map((p,i)=>(
          <div key={i} onClick={()=>setActive(i)} style={{flex:1,height:46,overflow:"hidden",
            cursor:"pointer",border:`2px solid ${i===active?C.blue:"transparent"}`,
            borderRadius:4,opacity:i===active?1:.45,transition:"opacity .2s"}}>
            <img src={p} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElevSVG({pts,accent,labels=[]}){
  const W=560,H=80,pad=10,mx=Math.max(...pts),n=pts.length;
  const xy=pts.map((v,i)=>[pad+(i/(n-1))*(W-2*pad),H-pad-(v/mx)*(H-2*pad)]);
  return(
    <svg viewBox={`0 0 ${W} ${H+18}`} style={{width:"100%",height:"auto"}}>
      <defs><linearGradient id={`eg${accent}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accent} stopOpacity=".35"/>
        <stop offset="100%" stopColor={accent} stopOpacity=".02"/>
      </linearGradient></defs>
      <path d={`M ${pad},${H-pad} L ${xy.map(p=>p.join(",")).join(" L ")} L ${W-pad},${H-pad} Z`} fill={`url(#eg${accent})`}/>
      <path d={`M ${xy.map(p=>p.join(",")).join(" L ")}`} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round"/>
      {[0,25,50,75,100].map((pct,i)=>{
        const d=pct/100;
        const label=labels[i]||`${Math.round(d*(n-1)/n*10)}km`;
        return <text key={i} x={pad+d*(W-2*pad)} y={H+14} textAnchor="middle" fill={C.mut} fontSize="9" fontFamily="monospace">{label}</text>;
      })}
    </svg>
  );
}

function SBIContent(){
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
        <SLabel children="Km-by-Km Blueprint" col={C.sky}/>
        {sbiKmData.map((d,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",
            borderBottom:i<sbiKmData.length-1?`1px solid ${C.bdr}`:"none"}}>
            <div style={{width:38,fontSize:13,fontFamily:F.h,color:d.flag?C.red:C.sec,flexShrink:0}}>{d.km}</div>
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
            {d.flag&&<div style={{width:20,height:20,borderRadius:"50%",background:C.red,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,flexShrink:0}}>⚠</div>}
          </div>
        ))}
      </div>
      <div style={{background:"rgba(248,113,113,0.06)",border:`1px solid ${C.red}33`,borderRadius:12,padding:14,marginBottom:12}}>
        <SLabel children="3 Mistakes at SBI" col={C.red}/>
        {[["Km 4 surge (5:18/km)","Ran 30+ sec/km faster than plan. Burned matches early."],
          ["Km 7 blowup (7:05/km)","Direct consequence of km 4. HR hit 182+ on the climb."],
          ["Km 8 power collapse","Lowest wattage of the race. Tank was empty."]].map(([t,d],i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<2?`1px solid ${C.bdr}`:"none"}}>
            <span style={{color:C.red,fontWeight:700,fontFamily:F.b,minWidth:20}}>#{i+1}</span>
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
      </div>
    </div>
  );
}

function KmByKm({segs}){
  return(
    <div>
      {segs.map((s,i)=>(
        <div key={i} style={{background:C.faint,borderRadius:10,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${s.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:s.color,minWidth:72,fontFamily:F.h,letterSpacing:"0.3px"}}>{s.km}</span>
              <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{s.terrain}</span>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
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
  );
}

function WeekPlan({weeks}){
  const[hov,setHov]=useState(null);
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
        <SLabel children="Weekly Volume (km)"/>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeks} barSize={36}>
            <XAxis dataKey="week" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Bar dataKey="km" radius={[5,5,0,0]}>{weeks.map((w,i)=><Cell key={i} fill={hov===i?w.color:w.color+"88"}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {weeks.map((wk,i)=>(
        <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
          style={{background:C.card,border:`1px solid ${hov===i?wk.color+"44":C.bdr}`,
            borderLeft:`3px solid ${wk.color}`,borderRadius:10,padding:12,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
            <div><span style={{fontSize:15,fontWeight:700,color:wk.color,fontFamily:F.h,marginRight:8}}>{wk.week}</span>
              <span style={{fontSize:13,fontWeight:600,color:C.pri,fontFamily:F.b}}>{wk.label}</span></div>
            <div style={{textAlign:"right"}}>
              <span style={{fontSize:18,fontFamily:F.h,color:C.white}}>{wk.km}km</span>
              <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{wk.dates}</div>
            </div>
          </div>
          <IBar val={wk.intensity} color={wk.color}/>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════ GPS ROUTE DATA ════════════════════ */

/* ════════════════════ ROUTE MAP SVG COMPONENT ════════════════════ */
/* ════════════════════ RACE COMPONENTS ════════════════════ */

function PoliceRun(){
  const[tab,setTab]=useState(0);
  const tabs=["Race Stats","Heart Rate","Pace","Takeaways"];
  const accent=C.police;
  return(
    <>
      <div style={{background:"#081410",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>COMPLETED — Mar 1, 2026 · Bengaluru</span>
          <div style={{marginLeft:"auto"}}><Pill c={accent}>✓ SUB-60 ACHIEVED</Pill></div>
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
              {[["🏁","Distance","10.02 km"],["⏱","Time","58:53"],["⚡","Pace","5:53/km"],
                ["❤️","Avg HR","180 bpm"],["🔥","Max HR","190 bpm"],["💪","Power","228W NP"]].map(([ic,l,v])=>(
                <div key={l} style={{background:C.faint,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:15,marginBottom:4}}>{ic}</div>
                  <div style={{fontSize:16,fontFamily:F.h,color:C.white}}>{v}</div>
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
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={policeHRData} margin={{left:0,right:0,top:4,bottom:0}}>
                <defs><linearGradient id="phr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={.4}/>
                  <stop offset="100%" stopColor={accent} stopOpacity={.02}/>
                </linearGradient></defs>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[110,195]} hide/>
                <Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:8,padding:"5px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.sec}}>{payload[0].payload.d}km</div><div style={{color:accent}}>{payload[0].value} bpm</div></div>);}}/>
                <ReferenceLine y={180} stroke={accent} strokeDasharray="3 3" strokeOpacity={.4}/>
                <Area type="monotone" dataKey="hr" stroke={accent} strokeWidth={2} fill="url(#phr)" dot={false} activeDot={{r:3,fill:accent}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        {tab===2&&(
          <div>
            <SLabel children="Pace per Km" col={accent}/>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={policePaceData} barSize={26}>
                <XAxis dataKey="km" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`km ${v}`}/>
                <YAxis hide domain={[5.5,6.3]}/>
                <ReferenceLine y={5.88} stroke={accent} strokeDasharray="3 3" strokeOpacity={.5}/>
                <Bar dataKey="pace" radius={[4,4,0,0]}>{policePaceData.map((d,i)=><Cell key={i} fill={d.pace<5.9?accent:d.pace<6.0?C.sky:C.mut}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:12}}>
              <SLabel children="What Worked ✅" col={accent}/>
              {[["Even splits","First 5km: 29:15 · Second 5km: 29:38. Only 23 sec positive split."],
                ["Power output","228W Normalized Power. Highest ever race watt."],
                ["Race execution","Started controlled, built pace, finished strong."]].map(([t,d],i,arr)=>(
                <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                  <span style={{fontSize:16,width:20}}>✅</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                    <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NammaRun(){
  const[tab,setTab]=useState(0);
  const tabs=["Race Plan","SBI Analysis","Route & Elev","Training Week","Race Morning"];
  const accent=C.namma;
  return(
    <>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:10,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.06em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(<div><div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}><SLabel children="Km-by-Km Strategy"/><KmByKm segs={nammaSegs}/></div>
          <div style={{background:`rgba(96,165,250,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="⚡ Mental Cue — Km 7–8" col={accent}/>
            <div style={{fontSize:16,fontWeight:700,color:C.white,lineHeight:1.5,fontFamily:F.b}}>"Shorten stride. Keep cadence 88+. Keep moving."</div>
          </div></div>)}
        {tab===1&&<SBIContent/>}
        {tab===2&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="NICE Road Elevation (Out & Back)"/>
            <ElevSVG pts={NAMMA_ELEV} accent={accent} labels={["0km","2.5km","5km","7.5km","10km"]}/>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
            {[["📍","Start/Finish","Hoskerehalli Toll Junction, NICE Road"],["↕️","Key Climb","0.83km · 5.7% avg · 13% max"],["🔄","Format","Out-and-back · Climb appears twice"],["🌡️","Forecast","~33°C · Start 6:00 AM"]].map(([ic,l,v],i,arr)=>(
              <div key={l} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:18}}>{ic}</span>
                <div><div style={{fontSize:10,color:C.mut,textTransform:"uppercase",fontWeight:600,fontFamily:F.b}}>{l}</div>
                  <div style={{fontSize:13,color:C.pri,marginTop:2,fontFamily:F.b}}>{v}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===3&&(<div>
          {nammaTraining.map((day,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8,padding:"12px 14px",
              background:day.isRace?`rgba(96,165,250,0.06)`:day.done?`rgba(52,211,153,0.04)`:C.card,
              border:`1px solid ${day.isRace?accent+"55":day.done?day.light+"44":C.bdr}`,
              borderRadius:10,borderLeft:`3px solid ${day.light}`,opacity:(!day.done&&!day.isRace&&i>4)?.72:1}}>
              <div style={{fontSize:20,lineHeight:1,paddingTop:2}}>{day.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,fontWeight:700,color:day.light,fontFamily:F.h,letterSpacing:"0.5px"}}>{day.label}</span>
                    {day.done&&<Pill c={C.green}>✓ Done</Pill>}
                  </div>
                  <span style={{fontSize:11,color:C.mut,fontFamily:F.b}}>{day.date}</span>
                </div>
                <div style={{fontSize:12,color:day.done?"#86EFAC88":C.sec,marginTop:2,lineHeight:1.6,fontFamily:F.b}}>{day.desc}</div>
              </div>
            </div>
          ))}</div>)}
        {tab===4&&(<div>
          <SLabel children="Mar 15 Morning Timeline"/>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:52,top:16,bottom:16,width:1,background:`linear-gradient(to bottom,${accent}44,${accent},${accent}44)`}}/>
            {[{t:"4:45 AM",a:"Wake Up",ic:"💧",d:"Drink 400ml water immediately.",fire:false},
              {t:"5:00 AM",a:"Pre-race Fuel",ic:"🍌",d:"2 bananas + salt in 200ml water.",fire:false},
              {t:"5:20 AM",a:"Leave Home",ic:"🚗",d:"Arrive early. Beat traffic, beat heat.",fire:false},
              {t:"5:40 AM",a:"Warmup",ic:"🤸",d:"Leg swings → hip circles → high knees.",fire:false},
              {t:"5:50 AM",a:"Strides",ic:"⚡",d:"80m × 2 at 5:50/km.",fire:false},
              {t:"6:00 AM",a:"🏅 RACE START",ic:"🔥",d:"Namma Power Run 2026.",fire:true},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,position:"relative"}}>
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
          </div></div>)}
      </div>
    </>
  );
}

function TCSRun(){
  const[tab,setTab]=useState(0);
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
        {tab===0&&<KmByKm segs={tcsKms}/>}
        {tab===1&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Elevation Profile — TCS Course"/>
            <div style={{fontSize:11,color:C.mut,marginBottom:10,fontFamily:F.b}}>826–908m · +50m total · Max 7.5%</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={tcsElev} margin={{left:0,right:0,top:8,bottom:0}}>
                <defs><linearGradient id="te" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={.3}/>
                  <stop offset="100%" stopColor={accent} stopOpacity={.02}/>
                </linearGradient></defs>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[880,915]} tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}m`} width={36}/>
                <ReferenceLine x={4.3} stroke={C.red} strokeDasharray="4 3" strokeOpacity={.5}/>
                <ReferenceLine x={5.0} stroke={C.red} strokeDasharray="4 3" strokeOpacity={.5}/>
                <Area type="monotone" dataKey="alt" stroke={accent} strokeWidth={2.5} fill="url(#te)" dot={false} activeDot={{r:4,fill:accent}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
            <SLabel children="Grade Per Section"/>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={tcsElev} barSize={7}>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[-2,3]} hide/>
                <ReferenceLine y={0} stroke={C.bdr2}/>
                <Bar dataKey="grade" radius={[2,2,0,0]}>{tcsElev.map((d,i)=><Cell key={i} fill={d.grade>1.5?C.red:d.grade>.3?C.orange:d.grade<-.5?C.green:C.bdr2}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div></div>)}
        {tab===2&&<WeekPlan weeks={tcsWeeks}/>}
        {tab===3&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginBottom:12}}>
            {[{t:"4:30 AM",a:"Wake Up",d:"400ml water. Light stretch."},
              {t:"5:00 AM",a:"Pre-race Fuel",d:"2 bananas + salt water."},
              {t:"5:45 AM",a:"Leave Home",d:"Cubbon Park area. Arrive 6:00 AM."},
              {t:"6:10 AM",a:"WAVE START",d:"TCS World 10K 2026 · Target Sub-55:00."},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.bdr}`:"none"}}>
                <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{it.a}</div>
                  <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(129,140,248,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="BIB Info" col={accent}/>
            <div style={{fontSize:13,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
              Apr 23–24 at <strong style={{color:C.white}}>Get Active Expo</strong> · Submit Namma result for wave seeding. Wear COROS and Novablast 5.
            </div>
          </div></div>)}
      </div>
    </>
  );
}

function FreedomHM(){
  const[tab,setTab]=useState(0);
  const tabs=["HM Race Plan","Route & Elev","4-Week Build","Race Morning"];
  const accent=C.freedom;
  return(
    <>
      <div style={{background:"#051416",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>FREEDOM BENGALURU HALF MARATHON · MAY 24, 2026 · NICE ROAD</span>
          <div style={{marginLeft:"auto"}}><Pill c={accent}>🏆 FIRST 21.1K</Pill></div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:10,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.06em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(<div>
          <div style={{background:`rgba(34,211,238,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>🏆 Your First Half Marathon — Key Mindset</div>
            <div style={{fontSize:13,color:C.white,lineHeight:1.7,fontFamily:F.b}}>
              21.1km is more than double a 10K. The golden rule: <strong style={{color:accent}}>if it feels easy at km 8, that's exactly right.</strong> Don't race the first half. Anyone who goes out fast at an HM pays dearly at km 16+.
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Section-by-Section Strategy" col={accent}/>
            <KmByKm segs={freedomSegs}/>
          </div>
          <div style={{background:C.faint,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="⚡ Mental Cues" col={accent}/>
            {[["Km 8","Should feel: conversational. If you're gasping — you've gone too fast."],
              ["Km 13","Halfway done. HR ~165. This is where the race begins."],
              ["Km 18.5","Last major hill. Shorten stride. You've done it before on Namma!"],
              ["Km 21","Sub-2:20 is coming. Trust your training."]].map(([k,d],i,arr)=>(
              <div key={k} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <div style={{width:40,flexShrink:0,fontSize:13,fontFamily:F.h,color:accent,letterSpacing:"0.3px"}}>{k}</div>
                <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div></div>)}
        {tab===1&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="NICE Road HM Elevation (21.1K Out & Back)"/>
            <div style={{fontSize:11,color:C.mut,marginBottom:10,fontFamily:F.b}}>~190m total elevation · Same NICE Road as Namma Power Run · Climbs appear 4× total</div>
            <ElevSVG pts={FREEDOM_ELEV} accent={accent} labels={["0","5K","10K","16K","21.1K"]}/>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Race Facts"/>
            {[["📍","Start/Finish","NICE Road, Hoskerehalli Toll Junction"],["🏁","Organiser","Kalki Sports India — 2nd Edition"],["⏰","Start Time","6:00 AM (HM category)"],["⛰","Elevation","~190m total (climb appears 4×)"],["✂️","Cutoff","240 minutes (4 hours)"],["🌡","May Weather","~28–32°C · Start: ~24°C · Get hotter fast"],["💧","Hydration","Aid stations every ~2.5km — use all of them"]].map(([ic,l,v],i,arr)=>(
              <div key={l} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:18}}>{ic}</span>
                <div><div style={{fontSize:10,color:C.mut,textTransform:"uppercase",fontWeight:600,fontFamily:F.b}}>{l}</div>
                  <div style={{fontSize:13,color:C.pri,marginTop:2,fontFamily:F.b}}>{v}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(34,211,238,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="Vs Namma Power Run" col={accent}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Namma 10K","10km","5:45/km","~90m","Mar","⚡"],["Freedom HM","21.1km","6:38/km","~190m","May","🏆"]].map(([n,d,p,e,m,ic])=>(
                <div key={n} style={{background:C.faint,borderRadius:10,padding:"12px 12px",textAlign:"center"}}>
                  <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                  <div style={{fontSize:14,fontFamily:F.h,color:C.white,letterSpacing:"0.5px",marginBottom:4}}>{n}</div>
                  <div style={{fontSize:11,color:C.sec,fontFamily:F.b,lineHeight:1.7}}>{d} · {p}<br/>{e} elev · {m}</div>
                </div>
              ))}
            </div>
          </div></div>)}
        {tab===2&&(<div>
          <div style={{background:`rgba(34,211,238,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Post-TCS HM Build (Apr 27 – May 24)</div>
            <div style={{fontSize:12,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
              4-week build from TCS recovery to HM race day. Key session is the <strong style={{color:C.white}}>Wk 3 long run of 16–18km</strong> — your longest run ever, at easy pace. This is the HM confidence builder.
            </div>
          </div>
          <WeekPlan weeks={freedomWeeks}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginTop:12}}>
            <SLabel children="Key Sessions"/>
            {[["Wk 2 — Long Run","14km @ 7:30/km. Easy pace. Don't rush. Building HM-specific endurance."],
              ["Wk 2 — Tempo","6km tempo @ 6:15/km. Building HM cruise pace."],
              ["Wk 3 — HM Sim 🔑","16–18km on NICE Road @ 6:50/km. Your most important workout."],
              ["Wk 4 — Shakeout","4km easy + 4 strides. Legs fresh going into race day."]].map(([t,d],i,arr)=>(
              <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:accent,marginTop:5,flexShrink:0}}/>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===3&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginBottom:12}}>
            <SLabel children="May 24 Morning Timeline"/>
            {[{t:"4:00 AM",a:"Wake Up",d:"400ml water. First HM — sleep will be broken. That's normal."},
              {t:"4:30 AM",a:"Breakfast",d:"Rice + dal OR banana + oats. Digestible carbs only."},
              {t:"5:10 AM",a:"Leave Home",d:"Arrive well before 5:45. Hoskerehalli gets busy."},
              {t:"5:35 AM",a:"Warmup",d:"10min easy jog + leg swings + hip circles."},
              {t:"5:50 AM",a:"Strides",d:"2×80m at 6:00/km. Prime the engine."},
              {t:"6:00 AM",a:"🏆 RACE START",d:"Freedom Bengaluru Half Marathon. Target 2:20:00."},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<5?`1px solid ${C.bdr}`:"none"}}>
                <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:it.a.includes("RACE")?accent:C.white,fontFamily:F.b}}>{it.a}</div>
                  <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(34,211,238,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="💧 HM Hydration Strategy" col={accent}/>
            {[["Night before","500ml + 300ml coconut water before sleep"],["Morning","400ml at wake + 200ml with breakfast"],["Each aid station","100–150ml water · DO NOT skip any station"],["Electrolytes","Take at every 2nd station from km 6 onwards"],["Finish line","Coconut water + ORS immediately · Keep walking"]].map(([w,v],i,arr)=>(
              <div key={i} style={{display:"flex",gap:12,paddingBottom:8,marginBottom:8,borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:11,color:accent,width:85,flexShrink:0,fontWeight:600,fontFamily:F.b}}>{w}</span>
                <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{v}</span>
              </div>
            ))}
          </div></div>)}
      </div>
    </>
  );
}

function DishaJatre(){
  const[tab,setTab]=useState(0);
  const tabs=["Race Plan","3-Week Build","Race Morning"];
  const accent=C.jatre;
  return(
    <>
      <div style={{background:"#180614",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>DISHA HABITAT BENGALURU RUNNERS JATRE · JUN 14, 2026</span>
          <div style={{marginLeft:"auto"}}><Pill c={accent}>🎉 COMMUNITY RUN</Pill></div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 6px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(<div>
          <div style={{background:`rgba(244,114,182,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>About Bengaluru Runners Jatre</div>
            <div style={{fontSize:13,color:C.white,lineHeight:1.7,fontFamily:F.b}}>
              "Jatre" means <strong style={{color:accent}}>festival/fair</strong> in Kannada — this is a celebration run organized by your own club, Bengaluru Runners. <strong style={{color:C.white}}>Flat, fast, fun.</strong> Great opportunity to chase sub-54 on a friendly course. You know the community, you know the roads.
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Km-by-Km Race Plan" col={accent}/>
            <KmByKm segs={jatre10kSegs}/>
          </div>
          <div style={{background:C.faint,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="Race Facts" col={accent}/>
            {[["📍","Organiser","Bengaluru Runners — your club"],["🏆","Distance","10K timed"],["🌡","June Weather","~25–28°C · Monsoon season · May rain 🌧"],["⏱","Target","54:00 (5:24/km)"],["💡","Strategy","Flat course — this is your sub-54 attempt. Push."]].map(([ic,l,v],i,arr)=>(
              <div key={l} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:18}}>{ic}</span>
                <div><div style={{fontSize:10,color:C.mut,textTransform:"uppercase",fontWeight:600,fontFamily:F.b}}>{l}</div>
                  <div style={{fontSize:13,color:C.pri,marginTop:2,fontFamily:F.b}}>{v}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===1&&(<div>
          <div style={{background:`rgba(244,114,182,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Post-HM Recovery → Jatre (May 25 – Jun 14)</div>
            <div style={{fontSize:12,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
              3-week block. Week 1 is pure recovery from HM legs. Week 2 sharpens speed. Week 3 is taper. Key session: <strong style={{color:C.white}}>3×1km intervals @ 5:15/km</strong> in Week 2.
            </div>
          </div>
          <WeekPlan weeks={jatreWeeks}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginTop:12}}>
            <SLabel children="Key Sessions"/>
            {[["Wk 1 — Jog Only","30–40min easy runs only. HM legs need a full week off hard effort."],
              ["Wk 2 — Speed Work 🔑","3×1km @ 5:15/km with 2min recovery. Sharpen race pace neurons."],
              ["Wk 2 — Fartlek","6km with 6×1min surges at 5:00/km. Race sharpness."],
              ["Wk 3 — Shakeout","4km easy + 4 strides. Fresh for Jatre race day."]].map(([t,d],i,arr)=>(
              <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:accent,marginTop:5,flexShrink:0}}/>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===2&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14}}>
            <SLabel children="Jun 14 Morning Timeline"/>
            {[{t:"5:00 AM",a:"Wake Up",d:"400ml water immediately."},
              {t:"5:20 AM",a:"Breakfast",d:"Banana + peanut butter toast. Light and fast-digesting."},
              {t:"5:50 AM",a:"Leave Home",d:"Community run — arrive 30min early for warmup."},
              {t:"6:15 AM",a:"Warmup",d:"10min easy jog with the group + strides."},
              {t:"6:30 AM",a:"🎉 RACE START",d:"Bengaluru Runners Jatre 2026 · Target 54:00!"},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<4?`1px solid ${C.bdr}`:"none"}}>
                <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:it.a.includes("RACE")?accent:C.white,fontFamily:F.b}}>{it.a}</div>
                  <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
              </div>
            ))}
          </div></div>)}
      </div>
    </>
  );
}

function Bengaluru10K(){
  const[tab,setTab]=useState(0);
  const tabs=["Km Breakdown","Elevation","3-Week Build","Race Morning"];
  const accent=C.b10k;
  return(
    <>
      <div style={{background:"#08061A",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>BENGALURU 10K CHALLENGE · "THE TOUGHER 10K" · JUL 5, 2026 · NICE ROAD</span>
          <div style={{marginLeft:"auto"}}><Pill c={accent}>🦖 110M ELEV</Pill></div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:10,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.06em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(<div>
          <div style={{background:`rgba(167,139,250,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>🦖 The Tougher 10K — What To Expect</div>
            <div style={{fontSize:13,color:C.white,lineHeight:1.7,fontFamily:F.b}}>
              11-year-old race, 10,000 runners. NICE Road out-and-back with <strong style={{color:accent}}>110m total elevation gain</strong>. The km 7 "Godzilla Hill" is the hardest km on any Bengaluru race course. Net downhill course — if paced right, you'll be flying in km 9-10. July = monsoon = <strong style={{color:C.cyan}}>cool 22°C</strong> — perfect racing weather!
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Km-by-Km Race Strategy" col={accent}/>
            <KmByKm segs={b10kSegs}/>
          </div>
          <div style={{background:`rgba(248,113,113,0.06)`,border:`1px solid ${C.red}33`,borderRadius:12,padding:14}}>
            <SLabel children="🦖 Godzilla Hill — Km 7 Survival Guide" col={C.red}/>
            <div style={{fontSize:14,fontWeight:700,color:C.white,lineHeight:1.5,fontFamily:F.b,marginBottom:10}}>
              "You cannot ignore Godzilla. So embrace him."
            </div>
            {["Shorten stride immediately entering km 7","Count to 100 — or count steps — to distract the mind",
              "Group up with runners of similar pace. Don't be alone.",
              "Accept that your pace will drop — everyone's does",
              "At km 7 end: Sharp uphill crests. Open up instantly!"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"5px 0",fontSize:12,color:C.sec,fontFamily:F.b}}>
                <span style={{color:C.red,flexShrink:0}}>{"⚡"}</span>{t}
              </div>
            ))}
          </div></div>)}
        {tab===1&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Bengaluru 10K Challenge — Elevation Profile"/>
            <div style={{fontSize:11,color:C.mut,marginBottom:10,fontFamily:F.b}}>NICE Road · 110m total elevation · Net downhill · One U-turn at 5km</div>
            <ResponsiveContainer width="100%" height={155}>
              <AreaChart data={b10kElev} margin={{left:0,right:0,top:8,bottom:0}}>
                <defs><linearGradient id="b10ke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={.3}/>
                  <stop offset="100%" stopColor={accent} stopOpacity={.02}/>
                </linearGradient></defs>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[890,938]} tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}m`} width={36}/>
                <ReferenceLine x={7} stroke={C.red} strokeDasharray="4 3" strokeOpacity={.6}/>
                <ReferenceLine x={7.1} stroke={C.red} strokeDasharray="4 3" strokeOpacity={.6}/>
                <Area type="monotone" dataKey="alt" stroke={accent} strokeWidth={2.5} fill="url(#b10ke)" dot={false} activeDot={{r:4,fill:accent}}/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{fontSize:10,color:C.red,fontFamily:F.b,marginTop:6,textAlign:"center"}}>🦖 Godzilla Hill peak at km 7–7.1</div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
            <SLabel children="Elevation Grade Per Section"/>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={b10kElev} barSize={10}>
                <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                <YAxis domain={[-2.5,2.5]} hide/>
                <ReferenceLine y={0} stroke={C.bdr2}/>
                <Bar dataKey="g" radius={[2,2,0,0]}>{b10kElev.map((d,i)=><Cell key={i} fill={d.g>1.5?C.red:d.g>.3?C.orange:d.g<-.5?C.green:C.bdr2}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div></div>)}
        {tab===2&&(<div>
          <div style={{background:`rgba(167,139,250,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Post-Jatre → B10K (Jun 15 – Jul 5)</div>
            <div style={{fontSize:12,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
              3-week block with key focus on <strong style={{color:C.white}}>hill training</strong>. The NICE Road hill must be rehearsed. Godzilla Hill can't surprise you if you've been doing hill repeats all week.
            </div>
          </div>
          <WeekPlan weeks={b10kWeeks}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginTop:12}}>
            <SLabel children="Key Sessions"/>
            {[["Wk 2 — Hill Repeats 🔑","6×200m hill repeats on NICE Road or equivalent. Build Godzilla Hill legs."],
              ["Wk 2 — Course Recon","Full 10K on NICE Road at easy pace. Know every hill."],
              ["Wk 2 — Tempo","5km tempo @ 5:40/km. Race-pace conditioning."],
              ["Wk 3 — Shakeout","4km easy + 6 strides. Last hard session Mon. Rest Wed–Fri."]].map(([t,d],i,arr)=>(
              <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:accent,marginTop:5,flexShrink:0}}/>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===3&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginBottom:12}}>
            <SLabel children="Jul 5 Morning Timeline"/>
            {[{t:"5:00 AM",a:"Wake Up",d:"400ml water. July monsoon — cooler start. Good."},
              {t:"5:20 AM",a:"Breakfast",d:"Banana + oats. Light."},
              {t:"5:50 AM",a:"Leave Home",d:"NICE Road, Hoskerehalli. Arrive by 6:00 AM."},
              {t:"6:00 AM",a:"Warmup",d:"Easy jog 10min + hill drills + strides."},
              {t:"6:15 AM",a:"🦖 RACE START",d:"Bengaluru 10K Challenge · Target Sub-55:30!"},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<4?`1px solid ${C.bdr}`:"none"}}>
                <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:it.a.includes("RACE")?accent:C.white,fontFamily:F.b}}>{it.a}</div>
                  <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(167,139,250,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="Monsoon Race Tips 🌧" col={C.cyan}/>
            {["Wear anti-chafe — wet fabric = chafing after 6km",
              "Test your shoes in wet conditions before race day",
              "Rain in July is cooling — it's actually an advantage",
              "Start slightly conservative — wet roads = risk of slipping on turns",
              "Bring dry change of clothes to the venue"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"5px 0",fontSize:12,color:C.sec,fontFamily:F.b}}>
                <span style={{color:C.cyan,flexShrink:0}}>🌧</span>{t}
              </div>
            ))}
          </div></div>)}
      </div>
    </>
  );
}

function BengaluruUltra(){
  const[tab,setTab]=useState(0);
  const tabs=["Ultra Plan","2-Loop Route","3-Week Build","Race Morning"];
  const accent=C.ultra;
  return(
    <>
      <div style={{background:"#141005",padding:"8px 16px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:600}}>BENGALURU ULTRA 25K · JUL 25, 2026 · GKVK CAMPUS</span>
          <div style={{marginLeft:"auto"}}><Pill c={accent}>🔥 2 LOOPS</Pill></div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.bdr}`,overflowX:"auto"}}>
        {tabs.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",background:"transparent",
          border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",
          color:tab===i?accent:C.mut,cursor:"pointer",fontSize:10,fontFamily:F.b,textTransform:"uppercase",
          letterSpacing:"0.06em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"18px 16px"}}>
        {tab===0&&(<div>
          <div style={{background:`rgba(252,211,77,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>You've Run This Before</div>
            <div style={{fontSize:13,color:C.white,lineHeight:1.7,fontFamily:F.b}}>
              Your Dec 2025 result: <strong style={{color:C.yellow}}>3:12:04 (7:40/km)</strong>. Target for Jul 2026: <strong style={{color:accent}}>2:55:00 (7:00/km)</strong> — a 17-minute improvement. 7 months of consistent training makes this achievable. <strong style={{color:C.white}}>The key: LOOP 2 management.</strong> In Dec you likely slowed significantly in loop 2. This time, even pacing through both loops.
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="Section-by-Section Strategy" col={accent}/>
            <KmByKm segs={ultraSegs}/>
          </div>
          <div style={{background:C.faint,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="Comparison: Dec '25 vs Jul '26 Target" col={accent}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Dec 2025","3:12:04","7:40/km","169m","~20°C","Raw ultra debut"],
                ["Jul 2026","2:55:00","7:00/km","~170m","~23°C","Trained ultra runner"]].map(([d,t,p,e,temp,note])=>(
                <div key={d} style={{background:C.card,borderRadius:10,padding:"12px 12px"}}>
                  <div style={{fontSize:13,fontFamily:F.h,color:d.includes("2026")?accent:C.mut,letterSpacing:"0.5px",marginBottom:6}}>{d}</div>
                  <div style={{fontSize:20,fontFamily:F.h,color:C.white,letterSpacing:"0.3px",lineHeight:1}}>{t}</div>
                  <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginTop:4,lineHeight:1.6}}>{p} · {e} elev<br/>{temp} · {note}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,height:5,background:C.bdr,borderRadius:3}}>
              <div style={{height:"100%",width:"91%",background:`linear-gradient(to right,${C.yellow},${accent})`,borderRadius:3}}/>
            </div>
            <div style={{fontSize:10,color:C.sec,fontFamily:F.b,marginTop:4,textAlign:"center"}}>-17 minutes improvement target · 91% of Dec pace</div>
          </div></div>)}
        {tab===1&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12}}>
            <SLabel children="GKVK Campus — 2-Loop Course"/>
            <div style={{fontSize:11,color:C.mut,marginBottom:10,fontFamily:F.b}}>GKVK Agricultural University, Hesaraghatta Main Road · Each loop = 12.5K · Rolling terrain</div>
            <ElevSVG pts={[0,8,15,22,30,38,44,50,55,58,60,58,54,49,43,36,29,22,15,9,4,1,0,5,12,20,28,36,43,49,54,58,60,58,54,48,42,35,27,20,13,7,3,0]} accent={accent} labels={["0","6K","12.5K","19K","25K"]}/>
            <div style={{marginTop:8,fontSize:11,color:C.sec,fontFamily:F.b,lineHeight:1.7}}>
              Loop structure: You start at GKVK campus, run through the <strong style={{color:C.white}}>scenic campus roads</strong>, exit onto an <strong style={{color:C.white}}>adjacent road</strong> at ~5km, return through campus to the start at 12.5km for a water break — then repeat.
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
            <SLabel children="Course Details"/>
            {[["📍","Location","GKVK Campus, Hesaraghatta Main Road, Bengaluru"],["🔄","Format","2 loops of 12.5K each"],["🌿","Terrain","Rolling hills · Paved campus roads + dirt paths"],["💧","Aid Stations","Every ~5km · Water, electrolytes, banana, jaggery"],["✂️","Cutoff","3 hours 30 minutes"],["🌧","July Weather","~22–25°C · Monsoon · Cool & humid"],["👟","Shoe Advice","Road shoes OK · Some dirt sections"]].map(([ic,l,v],i,arr)=>(
              <div key={l} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:18}}>{ic}</span>
                <div><div style={{fontSize:10,color:C.mut,textTransform:"uppercase",fontWeight:600,fontFamily:F.b}}>{l}</div>
                  <div style={{fontSize:13,color:C.pri,marginTop:2,fontFamily:F.b}}>{v}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===2&&(<div>
          <div style={{background:`rgba(252,211,77,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:accent,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Post-B10K → Ultra (Jul 6–25)</div>
            <div style={{fontSize:12,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
              3-week ultra build. Key session is <strong style={{color:C.white}}>Wk 2 LSD (Long Slow Distance) of 18–20km</strong> at easy pace — this primes ultra endurance and reminds legs what long distance feels like.
            </div>
          </div>
          <WeekPlan weeks={ultraWeeks}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginTop:12}}>
            <SLabel children="Key Sessions"/>
            {[["Wk 1 — Jog Only","Short 30–40min easy runs. Legs recovering from B10K."],
              ["Wk 2 — LSD 🔑","18–20km at 7:30–8:00/km on GKVK or NICE Road. Crucial endurance primer."],
              ["Wk 2 — Mid Run","10km steady @ 7:15/km. Practice fuelling on the run."],
              ["Wk 3 — Shakeout","4km easy + 4 strides. Sleep 8+ hours. Full rest Fri–Sat."]].map(([t,d],i,arr)=>(
              <div key={t} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:accent,marginTop:5,flexShrink:0}}/>
                <div><div style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b}}>{t}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5,marginTop:2}}>{d}</div></div>
              </div>
            ))}
          </div></div>)}
        {tab===3&&(<div>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:14,marginBottom:12}}>
            <SLabel children="Jul 25 Morning Timeline"/>
            {[{t:"4:00 AM",a:"Wake Up",d:"Ultra day. 400ml water. Light stretch. Calm mind."},
              {t:"4:30 AM",a:"Breakfast",d:"Rice + dal + banana. Substantial carb load. This fuels 3 hours."},
              {t:"5:15 AM",a:"Leave Home",d:"GKVK is ~30km from Bengaluru. Leave with buffer."},
              {t:"5:50 AM",a:"Arrive + Warmup",d:"Easy 10min jog + dynamic stretch. Don't rush."},
              {t:"6:00 AM",a:"🔥 RACE START",d:"Bengaluru Ultra 25K · Target 2:55:00. Improve 17 min!"},
            ].map((it,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<4?`1px solid ${C.bdr}`:"none"}}>
                <span style={{width:55,fontSize:11,color:C.sec,fontFamily:F.b,fontWeight:600,flexShrink:0}}>{it.t}</span>
                <div><div style={{fontSize:13,fontWeight:600,color:it.a.includes("RACE")?accent:C.white,fontFamily:F.b}}>{it.a}</div>
                  <div style={{fontSize:12,color:C.mut,fontFamily:F.b,marginTop:2}}>{it.d}</div></div>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(252,211,77,0.06)`,border:`1px solid ${accent}33`,borderRadius:12,padding:14}}>
            <SLabel children="💧 Ultra Nutrition Plan" col={accent}/>
            {[["Every 5km","200ml water OR electrolyte drink (alternate)"],["Aid station","1 banana slice + pinch jaggery every loop"],["Salt","Pinch of salt in water if sweating heavily"],["Gels","Carry 2 energy gels as emergency backup"],["Post race","ORS immediately + full meal within 1 hour"]].map(([w,v],i,arr)=>(
              <div key={i} style={{display:"flex",gap:12,paddingBottom:8,marginBottom:8,borderBottom:i<arr.length-1?`1px solid ${C.bdr}`:"none"}}>
                <span style={{fontSize:11,color:accent,width:80,flexShrink:0,fontWeight:600,fontFamily:F.b}}>{w}</span>
                <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{v}</span>
              </div>
            ))}
          </div></div>)}
      </div>
    </>
  );
}

/* ════════════════════ ROOT APP ════════════════════ */
const TOP_TABS=["TODAY","RACES","SEASON","LOG","STATS","PROFILE"];

export default function App(){
  const[topTab,setTopTab]=useState(0);
  const[race,setRace]=useState(0);
  const r=RACE_SWITCHER[race];

  /* ── Strava ── */
  const[stravaAuth,setStravaAuth]=useState(null);
  const[stravaActivities,setStravaActivities]=useState([]);
  const[stravaLoading,setStravaLoading]=useState(false);
  const[stravaError,setStravaError]=useState('');

  const loadActivities = async (auth) => {
    setStravaLoading(true);
    setStravaError('');
    try {
      let token = auth.access_token;
      if(isTokenExpired(auth)){
        const refreshed = await refreshAccessToken(auth.refresh_token);
        const newAuth = {...auth,...refreshed};
        storeAuth(newAuth);
        setStravaAuth(newAuth);
        token = newAuth.access_token;
      }
      const acts = await fetchActivities(token,1,50);
      setStravaActivities(acts.map(mapActivity));
    } catch(e){ setStravaError(e.message); }
    finally{ setStravaLoading(false); }
  };

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if(params.get('error')){ window.history.replaceState({},'',window.location.pathname); return; }
    if(code){
      window.history.replaceState({},'',window.location.pathname);
      setStravaLoading(true);
      exchangeCode(code)
        .then(auth=>{ storeAuth(auth); setStravaAuth(auth); return loadActivities(auth); })
        .catch(e=>{ setStravaError(e.message); setStravaLoading(false); });
    } else {
      const stored = getStoredAuth();
      if(stored){ setStravaAuth(stored); loadActivities(stored); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.pri,fontFamily:F.b,maxWidth:800,margin:"0 auto",
      paddingBottom:48,backgroundImage:"radial-gradient(ellipse 70% 40% at 100% 0%,rgba(61,139,248,0.06),transparent),radial-gradient(ellipse 50% 40% at 0% 80%,rgba(129,140,248,0.04),transparent)"}}>

      {/* ─── HERO ─── */}
      <div style={{background:"linear-gradient(160deg,#060A14 0%,#0A1028 60%,#060C10 100%)",
        padding:"24px 20px 0",borderBottom:`1px solid ${C.bdr}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:.025,
          backgroundImage:"linear-gradient(rgba(96,165,250,1) 1px,transparent 1px),linear-gradient(90deg,rgba(96,165,250,1) 1px,transparent 1px)",
          backgroundSize:"36px 36px"}}/>
        <div style={{position:"absolute",top:-80,right:-80,width:240,height:240,borderRadius:"50%",
          background:"rgba(61,139,248,0.1)",filter:"blur(70px)"}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
            <div style={{fontSize:10,color:C.blue,fontFamily:F.m,fontWeight:700,letterSpacing:"0.2em"}}>
              ● ATHLETE · STRAVA #99703920 · 2026 SEASON · 7 RACES
            </div>
            {stravaAuth
              ? <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:9,color:C.green,fontFamily:F.b,fontWeight:700}}>● STRAVA LIVE</span>
                  <button onClick={()=>loadActivities(stravaAuth)} disabled={stravaLoading}
                    style={{fontSize:9,padding:"3px 8px",borderRadius:10,border:`1px solid ${C.bdr2}`,
                      background:"transparent",color:C.sec,cursor:"pointer",fontFamily:F.b}}>
                    {stravaLoading?"Syncing…":"↻ Sync"}
                  </button>
                  <button onClick={()=>{clearAuth();setStravaAuth(null);setStravaActivities([]);setStravaError('');}}
                    style={{fontSize:9,padding:"3px 8px",borderRadius:10,border:`1px solid ${C.bdr2}`,
                      background:"transparent",color:C.mut,cursor:"pointer",fontFamily:F.b}}>
                    Disconnect
                  </button>
                </div>
              : <button onClick={()=>window.location.href=getAuthURL()}
                  style={{fontSize:9,padding:"5px 12px",borderRadius:12,border:`1px solid ${C.blue}55`,
                    background:`${C.blue}18`,color:C.blue,cursor:"pointer",fontFamily:F.b,fontWeight:700,
                    letterSpacing:"0.08em",textTransform:"uppercase"}}>
                  Connect Strava
                </button>
            }
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:20}}>
            <div>
              <h1 style={{margin:0,fontFamily:F.h,fontSize:52,lineHeight:.88,letterSpacing:"2px",color:C.white,marginBottom:8}}>
                SACHIN<br/>
                <span style={{WebkitTextStroke:`1.5px ${C.blue}`,WebkitTextFillColor:"transparent",color:"transparent"}}>K G</span>
              </h1>
              <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>📍 Bangalore, Karnataka · ♂ 75 kg · ASICS · COROS</div>
            </div>
            <div style={{background:"rgba(61,139,248,0.08)",border:`1px solid ${C.blue}33`,borderRadius:14,
              padding:"14px 20px",textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:9,color:C.blue,fontFamily:F.m,fontWeight:700,letterSpacing:"0.15em",marginBottom:2}}>VO₂ MAX</div>
              <div style={{fontSize:42,fontFamily:F.h,color:C.white,lineHeight:1}}>~38</div>
              <div style={{fontSize:9,color:C.sec,fontFamily:F.b}}>mL/kg/min</div>
            </div>
          </div>
          {/* KPI strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,borderTop:`1px solid ${C.bdr}`,borderLeft:`1px solid ${C.bdr}`}}>
            {[{v:"7",s:"",l:"2026 Races",sub:"Mar–Jul",c:C.blue},
              {v:"460",s:"km",l:"Season Vol",sub:"Nov–Mar",c:C.sky},
              {v:"58:53",s:"",l:"10K PR",sub:"Mar 1 2026",c:C.green},
              {v:"21.1",s:"K",l:"First HM",sub:"May 24 '26",c:C.freedom},
              {v:"25",s:"km",l:"Ultra 2×",sub:"Dec+Jul",c:C.ultra},
            ].map(k=>(
              <div key={k.l} style={{padding:"12px 8px",textAlign:"center",borderRight:`1px solid ${C.bdr}`,borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:20,fontFamily:F.h,color:k.c,letterSpacing:"0.5px",lineHeight:1}}>{k.v}<span style={{fontSize:11}}>{k.s}</span></div>
                <div style={{fontSize:10,color:C.white,fontFamily:F.b,fontWeight:600,marginTop:4}}>{k.l}</div>
                <div style={{fontSize:9,color:C.mut,fontFamily:F.b,marginTop:1}}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TOP NAV ─── */}
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

      {/* ══════ TAB: TODAY ══════ */}
      {topTab===0&&(
        <div>
          {/* Latest activity — dynamic from Strava or fallback */}
          {(()=>{
            const latest = stravaActivities.length>0 ? stravaActivities[0] : null;
            const prev   = stravaActivities.length>1 ? stravaActivities[1] : null;
            const isRun  = latest && ['EASY','TEMPO','LONG','ULTRA','RACE','STRIDES'].includes(latest.tag);
            const ac     = latest ? tagColor(latest.tag) : C.blue;

            // Estimate HR zone distribution from avg HR
            const estZones = (avgHR) => {
              if(!avgHR||avgHR==='—') return [{z:"Z1",c:C.green,pct:20},{z:"Z2",c:C.sky,pct:40},{z:"Z3",c:C.yellow,pct:25},{z:"Z4",c:C.orange,pct:10},{z:"Z5",c:C.red,pct:5}];
              if(avgHR<118) return [{z:"Z1",c:C.green,pct:70},{z:"Z2",c:C.sky,pct:25},{z:"Z3",c:C.yellow,pct:4},{z:"Z4",c:C.orange,pct:1},{z:"Z5",c:C.red,pct:0}];
              if(avgHR<135) return [{z:"Z1",c:C.green,pct:15},{z:"Z2",c:C.sky,pct:55},{z:"Z3",c:C.yellow,pct:22},{z:"Z4",c:C.orange,pct:7},{z:"Z5",c:C.red,pct:1}];
              if(avgHR<148) return [{z:"Z1",c:C.green,pct:5},{z:"Z2",c:C.sky,pct:30},{z:"Z3",c:C.yellow,pct:42},{z:"Z4",c:C.orange,pct:20},{z:"Z5",c:C.red,pct:3}];
              if(avgHR<163) return [{z:"Z1",c:C.green,pct:2},{z:"Z2",c:C.sky,pct:10},{z:"Z3",c:C.yellow,pct:28},{z:"Z4",c:C.orange,pct:48},{z:"Z5",c:C.red,pct:12}];
              return [{z:"Z1",c:C.green,pct:1},{z:"Z2",c:C.sky,pct:5},{z:"Z3",c:C.yellow,pct:14},{z:"Z4",c:C.orange,pct:40},{z:"Z5",c:C.red,pct:40}];
            };

            // Generate coach tip from activity data
            const coachTip = (act) => {
              if(!act) return "Connect Strava to get personalised coach tips based on your latest activity.";
              const hr = act.hr!=='—' ? act.hr : null;
              const km = act.km!=='—' ? act.km : 0;
              const tag = act.tag;
              if(tag==='RACE') return `🏅 Race completed! ${km}km in ${act.time} (${act.pace}/km). HR avg ${hr||'—'} bpm. Recovery starts now — easy 2 days minimum. Reflect on your race nutrition and pacing for next time.`;
              if(tag==='CROSS') return `🏸 Cross-training session: ${act.name}. ${hr?`Avg HR ${hr} bpm — ${hr<140?"good aerobic maintenance. Legs stay fresh.":"solid effort. Active recovery complete."}`:""} Cross-training keeps the engine running without pounding your joints.`;
              if(tag==='LONG') return `🏃 Long run done — ${km}km at ${act.pace}/km. ${hr?`Avg HR ${hr} bpm.`:""} ${km>=14?"Excellent aerobic stimulus. Eat well, sleep 8+hrs, and keep tomorrow easy.":"Good base-building work. Each long run builds your ultra endurance foundation."}`;
              if(tag==='TEMPO') return `⚡ Quality session: ${km}km at ${act.pace}/km. ${hr?`HR ${hr} bpm avg — ${hr>165?"high effort, solid threshold work.":"controlled tempo, good aerobic development."}`:""}  Race pace neurons are sharpening. Take tomorrow easy.`;
              if(tag==='ULTRA') return `🔥 Ultra-distance effort: ${km}km at ${act.pace}/km. ${hr?`Avg HR ${hr} bpm.`:""} This is serious endurance work. Prioritise protein recovery, compression, and legs-up rest tonight.`;
              if(tag==='STRIDES') return `💨 Strides session complete — ${km}km. Neuromuscular sharpness maintained. These short accelerations prime your legs for race pace. ${hr?`Avg HR ${hr} bpm — shows good easy base between strides.`:""}`;
              return `✅ Easy run: ${km}km at ${act.pace}/km. ${hr?`Avg HR ${hr} bpm — ${hr<148?"aerobic zone, great for base building.":"keep it easier next easy day."}`:""}  Consistency is the key to improvement.`;
            };

            if(!latest) return (
              <div style={{background:"linear-gradient(135deg,#070A18,#080C1A)",borderBottom:`1px solid ${C.blue}22`,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 90% 10%,rgba(61,139,248,0.08),transparent 50%)`}}/>
                <div style={{position:"relative"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:C.blue,boxShadow:`0 0 8px ${C.blue}`}}/>
                    <span style={{fontSize:11,color:C.blue,fontWeight:700,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.12em"}}>Latest Activity · Mar 11</span>
                    <Pill c={C.blue}>Mar 11</Pill><Pill c={C.green}>🏸 Badminton</Pill><Pill c={C.yellow}>REST DAY ✓</Pill>
                  </div>
                  <div style={{fontSize:20,fontFamily:F.h,letterSpacing:"1px",color:C.white}}>MORNING BADMINTON 🏸</div>
                  <div style={{fontSize:11,color:C.mut,fontFamily:F.b,marginTop:2}}>4 days to Namma Power Run · Active recovery</div>
                  <div style={{marginTop:12,padding:"10px 14px",background:`${C.blue}11`,border:`1px solid ${C.blue}33`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <span style={{fontSize:11,color:C.sec,fontFamily:F.b}}>Connect Strava to see live activity data</span>
                    <button onClick={()=>window.location.href=getAuthURL()} style={{padding:"6px 14px",borderRadius:10,border:`1px solid ${C.blue}55`,background:`${C.blue}22`,color:C.blue,cursor:"pointer",fontFamily:F.b,fontWeight:700,fontSize:10,textTransform:"uppercase"}}>Connect →</button>
                  </div>
                  {stravaLoading&&<div style={{marginTop:8,fontSize:11,color:C.sec,fontFamily:F.b,textAlign:"center"}}>Loading from Strava…</div>}
                </div>
              </div>
            );

            const zones = estZones(latest.hr);
            return (
              <div style={{background:"linear-gradient(135deg,#070A18,#080C1A)",borderBottom:`1px solid ${ac}22`,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 90% 10%,rgba(61,139,248,0.08),transparent 50%)`}}/>
                <div style={{position:"relative"}}>
                  {/* Header */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:ac,boxShadow:`0 0 8px ${ac}`}}/>
                        <span style={{fontSize:11,color:ac,fontWeight:700,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.12em"}}>Latest Activity · {latest.date}</span>
                        <Pill c={ac}>{latest.date}</Pill>
                        <Pill c={ac}>{latest.tag}</Pill>
                        {latest.stravaUrl&&<a href={latest.stravaUrl} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><Pill c={C.orange}>View on Strava ↗</Pill></a>}
                      </div>
                      <div style={{fontSize:20,fontFamily:F.h,letterSpacing:"1px",color:C.white}}>{latest.name.toUpperCase()}</div>
                      <div style={{fontSize:11,color:C.mut,fontFamily:F.b,marginTop:2}}>
                        {isRun?`${latest.km}km · ${latest.pace}/km · ${latest.elev}m elev`:`Duration: ${latest.time}`}
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {isRun
                        ? <><div style={{fontSize:26,fontFamily:F.h,color:ac,lineHeight:1}}>{latest.pace}<span style={{fontSize:11,color:C.mut}}>/km</span></div>
                            <div style={{fontSize:11,color:C.sec,fontFamily:F.b}}>{latest.km} km</div></>
                        : <><div style={{fontSize:24,fontFamily:F.h,color:ac,lineHeight:1}}>{latest.time}</div>
                            <div style={{fontSize:11,color:C.sec,fontFamily:F.b}}>Duration</div></>
                      }
                    </div>
                  </div>
                  {/* Stats grid */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
                    {[["❤️","Avg HR",latest.hr!=='—'?`${latest.hr} bpm`:'—'],
                      ["📏","Distance",latest.km!=='—'?`${latest.km} km`:'—'],
                      ["🔥","Calories",latest.calories!=='—'?`${latest.calories} kcal`:'—'],
                      ["⏱","Duration",latest.time]].map(([ic,l,v])=>(
                      <div key={l} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${C.bdr}`,borderRadius:8,padding:"7px 5px",textAlign:"center"}}>
                        <div style={{fontSize:13,marginBottom:2}}>{ic}</div>
                        <div style={{fontSize:12,fontWeight:700,color:C.white,fontFamily:F.h}}>{v}</div>
                        <div style={{fontSize:9,color:C.mut,fontFamily:F.b,textTransform:"uppercase"}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {/* HR zone bars */}
                  {latest.hr!=='—'&&(
                    <div style={{marginBottom:12}}>
                      <div style={{fontSize:10,color:C.mut,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Estimated HR Zones</div>
                      {zones.map((z,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div style={{width:22,fontSize:9,color:C.mut,fontFamily:F.m,textAlign:"right",flexShrink:0}}>{z.z}</div>
                          <div style={{flex:1,height:5,background:C.bdr,borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${z.pct}%`,background:z.c,borderRadius:3}}/>
                          </div>
                          <div style={{width:28,fontSize:10,fontFamily:F.h,color:z.c,textAlign:"right"}}>{z.pct}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Coach tip */}
                  <div style={{marginTop:10,padding:"9px 12px",background:`${C.green}0D`,borderRadius:8,border:`1px solid ${C.green}33`}}>
                    <div style={{fontSize:12,color:"#86EFAC",lineHeight:1.6,fontFamily:F.b}}>
                      <strong>Coach:</strong> {coachTip(latest)}
                    </div>
                  </div>
                  {/* Previous activity */}
                  {prev&&(
                    <div style={{marginTop:10,padding:"9px 12px",background:C.faint,borderRadius:8,border:`1px solid ${C.bdr}`}}>
                      <div style={{fontSize:10,color:C.mut,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Previous · {prev.date}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{prev.name.toUpperCase()}</div>
                          <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginTop:1}}>
                            {prev.km!=='—'?`${prev.km}km · `:''}
                            {prev.pace!=='—'?`${prev.pace}/km · `:''}
                            {prev.hr!=='—'?`HR ${prev.hr} avg`:''}
                          </div>
                        </div>
                        <Pill c={tagColor(prev.tag)}>{prev.tag}</Pill>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
          {/* Season road map */}
          <div style={{padding:"20px 18px 0"}}>
            <SHead label="2026 Race Roadmap" accent={C.sky}/>
            <div style={{position:"relative",paddingLeft:20,paddingBottom:8}}>
              <div style={{position:"absolute",left:6,top:8,bottom:8,width:2,
                background:`linear-gradient(to bottom,${C.police},${C.namma},${C.tcs},${C.freedom},${C.jatre},${C.b10k},${C.ultra})`}}/>
              {RACE_SWITCHER.map((rc,i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:10,position:"relative"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",background:rc.accent,flexShrink:0,marginTop:4,
                    position:"relative",left:-3,boxShadow:`0 0 10px ${rc.accent}88`}}/>
                  <div onClick={()=>{setRace(i);setTopTab(1);}}
                    style={{flex:1,background:C.card,border:`1px solid ${rc.accent}22`,borderLeft:`3px solid ${rc.accent}`,
                      borderRadius:10,padding:"10px 14px",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{display:"flex",gap:6,marginBottom:3}}>
                          <Pill c={rc.accent}>{rc.badge}</Pill>
                          <span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{rc.dist}</span>
                        </div>
                        <div style={{fontSize:15,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{rc.short}</div>
                        <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginTop:1}}>{rc.sub}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontFamily:F.h,color:rc.accent,lineHeight:1}}>{rc.target}</div>
                        <div style={{fontSize:10,color:C.sec,fontFamily:F.b}}>{rc.pace}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════ TAB: RACES ══════ */}
      {topTab===1&&(
        <div>
          {/* Race pills */}
          <div style={{background:"#08090F",borderBottom:`1px solid ${C.bdr}`,padding:"12px 14px 0"}}>
            <div style={{fontSize:9,color:C.mut,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:8,fontWeight:700,fontFamily:F.b}}>Sachin K G · 2026 Season · Select Race</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:6}}>
              {RACE_SWITCHER.slice(0,4).map(rc=>(
                <button key={rc.id} onClick={()=>setRace(rc.id)} style={{padding:"8px 6px",
                  background:race===rc.id?C.faint:"transparent",
                  border:`1px solid ${race===rc.id?rc.accent+"55":C.bdr}`,
                  borderBottom:`2px solid ${race===rc.id?rc.accent:"transparent"}`,
                  borderRadius:"8px 8px 0 0",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                  <div style={{fontSize:8,color:race===rc.id?rc.accent:C.mut,textTransform:"uppercase",fontWeight:700,fontFamily:F.b,marginBottom:2}}>{rc.dist}</div>
                  <div style={{fontSize:12,fontFamily:F.h,letterSpacing:"0.5px",color:race===rc.id?C.white:C.mut}}>{rc.short.toUpperCase()}</div>
                  <div style={{fontSize:8,color:race===rc.id?rc.accent:C.mut,fontFamily:F.b,marginBottom:6}}>{rc.sub.split("·")[0]}</div>
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
              {RACE_SWITCHER.slice(4).map(rc=>(
                <button key={rc.id} onClick={()=>setRace(rc.id)} style={{padding:"8px 6px",
                  background:race===rc.id?C.faint:"transparent",
                  border:`1px solid ${race===rc.id?rc.accent+"55":C.bdr}`,
                  borderBottom:`2px solid ${race===rc.id?rc.accent:"transparent"}`,
                  borderRadius:"8px 8px 0 0",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                  <div style={{fontSize:8,color:race===rc.id?rc.accent:C.mut,textTransform:"uppercase",fontWeight:700,fontFamily:F.b,marginBottom:2}}>{rc.dist}</div>
                  <div style={{fontSize:12,fontFamily:F.h,letterSpacing:"0.5px",color:race===rc.id?C.white:C.mut}}>{rc.short.toUpperCase()}</div>
                  <div style={{fontSize:8,color:race===rc.id?rc.accent:C.mut,fontFamily:F.b,marginBottom:6}}>{rc.sub.split("·")[0]}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Race hero */}
          <div style={{background:r.bgGrad,padding:"20px 18px 16px",borderBottom:`1px solid ${C.bdr}`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 85% 15%,${r.accent}18,transparent 50%)`}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:16}}>
                <div>
                  <div style={{fontSize:11,color:r.accent,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontWeight:600,fontFamily:F.b}}>{r.sub}</div>
                  <h2 style={{margin:0,fontSize:26,fontFamily:F.h,letterSpacing:"1px",color:C.white,marginBottom:6}}>{r.short.toUpperCase()}</h2>
                  <Pill c={r.accent}>{r.badge}</Pill>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,fontFamily:F.b}}>{race===0?"Official Time":"Target"}</div>
                  <div style={{fontSize:36,fontFamily:F.h,color:r.accent,lineHeight:1}}>{r.target}</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{r.pace}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${r.stats.length},1fr)`,gap:8}}>
                {r.stats.map(([ic,l,v])=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"9px 6px",textAlign:"center"}}>
                    <div style={{fontSize:15,marginBottom:3}}>{ic}</div>
                    <div style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:F.h}}>{v}</div>
                    <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",fontFamily:F.b}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {race===0&&<PoliceRun/>}
          {race===1&&<NammaRun/>}
          {race===2&&<TCSRun/>}
          {race===3&&<FreedomHM/>}
          {race===4&&<DishaJatre/>}
          {race===5&&<Bengaluru10K/>}
          {race===6&&<BengaluruUltra/>}
        </div>
      )}

      {/* ══════ TAB: SEASON ══════ */}
      {topTab===2&&(
        <div style={{padding:"0 18px"}}>
          <div style={{margin:"24px -18px 0"}}><PhotoGallery/></div>
          <SHead label="Monthly Volume" accent={C.cyan} right="Nov 2025–Mar 2026"/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <ResponsiveContainer width="100%" height={145}>
              <BarChart data={MONTHLY} barSize={34} margin={{left:0,right:0,top:4,bottom:0}}>
                <XAxis dataKey="m" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,160]}/>
                <Bar dataKey="km" radius={[5,5,0,0]}>{MONTHLY.map((m,i)=><Cell key={i} fill={m.color} opacity={.85}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <SHead label="Full Race Calendar 2026" accent={C.blue}/>
          <div style={{position:"relative",paddingLeft:20,marginBottom:24}}>
            <div style={{position:"absolute",left:6,top:8,bottom:8,width:2,
              background:`linear-gradient(to bottom,${C.police},${C.namma},${C.tcs},${C.freedom},${C.jatre},${C.b10k},${C.ultra})`}}/>
            {RACE_HISTORY.filter(r=>r.status!=="early").map((r,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:10,position:"relative"}}>
                <div style={{width:12,height:12,borderRadius:r.status==="new"?3:"50%",background:r.color,flexShrink:0,marginTop:4,
                  position:"relative",left:-3,boxShadow:`0 0 10px ${r.color}88`}}/>
                <div style={{flex:1,background:C.card,border:`1px solid ${r.color}22`,borderLeft:`3px solid ${r.color}`,borderRadius:10,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:6}}>
                    <div>
                      <div style={{display:"flex",gap:6,marginBottom:3,flexWrap:"wrap"}}>
                        <Pill c={r.color}>{r.status==="done"?"✓ DONE":r.status==="next"?"⚡ 5 DAYS":r.status==="goal"?"🎯 GOAL":"🆕 NEW"}</Pill>
                      </div>
                      <div style={{fontSize:14,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{r.name}</div>
                      <div style={{fontSize:11,color:C.sec,fontFamily:F.b,marginTop:1}}>{r.date} · {r.dist}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:22,fontFamily:F.h,color:r.color,lineHeight:1}}>{r.time}</div>
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

      {/* ══════ TAB: LOG ══════ */}
      {topTab===3&&(
        <div style={{padding:"0 18px"}}>
          {/* Strava connection banner */}
          {!stravaAuth&&(
            <div style={{background:"rgba(61,139,248,0.06)",border:`1px solid ${C.blue}33`,borderRadius:12,
              padding:"14px 16px",marginTop:16,marginBottom:4,display:"flex",alignItems:"center",
              justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.blue,fontFamily:F.b,marginBottom:2}}>Connect Strava for live data</div>
                <div style={{fontSize:11,color:C.sec,fontFamily:F.b}}>Fetch your real activities automatically from Strava.</div>
              </div>
              <button onClick={()=>window.location.href=getAuthURL()}
                style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.blue}55`,
                  background:`${C.blue}22`,color:C.blue,cursor:"pointer",fontFamily:F.b,
                  fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase"}}>
                Connect Strava →
              </button>
            </div>
          )}
          {stravaError&&(
            <div style={{background:"rgba(248,113,113,0.08)",border:`1px solid ${C.red}33`,borderRadius:10,
              padding:"10px 14px",marginBottom:8,fontSize:11,color:C.red,fontFamily:F.b}}>
              ⚠ Strava error: {stravaError}
            </div>
          )}
          {/* Activity list: live Strava or fallback */}
          {stravaActivities.length>0?(
            <>
              <SHead label="Strava Activity Log" accent={C.blue} right={`${stravaActivities.length} activities · Live`}/>
              {stravaActivities.map((a,i)=>(
                <div key={a.id||i}>
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
                    <div style={{width:46,flexShrink:0,textAlign:"right"}}>
                      <div style={{fontSize:12,fontFamily:F.m,color:C.sec}}>{a.date.split(" ")[1]}</div>
                      <div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{a.date.split(" ")[0]}</div>
                    </div>
                    <div style={{width:8,height:8,borderRadius:"50%",background:tagColor(a.tag),flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <a href={a.stravaUrl} target="_blank" rel="noreferrer"
                        style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:F.b,
                          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                          display:"block",textDecoration:"none"}}>
                        {a.name}
                      </a>
                      <div style={{fontSize:10,color:C.mut,fontFamily:F.b,marginTop:1}}>⛰ {a.elev}m · TL {a.tl}</div>
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
                      <div style={{width:52,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        <Pill c={tagColor(a.tag)}>{a.tag}</Pill>
                      </div>
                    </div>
                  </div>
                  {i<stravaActivities.length-1&&<Divider/>}
                </div>
              ))}
            </>
          ):(
            <>
              <SHead label="Recent Activity Log" accent={C.sky} right={stravaLoading?"Syncing from Strava…":"Last 12 runs"}/>
              {stravaLoading&&(
                <div style={{textAlign:"center",padding:"24px 0",fontSize:12,color:C.sec,fontFamily:F.b}}>
                  Loading activities from Strava…
                </div>
              )}
              {!stravaLoading&&ACTIVITY_LOG.map((a,i)=>(
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
                      <div style={{width:52,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                        <Pill c={tagColor(a.tag)}>{a.tag}</Pill>
                      </div>
                    </div>
                  </div>
                  {i<ACTIVITY_LOG.length-1&&<Divider/>}
                </div>
              ))}
            </>
          )}
          <SHead label="Gear Tracker" accent={C.yellow}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            {[{n:"ASICS Novablast 5",s:"Race + daily trainer",km:"~148km in 2026",c:C.blue,ic:"👟"},
              {n:"ASICS Gel Nimbus 27",s:"Easy & recovery runs",km:"~113km in 2026",c:C.sky,ic:"👟"}].map(g=>(
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

      {/* ══════ TAB: STATS ══════ */}
      {topTab===4&&(
        <div style={{padding:"0 18px"}}>
          <SHead label="Weekly Mileage" accent={C.indigo} right="Jan–Mar 10"/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <ResponsiveContainer width="100%" height={135}>
              <BarChart data={WEEKLY} barSize={22} margin={{left:0,right:0,top:4,bottom:0}}>
                <XAxis dataKey="w" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,65]}/>
                <ReferenceLine y={40} stroke={C.bdr2} strokeDasharray="4 3"/>
                <Bar dataKey="km" radius={[4,4,0,0]}>{WEEKLY.map((w,i)=><Cell key={i} fill={w.km>40?C.green:w.km>25?C.sky:C.indigo} opacity={.85}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <SHead label="Pace Trend" accent={C.sky}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"16px 14px",marginBottom:20}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {["RACE","TRAIL","ULTRA","TEMPO","LONG","STRIDES","EASY"].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:tagColor(t)}}/>
                  <span style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{t}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={PACE_TREND} margin={{left:0,right:8,top:4,bottom:0}}>
                <XAxis dataKey="r" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                <YAxis domain={[5.5,8.5]} hide/>
                <Tooltip content={({active,payload,label})=>{
                  if(!active||!payload?.length)return null;
                  const d=PACE_TREND.find(p=>p.r===label);
                  return(<div style={{background:C.card,border:`1px solid ${C.bdr2}`,borderRadius:10,padding:"10px 14px",fontFamily:F.b,fontSize:12}}>
                    <div style={{color:C.sec,marginBottom:6}}>{label} · {d?.km}km</div>
                    <div style={{color:tagColor(d?.tag||""),marginBottom:3}}>⚡ {fmtPace(payload[0].value)}/km</div>
                    <div style={{color:C.pink}}>❤️ {d?.hr} bpm</div>
                  </div>);
                }}/>
                <ReferenceLine y={5.88} stroke={C.green} strokeDasharray="3 3" strokeOpacity={.6}/>
                <Line type="monotone" dataKey="pace" stroke={C.sky} strokeWidth={2}
                  dot={p=>{const d=PACE_TREND[p.index];return <circle key={p.key} cx={p.cx} cy={p.cy} r={5} fill={tagColor(d?.tag||"")} stroke={C.bg} strokeWidth={2}/>;}}
                  activeDot={{r:6,fill:C.white,stroke:C.sky,strokeWidth:2}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <SHead label="Personal Bests" accent={C.yellow}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
            {[["🏅","58:53","10K PR","5:53/km · Mar 1"],["🏃","25 km","Longest Race","Ultra Dec"],["🔥","228W","Peak Power","Police Run"],
              ["❤️","192","Max HR Ever","Kaveri Trail"],["👣","91 spm","Max Cadence","Mar 10 stride"],["⛰️","169m","Most Elev","Bengaluru Ultra"]].map(([ic,v,l,sub])=>(
              <div key={l} style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"13px 12px",borderTop:`2px solid ${C.bdr2}`}}>
                <div style={{fontSize:18,marginBottom:6}}>{ic}</div>
                <div style={{fontSize:18,fontFamily:F.h,color:C.white,letterSpacing:"0.5px",lineHeight:1}}>{v}</div>
                <div style={{fontSize:11,color:C.white,fontFamily:F.b,fontWeight:600,marginTop:5}}>{l}</div>
                <div style={{fontSize:9,color:C.mut,fontFamily:F.b,marginTop:2}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════ TAB: PROFILE ══════ */}
      {topTab===5&&(
        <div style={{padding:"0 18px"}}>
          <SHead label="VO₂ Max & Training Paces" accent={C.blue}/>
          <div style={{background:"linear-gradient(135deg,#08102A,#0A1230)",border:`1px solid ${C.blue}33`,borderRadius:14,padding:"16px 18px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:C.blue,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3}}>🫁 Estimated VO2 Max</div>
                <div style={{fontSize:11,color:C.mut,fontFamily:F.b}}>Jack Daniels VDOT · Police Run (58:53)</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:42,fontFamily:F.h,color:C.blue,lineHeight:1}}>~38</div>
                <div style={{fontSize:9,color:C.sec,fontFamily:F.m}}>mL / kg / min</div>
              </div>
            </div>
            <div style={{height:8,borderRadius:4,overflow:"hidden",marginBottom:6,
              background:`linear-gradient(to right,#1E3A5F,${C.cyan} 33%,${C.yellow} 55%,${C.orange} 75%,${C.red} 90%,${C.indigo})`}}>
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
          <SHead label="Heart Rate Zones" accent={C.pink}/>
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
                  <div style={{fontSize:16,fontFamily:F.h,color:z.c}}>{z.pct}%</div>
                  <div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>{z.hrs}</div>
                </div>
              </div>
            ))}
          </div>
          <SHead label="Bangalore Running Spots" accent={C.cyan}/>
          <div style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:14,overflow:"hidden",marginBottom:24}}>
            {[{n:"NICE Road (Race course)",d:"Full route",g:"~90m elev",t:"Race route — Hoskerehalli"},
              {n:"Cubbon Park Full Loop",d:"3.73 km",g:"0%",t:"City loop · 6:00 AM ideal"},
              {n:"GKVK Campus Loop",d:"12.5 km",g:"Rolling",t:"Ultra route · Hesaraghatta"},
              {n:"TCS 10K Course",d:"9.69 km",g:"0%",t:"Race route preview"},
              {n:"Lalbagh One Mile",d:"1.66 km",g:"0%",t:"Speed intervals"},
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
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{s.g}</div>
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
          <div style={{fontSize:28,fontFamily:F.h,color:C.white,letterSpacing:"1.5px"}}>SACHIN K G</div>
          <div style={{fontSize:10,color:C.mut,fontFamily:F.b,marginTop:2}}>Bangalore · 2026 Season · 7 Races · Strava #99703920</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:C.mut,fontFamily:F.m}}>Updated Mar 11, 2026</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,justifyContent:"flex-end"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
            <span style={{fontSize:10,color:C.green,fontFamily:F.m}}>Strava Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}