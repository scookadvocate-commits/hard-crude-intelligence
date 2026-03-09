import { useState } from "react";

const PRICES = {
  brent:     { price:92.86, change:26.82, high:97.20, low:73.23 },
  wti:       { price:90.90, change:35.63, high:94.50, low:67.02 },
  wcs:       { price:73.40, change:24.11, high:76.80, low:59.10 },
  opec:      { price:93.80, change:26.41, high:98.10, low:74.20 },
  dubai:     { price:90.10, change:25.87, high:94.30, low:71.80 },
  urals:     { price:72.30, change:12.40, high:75.10, low:64.30 },
  bonny:     { price:95.40, change:27.10, high:99.60, low:75.10 },
  maya:      { price:78.60, change:22.44, high:82.10, low:64.20 },
  arab_light:{ price:93.20, change:26.55, high:97.50, low:73.60 },
};

const GRADES = [
  { id:"brent",      name:"Brent Crude",           region:"North Sea",       flag:"🌊", api:38.3 },
  { id:"wti",        name:"WTI Crude",              region:"USA",             flag:"🇺🇸", api:39.6 },
  { id:"wcs",        name:"Western Canadian Select",region:"Canada / Alberta",flag:"🇨🇦", api:20.5 },
  { id:"opec",       name:"OPEC Basket",            region:"Multi-Nation",    flag:"🛢️", api:36.1 },
  { id:"dubai",      name:"Dubai/Oman",             region:"Middle East",     flag:"🇦🇪", api:31.0 },
  { id:"urals",      name:"Urals Blend",            region:"Russia",          flag:"🇷🇺", api:31.7 },
  { id:"bonny",      name:"Bonny Light",            region:"Nigeria",         flag:"🇳🇬", api:33.9 },
  { id:"maya",       name:"Maya Crude",             region:"Mexico",          flag:"🇲🇽", api:22.0 },
  { id:"arab_light", name:"Arab Light",             region:"Saudi Arabia",    flag:"🇸🇦", api:32.8 },
];

const HISTORY = [
  {y:1970,p:1.8},{y:1973,p:3.0},{y:1974,p:11.6},{y:1979,p:31.6},{y:1980,p:36.8},
  {y:1983,p:29.5},{y:1986,p:14.4},{y:1990,p:23.7},{y:1998,p:12.7},{y:2000,p:28.5},
  {y:2004,p:38.3},{y:2008,p:97.3},{y:2009,p:61.7},{y:2011,p:111.0},{y:2014,p:98.9},
  {y:2016,p:43.6},{y:2020,p:41.8},{y:2022,p:99.1},{y:2024,p:72.0},{y:2026,p:92.9},
];

const CHART_EVENTS = [
  {y:1973,l:"Embargo"},{y:1979,l:"Iran Rev."},{y:1986,l:"Glut"},
  {y:1990,l:"Gulf War"},{y:1998,l:"Asia"},{y:2008,l:"$147"},
  {y:2016,l:"OPEC+"},{y:2020,l:"COVID"},{y:2022,l:"Ukraine"},
];

const TIMELINE = [
  { year:"1973", price:"$3→$12",  label:"Arab Embargo",    cat:"geopolitical", detail:"OAPEC nations embargoed the US and Netherlands following the Yom Kippur War. Oil quadrupled overnight. The IEA was founded in direct response. Energy security entered the geopolitical lexicon permanently." },
  { year:"1979", price:"$13→$35", label:"Iranian Revolution", cat:"geopolitical", detail:"The fall of the Shah removed 5.7 million bpd from global markets. Prices surged to $35/bbl nominal — over $120 in 2024 dollars. The Carter Doctrine committed US military force to defend Gulf oil." },
  { year:"1986", price:"$27→$10", label:"Saudi Price War",  cat:"opec", detail:"Tired of cutting while other OPEC members cheated, Saudi Arabia flooded the market. Prices crashed to $10/bbl. The collapse halved Soviet hard currency earnings, accelerating the fiscal crisis that ended the USSR." },
  { year:"1990", price:"$17→$40", label:"Gulf War",         cat:"geopolitical", detail:"Iraq's invasion of Kuwait removed 4.3 million bpd. Prices spiked to $40/bbl but the swift Desert Storm response demonstrated that coordinated political action can cap geopolitical price spikes." },
  { year:"1998", price:"$20→$10", label:"Asian Crisis",     cat:"economic", detail:"The 1997 Asian currency crisis collapsed demand just as OPEC raised output. Brent fell below $10/bbl — the lowest in inflation-adjusted terms since the 1970s. It forced historic cartel coordination." },
  { year:"2008", price:"$62→$147",label:"All-Time Peak",    cat:"economic", detail:"A perfect storm of Chinese demand, a weak dollar, and speculation drove Brent to $147.50/bbl in July 2008 — a record that still stands. Six months later the Financial Crisis crashed prices 75% to $35." },
  { year:"2016", price:"$27",     label:"OPEC+ Born",       cat:"opec", detail:"Brent touched $27/bbl as US shale flooded the market. The crisis forced Saudi Arabia and Russia together. 23 nations signed the Declaration of Cooperation — creating OPEC+ and doubling prices within a year." },
  { year:"2020", price:"-$37",    label:"Negative Oil",     cat:"economic", detail:"COVID lockdowns destroyed 30% of global demand. On April 20 2020, WTI futures traded at -$37.63/bbl — the only time in history a major commodity went negative. Cushing, Oklahoma was physically full." },
  { year:"2022", price:"$80→$130",label:"Ukraine War",      cat:"geopolitical", detail:"Russia's invasion triggered the worst energy crisis since 1973. Brent surged to $130/bbl as Europe scrambled to replace Russian crude and gas. Western sanctions created a permanent two-tier oil market." },
];

