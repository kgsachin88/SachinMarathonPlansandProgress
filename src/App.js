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
  {date:"Fri Mar 6", emoji:"🛌",label:"Full Rest",       light:C.sec,  isRace:false,isKey:false,desc:"Walk, stretch, foam roll."},
  {date:"Sat Mar 7", emoji:"🏃",label:"Easy Long Run",   light:C.blue, isRace:false,isKey:false,desc:"10–12 km @ 7:30–8:00/km · HR < 155 · Find a mild hill."},
  {date:"Sun Mar 8", emoji:"🛌",label:"Full Rest",       light:C.sec,  isRace:false,isKey:false,desc:"Full off day. Hydrate aggressively. Sleep 8+ hrs."},
  {date:"Mon Mar 9", emoji:"🏃",label:"Easy Run",        light:C.green,isRace:false,isKey:false,desc:"6 km @ 7:45/km. Loose, relaxed."},
  {date:"Tue Mar 10",emoji:"⚡",label:"Hill Intervals 🔑",light:C.tcs,  isRace:false,isKey:true, desc:"6 km total: 4× run up a 400–600m incline, jog down."},
  {date:"Wed Mar 11",emoji:"🏃",label:"Recovery Run",    light:C.green,isRace:false,isKey:false,desc:"5 km @ 8:00/km or rest if legs heavy."},
  {date:"Thu Mar 12",emoji:"💨",label:"Shakeout + Strides",light:C.purple,isRace:false,isKey:false,desc:"4 km easy + 4×80m strides at race effort."},
  {date:"Fri Mar 13",emoji:"🛌",label:"Full Rest",       light:C.sec,  isRace:false,isKey:false,desc:"Nothing. Carb load: rice + dal + curd. Sleep by 10pm."},
  {date:"Sat Mar 14",emoji:"🎽",label:"Shakeout + BIB",  light:C.blue, isRace:false,isKey:false,desc:"20 min easy + 2 strides. Collect BIB at Swaasthya Fitness, Whitefield."},
  {date:"Sun Mar 15",emoji:"🏅",label:"RACE DAY",        light:C.namma,isRace:true, isKey:false,desc:"Namma Power Run 2026 · Target: 57:30–58:30 · NICE Road, Hoskerehalli"},
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

const NAMMA_TABS=["Race Plan","Route & Elev","Training Week","Race Morning"];
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
        {tab===1&&(
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
        {tab===2&&(
          <div>
            {sLabel("9-Day Countdown to Race Day")}
            {nammaTraining.map((day,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8,padding:"12px 14px",background:day.isRace?"linear-gradient(135deg,#1A0000,#2A0000)":C.card,border:`1px solid ${day.isRace?accent+"55":day.isKey?"#F9731633":C.border}`,borderRadius:10,borderLeft:`3px solid ${day.light}`}}>
                <div style={{fontSize:22,lineHeight:1,paddingTop:2}}>{day.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <span style={{fontSize:15,fontWeight:700,color:day.light,textTransform:"uppercase",fontFamily:F.h,letterSpacing:"0.5px"}}>{day.label}</span>
                    <span style={{fontSize:12,color:C.mut,fontFamily:F.b}}>{day.date}</span>
                  </div>
                  <div style={{fontSize:12,color:C.sec,marginTop:5,lineHeight:1.6,fontFamily:F.b}}>{day.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab===3&&(
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