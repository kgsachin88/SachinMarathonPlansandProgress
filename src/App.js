import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
         Cell, BarChart, Bar } from "recharts";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.appendChild(fontLink);

const F = { h: "'Bebas Neue', sans-serif", b: "'Outfit', system-ui, sans-serif" };

const C = {
  bg:"#07090F", card:"#0D1117", border:"#1A1F2E",
  pri:"#E2E8F0", sec:"#94A3B8", mut:"#475569",
  police:"#6EE7B7", namma:"#FF3D3D", tcs:"#F97316",
  blue:"#60A5FA", yellow:"#FCD34D", purple:"#A78BFA",
  red:"#F87171", white:"#F8FAFC", green:"#34D399",
};

const sLabel = (txt, col=C.mut) => (
  <div style={{fontSize:11,color:col,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:F.b,marginBottom:12}}>{txt}</div>
);
function IntBar({val,color,h=4}){return(<div style={{height:h,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${val*100}%`,background:color,borderRadius:2}}/></div>);}

function Timeline({items,accent}){
  return(
    <div style={{position:"relative"}}>
      <div style={{position:"absolute",left:52,top:16,bottom:16,width:1,background:`linear-gradient(to bottom,${accent}44,${accent},${accent}44)`}}/>
      {items.map((item,i)=>(
        <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16,position:"relative"}}>
          <div style={{width:52,textAlign:"right",fontSize:11,color:C.sec,fontWeight:600,paddingTop:8,flexShrink:0,fontFamily:F.b}}>{item.time}</div>
          <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,zIndex:1,marginTop:6,background:item.fire?accent:"#1A1F2E",border:`2px solid ${item.fire?accent:"#334155"}`,boxShadow:item.fire?`0 0 14px ${accent}88`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {item.fire&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}
          </div>
          <div style={{flex:1,background:item.fire?"linear-gradient(135deg,#1A0800,#2A1000)":C.card,border:`1px solid ${item.fire?accent+"44":C.border}`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontSize:13,fontWeight:700,color:item.fire?accent:C.pri,fontFamily:F.h,letterSpacing:"0.5px"}}>{item.icon} {item.action.toUpperCase()}</div>
            <div style={{fontSize:12,color:C.mut,marginTop:3,lineHeight:1.6,fontFamily:F.b}}>{item.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Weather data (live pull Mar 8 2026) ──
const weatherData = {
  current: { temp: 28, condition: "Sunny ☀️", humidity: 42 },
  forecast: [
    { day:"Sun Mar 8",  high:33, icon:"☀️",  rain:0  },
    { day:"Mon Mar 9",  high:32, icon:"☀️",  rain:5  },
    { day:"Tue Mar 10", high:30, icon:"🌤️",  rain:0  },
    { day:"Wed Mar 11", high:31, icon:"☀️",  rain:0  },
    { day:"Thu Mar 12", high:33, icon:"☀️",  rain:5  },
    { day:"Sat Mar 14", high:32, icon:"☀️",  rain:0  },
    { day:"Sun Mar 15 🏅",high:33,icon:"🔥", rain:0, race:true },
  ],
};

// ── Latest Run — Morning Run Mar 9 2026 ──
const latestRunHR = [
  {d:0,hr:123},{d:0.52,hr:136},{d:1.04,hr:146},{d:1.57,hr:151},{d:2.09,hr:155},
  {d:2.59,hr:158},{d:3.11,hr:160},{d:3.65,hr:163},{d:4.16,hr:164},{d:4.68,hr:165},
  {d:5.20,hr:167},{d:5.73,hr:166},{d:6.25,hr:166},{d:6.76,hr:168},{d:7.28,hr:167},
  {d:7.79,hr:167},{d:8.33,hr:171},{d:8.84,hr:172},{d:9.37,hr:173},{d:9.89,hr:172},
  {d:10.39,hr:172},{d:10.92,hr:171},{d:11.45,hr:170},{d:11.96,hr:171},{d:12.49,hr:172},
  {d:12.99,hr:171},{d:13.52,hr:172},{d:14.03,hr:172},{d:14.55,hr:174},{d:15.07,hr:174},
  {d:15.59,hr:173},{d:16.11,hr:174},{d:16.64,hr:173},{d:17.15,hr:174},{d:17.67,hr:173},
  {d:18.19,hr:173},{d:18.73,hr:172},{d:19.25,hr:173},{d:19.77,hr:174},{d:20.28,hr:174},
  {d:20.79,hr:173},{d:21.31,hr:174},{d:21.84,hr:173},{d:22.37,hr:173},{d:22.87,hr:173},
  {d:23.39,hr:172},{d:23.91,hr:172},{d:24.45,hr:173},{d:24.96,hr:172},{d:25.48,hr:173},
  {d:25.99,hr:171},{d:26.52,hr:169},{d:27.04,hr:172},{d:27.56,hr:169},{d:28.08,hr:171},
  {d:28.58,hr:171},{d:29.13,hr:171},{d:29.64,hr:170},{d:30.14,hr:168},{d:30.68,hr:171},
  {d:31.71,hr:172},{d:32.24,hr:170},{d:32.76,hr:170},{d:33.28,hr:169},{d:33.80,hr:171},
  {d:34.30,hr:173},{d:34.83,hr:173},{d:35.35,hr:174},{d:35.87,hr:174},{d:36.40,hr:173},
  {d:36.92,hr:173},{d:37.43,hr:174},{d:37.95,hr:173},{d:38.47,hr:173},{d:38.98,hr:175},
  {d:39.50,hr:174},{d:40.02,hr:175},{d:40.62,hr:176},{d:41.06,hr:177},{d:41.76,hr:176},
  {d:42.12,hr:178},{d:42.79,hr:179},{d:43.18,hr:178},{d:43.90,hr:179},{d:44.18,hr:178},
  {d:44.70,hr:179},{d:45.22,hr:179},{d:45.75,hr:178},{d:46.27,hr:178},{d:46.79,hr:179},
  {d:47.32,hr:178},{d:47.84,hr:178},{d:48.36,hr:179},{d:48.88,hr:181},{d:49.38,hr:181},
  {d:49.90,hr:181},{d:50.44,hr:180},{d:50.96,hr:177},{d:51.48,hr:172},{d:51.47,hr:163},
];

function LatestRunCard() {
  const accent = "#818CF8";
  const daysToNamma = 6;
  return (
    <div style={{background:"linear-gradient(135deg,#080A18,#0A0C1A,#080E12)",borderBottom:`1px solid ${accent}22`,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 90% 10%,rgba(129,140,248,0.08) 0%,transparent 50%)`}}/>
      <div style={{position:"relative"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
              <span style={{fontSize:11,color:accent,fontWeight:700,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.12em"}}>Latest Run · Today</span>
              <div style={{background:"#13152A",border:`1px solid ${accent}44`,borderRadius:20,padding:"1px 8px",fontSize:10,color:accent,fontWeight:700,fontFamily:F.b}}>Mar 9</div>
            </div>
            <div style={{fontSize:20,fontFamily:F.h,letterSpacing:"1px",color:C.white}}>MORNING RUN 🏃</div>
            <div style={{fontSize:11,color:C.mut,fontFamily:F.b,marginTop:2}}>{daysToNamma} days to Namma Power Run · 👟 Nimbus 27</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontFamily:F.h,color:accent,letterSpacing:"1px",lineHeight:1}}>5.15<span style={{fontSize:14,color:C.mut}}> km</span></div>
            <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>31:00 · 6:01/km</div>
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:14}}>
          {[["❤️","Avg HR","171 bpm"],["📈","Max HR","182 bpm"],["⚡","Power","221W"],["👣","Cadence","84 spm"],["🔥","Calories","435"]].map(([icon,l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"7px 5px",textAlign:"center"}}>
              <div style={{fontSize:13,marginBottom:2}}>{icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.h,letterSpacing:"0.3px"}}>{v}</div>
              <div style={{fontSize:9,color:C.mut,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
            </div>
          ))}
        </div>
        {/* HR chart */}
        <div style={{fontSize:10,color:C.mut,marginBottom:6,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.1em"}}>Heart Rate · Distance</div>
        <ResponsiveContainer width="100%" height={72}>
          <AreaChart data={latestRunHR} margin={{left:0,right:0,top:4,bottom:0}}>
            <defs>
              <linearGradient id="lrf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.4}/>
                <stop offset="100%" stopColor={accent} stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`} ticks={[0,1,2,3,4,5]}/>
            <YAxis domain={[120,185]} hide/>
            <Tooltip content={({active,payload})=>{if(active&&payload?.length)return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 9px",fontSize:11,fontFamily:F.b}}><div style={{color:C.sec}}>{payload[0].payload.d}km</div><div style={{color:accent}}>{payload[0].value} bpm</div></div>);return null;}}/>
            <ReferenceLine y={171} stroke={accent} strokeDasharray="3 3" strokeOpacity={0.4}/>
            <Area type="monotone" dataKey="hr" stroke={accent} strokeWidth={2} fill="url(#lrf)" dot={false} activeDot={{r:3,fill:accent}}/>
          </AreaChart>
        </ResponsiveContainer>
        {/* Coach alert */}
        <div style={{marginTop:10,padding:"9px 12px",background:"rgba(249,115,22,0.07)",borderRadius:8,border:`1px solid ${C.tcs}33`}}>
          <div style={{fontSize:12,color:"#FED7AA",lineHeight:1.6,fontFamily:F.b}}>
            ⚠️ <strong>Coach note:</strong> Planned easy 6km @ 7:45/km — you ran 5km @ <strong style={{color:C.white}}>6:01/km with avg HR 171</strong>. That's Z4 territory, not easy. <strong style={{color:C.namma}}>6 days to race: tomorrow's hill session is crucial — don't skip it, but don't go deep either.</strong> Legs must arrive at the start line fresh.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Weather + Coach tips strip ──
function WeatherCoachCard() {
  const [showTips, setShowTips] = useState(false);
  const raceTemp = 33;
  const tempColor = raceTemp >= 33 ? C.namma : raceTemp >= 30 ? C.tcs : C.yellow;
  return (
    <div style={{background:"linear-gradient(135deg,#080C10,#060A0E)",borderBottom:`1px solid ${C.border}`,padding:"14px 18px"}}>
      {/* Weather row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>🌤️</span>
          <div>
            <div style={{fontSize:11,color:C.mut,fontFamily:F.b,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>Bengaluru Weather</div>
            <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:F.b}}>28°C now · Sunny — <span style={{color:tempColor}}>Race day forecast: {raceTemp}°C 🔥</span></div>
          </div>
        </div>
        <button onClick={()=>setShowTips(v=>!v)} style={{padding:"4px 12px",background:showTips?"#1A0D00":"transparent",border:`1px solid ${showTips?C.tcs+"55":C.border}`,borderRadius:20,fontSize:10,color:showTips?C.tcs:C.mut,cursor:"pointer",fontFamily:F.b,fontWeight:600}}>
          {showTips ? "Hide Tips ▲" : "Coach Tips ▼"}
        </button>
      </div>
      {/* 7-day forecast strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:showTips?12:0}}>
        {weatherData.forecast.map((d,i)=>(
          <div key={i} style={{background:d.race?"linear-gradient(135deg,#1A0800,#2A1000)":"rgba(255,255,255,0.03)",border:`1px solid ${d.race?C.tcs+"55":"rgba(255,255,255,0.06)"}`,borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
            <div style={{fontSize:9,color:d.race?C.tcs:C.mut,fontFamily:F.b,fontWeight:600,marginBottom:2,lineHeight:1.3}}>{d.day.replace(" 🏅","")}</div>
            <div style={{fontSize:14}}>{d.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:d.high>=32?tempColor:C.sec,fontFamily:F.h,letterSpacing:"0.3px"}}>{d.high}°</div>
            {d.race&&<div style={{fontSize:8,color:C.tcs,fontFamily:F.b,fontWeight:700,marginTop:2}}>RACE</div>}
          </div>
        ))}
      </div>
      {/* Coach tips panel */}
      {showTips && (
        <div style={{background:"rgba(249,115,22,0.05)",border:`1px solid ${C.tcs}33`,borderRadius:10,padding:14}}>
          <div style={{fontSize:11,color:C.tcs,fontWeight:700,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>🌡️ Heat Coaching Tips — Race Week</div>
          {[
            ["This week training","Run before 6:30 AM or after 7 PM. Avoid 28–33°C midday heat for any quality sessions."],
            ["Heat acclimatisation","Race day will be ~33°C at 6am start. Do Tuesday's hill intervals in warm conditions (don't seek shade) — lets your body adapt to sweating at pace."],
            ["Hydration this week","Increase daily water intake to 3.5–4L now. Pre-load sodium the day before the race (extra pinch of salt in meals)."],
            ["Race morning pre-cool","Arrive at venue early. Pour ice-cold water on wrists, neck & head just before start. Lowers core temp by ~0.5°C — worth 30+ seconds."],
            ["Pacing adjustment","33°C = add ~15–20 sec/km vs ideal. Your 5:45/km target becomes ~5:55–6:00/km on the first climb. Don't panic — it's the conditions, not your fitness."],
            ["Electrolytes on course","Grab every water station. If electrolyte sachets available at km 5, take one. Salt prevents cramps on the second climb (km 7–8)."],
          ].map(([title,tip],i,arr)=>(
            <div key={i} style={{display:"flex",gap:10,paddingBottom:i<arr.length-1?10:0,marginBottom:i<arr.length-1?10:0,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{width:3,background:C.tcs,borderRadius:2,flexShrink:0,opacity:0.7,marginTop:3}}/>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#FED7AA",fontFamily:F.b}}>{title}</div>
                <div style={{fontSize:12,color:"#92400E",marginTop:2,lineHeight:1.6,fontFamily:F.b}}>{tip}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Police Run HR data ──
const policeHRData=[
  {d:0,hr:117},{d:0.3,hr:141},{d:0.7,hr:153},{d:1.0,hr:159},{d:1.5,hr:162},{d:2.0,hr:168},
  {d:2.5,hr:170},{d:3.0,hr:170},{d:3.5,hr:174},{d:4.0,hr:176},{d:4.5,hr:178},{d:5.0,hr:180},
  {d:5.5,hr:180},{d:6.0,hr:181},{d:6.5,hr:183},{d:7.0,hr:183},{d:7.5,hr:185},{d:8.0,hr:185},
  {d:8.5,hr:187},{d:9.0,hr:188},{d:9.5,hr:190},{d:10.0,hr:188},
];

const policePaceData=[
  {km:"1",pace:5.78,hr:158},{km:"2",pace:5.90,hr:168},{km:"3",pace:5.85,hr:172},
  {km:"4",pace:5.82,hr:174},{km:"5",pace:5.88,hr:178},{km:"6",pace:5.90,hr:180},
  {km:"7",pace:5.95,hr:182},{km:"8",pace:6.05,hr:184},{km:"9",pace:6.08,hr:187},{km:"10",pace:5.72,hr:190},
];

const policeHRZones=[
  {zone:"Z1",name:"Recovery",  bpm:"0–118",   pct:2,  color:"#1E3A5F"},
  {zone:"Z2",name:"Aerobic",   bpm:"118–147",  pct:5,  color:C.green},
  {zone:"Z3",name:"Tempo",     bpm:"147–162",  pct:8,  color:C.yellow},
  {zone:"Z4",name:"Threshold", bpm:"162–177",  pct:28, color:C.tcs},
  {zone:"Z5",name:"Max",       bpm:"177+",     pct:57, color:C.namma},
];

const POLICE_TABS=["Race Stats","Heart Rate","Pace Analysis","Takeaways"];
function PoliceRun(){
  const [tab,setTab]=useState(0);
  const accent=C.police;
  return(
    <>
      <div style={{background:"#0A1A0A",padding:"10px 18px",borderBottom:`1px solid ${accent}22`}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:accent,boxShadow:`0 0 8px ${accent}`}}/>
          <span style={{fontSize:12,color:accent,fontFamily:F.b,fontWeight:600}}>COMPLETED — Mar 1, 2026 · Bengaluru</span>
          <div style={{marginLeft:"auto",background:"#0D2010",border:`1px solid ${accent}44`,borderRadius:20,padding:"3px 10px",fontSize:11,color:accent,fontWeight:700,fontFamily:F.b}}>✓ SUB-60 ACHIEVED</div>
        </div>
      </div>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {POLICE_TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"11px 6px",background:"transparent",border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>
        ))}
      </div>
      <div style={{padding:"20px 18px"}}>
        {tab===0&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Official Race Results")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                {[["🏁 Finish","58:53"],["⚡ Pace","5:53/km"],["📏 Distance","10.02 km"]].map(([l,v])=>(
                  <div key={l} style={{background:"#080B12",borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.mut,marginBottom:4,fontFamily:F.b}}>{l}</div>
                    <div style={{fontSize:20,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{v}</div>
                  </div>
                ))}
              </div>
              {sLabel("Performance Metrics")}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[["Avg HR","180 bpm"],["Max HR","190 bpm"],["Cadence","85 spm"],["Power","228W"]].map(([l,v])=>(
                  <div key={l} style={{background:"#080B12",borderRadius:8,padding:"9px 8px",textAlign:"center"}}>
                    <div style={{fontSize:15,fontWeight:700,color:accent,fontFamily:F.h,letterSpacing:"0.3px"}}>{v}</div>
                    <div style={{fontSize:10,color:C.mut,marginTop:2,fontFamily:F.b}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Activity Details")}
              {[["📍 Location","Bengaluru, Karnataka"],["⏱️ Moving Time","58 min 53 sec (zero stopped time)"],["🔥 Calories","889 kcal"],["⬆️ Elevation","39m (mostly flat course)"],["⚡ Max Speed","14.4 km/h (final sprint)"],["🎯 Training Load","336 (COROS — high intensity)"],["👟 Gear","ASICS Novablast 5 Daily trainers"],["💪 Norm. Power","229W"],].map(([l,v],i,arr)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:13,color:C.sec,fontFamily:F.b}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.pri,fontFamily:F.b,textAlign:"right",maxWidth:"55%"}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#0A1A0A",border:`1px solid ${accent}33`,borderRadius:12,padding:16}}>
              {sLabel("🏆 Achievement Unlocked", accent)}
              <div style={{fontSize:16,fontWeight:700,color:C.white,marginBottom:6,fontFamily:F.b}}>First official sub-60 minute 10K!</div>
              <div style={{fontSize:13,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>Finished in 58:53 — <strong style={{color:accent}}>1 min 7 sec under the 60-minute barrier</strong>. Average HR of 180 bpm shows you raced at near-max effort all the way. Cadence of 85 spm held steady. This is the baseline all future plans are built on.</div>
            </div>
          </div>
        )}
        {tab===1&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("HR Over Distance")}
              <div style={{fontSize:12,color:C.mut,marginBottom:12,fontFamily:F.b}}>Avg 180 bpm · Max 190 bpm · Almost entirely in Z4–Z5</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={policeHRData} margin={{left:0,right:0,top:8,bottom:0}}>
                  <defs><linearGradient id="hrFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity={0.4}/><stop offset="100%" stopColor={accent} stopOpacity={0.02}/></linearGradient></defs>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                  <YAxis domain={[90,195]} tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false} width={32}/>
                  <Tooltip content={({active,payload})=>{if(active&&payload?.length)return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white}}>{payload[0].payload.d}km</div><div style={{color:C.red}}>HR: {payload[0].value} bpm</div></div>);return null;}}/>
                  <ReferenceLine y={177} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.6}/>
                  <ReferenceLine y={162} stroke={C.yellow} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <Area type="monotone" dataKey="hr" stroke={accent} strokeWidth={2} fill="url(#hrFill)" dot={false} activeDot={{r:4,fill:accent}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("HR Zone Distribution")}
              {policeHRZones.map((z,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:28,fontSize:11,fontWeight:700,color:z.color,fontFamily:F.b}}>{z.zone}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:12,color:C.pri,fontFamily:F.b}}>{z.name}</span>
                      <span style={{fontSize:11,color:C.mut,fontFamily:F.b}}>{z.bpm} bpm</span>
                    </div>
                    <div style={{height:6,background:C.border,borderRadius:3}}><div style={{height:"100%",width:`${z.pct}%`,background:z.color,borderRadius:3,opacity:0.85}}/></div>
                  </div>
                  <div style={{width:36,textAlign:"right",fontSize:13,fontWeight:700,color:z.color,fontFamily:F.h,letterSpacing:"0.3px"}}>{z.pct}%</div>
                </div>
              ))}
              <div style={{marginTop:10,padding:"10px 12px",background:"#080B12",borderRadius:8}}>
                <div style={{fontSize:12,color:"#FED7AA",fontFamily:F.b,lineHeight:1.6}}>⚠️ <strong>57% in Z5 (max effort)</strong> — unsustainable for negative splits. For TCS, targeting 40% Z4 / 20% Z5 will unlock a faster finish.</div>
              </div>
            </div>
          </div>
        )}
        {tab===2&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14,paddingBottom:8}}>
              {sLabel("Km-by-Km Pace")}
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={policePaceData} barSize={26}>
                  <XAxis dataKey="km" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[5.5,6.2]} hide/>
                  <Tooltip cursor={{fill:"#1A1F2E"}} content={({active,payload})=>{if(active&&payload?.length){const p=payload[0].payload;return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white,fontWeight:700}}>Km {p.km}</div><div style={{color:accent}}>{p.pace.toFixed(2).replace(".",":")} /km</div><div style={{color:C.red}}>HR ~{p.hr}</div></div>);}return null;}}/>
                  <Bar dataKey="pace" radius={[4,4,0,0]}>
                    {policePaceData.map((d,i)=><Cell key={i} fill={d.pace>5.9?C.yellow:d.pace<5.75?accent:C.blue}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Split Analysis")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[["First 5km","29:15","5:51/km avg"],["Second 5km","29:38","5:56/km avg"]].map(([l,t,p])=>(
                  <div key={l} style={{background:"#080B12",borderRadius:8,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.mut,marginBottom:4,fontFamily:F.b}}>{l}</div>
                    <div style={{fontSize:22,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{t}</div>
                    <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{p}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 12px",background:"#0A1A0A",borderRadius:8,border:`1px solid ${accent}22`}}>
                <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.7}}><strong style={{color:accent}}>+23 sec positive split</strong> — slowed in second half due to Z5 HR saturation. For Namma, managing the first climb conservatively will enable a more even split.</div>
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              {sLabel("Power & Cadence")}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[["Avg Power","228W"],["Norm Power","229W"],["Avg Cadence","85 spm"]].map(([l,v])=>(
                  <div key={l} style={{background:"#080B12",borderRadius:8,padding:"9px 8px",textAlign:"center"}}>
                    <div style={{fontSize:15,fontWeight:700,color:accent,fontFamily:F.h,letterSpacing:"0.3px"}}>{v}</div>
                    <div style={{fontSize:10,color:C.mut,marginTop:2,fontFamily:F.b}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("What Went Right ✅", accent)}
              {[["Consistency","58:53 moving = 58:53 elapsed. Zero wasted seconds."],["Cadence","85 spm held entire race. Target is 85–90 — you're already there."],["Even Splits","5:51 first half, 5:56 second half. Near-perfect pacing for a first 10K race."],["Gear","Novablast 5 held up perfectly. Use same shoes for Namma + TCS."]].map(([t,d],i,arr)=>(
                <div key={t} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:16,width:22,flexShrink:0}}>✅</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.pri,fontFamily:F.b}}>{t}</div><div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5}}>{d}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("What To Improve ⚡")}
              {[["HR Control","57% in Z5. For TCS, aim 40% Z4 / 20% Z5 to sustain speed longer."],["Km 8–9 Fade","Pace dropped to 6:05–6:08 late race due to HR saturation. Fix: intervals + hill training."],["Distance Ceiling","Longest run = 10km. Push long runs to 12–15km to improve race-pace endurance."],["Surge Timing","Strong sprint at km 10 shows tank still had fuel. Start the surge at km 8.5 next time."]].map(([t,d],i,arr)=>(
                <div key={t} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:16,width:22,flexShrink:0}}>⚡</span>
                  <div><div style={{fontSize:13,fontWeight:600,color:C.pri,fontFamily:F.b}}>{t}</div><div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.5}}>{d}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:"linear-gradient(135deg,#0A1A0A,#0D1A10)",border:`1px solid ${accent}44`,borderRadius:12,padding:16}}>
              {sLabel("🚀 Season Progression", accent)}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[["Police Run","58:53","✓ Done",C.police],["Namma Power","57:30","Mar 15",C.namma],["TCS Open","54:50","Apr 26",C.tcs]].map(([r,t,d,col],i)=>(
                  <div key={r} style={{background:i===0?"#0D2010":"#080B12",borderRadius:8,padding:10,textAlign:"center",border:`1px solid ${col}44`}}>
                    <div style={{fontSize:10,color:col,fontFamily:F.b,fontWeight:600,marginBottom:3}}>{r}</div>
                    <div style={{fontSize:19,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{t}</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:12,height:6,background:C.border,borderRadius:3}}>
                <div style={{height:"100%",width:"33%",background:`linear-gradient(to right,${C.police},${C.namma})`,borderRadius:3}}/>
              </div>
              <div style={{fontSize:11,color:C.mut,marginTop:6,fontFamily:F.b,textAlign:"center"}}>4 min 3 sec improvement target across 3 races</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Namma Power Run ───────────────────────────────────────────────────────────
const nammaSegments=[
  {km:"0–1 km",  terrain:"Flat Start",       pace:"6:10/km",      hr:"~155",intensity:0.35,color:C.green,tip:"Don't surge with the crowd. Start easy, HR under 160."},
  {km:"1–2.5 km",terrain:"⬆️ The Climb",      pace:"6:30–6:40/km", hr:"~172",intensity:0.75,color:C.tcs,  tip:"5.7% avg grade, max 13%. Shorten stride, keep cadence 85+."},
  {km:"2.5–5 km",terrain:"Flat / Rolling",    pace:"5:50/km",      hr:"~168",intensity:0.60,color:C.blue, tip:"Recover on the flat. Gentle downhill — bank the time here."},
  {km:"5–7 km",  terrain:"Turnaround + Flat", pace:"5:45/km",      hr:"~172",intensity:0.65,color:C.blue, tip:"Fastest stretch. Feel strong. Push now."},
  {km:"7–8.5 km",terrain:"⬆️ Climb Again",    pace:"6:20–6:30/km", hr:"~182",intensity:0.90,color:C.namma,tip:"Most runners blow up here. Shorten stride. Keep moving. Cadence 88+."},
  {km:"8.5–10 km",terrain:"⬇️ Downhill Finish",pace:"5:30–5:40/km",hr:"~185",intensity:0.85,color:C.namma,tip:"Gravity is your friend. Open up and empty the tank."},
];

const nammaTraining=[
  {date:"Fri Mar 6", emoji:"🏸",label:"Badminton ✓",      light:C.green, isRace:false,isKey:false,done:true,
   desc:"67 min · Avg HR 133 · Max 157 · 547 kcal. Cross-training instead of rest — legs fresh, heart rate controlled. ✅"},
  {date:"Sat Mar 7", emoji:"✅",label:"Long Run ✓",        light:"#818CF8",isRace:false,isKey:false,done:true,
   desc:"14.08 km · 1:40:20 · 7:08/km · HR avg 159 · 150m elevation · 1244 kcal. EXCEEDED plan (10–12km target). Big aerobic base work. ✅"},
  {date:"Sun Mar 8", emoji:"🏸",label:"Badminton ✓",        light:C.green, isRace:false,isKey:false,done:true,
   desc:"1:44:11 · Avg HR 132 · Max 161 · 822 kcal. Planned rest day → smart active recovery instead. Legs stayed fresh. ✅"},
  {date:"Mon Mar 9", emoji:"✅",label:"Morning Run ✓",     light:C.green, isRace:false,isKey:false,done:true,
   desc:"5.15km · 31:00 · 6:01/km · Avg HR 171 · 221W · 435 kcal. Faster than planned easy pace — HR ran at Z4 avg (171). Legs felt good. 6 days to race: taper mode from here. ✅"},
  {date:"Tue Mar 10",emoji:"⚡",label:"Hill Intervals 🔑", light:C.tcs,   isRace:false,isKey:true, done:false,
   desc:"6 km total: find a 400–600m incline. 4× run up at effort, jog down. Trains legs for NICE Road's km 1–2 climb."},
  {date:"Wed Mar 11",emoji:"🏃",label:"Recovery Run",      light:C.green, isRace:false,isKey:false,done:false,
   desc:"5 km @ 8:00/km or full rest if legs feel heavy."},
  {date:"Thu Mar 12",emoji:"💨",label:"Shakeout + Strides",light:C.purple,isRace:false,isKey:false,done:false,
   desc:"4 km easy + 4×80m strides at race effort. Stay sharp, don't tire."},
  {date:"Fri Mar 13",emoji:"🛌",label:"Full Rest",         light:C.sec,   isRace:false,isKey:false,done:false,
   desc:"Nothing. Carb load at dinner: rice + dal + curd. Sleep by 10pm."},
  {date:"Sat Mar 14",emoji:"🎽",label:"Shakeout + BIB",    light:C.blue,  isRace:false,isKey:false,done:false,
   desc:"20 min very easy + 2 strides at race pace. Collect BIB at Swaasthya Fitness, Whitefield."},
  {date:"Sun Mar 15",emoji:"🏅",label:"RACE DAY",          light:C.namma, isRace:true, isKey:false,done:false,
   desc:"Namma Power Run 2026 · Target: 57:30–58:30 · NICE Road, Hoskerehalli"},
];

const NAMMA_ELEV_PTS=[0,3,6,12,22,35,45,52,58,62,65,67,68,66,63,58,52,45,38,30,24,18,14,10,7,5,4,3,2,2,2,3,5,8,12,18,25,33,42,50,57,63,67,68,67,65,62,58,53,47,40,33,26,20,15,10,7,4,2,0];

function NammaElevSVG(){
  const W2=560,H2=80,pad=10,mx=Math.max(...NAMMA_ELEV_PTS),n=NAMMA_ELEV_PTS.length;
  const pts=NAMMA_ELEV_PTS.map((v,i)=>[pad+(i/(n-1))*(W2-2*pad),H2-pad-(v/mx)*(H2-2*pad)]);
  return(
    <svg viewBox={`0 0 ${W2} ${H2+20}`} style={{width:"100%",height:"auto"}}>
      <defs><linearGradient id="ng2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.namma} stopOpacity="0.35"/><stop offset="100%" stopColor={C.namma} stopOpacity="0.03"/></linearGradient></defs>
      {[[8,18],[38,50]].map(([s,e],i)=>{const x1=pad+(s/(n-1))*(W2-2*pad),x2=pad+(e/(n-1))*(W2-2*pad);return <rect key={i} x={x1} y={pad} width={x2-x1} height={H2-2*pad} fill={C.namma} opacity="0.08" rx="2"/>;})}
      <path d={`M ${pad},${H2-pad} L ${pts.map(p=>p.join(",")).join(" L ")} L ${W2-pad},${H2-pad} Z`} fill="url(#ng2)"/>
      <path d={`M ${pts.map(p=>p.join(",")).join(" L ")}`} fill="none" stroke={C.namma} strokeWidth="2" strokeLinejoin="round"/>
      {[0,2.5,5,7.5,10].map((km,i)=>(<text key={km} x={pad+(i/4)*(W2-2*pad)} y={H2+14} textAnchor="middle" fill={C.mut} fontSize="9" fontFamily="monospace">{km}km</text>))}
      <text x={(pad+(8/(n-1))*(W2-2*pad)+pad+(18/(n-1))*(W2-2*pad))/2} y={H2+14} textAnchor="middle" fill="#FF6B6B" fontSize="9" fontFamily="monospace">Climb ↑</text>
      <text x={(pad+(38/(n-1))*(W2-2*pad)+pad+(50/(n-1))*(W2-2*pad))/2} y={H2+14} textAnchor="middle" fill="#FF6B6B" fontSize="9" fontFamily="monospace">Climb ↑</text>
    </svg>
  );
}

const NAMMA_TABS=["Race Plan","SBI Analysis","Route & Elev","Training Week","Race Morning"];
function NammaRun(){
  const [tab,setTab]=useState(0);
  const accent=C.namma;
  return(
    <>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {NAMMA_TABS.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"11px 6px",background:"transparent",border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"20px 18px"}}>
        {tab===0&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Km-by-Km Race Strategy")}
              {nammaSegments.map((seg,i)=>(
                <div key={i} style={{background:"#080B12",borderRadius:10,padding:"13px 14px",marginBottom:8,borderLeft:`3px solid ${seg.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:13,fontWeight:700,color:seg.color,minWidth:78,fontFamily:F.h,letterSpacing:"0.3px"}}>{seg.km}</span>
                      <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{seg.terrain}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:16,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{seg.pace}</div>
                      <div style={{fontSize:11,color:C.mut}}>HR {seg.hr}</div>
                    </div>
                  </div>
                  <IntBar val={seg.intensity} color={seg.color}/>
                  <div style={{height:6}}/>
                  <div style={{fontSize:12,color:C.sec,lineHeight:1.6,fontFamily:F.b}}>{seg.tip}</div>
                </div>
              ))}
            </div>
            <div style={{background:"linear-gradient(135deg,#1A0800,#0D0500)",border:`1px solid ${accent}33`,borderRadius:12,padding:16}}>
              {sLabel("⚡ Mental Cue — Km 7–8",accent)}
              <div style={{fontSize:17,fontWeight:700,color:C.white,lineHeight:1.5,fontFamily:F.b}}>"Shorten stride. Keep cadence 88+. Keep moving."</div>
              <div style={{fontSize:12,color:C.sec,marginTop:8,lineHeight:1.6,fontFamily:F.b}}>Your HR will be 182–185. Every other runner feels the same. The ones who hold form here win.</div>
            </div>
          </div>
        )}
        {tab===1&&<SBIAnalysis/>}
        {tab===2&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("NICE Road Elevation Profile (Out & Back)")}
              <NammaElevSVG/>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              {sLabel("Route Facts")}
              {[["📍","Start/Finish","Hoskerehalli Toll Junction, NICE Road"],["↕️","Key Climb","0.83km at 5.7% avg grade, max 13%"],["📏","Total Elev","~80–100m (climb appears TWICE — out & back)"],["🛣️","Surface","Smooth expressway — zero potholes"],["🔄","Format","Out-and-back — you face the hill both ways"],["🌡️","Weather","~24°C at 6am · Heats up fast after 7am"]].map(([icon,l,v],i,arr)=>(
                <div key={l} style={{display:"flex",gap:12,alignItems:"flex-start",paddingBottom:10,marginBottom:10,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:18}}>{icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:11,color:C.mut,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,fontFamily:F.b}}>{l}</div><div style={{fontSize:13,color:"#CBD5E1",marginTop:3,fontWeight:600,fontFamily:F.b}}>{v}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:C.mut,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,fontFamily:F.b}}>9-Day Countdown to Race Day</div>
              <div style={{display:"flex",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>Done</span></div>
                <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:"#283040"}}/><span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>Planned</span></div>
              </div>
            </div>
            {nammaTraining.map((day,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8,padding:"12px 14px",
                background:day.isRace?"linear-gradient(135deg,#1A0000,#2A0000)":day.done?"linear-gradient(135deg,#060F08,#080E0A)":C.card,
                border:`1px solid ${day.isRace?accent+"55":day.done?day.light+"44":day.isKey?"#F9731633":C.border}`,
                borderRadius:10,borderLeft:`3px solid ${day.light}`,
                opacity:(!day.done&&!day.isRace&&i>1)?0.72:1,
              }}>
                <div style={{fontSize:22,lineHeight:1,paddingTop:2}}>{day.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:15,fontWeight:700,color:day.light,textTransform:"uppercase",fontFamily:F.h,letterSpacing:"0.5px"}}>{day.label}</span>
                      {day.done&&<div style={{background:"#0A1F0D",border:`1px solid ${C.green}55`,borderRadius:10,padding:"1px 7px",fontSize:9,color:C.green,fontWeight:700,fontFamily:F.b,letterSpacing:"0.05em"}}>✓ DONE</div>}
                    </div>
                    <span style={{fontSize:12,color:C.mut,fontFamily:F.b}}>{day.date}</span>
                  </div>
                  <div style={{fontSize:12,color:day.done?"#86EFAC99":C.sec,marginTop:3,lineHeight:1.6,fontFamily:F.b}}>{day.desc}</div>
                </div>
              </div>
            ))}
            <div style={{background:"linear-gradient(135deg,#060F08,#080E0A)",border:`1px solid ${C.green}33`,borderRadius:12,padding:14,marginTop:6}}>
              <div style={{fontSize:12,color:"#86EFAC",fontFamily:F.b,lineHeight:1.7}}>
                📊 <strong>Week progress: 4/9 days done</strong> · <strong style={{color:C.white}}>19.23km</strong> running + 2 badminton sessions · <strong style={{color:C.namma}}>⚠️ HR running hot — taper carefully</strong> · <strong style={{color:C.white}}>6 days to race</strong>. Next: 🔑 hill intervals Tue. 🎯
              </div>
            </div>
          </div>
        )}
        {tab===4&&(
          <div>
            {sLabel("Mar 15 Morning Timeline")}
            <Timeline accent={accent} items={[
              {time:"4:45 AM",action:"Wake Up",       icon:"💧",detail:"Drink 400ml water immediately.",fire:false},
              {time:"5:00 AM",action:"Pre-race Fuel", icon:"🍌",detail:"2 bananas + pinch of salt in 200ml water.",fire:false},
              {time:"5:20 AM",action:"Leave Home",    icon:"🚗",detail:"Arrive early. Beat traffic, beat heat.",fire:false},
              {time:"5:40 AM",action:"Dynamic Warmup",icon:"🤸",detail:"Leg swings → hip circles → high knees → A-skips.",fire:false},
              {time:"5:50 AM",action:"Race Strides",  icon:"⚡",detail:"80m × 2 at 5:50/km.",fire:false},
              {time:"5:55 AM",action:"Seed Yourself", icon:"🏁",detail:"58–60 min pace group. Don't go to the front.",fire:false},
              {time:"6:00 AM",action:"🏅 RACE START", icon:"🔥",detail:"Namma Power Run 2026.",fire:true},
            ]}/>
            <div style={{background:"#080B0A",border:`1px solid ${C.green}33`,borderRadius:12,padding:16,marginTop:8}}>
              {sLabel("💧 Hydration Plan",C.green)}
              {[["Night before","500ml water before sleep"],["4:45 AM","400ml water on waking"],["5:00 AM","200ml with pinch of salt"],["Mid-race","Grab-and-go at stations — DON'T stop"],["Finish line","Coconut water or ORS immediately"]].map(([w,v],i,arr)=>(
                <div key={i} style={{display:"flex",gap:12,paddingBottom:9,marginBottom:9,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:12,color:C.green,width:90,flexShrink:0,fontWeight:600,fontFamily:F.b}}>{w}</span>
                  <span style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── TCS Open 10K ─────────────────────────────────────────────────────────────
const tcsElevData=[
  {d:0,alt:908,grade:0},{d:0.3,alt:904,grade:-1.3},{d:0.7,alt:900,grade:-1.1},{d:1.0,alt:897,grade:-1.0},
  {d:1.4,alt:893,grade:-1.0},{d:1.8,alt:889,grade:-1.1},{d:2.0,alt:889,grade:0},{d:2.3,alt:892,grade:1.0},
  {d:2.7,alt:896,grade:1.3},{d:3.0,alt:895,grade:-0.3},{d:3.5,alt:895,grade:0},{d:4.0,alt:894,grade:-0.2},
  {d:4.3,alt:895,grade:0.3},{d:4.6,alt:899,grade:1.3},{d:4.8,alt:903,grade:2.0},{d:5.0,alt:908,grade:2.5},
  {d:5.3,alt:906,grade:-0.7},{d:5.7,alt:904,grade:-0.5},{d:6.0,alt:903,grade:-0.3},{d:6.4,alt:901,grade:-0.5},
  {d:6.8,alt:899,grade:-0.5},{d:7.0,alt:899,grade:0},{d:7.3,alt:901,grade:0.7},{d:7.6,alt:903,grade:0.7},
  {d:8.0,alt:901,grade:-0.5},{d:8.3,alt:899,grade:-0.7},{d:8.6,alt:901,grade:0.7},{d:9.0,alt:905,grade:1.0},
  {d:9.3,alt:903,grade:-0.7},{d:9.6,alt:901,grade:-0.7},{d:10.0,alt:899,grade:-0.5},
];
const tcsKmData=[
  {km:"Km 1",loc:"Cubbon Rd → Dickenson → Ulsoor",terrain:"Net Downhill",  grade:"-1.1%",pace:"5:45",hr:158,cadence:83,elev:-11,color:C.green,intensity:0.35,turns:2,tip:"Cruise the downhill. Resist the wave start surge."},
  {km:"Km 2",loc:"Ulsoor Lake, Bhaskaran Rd",      terrain:"Down then Up",  grade:"+4m",  pace:"5:35",hr:163,cadence:85,elev:0,  color:C.green,intensity:0.45,turns:1,tip:"Short sharp uphill in latter half — don't fight it."},
  {km:"Km 3",loc:"Bhaskaran Rd U-turn",            terrain:"Uphill+Headwind",grade:"+7m", pace:"5:35",hr:168,cadence:85,elev:7,  color:C.yellow,intensity:0.55,turns:1,tip:"U-turn #1. Headwinds on return. Maintain cadence."},
  {km:"Km 4",loc:"Gangadhar Chetty Road",          terrain:"FLATTEST 🔑",  grade:"-1m",  pace:"5:20",hr:170,cadence:87,elev:-1, color:C.blue, intensity:0.65,turns:3,tip:"Surge here! Flattest km — bank 10–15 seconds."},
  {km:"Km 5",loc:"Dickenson → Kamaraj Rd",         terrain:"HARDEST KM ⚠", grade:"+19m", pace:"5:45",hr:178,cadence:86,elev:19, color:C.red,  intensity:0.90,turns:2,tip:"Short sharp up → protracted uphill. Shorten stride. Cadence 88+. Survive."},
  {km:"Km 6",loc:"Cubbon Rd, Chinnaswamy",         terrain:"Recovery",      grade:"-5m",  pace:"5:25",hr:172,cadence:86,elev:-5, color:C.purple,intensity:0.55,turns:1,tip:"Mental reset. Recover here."},
  {km:"Km 7",loc:"Minsk Sq → Rajbhavan → GPO",    terrain:"Down then Up",  grade:"+4m",  pace:"5:25",hr:173,cadence:86,elev:4,  color:C.blue, intensity:0.60,turns:1,tip:"Vidhana Soudha, Cubbon Park, High Court. Draw from the crowd."},
  {km:"Km 8",loc:"Dr Ambedkar → KR Circle",        terrain:"Down → U-turn", grade:"-7m",  pace:"5:25",hr:174,cadence:87,elev:-7, color:C.yellow,intensity:0.65,turns:1,tip:"Steady downhill — don't surge yet. U-turn #3 at KR Circle."},
  {km:"Km 9",loc:"Dr Ambedkar uphill → GPO",       terrain:"Up then Down",  grade:"+6m",  pace:"5:30",hr:179,cadence:87,elev:6,  color:C.red,  intensity:0.85,turns:2,tip:"Grunt time. Steady uphill. At top → gentle downhill. Dig deep."},
  {km:"Km 10",loc:"Cubbon Rd → Manekshaw",         terrain:"Straight SPRINT",grade:"-2m", pace:"5:05",hr:185,cadence:91,elev:-2, color:C.tcs,  intensity:1.00,turns:0,tip:"THE STRAIGHTAWAY. Empty every last reserve."},
];
const tcsWeeks=[
  {week:"Wk 1",dates:"Mar 16–22",label:"Recovery",    km:16,color:C.green, intensity:0.15,sessions:["Mon: REST","Tue: REST","Wed: 5km easy","Thu: REST","Fri: 5km easy","Sat: REST","Sun: 6km easy"]},
  {week:"Wk 2",dates:"Mar 23–29",label:"Rebuild",     km:33,color:C.blue,  intensity:0.40,sessions:["Mon: 6km easy","Tue: REST","Wed: 8km easy","Thu: 5km tempo @5:20","Fri: REST","Sat: 6km","Sun: 8km easy"]},
  {week:"Wk 3",dates:"Mar 30–Apr 5",label:"Speed 🔑", km:42,color:C.tcs,   intensity:0.70,sessions:["Mon: 6km easy","Tue: 6x800m @5:10/km","Wed: REST","Thu: 8km easy","Fri: 5km tempo","Sat: REST","Sun: 12km long"]},
  {week:"Wk 4",dates:"Apr 6–12", label:"Race Sim 🔑", km:40,color:C.tcs,   intensity:0.75,sessions:["Mon: REST","Tue: 8km easy","Wed: 6x800m intervals","Thu: REST","Fri: 8km","Sat: REST","Sun: Run TCS course"]},
  {week:"Wk 5",dates:"Apr 13–19",label:"Sharpening",  km:29,color:C.yellow,intensity:0.50,sessions:["Mon: 6km easy","Tue: 8km @5:25","Wed: REST","Thu: 4km+strides","Fri: REST","Sat: 5km easy","Sun: 6km easy"]},
  {week:"Wk 6",dates:"Apr 20–26",label:"Taper 🏁",    km:17,color:C.red,   intensity:0.20,sessions:["Mon: 5km easy","Tue: 4km+strides","Wed: 5km easy","Thu: REST","Fri: REST","Sat: 3km shakeout","Sun: RACE DAY"]},
];
const TCS_TABS=["Overview","Km Breakdown","Elevation","Training Plan","Race Morning"];
function TCSRun(){
  const [tab,setTab]=useState(0);
  const [activeKm,setActiveKm]=useState(null);
  const [hovWk,setHovWk]=useState(null);
  const accent=C.tcs;
  const totalGain=tcsKmData.reduce((s,k)=>s+Math.max(0,k.elev),0);
  return(
    <>
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {TCS_TABS.map((t,i)=>(<button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"11px 6px",background:"transparent",border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>))}
      </div>
      <div style={{padding:"20px 18px"}}>
        {tab===0&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Full Season — All 3 Races")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[[C.police,"Police Run","Mar 1","58:53","5:53","✓ Done","39m"],[C.namma,"Namma Power","Mar 15","~57:30","5:45","Mar 15","~90m"],[C.tcs,"TCS Open","Apr 26","54:50","5:29","Apr 26","~50m"]].map(([col,r,d,t,p,s,e],i)=>(
                  <div key={r} style={{background:i===0?"linear-gradient(135deg,#0A1A0A,#081208)":i===2?"linear-gradient(135deg,#1A0D00,#0D0800)":"#080B12",border:`1px solid ${col}44`,borderRadius:10,padding:12}}>
                    <div style={{fontSize:10,color:col,fontWeight:700,letterSpacing:"0.08em",marginBottom:3,fontFamily:F.b}}>{r}</div>
                    <div style={{fontSize:10,color:C.mut,marginBottom:5,fontFamily:F.b}}>{d}</div>
                    <div style={{fontSize:20,fontFamily:F.h,color:C.white,letterSpacing:"0.5px"}}>{t}</div>
                    <div style={{fontSize:11,color:C.sec,fontFamily:F.b}}>{p}/km</div>
                    <div style={{height:1,background:C.border,margin:"7px 0"}}/>
                    <div style={{fontSize:10,color:col,fontWeight:600,fontFamily:F.b}}>{s}</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>Elev {e}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("TCS Course — What to Expect")}
              {[["⬇️","Km 1–2","Net downhill start. Cruise.","CRUISE","#064E3B",C.green],["🔄","Km 3","U-turn, headwinds. Maintain cadence.","HOLD","#1C1400",C.yellow],["⚡","Km 4","Gangadhar Chetty — flattest. Surge!","SURGE","#0C1A30",C.blue],["⚠️","Km 5","Steepest km — sharp uphill to Kamaraj.","SURVIVE","#1A0600",C.red],["🌿","Km 6","Back on Cubbon Rd. Recover.","RECOVER","#120A20",C.purple],["🏛️","Km 7–9","Vidhana Soudha, KR Circle U-turn, grind.","GRIND","#1A0600",C.red],["🏅","Km 10","The straightaway. Empty everything.","SPRINT","#1A0A00",C.tcs]].map(([icon,km,desc,badge,bc,tc],i,arr)=>(
                <div key={km} style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:18,width:22,textAlign:"center",flexShrink:0}}>{icon}</span>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#CBD5E1",fontFamily:F.b}}>{km}</div><div style={{fontSize:12,color:C.mut,lineHeight:1.5,fontFamily:F.b}}>{desc}</div></div>
                  <div style={{background:bc,border:`1px solid ${tc}44`,borderRadius:6,padding:"3px 8px",fontSize:10,color:tc,fontWeight:700,flexShrink:0,fontFamily:F.b}}>{badge}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#100800",border:`1px solid ${accent}22`,borderRadius:12,padding:16}}>
              {sLabel("🌡️ April Heat — Critical",accent)}
              {[["Pre-cool at start","Pour cold water on wrists + neck before start."],["Every station: grab & go","Sip ~150ml while running. Don't stop."],["Accept 5–8 bpm higher HR","April heat: chase pace, not heart rate."],["Salt at km 5","Electrolyte if available — prevents late-race cramping."]].map(([t,d],i,arr)=>(
                <div key={t} style={{display:"flex",gap:8,marginBottom:i<arr.length-1?10:0}}>
                  <div style={{width:3,background:accent,borderRadius:2,flexShrink:0,opacity:0.6}}/>
                  <div><div style={{fontSize:13,fontWeight:600,color:"#FED7AA",fontFamily:F.b}}>{t}</div><div style={{fontSize:12,color:"#92400E",marginTop:2,lineHeight:1.5,fontFamily:F.b}}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab===1&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,paddingBottom:8,marginBottom:14}}>
              {sLabel("Pace Target per Km")}
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={tcsKmData} barSize={28}>
                  <XAxis dataKey="km" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={d=>d.replace("Km ","")}/>
                  <YAxis domain={[4.8,6.0]} hide/>
                  <Tooltip cursor={{fill:"#1A1F2E"}} content={({active,payload})=>{if(active&&payload?.length){const pv=parseFloat(payload[0].value);const pm=Math.floor(pv);const ps=Math.round((pv-pm)*100);return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:payload[0].payload.color,fontWeight:700}}>{pm}:{ps<10?"0"+ps:ps}/km</div></div>);}return null;}}/>
                  <Bar dataKey={d=>parseFloat(d.pace.replace(":",".") )} radius={[4,4,0,0]}>
                    {tcsKmData.map((d,i)=><Cell key={i} fill={i===activeKm?d.color:d.color+"66"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {tcsKmData.map((km,i)=>(
              <div key={i} onClick={()=>setActiveKm(i===activeKm?null:i)} style={{background:activeKm===i?C.card:"#09090F",border:`1px solid ${activeKm===i?km.color+"55":C.border}`,borderLeft:`3px solid ${km.color}`,borderRadius:10,marginBottom:8,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:km.color+"22",border:`1px solid ${km.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:km.color,fontFamily:F.h,letterSpacing:"0.3px"}}>{i+1}</div>
                    <div><div style={{fontSize:14,fontWeight:700,color:C.pri,fontFamily:F.b}}>{km.km}</div><div style={{fontSize:11,color:C.mut,fontFamily:F.b}}>{km.loc}</div></div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:18,fontFamily:F.h,color:km.color,letterSpacing:"0.5px"}}>{km.pace}/km</div><div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{km.terrain}</div></div>
                </div>
                <div style={{height:3,background:C.border,margin:"0 14px"}}><div style={{height:"100%",width:`${km.intensity*100}%`,background:km.color,borderRadius:2}}/></div>
                {activeKm===i&&(
                  <div style={{padding:"12px 14px 14px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
                      {[["Pace",km.pace+"/km"],["HR","~"+km.hr],["Cadence",km.cadence+" spm"],["Elev",(km.elev>0?"+":"")+km.elev+"m"]].map(([l,v])=>(
                        <div key={l} style={{background:"#080B12",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:km.color,fontFamily:F.h}}>{v}</div><div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{l}</div></div>
                      ))}
                    </div>
                    <div style={{fontSize:13,color:C.sec,lineHeight:1.7,background:"#080B12",borderRadius:8,padding:"10px 12px",fontFamily:F.b}}>💬 {km.tip}</div>
                    {km.turns>0&&<div style={{marginTop:8,fontSize:11,color:C.mut,fontFamily:F.b}}>🔄 {km.turns} turn{km.turns>1?"s":""} — slow for turns, re-accelerate out</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab===2&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Elevation Profile — TCS Course")}
              <div style={{fontSize:12,color:C.mut,marginBottom:12,fontFamily:F.b}}>826m–908m range · Total gain +{totalGain}m · Max grade 7.5%</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={tcsElevData} margin={{left:0,right:0,top:8,bottom:0}}>
                  <defs><linearGradient id="tef2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity={0.35}/><stop offset="100%" stopColor={accent} stopOpacity={0.03}/></linearGradient></defs>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                  <YAxis domain={[880,915]} tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}m`} width={38}/>
                  <Tooltip content={({active,payload})=>{if(active&&payload?.length){const d=payload[0].payload;return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white,fontWeight:600}}>{d.label||`${d.d}km`}</div><div style={{color:C.blue}}>Alt: {d.alt}m</div><div style={{color:d.grade>1?C.red:d.grade<-0.5?C.green:C.sec}}>{d.grade>0?"+":""}{d.grade}%</div></div>);}return null;}}/>
                  <ReferenceLine x={4.3} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <ReferenceLine x={5.0} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <ReferenceLine x={8.5} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <ReferenceLine x={9.2} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.5}/>
                  <Area type="monotone" dataKey="alt" stroke={accent} strokeWidth={2.5} fill="url(#tef2)" dot={false} activeDot={{r:4,fill:accent}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
              {sLabel("Grade % Per Section")}
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={tcsElevData} barSize={8}>
                  <XAxis dataKey="d" tick={{fill:C.mut,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}km`}/>
                  <YAxis domain={[-2,3]} hide/>
                  <ReferenceLine y={0} stroke="#2A2D3A" strokeWidth={1}/>
                  <Bar dataKey="grade" radius={[2,2,0,0]}>{tcsElevData.map((d,i)=><Cell key={i} fill={d.grade>1.5?C.red:d.grade>0.3?C.yellow:d.grade<-0.5?C.green:"#2A2D3A"}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:10,flexWrap:"wrap"}}>
                {[[C.red,"Steep ↑"],[C.yellow,"Mild ↑"],["#2A2D3A","Flat"],[C.green,"Downhill ↓"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
              {sLabel("Elevation by Km")}
              {tcsKmData.map((km,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<9?`1px solid ${C.border}`:"none"}}>
                  <div style={{width:40,fontSize:13,fontWeight:700,color:km.color,fontFamily:F.h,letterSpacing:"0.3px",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    {km.elev>0?<div style={{height:"100%",width:`${Math.min(100,km.elev/20*100)}%`,background:C.red,borderRadius:3}}/>:<div style={{height:"100%",width:`${Math.min(100,Math.abs(km.elev)/15*100)}%`,background:C.green,borderRadius:3}}/>}
                  </div>
                  <div style={{width:48,textAlign:"right",fontSize:13,fontWeight:700,color:km.elev>0?C.red:km.elev<0?C.green:C.mut,fontFamily:F.b}}>{km.elev>0?"+":""}{km.elev}m</div>
                  <div style={{width:55,fontSize:11,color:C.mut,fontFamily:F.b}}>{km.grade}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,paddingBottom:8,marginBottom:14}}>
              {sLabel("6-Week Volume (km/week)")}
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={tcsWeeks} barSize={40}>
                  <XAxis dataKey="week" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip cursor={{fill:"#1A1F2E"}} content={({active,payload})=>{if(active&&payload?.length){const d=payload[0].payload;return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,fontFamily:F.b}}><div style={{color:d.color,fontWeight:700}}>{d.label}</div><div style={{color:C.sec}}>{d.km} km · {d.dates}</div></div>);}return null;}}/>
                  <Bar dataKey="km" radius={[6,6,0,0]}>{tcsWeeks.map((w,i)=><Cell key={i} fill={hovWk===i?w.color:w.color+"77"}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {tcsWeeks.map((wk,i)=>(
              <div key={i} onMouseEnter={()=>setHovWk(i)} onMouseLeave={()=>setHovWk(null)} style={{background:C.card,border:`1px solid ${hovWk===i?wk.color+"44":C.border}`,borderLeft:`3px solid ${wk.color}`,borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                  <div><span style={{fontSize:16,fontWeight:700,color:wk.color,fontFamily:F.h,letterSpacing:"0.5px",marginRight:8}}>{wk.week}</span><span style={{fontSize:14,fontWeight:600,color:C.pri,fontFamily:F.b}}>{wk.label}</span></div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:20,fontFamily:F.h,color:C.white,letterSpacing:"0.3px"}}>{wk.km}km</span><div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>{wk.dates}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
                  {wk.sessions.map((s,j)=><div key={j} style={{fontSize:12,color:s.includes("REST")?"#334155":s.includes("RACE")||s.includes("DAY")?C.tcs:s.includes("x")||s.includes("tempo")?C.yellow:C.mut,padding:"2px 0",fontFamily:F.b}}>{s}</div>)}
                </div>
                <div style={{marginTop:10}}><IntBar val={wk.intensity} color={wk.color}/></div>
              </div>
            ))}
            <div style={{background:"#0A1205",border:`1px solid ${C.green}33`,borderRadius:12,padding:16}}>
              {sLabel("🔑 Key Workout: 6×800m Intervals",C.green)}
              <div style={{fontSize:13,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>Warmup 2km → 6 reps × 800m @ <strong style={{color:C.white}}>5:10/km</strong> with 90sec jog recovery → cooldown 1km. This cracks the 5:30/km barrier.</div>
            </div>
          </div>
        )}
        {tab===4&&(
          <div>
            {sLabel("Apr 26 — Race Day Timeline")}
            <Timeline accent={accent} items={[
              {time:"4:30 AM",action:"Wake Up",       icon:"⏰",detail:"400ml water immediately.",fire:false},
              {time:"4:45 AM",action:"Pre-race Fuel", icon:"🍌",detail:"2 bananas + 2 dates + salt in 200ml water.",fire:false},
              {time:"5:15 AM",action:"Leave Home",    icon:"🚗",detail:"Arrive by 5:30 AM. April traffic near Cubbon Rd.",fire:false},
              {time:"5:30 AM",action:"Warmup",        icon:"🤸",detail:"Leg swings, A-skips × 10 min. 2 strides at 5:20/km.",fire:false},
              {time:"5:55 AM",action:"Seed Yourself", icon:"🏁",detail:"55–57 min corral. Wave start — don't go front row.",fire:false},
              {time:"6:10 AM",action:"🔥 WAVE FIRES", icon:"🏃",detail:"TCS Open 10K 2026. Sub-55 is yours.",fire:true},
            ]}/>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginTop:14}}>
              {sLabel("🍽️ Race Day Nutrition")}
              {[["Apr 25 dinner","Rice + dal + curd. No fried food. Sleep by 9:30 PM."],["4:30 AM","400ml water on waking."],["4:45 AM","2 bananas + 2 dates + salt in 200ml water."],["Km 5 station","Electrolyte if available."],["Km 8 station","Last water. Grab and go."],["Finish","Coconut water or ORS + 2 boiled eggs within 30 min."]].map(([w,v],i,arr)=>(
                <div key={i} style={{display:"flex",gap:12,paddingBottom:9,marginBottom:9,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:12,color:accent,width:100,flexShrink:0,fontWeight:600,fontFamily:F.b}}>{w}</span>
                  <span style={{fontSize:12,color:C.sec,lineHeight:1.5,fontFamily:F.b}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{background:"#0A0D1A",border:`1px solid ${C.blue}33`,borderRadius:12,padding:16,marginTop:14}}>
              {sLabel("📋 Race Logistics",C.blue)}
              {[["BIB Collection","Apr 23–24 at Get Active Expo. No race-day pickup."],["Wave Start","Submit Namma Power Run result for fast wave."],["Parking","Metro to MG Road or Cubbon Park station."],["Finisher Tee","Top 1,500 men. Sub-55 puts you there comfortably."]].map(([l,v],i,arr)=>(
                <div key={i} style={{display:"flex",gap:10,paddingBottom:9,marginBottom:9,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{fontSize:12,color:C.blue,width:110,flexShrink:0,fontWeight:600,fontFamily:F.b}}>{l}</span>
                  <span style={{fontSize:12,color:C.sec,lineHeight:1.5,fontFamily:F.b}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  SBI GREEN 10K — COMPARISON & SUB-60 PLAN
// ══════════════════════════════════════════════════════════════════════════════

const SBI_COLOR = "#38BDF8"; // sky blue

// Real Strava lap data from SBI Green 10K
const sbiLaps = [
  {km:1, time:"6:10", pace:6.17, hr:160, elev:13,  power:223, cad:84},
  {km:2, time:"6:53", pace:6.88, hr:174, elev:27,  power:221, cad:83},
  {km:3, time:"6:21", pace:6.35, hr:171, elev:16,  power:223, cad:83},
  {km:4, time:"5:18", pace:5.30, hr:178, elev:0,   power:227, cad:86},
  {km:5, time:"6:00", pace:6.00, hr:178, elev:0,   power:225, cad:85},
  {km:6, time:"6:25", pace:6.42, hr:178, elev:9,   power:218, cad:85},
  {km:7, time:"7:05", pace:7.08, hr:182, elev:24,  power:217, cad:83},
  {km:8, time:"6:41", pace:6.68, hr:175, elev:12,  power:198, cad:83},
  {km:9, time:"5:46", pace:5.77, hr:177, elev:4,   power:213, cad:85},
  {km:10,time:"5:31", pace:5.52, hr:176, elev:2,   power:237, cad:85},
];

// Namma target blueprint derived from SBI analysis
const nammaPlan = [
  {km:1,  zone:"Flat Start",       sbiPace:6.17, targetPace:6.17, targetHR:155, elev:0,  color:C.green,
   issue:null, fix:"Roll out easy. Match SBI km1. HR under 158."},
  {km:2,  zone:"⬆️ Climb (out)",   sbiPace:6.88, targetPace:6.75, targetHR:170, elev:13, color:C.tcs,
   issue:"SBI km2 HR spiked to 174 on the first climb.", fix:"Same climb at NICE Road. Shorten stride. HR 168–172 max."},
  {km:3,  zone:"Flat Recovery",    sbiPace:6.35, targetPace:5.58, targetHR:165, elev:0,  color:C.blue,
   issue:"SBI km3: still recovering at 6:21.", fix:"NICE km 2.5–5 is flat — capitalise. Bank 30–40 sec here."},
  {km:4,  zone:"⚠️ DON'T SURGE",   sbiPace:5.30, targetPace:5.50, targetHR:170, elev:0,  color:C.red,
   issue:"SBI km4: SURGED to 5:18 — fastest km of race. Burned ALL your matches.", fix:"Hold 5:45–5:50. Save legs. The 2nd climb is 3km away."},
  {km:5,  zone:"Turnaround+Flat",  sbiPace:6.00, targetPace:5.50, targetHR:172, elev:0,  color:C.blue,
   issue:"SBI km5 dropped back to 6:00 after the surge.",fix:"Steady 5:45–5:50. No yo-yo pacing like SBI."},
  {km:6,  zone:"Flat Push",        sbiPace:6.42, targetPace:5.55, targetHR:174, elev:9,  color:C.blue,
   issue:"SBI km6 slowed to 6:25 — fatigue from km4 surge showing.", fix:"You'll have energy here because you didn't surge at km4. Push to 5:45."},
  {km:7,  zone:"⬆️ Climb (back)",  sbiPace:7.08, targetPace:6.58, targetHR:180, elev:24, color:C.namma,
   issue:"SBI km7: DISASTER — 7:05, HR 187. Power fell to 217W. Tanks empty from km4.", fix:"With controlled km4–6, you hit this climb with fuel. Target 6:30–6:40. Cadence 88+."},
  {km:8,  zone:"Recovery Downhill",sbiPace:6.68, targetPace:6.25, targetHR:176, elev:12, color:C.yellow,
   issue:"SBI km8: still suffering at 6:41. Power dropped to 198W (lowest of race).", fix:"Downhill on NICE Road. Let gravity work. 6:00–6:15."},
  {km:9,  zone:"Final Push",       sbiPace:5.77, targetPace:5.58, targetHR:178, elev:4,  color:C.green,
   issue:"SBI km9 finally recovered at 5:46 — but too late.", fix:"You'll have legs here. Target sub-5:45. Start surging."},
  {km:10, zone:"Sprint Finish",    sbiPace:5.52, targetPace:5.25, targetHR:185, elev:2,  color:C.namma,
   issue:"SBI km10: 5:31 finish sprint.", fix:"Aim for 5:10–5:20. You'll have more left than SBI."},
];

// Time saved per km vs SBI
const timeSavings = nammaPlan.map(d=>({
  km: `Km ${d.km}`,
  saved: Math.round((d.sbiPace - d.targetPace) * 60),
  color: d.sbiPace > d.targetPace ? C.green : C.red,
}));

const SBI_TABS = ["Race Comparison","Km Blueprint","Sub-60 Plan","Key Mistakes"];
function SBIAnalysis() {
  const [tab, setTab] = useState(0);
  const accent = SBI_COLOR;

  const CustomTooltip = ({active, payload, label}) => {
    if (active && payload?.length) return (
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 11px",fontSize:12,fontFamily:F.b}}>
        <div style={{color:C.white,fontWeight:700,marginBottom:3}}>{label}</div>
        {payload.map((p,i) => <div key={i} style={{color:p.color||accent}}>{p.name}: {p.value}</div>)}
      </div>
    );
    return null;
  };

  return (
    <>
      {/* Banner */}
      <div style={{background:"#080C14",padding:"10px 18px",borderBottom:`1px solid ${accent}22`,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:accent,flexShrink:0}}/>
        <span style={{fontSize:12,color:accent,fontWeight:700,fontFamily:F.b}}>SBI Green 10K — Nov 30, 2025 · Bengaluru</span>
        <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{background:"#0A1020",border:`1px solid ${accent}44`,borderRadius:20,padding:"2px 10px",fontSize:10,color:accent,fontWeight:700,fontFamily:F.b}}>63:09 → TARGET: SUB-60</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:"#070910",borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {SBI_TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"11px 6px",background:"transparent",border:"none",borderBottom:tab===i?`2px solid ${accent}`:"2px solid transparent",color:tab===i?accent:C.mut,cursor:"pointer",fontSize:11,fontFamily:F.b,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,whiteSpace:"nowrap"}}>{t}</button>
        ))}
      </div>

      <div style={{padding:"18px 18px"}}>

        {/* ── TAB 0: RACE COMPARISON ── */}
        {tab===0&&(
          <div>
            {/* Head-to-head stats */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("Head-to-Head: SBI vs Namma Target")}
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:6,alignItems:"center",marginBottom:16}}>
                {/* SBI column */}
                <div style={{background:"#080B12",borderRadius:10,padding:12,textAlign:"center",border:`1px solid ${accent}33`}}>
                  <div style={{fontSize:10,color:accent,fontWeight:700,fontFamily:F.b,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>SBI Green 10K</div>
                  <div style={{fontSize:28,fontFamily:F.h,color:accent,letterSpacing:"1px"}}>63:09</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>6:14/km avg</div>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    {[["HR","175 bpm"],["Max HR","187 bpm"],["Power","220W"],["Cad","84 spm"],["Elev","+111m"],["Load","323"]].map(([l,v])=>(
                      <div key={l} style={{fontSize:10,fontFamily:F.b}}><span style={{color:C.mut}}>{l}: </span><span style={{color:C.pri,fontWeight:600}}>{v}</span></div>
                    ))}
                  </div>
                </div>
                {/* VS divider */}
                <div style={{textAlign:"center",padding:"0 6px"}}>
                  <div style={{fontSize:18,fontFamily:F.h,color:C.mut,letterSpacing:"2px"}}>VS</div>
                  <div style={{marginTop:8,fontSize:10,color:C.mut,fontFamily:F.b}}>3:09<br/>faster</div>
                </div>
                {/* Namma target */}
                <div style={{background:"linear-gradient(135deg,#1A0500,#120300)",borderRadius:10,padding:12,textAlign:"center",border:`1px solid ${C.namma}44`}}>
                  <div style={{fontSize:10,color:C.namma,fontWeight:700,fontFamily:F.b,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em"}}>Namma Target</div>
                  <div style={{fontSize:28,fontFamily:F.h,color:C.namma,letterSpacing:"1px"}}>58:30</div>
                  <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>5:51/km avg</div>
                  <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    {[["HR","~172"],["Max HR","~185"],["Power","~225W"],["Cad","85+ spm"],["Elev","+90m"],["Gap","−3:39"]].map(([l,v])=>(
                      <div key={l} style={{fontSize:10,fontFamily:F.b}}><span style={{color:C.mut}}>{l}: </span><span style={{color:C.pri,fontWeight:600}}>{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pace bar chart comparison */}
              {sLabel("Pace Per Km — SBI vs Namma Target")}
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={nammaPlan.map(d=>({km:`${d.km}`,sbi:d.sbiPace,target:d.targetPace}))} barGap={3} barSize={16}>
                  <XAxis dataKey="km" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`Km${v}`}/>
                  <YAxis domain={[5.0, 7.5]} hide/>
                  <Tooltip content={({active,payload,label})=>{
                    if(active&&payload?.length)return(
                      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 11px",fontSize:12,fontFamily:F.b}}>
                        <div style={{color:C.white,fontWeight:700,marginBottom:3}}>Km {label}</div>
                        {payload.map((p,i)=>{const m=Math.floor(p.value);const s=Math.round((p.value-m)*100);return(<div key={i} style={{color:p.fill}}>{p.name}: {m}:{s<10?"0"+s:s}/km</div>);})}
                      </div>
                    );return null;
                  }}/>
                  <Bar dataKey="sbi" name="SBI" radius={[3,3,0,0]} fill={accent+"88"}/>
                  <Bar dataKey="target" name="Target" radius={[3,3,0,0]}>
                    {nammaPlan.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:6}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:8,borderRadius:2,background:accent+"88"}}/><span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>SBI Actual</span></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:8,borderRadius:2,background:C.green}}/><span style={{fontSize:10,color:C.mut,fontFamily:F.b}}>Namma Target</span></div>
              </div>
            </div>

            {/* HR comparison */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("Heart Rate Per Km")}
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={sbiLaps.map(d=>({km:`${d.km}`,hr:d.hr}))} barSize={28}>
                  <XAxis dataKey="km" tick={{fill:C.mut,fontSize:10,fontFamily:F.b}} axisLine={false} tickLine={false} tickFormatter={v=>`Km${v}`}/>
                  <YAxis domain={[150,190]} hide/>
                  <Tooltip content={({active,payload,label})=>{
                    if(active&&payload?.length)return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white}}>Km {label}</div><div style={{color:"#F87171"}}>HR: {payload[0].value} bpm</div></div>);return null;
                  }}/>
                  <ReferenceLine y={177} stroke={C.red} strokeDasharray="4 3" strokeOpacity={0.6}/>
                  <Bar dataKey="hr" radius={[3,3,0,0]}>
                    {sbiLaps.map((d,i)=><Cell key={i} fill={d.hr>=182?C.namma:d.hr>=177?C.tcs:C.blue}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{marginTop:10,padding:"9px 12px",background:"#080B12",borderRadius:8}}>
                <div style={{fontSize:12,color:"#FED7AA",fontFamily:F.b,lineHeight:1.6}}>
                  ⚠️ <strong>Km 7 peaked at 187 bpm</strong> — your highest of the race, right on the second big climb. Classic "blowup" pattern caused by the km 4 surge (5:18). Power also collapsed to just 198W at km 8 — total tank empty.
                </div>
              </div>
            </div>

            {/* Time savings bar */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              {sLabel("Seconds Saved Per Km vs SBI")}
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={timeSavings} barSize={28}>
                  <XAxis dataKey="km" tick={{fill:C.mut,fontSize:9,fontFamily:F.b}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <ReferenceLine y={0} stroke={C.border} strokeWidth={1}/>
                  <Tooltip content={({active,payload,label})=>{
                    if(active&&payload?.length){const v=payload[0].value;return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontFamily:F.b}}><div style={{color:C.white}}>{label}</div><div style={{color:v>0?C.green:C.red}}>{v>0?"+":""}{v}s saved</div></div>);}return null;
                  }}/>
                  <Bar dataKey="saved" radius={[3,3,0,0]}>
                    {timeSavings.map((d,i)=><Cell key={i} fill={d.saved>0?C.green:C.red}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"8px 12px",background:"#080B12",borderRadius:8}}>
                <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>Total time saved</div>
                <div style={{fontSize:16,fontFamily:F.h,color:C.green,letterSpacing:"0.5px"}}>~3:39 faster = <strong>59:30</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 1: KM BLUEPRINT ── */}
        {tab===1&&(
          <div>
            {sLabel("Namma Km Blueprint — Learned from SBI")}
            {nammaPlan.map((km,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${km.color}33`,borderLeft:`3px solid ${km.color}`,borderRadius:10,padding:"13px 14px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:km.color+"22",border:`1px solid ${km.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:km.color,fontFamily:F.h,flexShrink:0}}>{km.km}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:C.pri,fontFamily:F.b}}>{km.zone}</div>
                      <div style={{fontSize:11,color:C.mut,fontFamily:F.b}}>SBI was {km.time||`${km.sbiPace.toFixed(2).replace(".",":")} /km`}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:20,fontFamily:F.h,color:km.color,letterSpacing:"0.5px"}}>{(()=>{const m=Math.floor(km.targetPace);const s=Math.round((km.targetPace-m)*100);return `${m}:${s<10?"0"+s:s}`;})()}/km</div>
                    <div style={{fontSize:10,color:C.mut,fontFamily:F.b}}>HR ~{km.targetHR}</div>
                  </div>
                </div>
                {km.issue&&(
                  <div style={{background:"#1A0B00",borderRadius:6,padding:"7px 10px",marginBottom:7,border:`1px solid ${C.tcs}22`}}>
                    <div style={{fontSize:11,color:"#FED7AA",fontFamily:F.b,lineHeight:1.5}}>❌ <strong>SBI mistake:</strong> {km.issue}</div>
                  </div>
                )}
                <div style={{background:"#060F08",borderRadius:6,padding:"7px 10px",border:`1px solid ${C.green}22`}}>
                  <div style={{fontSize:11,color:"#86EFAC",fontFamily:F.b,lineHeight:1.5}}>✅ <strong>Namma fix:</strong> {km.fix}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 2: SUB-60 PLAN ── */}
        {tab===2&&(
          <div>
            <div style={{background:"linear-gradient(135deg,#060F08,#080E0A)",border:`1px solid ${C.green}44`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("Sub-60 is already yours 🎯", C.green)}
              <div style={{fontSize:13,color:C.sec,lineHeight:1.7,fontFamily:F.b}}>
                You ran <strong style={{color:C.police}}>58:53 at the Police Run</strong> — you are already a sub-60 runner. The SBI Green run (63:09) was slower because of one key error: the km 4 surge. Fix that single habit and you go sub-60 at Namma comfortably.
              </div>
            </div>

            {/* Target time splits */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("The Sub-58:30 Split Plan")}
              {[
                ["Km 1",    "6:10","6:10","Flat start. Calm. HR under 158.",           C.green],
                ["Km 2",    "6:53","6:30","CLIMB — same as SBI km2 but 23 sec faster by not fighting it. Short stride, high cadence.", C.tcs],
                ["Km 3–5", "18:26","17:30","Three flat kms. Steady 5:50/km. NO surge. This is 56 sec of savings.", C.blue],
                ["Km 6",    "6:25","5:55","You have fresh legs unlike SBI. Push here.", C.blue],
                ["Km 7",    "7:05","6:35","CLIMB BACK — but with fuel in tank. Target 6:30. Not 7:05.", C.namma],
                ["Km 8",    "6:41","6:10","Downhill. Gravity. Let it roll.",            C.yellow],
                ["Km 9",    "5:46","5:40","Final push. You'll have more gas than SBI.", C.green],
                ["Km 10",   "5:31","5:10","Sprint. Empty everything.",                  C.namma],
              ].map(([km,sbi,target,tip,col],i,arr)=>(
                <div key={km} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}>
                  <div style={{width:44,fontSize:13,fontWeight:700,color:col,fontFamily:F.h,letterSpacing:"0.5px",flexShrink:0,paddingTop:1}}>{km}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:12,alignItems:"baseline",marginBottom:4}}>
                      <span style={{fontSize:12,color:C.mut,fontFamily:F.b,textDecoration:"line-through"}}>{sbi}</span>
                      <span style={{fontSize:16,fontWeight:700,color:col,fontFamily:F.h,letterSpacing:"0.5px"}}>→ {target}</span>
                    </div>
                    <div style={{fontSize:12,color:C.sec,lineHeight:1.5,fontFamily:F.b}}>{tip}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,padding:"10px 12px",background:"linear-gradient(135deg,#060F08,#080E0A)",borderRadius:8,border:`1px solid ${C.green}33`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:C.sec,fontFamily:F.b}}>Projected Finish</span>
                <span style={{fontSize:24,fontFamily:F.h,color:C.green,letterSpacing:"1px"}}>58:30 ✓</span>
              </div>
            </div>

            {/* The single rule */}
            <div style={{background:"linear-gradient(135deg,#1A0800,#0D0500)",border:`1px solid ${C.namma}44`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("⚡ The One Rule That Unlocks Sub-60", C.namma)}
              <div style={{fontSize:18,fontWeight:700,color:C.white,fontFamily:F.b,lineHeight:1.4,marginBottom:10}}>
                "At km 4, <span style={{color:C.namma}}>DO NOT run faster than 5:50/km</span> — no matter how good you feel."
              </div>
              <div style={{fontSize:13,color:C.sec,fontFamily:F.b,lineHeight:1.7}}>
                At SBI you ran km 4 in <strong style={{color:C.red}}>5:18</strong> — a full 90+ seconds faster than sustainable. The second climb (km 7) then cost you <strong style={{color:C.red}}>7:05</strong> — 2 full minutes slower than km 4. You net-lost 30 seconds by "going fast" on the flat. At Namma, km 5–7 is the same temptation. Resist it.
              </div>
            </div>

            {/* Race day checklist */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              {sLabel("Namma Race Day Checklist")}
              {[
                [C.blue,  "Start of race","Seed in 58–60 min group. Let the fast pack go."],
                [C.tcs,   "Km 1–2 climb","Shorten stride. Cadence 86+. HR 168–172 max."],
                [C.red,   "Km 3–6 flat",  "HOLD 5:50. Repeat 'hold hold hold' on km 4."],
                [C.namma, "Km 7–8 climb", "You have saved legs. 6:30–6:40. Cadence 88+."],
                [C.green, "Km 9–10",      "Now is the time. Empty everything. Sub-5:30 finish sprint."],
              ].map(([col,phase,tip],i,arr)=>(
                <div key={phase} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{width:4,background:col,borderRadius:2,flexShrink:0,opacity:0.8}}/>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.pri,fontFamily:F.b}}>{phase}</div>
                    <div style={{fontSize:12,color:C.sec,marginTop:2,lineHeight:1.5,fontFamily:F.b}}>{tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: KEY MISTAKES ── */}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
              {sLabel("The 3 Mistakes That Cost 3+ Minutes at SBI")}
              {[
                {rank:"#1",title:"Km 4 Surge (5:18)",severity:1.0,color:C.namma,
                 what:"Ran km 4 in 5:18 — 56 seconds faster than your race pace. It felt great. It wasn't.",
                 why:"You'd just come off the first climb (km2–3). Legs felt light on the flat. Classic over-confidence.",
                 cost:"Cost you the entire km 7 climb. That one km was 7:05 — the single slowest km of your race.",
                 fix:"At Namma: glance at watch at km 3.5. If you're under 5:45/km, SLOW DOWN deliberately."},
                {rank:"#2",title:"Km 7 Blowup (7:05, HR 187)",severity:0.85,color:C.red,
                 what:"Your slowest km AND your highest HR of the race — at the same time. Power: 217W, your second-lowest.",
                 why:"Tank was empty from the km 4 surge. Body had nothing left for the second major climb.",
                 cost:"7:05 vs a manageable 6:35 = 30 seconds lost on just this km.",
                 fix:"At Namma: second climb is km 7–8.5. If you've held pace correctly, this should feel like a grind, not a collapse."},
                {rank:"#3",title:"Power Collapse km 8 (198W)",severity:0.65,color:C.yellow,
                 what:"After the km 7 blowup, your power dropped to 198W — lowest of the entire race.",
                 why:"Glycogen-depleted effort. The body physically couldn't sustain output.",
                 cost:"Km 8 was 6:41 when you should've been recovering and building towards the finish.",
                 fix:"At Namma: if you feel this coming (sudden HR drop + legs locking), back off 10 sec/km and eat the loss. Don't panic and surge."},
              ].map((m,i,arr)=>(
                <div key={i} style={{marginBottom:i<arr.length-1?16:0,paddingBottom:i<arr.length-1?16:0,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{background:m.color+"22",border:`1px solid ${m.color}55`,borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:m.color,fontFamily:F.h,letterSpacing:"0.5px"}}>{m.rank}</div>
                    <div style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:F.b}}>{m.title}</div>
                  </div>
                  <IntBar val={m.severity} color={m.color} h={3}/>
                  <div style={{marginTop:10,display:"grid",gap:7}}>
                    {[["🔍 What happened",m.what],["❓ Why it happened",m.why],["💸 What it cost",m.cost],["✅ Namma fix",m.fix]].map(([l,t])=>(
                      <div key={l} style={{display:"flex",gap:8,fontSize:12,fontFamily:F.b}}>
                        <span style={{color:C.mut,flexShrink:0,width:130}}>{l}</span>
                        <span style={{color:C.sec,lineHeight:1.5,flex:1}}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Cadence note */}
            <div style={{background:"#0A0D1A",border:`1px solid ${C.blue}33`,borderRadius:12,padding:16}}>
              {sLabel("📊 Cadence Pattern", C.blue)}
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10}}>
                {sbiLaps.filter((_,i)=>[1,3,6,8,9].includes(i)).map((l)=>(
                  <div key={l.km} style={{background:"#080B12",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                    <div style={{fontSize:12,fontFamily:F.h,color:l.cad>=85?C.green:C.yellow,letterSpacing:"0.5px"}}>{l.cad}</div>
                    <div style={{fontSize:9,color:C.mut,fontFamily:F.b}}>Km {l.km}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:12,color:C.sec,fontFamily:F.b,lineHeight:1.6}}>
                Cadence averaged 83.9 spm across SBI — just below the optimal 85+ threshold. On the climbs (km 2, 7) it dropped to 83. At Namma: target <strong style={{color:C.white}}>86+ on the flat, 88+ on the climbs</strong>. Higher cadence = lower impact per step = less fatigue.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const RACES=[
  {id:0,name:"Karnataka State\nPolice Run",short:"Police Run",sub:"Mar 1 · Bengaluru",target:"58:53",pace:"5:53/km",badge:"Race 1 ✓",accent:C.police,bgGrad:"linear-gradient(160deg,#060F0A 0%,#0A1A0A 50%,#061205 100%)",glow1:"rgba(110,231,183,0.10)",glow2:"rgba(96,165,250,0.06)",status:"COMPLETED",statusBg:"#0D2010",stats:[["🏁","Finish","58:53"],["❤️","Avg HR","180 bpm"],["⚡","Power","228W"],["👟","Cadence","85 spm"]]},
  {id:1,name:"Namma Power Run",short:"Namma Power",sub:"Mar 15 · NICE Road",target:"57:30",pace:"5:45/km",badge:"Race 2",accent:C.namma,bgGrad:"linear-gradient(160deg,#0A0F1A 0%,#0D1A0D 40%,#1A0500 100%)",glow1:"rgba(255,61,61,0.10)",glow2:"rgba(76,155,232,0.06)",status:"UPCOMING",statusBg:"#1A0D00",stats:[["🎯","Target","57:30"],["⬆️","Elev","~90m"],["📐","Grade","13%"],["🔄","Climbs","2"]]},
  {id:2,name:"TCS Open 10K",short:"TCS Open",sub:"Apr 26 · Cubbon Road",target:"54:50",pace:"5:29/km",badge:"Race 3",accent:C.tcs,bgGrad:"linear-gradient(160deg,#0A0F1A 0%,#0D1A10 40%,#1A0D05 100%)",glow1:"rgba(249,115,22,0.10)",glow2:"rgba(96,165,250,0.08)",status:"UPCOMING",statusBg:"#1A0800",stats:[["🎯","Target","54:50"],["⬆️","Elev","~50m"],["📐","Grade","7.5%"],["🔄","U-Turns","3"]]},
];

export default function RacePlanner(){
  const [race,setRace]=useState(0);
  const r=RACES[race];
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.pri,fontFamily:F.b,maxWidth:780,margin:"0 auto",paddingBottom:40}}>
      {/* Latest Activity */}
      <LatestRunCard/>
      {/* Weather + Coach */}
      <WeatherCoachCard/>
      {/* Switcher */}
      <div style={{background:"#09090F",borderBottom:`1px solid ${C.border}`,padding:"14px 16px 0"}}>
        <div style={{fontSize:10,color:"#283040",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10,fontWeight:700,fontFamily:F.b}}>Sachin K G · Strava #99703920 · 2026 Race Season</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {RACES.map((rc)=>(
            <button key={rc.id} onClick={()=>setRace(rc.id)} style={{padding:"10px 10px 0",background:race===rc.id?"#0D1117":"transparent",border:`1px solid ${race===rc.id?rc.accent+"55":C.border}`,borderBottom:`2px solid ${race===rc.id?rc.accent:"transparent"}`,borderRadius:"8px 8px 0 0",cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
              <div style={{fontSize:9,color:race===rc.id?rc.accent:"#283040",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,fontFamily:F.b,marginBottom:2}}>{rc.badge}</div>
              <div style={{fontSize:13,fontWeight:700,fontFamily:F.h,letterSpacing:"0.8px",color:race===rc.id?C.white:C.mut,lineHeight:1.2,marginBottom:4}}>{rc.short.toUpperCase()}</div>
              <div style={{fontSize:10,color:race===rc.id?C.mut:"#283040",fontFamily:F.b,marginBottom:8}}>{rc.sub}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Hero */}
      <div style={{background:r.bgGrad,padding:"22px 18px 18px",borderBottom:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle at 85% 15%,${r.glow1} 0%,transparent 50%),radial-gradient(circle at 15% 85%,${r.glow2} 0%,transparent 50%)`}}/>
        <div style={{position:"relative"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:11,color:r.accent,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,fontWeight:600,fontFamily:F.b}}>{r.sub}</div>
              <h1 style={{margin:0,fontSize:30,fontFamily:F.h,letterSpacing:"1px",lineHeight:1.1,color:C.white,whiteSpace:"pre-line"}}>{r.name.toUpperCase()}</h1>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:6}}>
                <div style={{background:r.statusBg,border:`1px solid ${r.accent}44`,borderRadius:20,padding:"2px 10px",fontSize:10,color:r.accent,fontWeight:700,fontFamily:F.b}}>{r.status}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,fontFamily:F.b}}>{race===0?"Official Time":"Target"}</div>
              <div style={{fontSize:42,fontFamily:F.h,color:r.accent,lineHeight:1,letterSpacing:"1px"}}>{r.target}</div>
              <div style={{fontSize:12,color:C.sec,fontFamily:F.b}}>{r.pace}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${r.stats.length},1fr)`,gap:8,marginTop:16}}>
            {r.stats.map(([icon,lbl,val])=>(
              <div key={lbl} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 6px",textAlign:"center"}}>
                <div style={{fontSize:16,marginBottom:3}}>{icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:F.h,letterSpacing:"0.5px"}}>{val}</div>
                <div style={{fontSize:10,color:C.mut,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:F.b}}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      {race===0&&<PoliceRun/>}
      {race===1&&<NammaRun/>}
      {race===2&&<TCSRun/>}
      <div style={{textAlign:"center",fontSize:10,color:"#1A1F2E",paddingTop:12,fontFamily:F.b}}>Powered by Strava · Sachin K G · 2026</div>
    </div>
  );
}