const NEWS = {
  geopolitical:[
    { headline:"DAY 7: Trump Signals Willingness to Talk — Iran's Leadership Council Responds", summary:"Trump said Iran's new three-person leadership council has indicated they want to talk and he has agreed to preliminary diplomatic contact. Iranian Foreign Minister Araghchi told Reuters Tehran is open to discussions but will not negotiate under bombs. US-Iran talks scheduled through Omani intermediaries next week.", source:"Reuters / CNBC", time:"LIVE", region:"Washington / Tehran" },
    { headline:"Strait of Hormuz: Diplomacy Opens But 150+ Tankers Still Anchored", summary:"Despite diplomatic signals, Kpler confirmed the Strait of Hormuz remains effectively closed. Over 150 tankers are anchored in open Gulf waters. The IRGC has not rescinded its warning. Maersk, CMA CGM, and Hapag-Lloyd confirmed continued Hormuz suspension.", source:"Kpler / Reuters", time:"2h ago", region:"Strait of Hormuz" },
    { headline:"Israel-Iran Ceasefire Talks Begin in Cyprus", summary:"Israeli and Iranian intermediaries are meeting in Cyprus for preliminary ceasefire discussions. Israel may pause strikes on civilian infrastructure as a gesture of good faith. The talks are being facilitated by the EU's foreign policy chief. Combat operations continued Saturday with Israeli strikes on IRGC weapons depots outside Ahvaz.", source:"Reuters / Times of Israel", time:"3h ago", region:"Cyprus / Middle East" },
    { headline:"South Korea and Japan Draw Down Strategic Reserves", summary:"South Korea authorised withdrawal from strategic petroleum reserves at 500,000 bpd — the first emergency drawdown since COVID. Japan announced a similar 300,000 bpd release. Both nations warned their 90-day reserves will be significantly tested if Hormuz remains closed beyond two weeks.", source:"Reuters / Bloomberg", time:"4h ago", region:"South Korea / Japan" },
    { headline:"Hezbollah Remains on Sidelines — Arab World Splits", summary:"Hezbollah has not entered the conflict after seven days. Arab governments issued official condemnations while dealing with popular street demonstrations in support of Iran. Jordan intercepted 49 Iranian drones in transit. Saudi Arabia has maintained official silence.", source:"Al Jazeera / Reuters", time:"6h ago", region:"Lebanon / Arab World" },
  ],
  opec:[
    { headline:"WTI Posts Biggest Weekly Gain in Futures History — +35.63%", summary:"WTI posted a weekly gain of 35.63% — the largest in the history of the futures contract dating back to 1983. Brent rose 26.82% for the week. As of Saturday Brent trades at $92.86/bbl and WTI at $90.90, having pulled back from intraday highs near $97 on Friday as diplomatic signals emerged.", source:"CNBC / Reuters", time:"LIVE", region:"Global Markets" },
    { headline:"OPEC+ Emergency Call Monday — Barrels Still Can't Reach Market", summary:"OPEC+ Secretary-General confirmed an emergency ministerial call for Monday. Analysts noted the fundamental constraint: Saudi and UAE spare capacity depends on Hormuz access. The East-West pipeline handles roughly 1–1.5 million bpd — less than 10% of normal Gulf export volume.", source:"OPEC+ / TradingNews", time:"2h ago", region:"Vienna / OPEC+" },
    { headline:"Saudi Yanbu Terminal at Maximum — A Fraction of Normal Exports", summary:"Saudi Aramco confirmed Yanbu Red Sea terminal is running at maximum capacity of approximately 1.5 million bpd. Saudi Arabia normally exports 6–7 million bpd. The remaining 80% has no viable route to market while Hormuz remains closed.", source:"Bloomberg / Aramco", time:"3h ago", region:"Saudi Arabia" },
    { headline:"Three Scenarios: $80–85 De-escalation, $90–95 Prolonged, $120+ Escalation", summary:"Analysts maintain three scenarios. Base case (40%): Diplomatic breakthrough within 1–2 weeks, Brent $88–95. Optimistic (35%): Rapid de-escalation, Brent $80–85. Worst case (25%): Escalation to Saudi/UAE infrastructure, Brent $120+. JPMorgan revised worst-case to $150 if Gulf production infrastructure is directly attacked.", source:"UBS / JPMorgan / Goldman", time:"5h ago", region:"Global" },
    { headline:"Cape of Good Hope Rerouting Now in Full Effect — Freight Rates Hit Records", summary:"VLCC benchmark freight rates hit an all-time record of $423,736 per day — up 94% from pre-conflict levels. The Cape route adds 10–15 days to Asian deliveries. The first physical supply shortages will hit Asian refiners approximately two weeks from now.", source:"Reuters / CNBC / LSEG", time:"6h ago", region:"Global Shipping" },
  ],
  economic:[
    { headline:"Brent Pulls Back From $97 Peak on Diplomatic Signals", summary:"Brent pulled back from an intraday high near $97 to settle around $92.86 as diplomatic signals introduced two-way volatility. Goldman Sachs maintained its $100 Brent call for a two-week Hormuz restriction scenario while noting de-escalation points toward $80–85 within 72 hours of a ceasefire.", source:"Goldman Sachs / Reuters", time:"1h ago", region:"Global Markets" },
    { headline:"US Pump Prices Approach $4.50/Gallon", summary:"US retail gasoline hit $4.34/gallon nationally on Friday — up from $3.14 before the conflict. The White House 30-million-barrel SPR release is moderating but not stopping the surge. GasBuddy warned prices could reach $4.80–5.00 if diplomatic talks fail.", source:"GasBuddy / White House", time:"2h ago", region:"United States" },
    { headline:"Canada and US Shale Identified as Primary Alternative Supply", summary:"With Gulf barrels trapped, Canada and US shale have emerged as the primary alternative. WCS discount to WTI has narrowed to approximately $14/bbl — the tightest since Trans Mountain opened. Trans Mountain bookings are fully committed months forward.", source:"Globe and Mail / Bloomberg", time:"5h ago", region:"Canada / Alberta / USA" },
    { headline:"IEA Coordinates 120-Million-Barrel Emergency Release — Largest in History", summary:"The IEA announced an emergency strategic reserve release of up to 120 million barrels — the largest in its 51-year history. The previous record was the 60-million-barrel release during the 2022 Ukraine crisis. The agency warned that if Hormuz remains closed beyond 30 days, reserves would be insufficient.", source:"IEA", time:"6h ago", region:"Global / IEA" },
    { headline:"European Gas Prices Pull Back From 30% Spike", summary:"European natural gas futures retreated from their 30% spike as Europe's rebuilt storage provided a buffer. QatarEnergy engineers estimate 2–4 weeks for repairs to Ras Laffan and Mesaieed LNG facilities damaged in Iranian drone attacks.", source:"Reuters / Bloomberg", time:"4h ago", region:"Europe / Qatar" },
  ],
  climate:[
    { headline:"IEA: Hormuz Crisis Is Largest Supply Disruption in History", summary:"The IEA confirmed the current Hormuz disruption represents the largest potential supply shock in recorded oil market history. The 1973 Arab Embargo removed 4–5 million bpd. A full Hormuz closure removes 20 million bpd — nearly four times any previous shock.", source:"IEA", time:"2h ago", region:"Global" },
    { headline:"Canada's Strategic Moment: Trans Mountain Fully Booked", summary:"Trans Mountain pipeline bookings at 100% capacity with a months-long waiting list. Alberta oil sands operators are running at or near maximum sustainable output of approximately 3.4 million bpd. WCS is trading at its narrowest discount to WTI since Trans Mountain opened.", source:"Globe and Mail / Bloomberg", time:"3h ago", region:"Canada / Alberta" },
    { headline:"Energy Crisis Accelerates Nuclear and Renewables", summary:"South Korea fast-tracked four nuclear reactor approvals. Germany reversed its nuclear exit policy. Offshore wind permitting in the UK streamlined via emergency powers. The IEA called it the most consequential single-week acceleration of energy transition investment in history.", source:"Bloomberg / IEA", time:"5h ago", region:"Global" },
    { headline:"Qatar LNG Assessing Restart — Europe's Gas Buffer Being Tested", summary:"QatarEnergy engineers estimate a 2–4 week restart timeline for Ras Laffan and Mesaieed if no further attacks occur. European natural gas prices spiked 30% before retreating. The EU has coordinated emergency LNG purchases from US Gulf Coast terminals at record spot premiums.", source:"Reuters / FT", time:"6h ago", region:"Qatar / Europe" },
    { headline:"Civilian Casualty Reports Deepen International Pressure", summary:"Ongoing reporting of civilian casualties in Iran continues to generate significant international pressure. The UN Human Rights Council voted to convene an emergency session. France and Germany issued joint statements calling for an immediate humanitarian ceasefire.", source:"NPR / Al Jazeera", time:"7h ago", region:"Iran / International" },
  ],
  demand:[
    { headline:"Gulf Aviation Beginning to Recover — Emirates Plans Partial Restart", summary:"Emirates and Etihad announced preparation to resume limited international operations as Gulf airspace improves. Initial flights will avoid Iranian airspace using longer routes over Saudi Arabia. Qatar Airways has not yet announced a restart timeline.", source:"IATA / Reuters", time:"1h ago", region:"Gulf / Aviation" },
    { headline:"China's State Tankers Testing Hormuz", summary:"Two Chinese state-owned COSCO tankers attempted to transit the Strait of Hormuz on Friday with AIS transponders switched off. It is unclear whether either vessel successfully passed. Beijing is weighing the risk of unilateral transit against its need for 1.8 million bpd of Iranian crude.", source:"MarineTraffic / Reuters", time:"3h ago", region:"China / Hormuz" },
    { headline:"India's Jamnagar Has Three Weeks of Inventory", summary:"Reliance Industries confirmed its Jamnagar refinery has approximately three weeks of crude inventory. Emergency supply deals with US, Canadian, Brazilian, and Norwegian exporters are being finalised. India activated emergency fuel price controls and strategic reserve drawdown of 500,000 bpd.", source:"Bloomberg / Reuters", time:"4h ago", region:"India" },
    { headline:"US Gasoline at $4.34 — Demand Destruction Emerging", summary:"Early data suggests demand destruction is beginning: GasBuddy reported fuel purchase frequency dropped 8% week-over-week in $4.50+ price zones. AAA said the number of Americans cutting back on driving has risen sharply.", source:"GasBuddy / AAA", time:"5h ago", region:"United States" },
    { headline:"South Korea Declares 9-Day LNG Warning — $68B Fund Activated", summary:"South Korea confirmed it could exhaust LNG supplies within nine days if Hormuz remains closed and Qatar stays offline. President Lee activated a 100 trillion won ($68.3 billion) energy stabilisation fund — the largest emergency energy intervention in Korean history.", source:"Reuters / Bloomberg", time:"6h ago", region:"South Korea" },
  ],
};

const HIST = {
  geopolitical:[
    {y:"1973",t:"Arab Oil Embargo",d:"OAPEC cuts supply to punish US support for Israel. Oil quadruples. The IEA is founded in direct response."},
    {y:"1979–80",t:"Iranian Revolution & Iran-Iraq War",d:"Shah's fall removes 5.7m bpd. The Carter Doctrine commits US military force to Gulf oil defence for 40+ years."},
    {y:"1990",t:"Gulf War",d:"Iraq invades Kuwait, removes 4.3m bpd. Swift coalition response shows coordinated action can cap geopolitical price spikes."},
    {y:"2022",t:"Russia-Ukraine War",d:"Largest energy shock since 1973. Europe replaces Russian gas with LNG. Sanctions create a permanently bifurcated global oil market."},
    {y:"2026",t:"US-Israel Strike on Iran",d:"Joint strikes kill Khamenei and close the Strait of Hormuz — the largest supply disruption in history at 20 million bpd."},
  ],
  opec:[
    {y:"1960",t:"OPEC Founded",d:"Venezuela and Arab nations create OPEC to counter Western oil companies who unilaterally set prices."},
    {y:"1973",t:"First Oil Weapon",d:"OPEC weaponises oil geopolitically — transferring ~$70 billion annually from consumers to producers."},
    {y:"1986",t:"Saudi Price War",d:"Saudi Arabia floods the market. The cartel's chronic discipline problem — still present today with Iraq and UAE overproduction — is exposed."},
    {y:"2016",t:"OPEC+ Alliance Created",d:"Shale-driven price collapse forces Saudi Arabia and Russia together. 23 nations sign the Declaration of Cooperation."},
    {y:"2020",t:"9.7 Million bpd Historic Cut",d:"COVID forces the largest coordinated production cut in history. Saudi Arabia and Russia set aside their March 2020 price war within weeks."},
  ],
  economic:[
    {y:"1973–74",t:"Stagflation Invented",d:"The oil shock drives double-digit inflation during recession — stagflation — ending the postwar Keynesian economic consensus."},
    {y:"1986",t:"Soviet Fiscal Crisis",d:"The Saudi price crash halves Soviet hard currency earnings — the beginning of the fiscal crisis that ended the USSR in 1991."},
    {y:"2008",t:"$147 Peak and 75% Crash",d:"Oil's parabolic rise contributed to the consumer squeeze that deepened the financial crisis. Six-month range: $147 to $35."},
    {y:"2020",t:"Negative Oil: -$37.63",d:"WTI May futures trade negative for the only time in history as Cushing storage fills physically."},
    {y:"2026",t:"Record Weekly Gain",d:"WTI posts +35.63% — the largest weekly gain in futures history dating to 1983 — as Hormuz closes."},
  ],
  climate:[
    {y:"1997",t:"Kyoto Protocol",d:"First binding international climate agreement. Begins the regulatory trajectory driving ESG investing and energy transition capital."},
    {y:"2015",t:"Paris Agreement",d:"196 nations commit to 1.5–2°C warming limit. IEA calculates no new oil fields should be approved after 2021 to meet this target."},
    {y:"2021",t:"IEA Net Zero Report",d:"The world's energy watchdog declares peak oil demand achievable by 2030 — a seismic shift for an institution that once tracked only fossil fuels."},
    {y:"2023",t:"EV Price Parity in China",d:"EVs reach price parity with combustion cars in China. Oil demand displacement becomes statistically measurable for the first time."},
    {y:"2026",t:"Crisis Accelerates Transition",d:"The Hormuz crisis accomplishes what years of climate policy could not: making energy diversification an immediate survival imperative."},
  ],
  demand:[
    {y:"1950s",t:"The Postwar Automobile Age",d:"US interstate highways and cheap gasoline create car-dependent civilisation. Those decisions still lock in oil demand today."},
    {y:"1993",t:"China Becomes Oil Importer",d:"China shifts from exporter to net importer. Over 30 years it adds 10 million bpd — the greatest demand growth story in oil history."},
    {y:"2000s",t:"Aviation Democratised",d:"Low-cost carriers make air travel a mass market. Jet fuel is now 7% of global oil consumption and the hardest sector to decarbonise."},
    {y:"2020s",t:"India's Turn",d:"With 1.4 billion people and rapid motorisation, India is expected to add 4 million bpd by 2040 — the defining demand variable of the next decade."},
    {y:"2026",t:"Demand Destruction Begins",d:"US gasoline at $4.34/gallon triggers measurable demand destruction — fuel purchase frequency down 8% in high-price zones."},
  ],
};

const CATS = [
  {id:"geopolitical", label:"Geopolitical",    icon:"⚔️",  color:"#dc2626"},
  {id:"opec",         label:"OPEC & Supply",   icon:"🛢️", color:"#ea580c"},
  {id:"economic",     label:"Economic",         icon:"📈",  color:"#0369a1"},
  {id:"climate",      label:"Climate & Policy", icon:"🌿",  color:"#16a34a"},
  {id:"demand",       label:"Demand Trends",    icon:"🏭",  color:"#7c3aed"},
];

function Ticker() {
  const all = [...GRADES, ...GRADES, ...GRADES];
  return (
    <div style={{background:"#0f172a",display:"flex",alignItems:"center",overflow:"hidden"}}>
      <div style={{background:"#dc2626",color:"#fff",padding:"7px 14px",fontSize:9,fontWeight:800,letterSpacing:"0.15em",whiteSpace:"nowrap",flexShrink:0,fontFamily:"monospace"}}>● LIVE</div>
      <div style={{overflow:"hidden",flex:1}}>
        <div style={{display:"flex",animation:"ticker 55s linear infinite",whiteSpace:"nowrap"}}>
          {all.map((g,i) => {
            const d = PRICES[g.id];
            return (
              <span key={i} style={{display:"inline-flex",alignItems:"center",padding:"7px 18px",borderRight:"1px solid #1e293b"}}>
                <span style={{color:"#94a3b8",fontSize:9,marginRight:7,fontFamily:"monospace"}}>{g.name.toUpperCase()}</span>
                <span style={{color:"#f8fafc",fontSize:10,fontWeight:700,marginRight:5,fontFamily:"monospace"}}>${d.price.toFixed(2)}</span>
                <span style={{fontSize:9,color:d.change>=0?"#4ade80":"#f87171",fontFamily:"monospace"}}>{d.change>=0?"▲":"▼"}{Math.abs(d.change).toFixed(2)}%</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PriceCard({ grade }) {
  const d = PRICES[grade.id];
  const isPos = d.change >= 0;
  return (
    <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderTop:`4px solid ${isPos?"#16a34a":"#dc2626"}`,borderRadius:4,padding:"13px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
        <span style={{fontSize:14}}>{grade.flag}</span>
        <div>
          <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"monospace"}}>{grade.region}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#0f172a",fontFamily:"monospace"}}>{grade.name}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:7,marginBottom:4}}>
        <span style={{fontSize:21,fontWeight:800,color:"#0f172a",fontFamily:"monospace"}}>${d.price.toFixed(2)}</span>
        <span style={{fontSize:10,fontWeight:700,color:isPos?"#16a34a":"#dc2626",background:isPos?"#f0fdf4":"#fef2f2",padding:"1px 5px",borderRadius:2}}>{isPos?"▲":"▼"} {Math.abs(d.change).toFixed(2)}%</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#94a3b8",fontFamily:"monospace"}}>
        <span>H: ${d.high}</span><span>L: ${d.low}</span>
      </div>
    </div>
  );
}

function PriceChart() {
  const [hovered, setHovered] = useState(null);
  const W=640,H=175,pL=40,pR=14,pT=24,pB=30;
  const iW=W-pL-pR, iH=H-pT-pB;
  const xS = y => pL+((y-1970)/(2026-1970))*iW;
  const yS = p => pT+iH-((p-0)/(150-0))*iH;
  const pts = HISTORY.map(d=>`${xS(d.y)},${yS(d.p)}`).join(" ");
  const area = `M${xS(1970)},${yS(0)} `+HISTORY.map(d=>`L${xS(d.y)},${yS(d.p)}`).join(" ")+` L${xS(2026)},${yS(0)} Z`;
  return (
    <div style={{background:"#0f172a",borderRadius:6,padding:"14px 14px 6px",marginBottom:20}}>
      <div style={{fontSize:9,color:"#f97316",letterSpacing:"0.15em",fontWeight:700,marginBottom:10,fontFamily:"monospace"}}>
        📈 BRENT CRUDE — 56 YEAR PRICE HISTORY (USD/BBL) · KEY EVENTS ANNOTATED
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",cursor:"crosshair"}}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[25,50,75,100,125].map(p=>(
          <g key={p}>
            <line x1={pL} y1={yS(p)} x2={W-pR} y2={yS(p)} stroke="#1e293b" strokeWidth={1}/>
            <text x={pL-4} y={yS(p)+4} textAnchor="end" fontSize={7} fill="#334155" fontFamily="monospace">${p}</text>
          </g>
        ))}
        <path d={area} fill="url(#g1)"/>
        <polyline points={pts} fill="none" stroke="#f97316" strokeWidth={2} strokeLinejoin="round"/>
        {CHART_EVENTS.map(e => {
          const d = HISTORY.find(h=>h.y===e.y);
          if (!d) return null;
          return (
            <g key={e.y} onMouseEnter={()=>setHovered(e)} onMouseLeave={()=>setHovered(null)} style={{cursor:"pointer"}}>
              <circle cx={xS(d.y)} cy={yS(d.p)} r={hovered?.y===e.y?5:3} fill={hovered?.y===e.y?"#fbbf24":"#f97316"} stroke="#0f172a" strokeWidth={1.5}/>
              <line x1={xS(d.y)} y1={yS(d.p)-5} x2={xS(d.y)} y2={pT+2} stroke="#374151" strokeWidth={1} strokeDasharray="2,2"/>
              <text x={xS(d.y)} y={pT-2} textAnchor="middle" fontSize={6} fill={hovered?.y===e.y?"#fbbf24":"#6b7280"} fontFamily="monospace">{e.l}</text>
            </g>
          );
        })}
        {[1975,1985,1995,2005,2015,2026].map(y=>(
          <text key={y} x={xS(y)} y={H-4} textAnchor="middle" fontSize={7} fill="#334155" fontFamily="monospace">{y}</text>
        ))}
        {hovered && (()=>{
          const d = HISTORY.find(h=>h.y===hovered.y);
          if (!d) return null;
          const tx = Math.min(Math.max(xS(d.y)-50,pL),W-pR-110);
          return (
            <g>
              <rect x={tx} y={yS(d.p)-38} width={110} height={32} rx={3} fill="#1e293b" stroke="#f97316" strokeWidth={1}/>
              <text x={tx+55} y={yS(d.p)-23} textAnchor="middle" fontSize={7} fontWeight={700} fill="#f97316" fontFamily="monospace">{hovered.y} — {hovered.l}</text>
              <text x={tx+55} y={yS(d.p)-11} textAnchor="middle" fontSize={7} fill="#94a3b8" fontFamily="monospace">${d.p}/bbl</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

function NewsCard({ article, index, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{background:"#fff",border:"1.5px solid #e2e8f0",borderLeft:`5px solid ${color}`,borderRadius:4,padding:"12px 14px",cursor:"pointer",marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:8,background:color,color:"#fff",padding:"1px 7px",borderRadius:2,fontFamily:"monospace",fontWeight:700}}>{article.source}</span>
            <span style={{fontSize:8,color:"#94a3b8",fontFamily:"monospace"}}>{article.time}</span>
            {article.region && <span style={{fontSize:8,color:"#64748b",fontFamily:"monospace"}}>📍{article.region}</span>}
          </div>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a",lineHeight:1.4,fontFamily:"Georgia,serif"}}>{article.headline}</div>
        </div>
        <div style={{color:"#cbd5e1",fontSize:12,flexShrink:0}}>{open?"▲":"▼"}</div>
      </div>
      {open && (
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
          <p style={{fontSize:12,color:"#475569",lineHeight:1.78,fontFamily:"Georgia,serif",margin:0}}>{article.summary}</p>
        </div>
      )}
    </div>
  );
}

function TimelineCard({ event, selected, onClick }) {
  return (
    <button onClick={onClick} style={{background:selected?"#0f172a":"#f8fafc",border:`1.5px solid ${selected?"#f97316":"#e2e8f0"}`,borderRadius:4,padding:"8px 12px",cursor:"pointer",textAlign:"left",minWidth:90}}>
      <div style={{fontSize:8,color:selected?"#f97316":"#64748b",fontWeight:700,fontFamily:"monospace",marginBottom:2}}>{event.year}</div>
      <div style={{fontSize:10,color:selected?"#e2e8f0":"#0f172a",fontWeight:700,fontFamily:"monospace"}}>{event.price}</div>
      <div style={{fontSize:8,color:selected?"#94a3b8":"#64748b",marginTop:2,fontFamily:"monospace"}}>{event.label}</div>
    </button>
  );
}

export default function App() {
  const [activeCat,  setActiveCat]  = useState("geopolitical");
  const [selEvent,   setSelEvent]   = useState(null);
  const [showChart,  setShowChart]  = useState(true);
  const [activeTab,  setActiveTab]  = useState("news");

  const cat = CATS.find(c=>c.id===activeCat);

  return (
    <div style={{minHeight:"100vh",background:"#f1f5f9"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap');
        @keyframes ticker {0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes blink  {0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes fadeUp {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        * { box-sizing:border-box; margin:0; padding:0 }
        body { max-width:100vw; overflow-x:hidden }
      `}</style>

      {/* HEADER */}
      <div style={{background:"#fff",borderBottom:"3px solid #0369a1",boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>
        <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{background:"#0369a1",color:"#fff",width:40,height:40,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🛢️</div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(18px,5vw,28px)",fontWeight:900,letterSpacing:"0.04em",color:"#0f172a",lineHeight:1}}>
              HARD <span style={{color:"#0369a1"}}>CRUDE</span> INTELLIGENCE
            </div>
            <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.15em",marginTop:2,fontFamily:"monospace"}}>GLOBAL OIL MARKETS & ENERGY INTELLIGENCE</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{textAlign:"center",padding:"4px 10px",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{fontSize:7,color:"#94a3b8",letterSpacing:"0.12em",fontFamily:"monospace"}}>BRENT</div>
              <div style={{fontSize:16,fontWeight:800,color:"#0f172a",fontFamily:"monospace"}}>$92.86</div>
            </div>
            <div style={{textAlign:"center",padding:"4px 10px",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{fontSize:7,color:"#94a3b8",letterSpacing:"0.12em",fontFamily:"monospace"}}>WTI</div>
              <div style={{fontSize:16,fontWeight:800,color:"#0f172a",fontFamily:"monospace"}}>$90.90</div>
            </div>
            <div style={{padding:"4px 10px",borderLeft:"1px solid #e2e8f0"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#16a34a",display:"inline-block",marginRight:5}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#16a34a",fontFamily:"monospace"}}>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <Ticker/>

      {/* BREAKING BANNER */}
      <div style={{background:"#dc2626",color:"#fff",padding:"9px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{background:"#fff",color:"#dc2626",fontWeight:900,fontSize:9,padding:"2px 7px",borderRadius:2,fontFamily:"monospace",flexShrink:0,animation:"blink 1s infinite"}}>⚡ BREAKING</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.04em",fontFamily:"monospace"}}>
          DAY 7: WTI +35.63% BIGGEST WEEKLY GAIN IN FUTURES HISTORY · BRENT $92.86 · 150+ TANKERS ANCHORED · US-IRAN TALKS BEGIN · SOUTH KOREA ENERGY EMERGENCY
        </div>
      </div>

      {/* MAIN */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"16px"}}>

        {/* Chart toggle */}
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowChart(!showChart)} style={{background:showChart?"#0f172a":"#f8fafc",border:`1.5px solid ${showChart?"#f97316":"#e2e8f0"}`,color:showChart?"#f97316":"#64748b",padding:"6px 14px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>
            📈 {showChart?"HIDE CHART":"SHOW 56-YEAR CHART"}
          </button>
        </div>

        {showChart && <PriceChart/>}

        {/* Timeline */}
        <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:4,padding:"14px 16px",marginBottom:20}}>
          <div style={{fontSize:9,fontWeight:700,color:"#64748b",letterSpacing:"0.15em",fontFamily:"monospace",marginBottom:12}}>
            KEY PRICE EVENTS — CLICK ANY TO READ THE FULL STORY
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:selEvent?14:0}}>
            {TIMELINE.map((e,i)=>(
              <TimelineCard key={i} event={e} selected={selEvent?.year===e.year} onClick={()=>setSelEvent(selEvent?.year===e.year?null:e)}/>
            ))}
          </div>
          {selEvent && (
            <div style={{background:"#0f172a",borderRadius:4,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#f97316",letterSpacing:"0.12em",fontWeight:700,fontFamily:"monospace",marginBottom:4}}>{selEvent.year} · {selEvent.price}/BBL · {selEvent.label.toUpperCase()}</div>
              <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.8,fontFamily:"Georgia,serif",margin:0}}>{selEvent.detail}</p>
              <button onClick={()=>setSelEvent(null)} style={{marginTop:10,background:"none",border:"1px solid #334155",color:"#64748b",padding:"4px 10px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"monospace"}}>CLOSE</button>
            </div>
          )}
        </div>

        {/* Price cards */}
        <div style={{fontSize:9,fontWeight:700,color:"#64748b",letterSpacing:"0.18em",fontFamily:"monospace",marginBottom:12}}>
          BENCHMARK CRUDE — SPOT PRICES (USD/BBL) · MAR 9, 2026
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:24}}>
          {GRADES.map(g=><PriceCard key={g.id} grade={g}/>)}
        </div>

        {/* News section */}
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {["news","history"].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{background:activeTab===t?"#0369a1":"#f8fafc",border:`1.5px solid ${activeTab===t?"#0369a1":"#e2e8f0"}`,color:activeTab===t?"#fff":"#64748b",padding:"7px 16px",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>
              {t==="news"?"📰 INTELLIGENCE BRIEFS":"📚 HISTORICAL CONTEXT"}
            </button>
          ))}
        </div>

        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{background:activeCat===c.id?c.color:"#fff",border:`1.5px solid ${activeCat===c.id?c.color:"#e2e8f0"}`,color:activeCat===c.id?"#fff":"#475569",padding:"8px 14px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace",display:"flex",alignItems:"center",gap:6}}>
              <span>{c.icon}</span><span>{c.label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {activeTab==="news" ? (
          <div>
            {(NEWS[activeCat]||[]).map((a,i)=><NewsCard key={i} article={a} index={i} color={cat?.color||"#0369a1"}/>)}
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(HIST[activeCat]||[]).map((e,i)=>(
              <div key={i} style={{display:"flex",gap:12,background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:4,padding:"12px 14px"}}>
                <div style={{flexShrink:0,background:"#0f172a",borderRadius:3,padding:"6px 8px",display:"flex",alignItems:"center",justifyContent:"center",minWidth:50}}>
                  <span style={{fontSize:8,color:"#f97316",fontWeight:700,fontFamily:"monospace",textAlign:"center"}}>{e.y}</span>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"#0f172a",marginBottom:4,fontFamily:"monospace"}}>{e.t}</div>
                  <div style={{fontSize:11,color:"#64748b",lineHeight:1.68,fontFamily:"Georgia,serif"}}>{e.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{marginTop:30,paddingTop:14,borderTop:"1px solid #e2e8f0",textAlign:"center"}}>
          <span style={{fontSize:8,color:"#cbd5e1",letterSpacing:"0.1em",fontFamily:"monospace"}}>HARD CRUDE INTELLIGENCE © 2026 — FOR INFORMATIONAL PURPOSES ONLY. NOT FINANCIAL ADVICE.</span>
        </div>
      </div>
    </div>
  );
}
