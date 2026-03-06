import { useState } from "react";

// ─── PRICES ──────────────────────────────────────────────────────────────────
const PRICES = {
  brent:     { price:91.40, change:17.15, high:94.80, low:72.87 },
  wti:       { price:87.20, change:16.38, high:90.50, low:67.02 },
  wcs:       { price:68.90, change:16.56, high:71.20, low:57.60 },
  opec:      { price:93.10, change:16.88, high:96.40, low:78.10 },
  dubai:     { price:89.80, change:16.72, high:93.10, low:75.30 },
  urals:     { price:70.20, change:13.71, high:72.50, low:61.75 },
  bonny:     { price:94.30, change:17.04, high:97.60, low:79.20 },
  maya:      { price:76.40, change:16.81, high:79.20, low:65.40 },
  arab_light:{ price:92.10, change:16.92, high:95.30, low:77.05 },
};
const GRADES = [
  { id:"brent",      name:"Brent Crude",  region:"North Sea",    flag:"🌊", api:38.3 },
  { id:"wti",        name:"WTI Crude",    region:"USA",          flag:"🇺🇸", api:39.6 },
  { id:"wcs",        name:"Western Canadian Select", region:"Canada / Alberta", flag:"🇨🇦", api:20.5 },
  { id:"opec",       name:"OPEC Basket",  region:"Multi-Nation", flag:"🛢️", api:36.1 },
  { id:"dubai",      name:"Dubai/Oman",   region:"Middle East",  flag:"🇦🇪", api:31.0 },
  { id:"urals",      name:"Urals Blend",  region:"Russia",       flag:"🇷🇺", api:31.7 },
  { id:"bonny",      name:"Bonny Light",  region:"Nigeria",      flag:"🇳🇬", api:33.9 },
  { id:"maya",       name:"Maya Crude",   region:"Mexico",       flag:"🇲🇽", api:22.0 },
  { id:"arab_light", name:"Arab Light",   region:"Saudi Arabia", flag:"🇸🇦", api:32.8 },
];

// ─── 50-YEAR PRICE HISTORY ────────────────────────────────────────────────────
const HISTORY_PRICES = [
  {y:1970,p:1.8},{y:1973,p:3.0},{y:1974,p:11.6},{y:1979,p:31.6},{y:1980,p:36.8},
  {y:1981,p:35.5},{y:1983,p:29.5},{y:1986,p:14.4},{y:1988,p:14.9},{y:1990,p:23.7},
  {y:1991,p:20.0},{y:1993,p:17.0},{y:1995,p:17.0},{y:1998,p:12.7},{y:2000,p:28.5},
  {y:2002,p:25.0},{y:2004,p:38.3},{y:2006,p:65.1},{y:2007,p:72.4},{y:2008,p:97.3},
  {y:2009,p:61.7},{y:2010,p:79.5},{y:2011,p:111.0},{y:2012,p:111.7},{y:2013,p:108.7},
  {y:2014,p:98.9},{y:2015,p:52.4},{y:2016,p:43.6},{y:2017,p:54.2},{y:2018,p:71.3},
  {y:2019,p:63.7},{y:2020,p:41.8},{y:2021,p:70.9},{y:2022,p:99.1},{y:2023,p:82.5},
  {y:2024,p:72.0},{y:2025,p:74.2},{y:2026,p:76.4},
];

const CHART_EVENTS = [
  {y:1973,l:"Embargo"},{y:1979,l:"Iran Rev."},{y:1986,l:"Glut"},
  {y:1990,l:"Gulf War"},{y:1998,l:"Asia"},{y:2008,l:"$147"},
  {y:2014,l:"Shale"},{y:2020,l:"COVID"},{y:2022,l:"Ukraine"},
];

const TIMELINE = [
  { year:"1973", price:"$3→$12",  label:"Arab Embargo",       cat:"geopolitical",
    detail:"OAPEC nations embargoed the US and Netherlands following the Yom Kippur War. Oil quadrupled overnight. The IEA was founded in direct response. Energy security entered the geopolitical lexicon permanently. Petrol rationing and speed limits were introduced across the West as emergency measures. The shock transferred ~$70 billion annually from consuming to producing nations and ended the era of cheap energy." },
  { year:"1979", price:"$13→$35", label:"Iranian Revolution",  cat:"geopolitical",
    detail:"The fall of the Shah removed 5.7 million bpd from global markets. When the Iran-Iraq War erupted in 1980, a further 4 million bpd was disrupted. Prices surged to $35/bbl nominal — over $120 in 2024 dollars. The crisis permanently elevated the Persian Gulf's strategic importance, triggered the Carter Doctrine committing US military force to defend Gulf oil, and launched the era of strategic petroleum reserves as policy tools." },
  { year:"1986", price:"$27→$10", label:"Saudi Price War",     cat:"opec",
    detail:"Tired of cutting while other OPEC members cheated and non-OPEC producers grew, Saudi Arabia flooded the market. Prices crashed from $27 to $10/bbl. The economic devastation was geopolitically consequential: it halved Soviet hard currency earnings, accelerating the fiscal crisis that would end the USSR in 1991. It also bankrupted hundreds of US oil companies and delayed North Sea and Alaskan investment by a decade." },
  { year:"1990", price:"$17→$40", label:"Gulf War",            cat:"geopolitical",
    detail:"Iraq's invasion of Kuwait instantly removed 4.3 million bpd. Prices spiked to $40/bbl — but the swift Desert Storm response and the first coordinated IEA SPR release demonstrated that political action can cap geopolitical price spikes. Prices collapsed back to pre-war levels within six months, establishing a template for crisis management that the IEA still uses today." },
  { year:"1998", price:"$20→$10", label:"Asian Crisis",        cat:"economic",
    detail:"The 1997 Asian currency crisis collapsed demand across the region just as OPEC raised output quotas. Brent fell below $10/bbl — the lowest in inflation-adjusted terms since the 1970s. The crisis forced an historic meeting between Saudi Oil Minister Ali al-Naimi and Venezuelan President Hugo Chávez, kicking off serious cartel coordination and laying the groundwork for the OPEC+ alliance that emerged 18 years later." },
  { year:"2008", price:"$62→$147",label:"All-Time Peak",       cat:"economic",
    detail:"A perfect storm: surging Chinese and Indian demand, a weak US dollar, Iraq war uncertainty, and speculative commodity investment drove Brent to $147.50/bbl in July 2008 — a record that still stands. Goldman Sachs predicted $200 oil. Six months later, the Global Financial Crisis destroyed demand and prices crashed 75% to $35 — the most violent six-month collapse in oil market history." },
  { year:"2016", price:"$27",     label:"OPEC+ Born",          cat:"opec",
    detail:"Brent touched $27/bbl in January 2016, the lowest since 2003, as US shale flooded the market. The crisis forced Saudi Arabia and Russia to set aside decades of rivalry. In December 2016, 23 nations signed the Declaration of Cooperation — creating OPEC+ and giving the cartel its most powerful instrument since the 1970s embargo. The price doubled within a year." },
  { year:"2020", price:"-$37",    label:"Negative Oil",        cat:"economic",
    detail:"COVID lockdowns destroyed 30% of global demand in weeks. On April 20 2020, WTI futures traded at -$37.63/bbl — the only time in history a major commodity went negative. With Cushing, Oklahoma physically full, producers paid buyers to take crude. The OPEC+ emergency cut of 9.7 million bpd — the largest in history — stabilised markets. Brent recovered from $16 to $50 within six months, one of the fastest recoveries ever recorded." },
  { year:"2022", price:"$80→$130",label:"Ukraine War",         cat:"geopolitical",
    detail:"Russia's February 24 2022 invasion triggered the most severe energy crisis since 1973. Brent surged to $130/bbl as Europe scrambled to replace 4 million bpd of Russian crude and 150 bcm of pipeline gas. The crisis permanently redrew global energy trade: Europe built LNG terminals at record speed, Russia pivoted to India and China at steep discounts, and Western sanctions created a two-tier global oil market that persists today." },
];

const NEWS = {
  geopolitical:[
    { headline:"CONFIRMED: Ayatollah Ali Khamenei Killed in US-Israeli Strike on Tehran Compound", summary:"Iranian state television has confirmed the death of Supreme Leader Ayatollah Ali Khamenei, who held power since 1989. He was killed by an Israeli airstrike on his compound in Tehran's Pasteur district. Trump announced his death on Truth Social, calling him 'one of the most evil people in history.' Khamenei's daughter, son-in-law, and grandson were also killed in the strike. Iran has declared 40 days of mourning and vowed the 'most ferocious offensive in its history' in retaliation.", source:"CNN / Al Jazeera / WaPo", time:"LIVE", region:"Tehran / Iran" },
    { headline:"Iran Restricts Strait of Hormuz — IRGC Ordering Ships Not to Pass", summary:"Iran's Revolutionary Guard is broadcasting marine radio warnings instructing vessels not to transit the Strait of Hormuz. An EU naval mission official confirmed the restriction to Reuters. Several oil companies and trading firms have already paused crude shipments through the waterway. Barclays warned: 'Oil markets might have to face their worst fears on Monday.' The waterway carries 20 million barrels per day — 20% of global seaborne oil.", source:"Reuters / Fox Business", time:"2h ago", region:"Strait of Hormuz" },
    { headline:"Dubai International Airport — World's Busiest for International Flights — Closed Indefinitely", summary:"Dubai's airport operator announced flights have been halted indefinitely at Dubai International Airport following Iranian missile strikes. Smoke was seen rising over Palm Jumeirah. The closure of the world's busiest international airport is a profound signal of the conflict's reach into the heart of Gulf commercial life. Major airlines are cancelling flights across the region through early next week.", source:"PBS / CNBC", time:"3h ago", region:"UAE / Dubai" },
    { headline:"Iran Fires Missiles at Tel Aviv — 21 Injured, Fires Burn in City Centre", summary:"Iranian ballistic missiles struck central Tel Aviv overnight, injuring at least 21 people. Fires burned across several districts as Israel's Iron Dome intercepted incoming projectiles. Israel has declared a state of emergency nationwide. Netanyahu confirmed a second wave of Israeli strikes on missile launchers in central Iran has commenced. Bombing will continue 'throughout the week or as long as necessary,' Trump said.", source:"Reuters / Getty", time:"4h ago", region:"Israel" },
    { headline:"Trump: Bombing Will Continue 'Throughout the Week' — Regime Change the Objective", summary:"President Trump posted on Truth Social that bombing would continue 'uninterrupted throughout the week or as long as necessary.' Both Trump and Netanyahu have explicitly stated regime change as their goal. Trump urged Iranians: 'When we are finished, take over your government. It will be yours to take.' The UN Secretary General warned: 'Military action carries the risk of igniting a chain of events that no one can control.'", source:"Truth Social / NBC News", time:"5h ago", region:"USA / Iran" },
  ],
  opec:[
    { headline:"OPEC+ Emergency Meeting Sunday — Saudi Arabia Prepares Maximum Output as Hormuz Restricted", summary:"With Hormuz now under restriction, Sunday's OPEC+ emergency session has taken on critical importance. Saudi Arabia and UAE are preparing to signal maximum possible output increases, but their own exports also transit the Strait of Hormuz. If the restriction hardens into a full blockade, no amount of OPEC spare capacity can compensate — the bottleneck is geographic, not volume-based.", source:"Reuters", time:"1h ago", region:"Saudi Arabia / OPEC+" },
    { headline:"Iran's Kharg Island Export Terminal: Still Operational — But For How Long?", summary:"Despite the scale of strikes across Iran, Kharg Island — through which 90% of Iran's crude exports flow — has not been confirmed as a direct target as of Saturday evening. Energy analysts say this is deliberate: the US and Israel are using Kharg as leverage. Any strike on Kharg would remove 3 million bpd from global markets instantly. Several tanker operators have preemptively suspended loadings pending security assessment.", source:"Bloomberg / OilPrice.com", time:"3h ago", region:"Iran / Persian Gulf" },
    { headline:"Russia's Rosneft Quietly Raises Asian Crude Prices as Middle East Supply Collapses", summary:"Russia's Rosneft has raised its official selling prices for Urals crude to Asian buyers by $4.50/bbl, moving swiftly to capitalise on Middle Eastern supply uncertainty. Chinese and Indian refiners who had depended on Iranian crude are now competing intensely for Russian barrels. Russia, which declared it would not increase output, is extracting maximum value from the chaos it did not create.", source:"Bloomberg", time:"5h ago", region:"Russia / Asia" },
    { headline:"Iraq Halts All Oil Exports Through Basra — Cites Security Threat From Iranian Missiles", summary:"Iraq's State Oil Marketing Organisation announced a temporary halt to crude loadings at the Basra oil terminal, citing active security threats from Iranian missile activity. Approximately 3.3 million bpd of Iraqi crude exports — OPEC's second largest producer — is now offline. The halt represents a massive additional supply shock on top of the Iranian disruption and Hormuz restriction.", source:"Reuters", time:"6h ago", region:"Iraq / Basra" },
    { headline:"Saudi Arabia Condemns Iran's Missile Strikes on Gulf States — Backs UAE, Qatar, Kuwait", summary:"Saudi Arabia issued a strongly worded statement condemning Iranian missile strikes on the UAE, Bahrain, Qatar, Kuwait, and Jordan as a breach of sovereignty, warning of 'dire consequences.' The Kingdom stopped short of joining the military campaign but has positioned itself firmly alongside the US-led coalition. Saudi Aramco has activated all contingency export protocols.", source:"PBS / Reuters", time:"7h ago", region:"Saudi Arabia" },
  ],
  economic:[
    { headline:"Barclays: 'Oil Markets May Face Their Worst Fears Monday' — Brent $100 Now Base Case", summary:"Barclays issued its starkest warning yet: 'Oil markets might have to face their worst fears on Monday.' With Hormuz restricted and Khamenei confirmed dead, the bank has shifted its $100/bbl Brent call from tail risk to base case. Eurasia Group projected a $5–10 increase above Friday's $73 baseline as a minimum if restrictions continue into Sunday. Asian markets open first — the initial price signal will come from Singapore and Tokyo.", source:"Barclays / Reuters", time:"2h ago", region:"Global Markets" },
    { headline:"IEA Calls Emergency Governing Board Session — Coordinated SPR Release Being Finalised", summary:"The IEA's governing board convened an emergency session, with member nations moving toward a coordinated strategic petroleum reserve release potentially larger than the 60 million barrel package deployed after Russia's 2022 Ukraine invasion. The White House has separately authorised a unilateral US SPR release of up to 30 million barrels targeting Monday's Asian market open.", source:"WSJ / Reuters", time:"4h ago", region:"IEA / USA" },
    { headline:"Goldman Sachs Revises Brent Worst Case to $130 if Hormuz Fully Closed for One Week", summary:"Goldman Sachs issued a second emergency commodity note revising its worst-case Brent scenario sharply higher. A full Hormuz closure sustained for one week would push Brent to $130/bbl. The bank's new base case, assuming partial Hormuz restriction resolved within 48–72 hours, is $95–105/bbl at Monday's open. The note described this as 'the most significant oil supply risk event since 1973.'", source:"Goldman Sachs / Bloomberg", time:"5h ago", region:"Global" },
    { headline:"Asian Stock Futures Collapse — Nikkei Down 4%, Hang Seng Down 5% in Pre-Market", summary:"Asian equity futures are signalling a brutal Monday open. Nikkei 225 futures are down approximately 4%, Hang Seng futures down 5%, and South Korean KOSPI futures off 3.8%. Gold has surged to $3,180/oz, the US dollar index has risen 2.4%, and Treasury yields have fallen sharply. Oil futures in weekend electronic trading are already pricing Brent above $90.", source:"Bloomberg / CNBC", time:"6h ago", region:"Global Markets" },
    { headline:"US Gasoline Futures Signal $5/Gallon Pump Prices Within Two Weeks if Hormuz Stays Restricted", summary:"US retail gasoline futures are pricing in pump prices of $4.80–5.10 per gallon within two weeks if Hormuz restrictions persist. The White House confirmed an SPR release and said the administration is 'doing everything possible' to protect American consumers. GasBuddy upgraded its forecast to a 50–75 cent per gallon increase in the next 10 days.", source:"GasBuddy / Reuters", time:"7h ago", region:"United States" },
  ],
  climate:[
    { headline:"Energy Transition Narrative Collapses Overnight — Fossil Fuel Security Back at Top of Every Agenda", summary:"The Khamenei killing and Hormuz restriction have abruptly ended what remained of the energy transition narrative in government policy circles. European energy ministers are convening emergency sessions, coal plant restarts are being fast-tracked, and LNG import capacity approvals are being rubber-stamped. The crisis has exposed that the world remains entirely dependent on fossil fuel infrastructure with no alternative capable of absorbing a supply shock of this magnitude.", source:"FT", time:"3h ago", region:"Global" },
    { headline:"Canada Becomes World's Most Strategically Valuable Oil Producer Overnight", summary:"With Middle Eastern supply in chaos and Hormuz restricted, Canada's oil sands — producing 3.5 million bpd via geographically insulated pipelines — have become the single most strategically valuable oil resource on the planet. Trans Mountain pipeline bookings to Asian buyers have surged to maximum capacity. WCS prices have jumped to their highest level in years as Asian refiners pay premiums for non-Gulf supply.", source:"Globe and Mail / Bloomberg", time:"5h ago", region:"Canada / Alberta" },
    { headline:"IEA Emergency Assessment: Current Crisis Exceeds 1973 Embargo in Potential Severity", summary:"The IEA's emergency assessment concluded that the combination of Iranian supply disruption, Hormuz restriction, and Iraqi export halt represents a potential supply shock exceeding the 1973 Arab Embargo. The 1973 embargo removed 4–5 million bpd. The current scenario, if Hormuz is fully closed, would remove 20 million bpd — four times larger.", source:"IEA", time:"6h ago", region:"Global" },
    { headline:"Nuclear Power Plants Fast-Tracked Across Europe and Asia as Energy Security Crisis Deepens", summary:"Governments across Europe and Asia are fast-tracking nuclear power approvals. Japan's cabinet approved the restart of four additional reactors on emergency authority. France accelerated its EPR2 programme. South Korea reversed a planned decommissioning of two older plants. The crisis is doing in hours what years of policy debate could not.", source:"Reuters / Bloomberg", time:"7h ago", region:"Europe / Asia" },
    { headline:"Coal Restarts Accelerate — Germany, Poland, UK Reactivating Mothballed Plants", summary:"Germany, Poland, and the United Kingdom confirmed emergency reactivation of mothballed coal-fired power stations as insurance against a sustained oil and gas supply shock. Energy ministers have invoked emergency powers to bypass normal environmental review processes. RWE, PGE, and Drax confirmed additional capacity can be online within 72 hours.", source:"Bloomberg / Reuters", time:"9h ago", region:"Europe" },
  ],
  demand:[
    { headline:"Global Aviation in Crisis — Middle East Airspace Closed, 600+ Flights Cancelled", summary:"More than 600 flights have been cancelled as airspace over Iran, Iraq, UAE, Qatar, Bahrain, and Kuwait is partially or fully closed. Emirates, Qatar Airways, Etihad, and flydubai have suspended all operations. Long-haul routes between Europe, Asia, and Australia transiting Gulf airspace are being rerouted over the Indian Ocean — adding hours and thousands of dollars in fuel cost per flight.", source:"IATA / FlightRadar24", time:"2h ago", region:"Middle East / Global" },
    { headline:"China Activates Full Emergency Energy Protocol — State Refiners Ordered to Maximise Domestic Output", summary:"Beijing's State Council activated its highest-level energy emergency protocol, ordering state refiners Sinopec and PetroChina to maximise domestic crude extraction, draw down strategic reserves, and immediately seek alternative supply from Russia, Brazil, and West Africa. China imports 1.5–1.8 million bpd of Iranian crude — supply now completely uncertain.", source:"Reuters / Bloomberg", time:"4h ago", region:"China" },
    { headline:"Shipping Paralysis: 47 Tankers Anchored Outside Hormuz — $2 Billion of Crude Stranded", summary:"Kpler reports 47 loaded crude tankers at anchor outside the Strait of Hormuz, unable to transit due to IRGC warnings. The stranded vessels carry an estimated 47–55 million barrels — approximately $2 billion at current prices. Lloyd's of London has suspended war-risk coverage for Hormuz transit entirely, making insurance-backed passage legally impossible for most commercial operators.", source:"Kpler / Reuters", time:"5h ago", region:"Strait of Hormuz" },
    { headline:"India Declares National Energy Emergency — First in the Country's History", summary:"India's cabinet declared a national energy emergency, the first such declaration in the country's history. India sources 40% of its crude from the Gulf — now an acute national security vulnerability. Strategic reserves covering 9–10 days of consumption have been authorised for immediate drawdown. Emergency supply agreements are being negotiated with the US, Canada, Brazil, and Norway.", source:"Bloomberg / Reuters", time:"6h ago", region:"India" },
    { headline:"Global Shipping Rates Surge 85% in Single Day — Worst Since COVID Port Closures", summary:"The Baltic Exchange dirty tanker rate index surged 85% in Saturday trading — the largest single-day move since COVID-era port closures in 2020. Very Large Crude Carrier day rates have jumped from $35,000 to $85,000 in 24 hours. Vessels capable of loading in the US Gulf, West Africa, and North Sea are being booked at any price.", source:"Baltic Exchange / Bloomberg", time:"8h ago", region:"Global Shipping" },
  ],
};

const HIST = {
  geopolitical:[
    {y:"1973",t:"Arab Oil Embargo",d:"OAPEC cuts supply to punish US/Netherlands support for Israel. Oil quadruples. The IEA is founded in direct response. Energy security enters the geopolitical lexicon permanently."},
    {y:"1979–80",t:"Iranian Revolution & Iran-Iraq War",d:"Shah's fall removes 5.7m bpd. Ensuing war adds further disruption. The Carter Doctrine commits US military force to Gulf oil defence — defining US Middle East policy for 40+ years."},
    {y:"1990",t:"Gulf War",d:"Iraq invades Kuwait, removes 4.3m bpd. Swift coalition response and first SPR deployment show that coordinated political action can cap price spikes from geopolitical disruptions."},
    {y:"2011",t:"Arab Spring & Libya Collapse",d:"Libya's civil war removes 1.6m bpd. Unrest across Yemen, Bahrain, Syria creates a persistent Middle East risk premium. OPEC loses a major member to chronic instability."},
    {y:"2022",t:"Russia-Ukraine War",d:"Largest energy shock since 1973. Europe replaces Russian pipeline gas with LNG. Russia pivots to India and China at deep discounts. Western sanctions create a permanently bifurcated global oil market."},
  ],
  opec:[
    {y:"1960",t:"OPEC Founded in Baghdad",d:"Venezuela and Arab nations create OPEC to counter the Western 'Seven Sisters' who unilaterally set prices. The founding shifts the centre of oil power from consuming to producing nations."},
    {y:"1973",t:"First Oil Weapon",d:"OPEC demonstrates it can weaponise oil geopolitically — transferring ~$70 billion annually from consumers to producers and permanently altering the global economic order."},
    {y:"1986",t:"Saudi Price War & Internal Breakdown",d:"Tired of cutting while others cheat, Saudi Arabia floods the market. The cartel's chronic discipline problem — still present today — is exposed in full."},
    {y:"2016",t:"OPEC+ Alliance Created",d:"The shale-driven price collapse forces Saudi Arabia and Russia together. 23 nations sign the Declaration of Cooperation — the most significant restructuring of global oil governance since 1960."},
    {y:"2020",t:"9.7 Million bpd Historic Cut",d:"COVID forces the largest coordinated production cut in history. Saudi Arabia and Russia set aside their March 2020 price war within weeks, proving the alliance can survive extreme stress."},
  ],
  economic:[
    {y:"1973–74",t:"Stagflation Invented",d:"The oil shock drives double-digit inflation while simultaneously causing recession — 'stagflation' — a combination economists thought impossible. It ends the postwar Keynesian economic consensus."},
    {y:"1986",t:"Soviet Fiscal Crisis Begins",d:"The Saudi-driven price crash halves Soviet hard currency earnings. Many historians mark this as the beginning of the fiscal crisis that ended the USSR in 1991."},
    {y:"1998",t:"$10 Oil Forces OPEC Emergency",d:"Asian crisis demand collapse plus OPEC quota increase drives prices below $10/bbl. Forces emergency cartel coordination — the template for modern OPEC crisis management."},
    {y:"2008",t:"$147 Peak and 75% Crash",d:"Oil's parabolic rise contributed to consumer squeeze that deepened the financial crisis; its collapse reflected the severity of demand destruction. The six-month range: $147 to $35."},
    {y:"2020",t:"Negative Oil: -$37.63/bbl",d:"WTI May futures trade negative for the only time in history as Cushing storage fills physically. Financial market mechanics collide with physical commodity reality in an event no model predicted."},
  ],
  climate:[
    {y:"1988",t:"IPCC Founded",d:"The Intergovernmental Panel on Climate Change begins the scientific consensus-building that will ultimately challenge the long-term future of fossil fuels as the world's primary energy source."},
    {y:"1997",t:"Kyoto Protocol",d:"First binding international climate agreement. Oil industry dismisses it — but it begins the regulatory trajectory that now drives ESG investing, carbon pricing, and energy transition capital allocation."},
    {y:"2015",t:"Paris Agreement",d:"196 nations commit to limiting warming to 1.5–2°C. The IEA subsequently calculates that no new oil and gas fields should be approved after 2021 to meet this target."},
    {y:"2021",t:"IEA Net Zero Report",d:"The world's energy watchdog declares peak oil demand achievable by 2030 under aggressive transition — a seismic shift from an institution that once only tracked fossil fuel supply."},
    {y:"2023",t:"EV Price Parity in China",d:"Electric vehicles reach price parity with combustion cars in China. Global EV sales hit 14 million. Oil demand displacement from EVs becomes statistically measurable for the first time."},
  ],
  demand:[
    {y:"1908",t:"Ford Model T",d:"Mass automobile production begins the century-long marriage of oil and transportation. Within 20 years: 23 million registered US vehicles. Within 50 years: the oil-dependent suburban civilisation."},
    {y:"1950s",t:"The Postwar Automobile Age",d:"Western suburbanisation, the US interstate highway system, and cheap gasoline create car-dependent civilisation. Decisions made in the 1950s about urban planning still lock in oil demand today."},
    {y:"1993",t:"China Becomes Oil Importer",d:"China shifts from oil exporter to net importer. Over the next 30 years it adds 10 million bpd of demand — the single greatest demand growth story in oil history."},
    {y:"2000s",t:"Aviation Democratised",d:"Low-cost carriers make air travel a mass market. Jet fuel becomes one of the fastest-growing demand categories — now 7% of global oil consumption and the hardest sector to decarbonise."},
    {y:"2020s",t:"India's Turn",d:"With 1.4 billion people and rapid motorisation, India replicates China's demand growth story. Expected to add 4 million bpd by 2040, making it the defining demand variable of the next decade."},
  ],
};

const KB = [
  {keys:["brent","wti","spread","premium","difference","benchmark"],
   ans:"The Brent-WTI spread currently sits around $4.20/bbl. Brent trades at a premium because it is a seaborne benchmark priced at the North Sea export point, freely accessible to global refiners. WTI is landlocked at Cushing, Oklahoma and subject to pipeline and storage constraints. In a Middle East supply crisis, Brent typically widens its premium over WTI because the supply risk is geographically closer to Brent-priced barrels."},
  {keys:["opec","cartel","quota","cut","compliance","saudi","riyadh"],
   ans:"OPEC+ has convened an emergency ministerial meeting following the US-Israeli strikes on Iran. Saudi Arabia holds approximately 1.5–2 million bpd of immediately deployable spare capacity, while the UAE has a further 500,000–700,000 bpd. Combined, the alliance can theoretically offset Iran's 3.3 million bpd — but only if the Strait of Hormuz remains open, since Saudi and UAE exports transit the same waterway."},
  {keys:["iran","strike","attack","khamenei","hormuz","operation","epic fury"],
   ans:"The US-Israeli strikes on Iran on February 28 2026 have killed Supreme Leader Ayatollah Ali Khamenei — confirmed by Iranian state television. Iran has restricted the Strait of Hormuz, with the IRGC broadcasting warnings ordering ships not to transit. 47 tankers are anchored outside the strait. Goldman Sachs has issued $95–105/bbl as its base case and $130/bbl if Hormuz is fully closed for one week. Brent is targeting $100 when Asian markets open Sunday."},
  {keys:["russia","ukraine","war","urals","moscow"],
   ans:"Russia is a quiet beneficiary of the Iran crisis. Urals blend has jumped sharply as Russia raises Asian crude prices by $4.50/bbl. Russia has explicitly stated it will not increase output to replace Iranian barrels, as every dollar of price increase benefits Moscow's war budget. Russia's fiscal breakeven is approximately $65/bbl — current prices are well above that threshold."},
  {keys:["china","beijing","demand","import","refinery"],
   ans:"China has activated its highest-level energy emergency protocol, ordering state refiners to maximise domestic output and draw down strategic reserves. China imports 1.5–1.8 million bpd of Iranian crude — supply now completely uncertain. Beijing is sending emergency purchase enquiries to Saudi Aramco, ADNOC, and Rosneft simultaneously."},
  {keys:["canada","wcs","western canadian","alberta","oil sands","trans mountain"],
   ans:"Western Canadian Select has surged to $68.90 — up 16.56% — as markets price in Middle Eastern supply loss. Canada's oil sands — producing 3.5 million bpd via geographically insulated pipelines — have become the world's most strategically valuable oil resource overnight. Trans Mountain pipeline bookings to Asian buyers have surged to maximum capacity. Alberta's Premier called it 'Canada's moment to step up for global energy security.'"},
  {keys:["spr","strategic petroleum reserve","release","iea","emergency"],
   ans:"The IEA has convened an emergency governing board session moving toward a coordinated SPR release potentially larger than the 60 million barrel package deployed after Russia's 2022 Ukraine invasion. The White House has separately authorised a unilateral US SPR release of up to 30 million barrels targeting Monday's Asian market open to prevent a disorderly price spike."},
  {keys:["goldman","$130","$100","$95","price","forecast","target"],
   ans:"Goldman Sachs issued a second emergency commodity note Saturday evening with revised scenarios: base case $95–105/bbl assuming partial Hormuz restriction resolved within 48–72 hours; worst case $130/bbl if Hormuz is fully closed for one week. The note described the situation as 'the most significant oil supply risk event since 1973.' Barclays has shifted $100 from tail risk to base case."},
  {keys:["shipping","tanker","hormuz","lloyd","insurance","kpler"],
   ans:"47 loaded crude tankers are anchored outside the Strait of Hormuz carrying an estimated 47–55 million barrels — approximately $2 billion at current prices. Lloyd's of London has suspended war-risk coverage for Hormuz transit entirely, making insurance-backed passage legally impossible for most commercial operators. Baltic Exchange dirty tanker rates surged 85% in a single day — the largest move since COVID port closures."},
  {keys:["history","1973","embargo","1979","1986","1990","2008","2020","2022","crisis","shock"],
   ans:"The history of oil prices is essentially the history of the modern world. The 1973 Arab Embargo quadrupled prices overnight and created energy security as a policy concept. The 1979 Iranian Revolution drove prices to $35/bbl. The 1986 Saudi price war contributed to Soviet collapse. The 2008 spike to $147 preceded the financial crisis. The 2020 COVID crash took WTI to -$37.63. The 2022 Ukraine invasion triggered the worst energy crisis since 1973. Today's Iran conflict may surpass them all."},
];

function getAnswer(q) {
  const lower = q.toLowerCase();
  for (const e of KB) {
    if (e.keys.some(k => lower.includes(k))) return e.ans;
  }
  return "The US-Israeli strikes on Iran on February 28 2026 have killed Supreme Leader Khamenei and triggered a Hormuz restriction — the most significant oil market event since 1973. Brent is targeting $100+ at Monday's Asian open. Goldman Sachs worst case is $130 if Hormuz stays closed. Ask me about: Hormuz risk, Goldman scenarios, OPEC emergency response, Canada's WCS role, the SPR release, Russia's position, or the history of oil price shocks.";
}

function PriceChart() {
  const [hovered, setHovered] = useState(null);
  const W=640,H=175,pL=40,pR=14,pT=24,pB=30;
  const iW=W-pL-pR, iH=H-pT-pB;
  const xS=y=>pL+((y-1970)/(2026-1970))*iW;
  const yS=p=>pT+iH-((p-0)/(150-0))*iH;
  const pts=HISTORY_PRICES.map(d=>`${xS(d.y)},${yS(d.p)}`).join(" ");
  const area=`M${xS(1970)},${yS(0)} `+HISTORY_PRICES.map(d=>`L${xS(d.y)},${yS(d.p)}`).join(" ")+` L${xS(2026)},${yS(0)} Z`;
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
        {CHART_EVENTS.map(e=>{
          const d=HISTORY_PRICES.find(h=>h.y===e.y);
          if(!d) return null;
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
      </svg>
    </div>
  );
}

function Gauge({ value, max, color }) {
  const pct=Math.min(value/max,1),r=28,cx=36,cy=36;
  const toRad=d=>d*Math.PI/180, ax=a=>cx+r*Math.cos(toRad(a)), ay=a=>cy+r*Math.sin(toRad(a));
  const sa=-210,sw=240,ea=sa+sw*pct;
  const tD=`M${ax(sa)} ${ay(sa)} A${r} ${r} 0 1 1 ${ax(sa+sw-0.01)} ${ay(sa+sw-0.01)}`;
  const fD=pct>0.01?`M${ax(sa)} ${ay(sa)} A${r} ${r} 0 ${sw*pct>180?1:0} 1 ${ax(ea)} ${ay(ea)}`:"";
  return (
    <svg width={72} height={58} viewBox="0 0 72 72">
      <path d={tD} fill="none" stroke="#e2e8f0" strokeWidth={5} strokeLinecap="round"/>
      {fD&&<path d={fD} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"/>}
      <text x={cx} y={cy+5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{value}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fontSize={7} fill="#94a3b8">API°</text>
    </svg>
  );
}

function PriceCard({ grade }) {
  const [hov,setHov]=useState(false);
  const d=PRICES[grade.id], isPos=d.change>=0;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:hov?"#f0f7ff":"#fff",border:`1.5px solid ${hov?"#0369a1":"#e2e8f0"}`,borderTop:`4px solid ${isPos?"#16a34a":"#dc2626"}`,borderRadius:4,padding:"13px 14px",transition:"all 0.2s",boxShadow:hov?"0 4px 20px rgba(3,105,161,0.12)":"0 1px 4px rgba(0,0,0,0.05)",position:"relative"}}>
      <div style={{position:"absolute",top:10,right:11,width:7,height:7,borderRadius:"50%",background:"#16a34a",animation:"livepulse 2s infinite"}}/>
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
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#94a3b8",fontFamily:"monospace",marginBottom:6}}>
        <span>H: ${d.high}</span><span>L: ${d.low}</span>
      </div>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        <Gauge value={grade.api} max={50} color="#0369a1"/>
        <div style={{fontSize:8,color:"#94a3b8",lineHeight:2,fontFamily:"monospace"}}><div>SPOT · USD/BBL</div><div>API GRAVITY</div></div>
      </div>
    </div>
  );
}

function NewsCard({ article, index, color }) {
  const [open,setOpen]=useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{background:"#fff",border:"1.5px solid #e2e8f0",borderLeft:`5px solid ${color}`,borderRadius:4,padding:"12px 14px",cursor:"pointer",transition:"all 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.background="#f8fafc"}}
      onMouseLeave={e=>{e.currentTarget.style.background="#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:8,background:color,color:"#fff",padding:"1px 7px",borderRadius:2,fontFamily:"monospace",fontWeight:700}}>{article.source}</span>
            <span style={{fontSize:8,color:"#94a3b8",fontFamily:"monospace"}}>{article.time}</span>
            {article.region&&<span style={{fontSize:8,color:"#64748b",fontFamily:"monospace"}}>📍{article.region}</span>}
          </div>
          <div style={{fontSize:13,fontWeight:700,color:"#0f172a",lineHeight:1.4,fontFamily:"Georgia,serif"}}>{article.headline}</div>
        </div>
        <div style={{color:"#cbd5e1",fontSize:12,flexShrink:0,marginTop:4}}>{open?"▲":"▼"}</div>
      </div>
      {open&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9"}}>
          <p style={{fontSize:12,color:"#475569",lineHeight:1.78,fontFamily:"Georgia,serif",margin:0}}>{article.summary}</p>
        </div>
      )}
    </div>
  );
}

function TimelineCard({ event, selected, onClick }) {
  const isNeg = event.price.startsWith("-");
  const isHigh = event.price.includes("147") || event.price.includes("130");
  const bg = isNeg?"#fef2f2":isHigh?"#fff7ed":selected?"#0f172a":"#f8fafc";
  const border = isNeg?"#fecaca":isHigh?"#fed7aa":selected?"#f97316":"#e2e8f0";
  return (
    <button onClick={onClick} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:4,padding:"8px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",minWidth:100}}>
      <div style={{fontSize:8,color:selected?"#f97316":isNeg?"#dc2626":isHigh?"#ea580c":"#64748b",fontWeight:700,fontFamily:"monospace",marginBottom:2}}>{event.year}</div>
      <div style={{fontSize:10,color:selected?"#e2e8f0":"#0f172a",fontWeight:700,fontFamily:"monospace"}}>{event.price}</div>
      <div style={{fontSize:8,color:selected?"#94a3b8":"#64748b",marginTop:2,fontFamily:"monospace"}}>{event.label}</div>
    </button>
  );
}

function HistoricalPanel({ catId }) {
  const ctx=HIST[catId];
  const [open,setOpen]=useState(false);
  if(!ctx) return null;
  return (
    <div style={{border:"1.5px solid #e2e8f0",borderRadius:4,overflow:"hidden",marginTop:14}}>
      <div onClick={()=>setOpen(!open)} style={{background:"#0f172a",padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:8,color:"#f97316",letterSpacing:"0.15em",fontWeight:700,fontFamily:"monospace"}}>📚 HISTORICAL CONTEXT</div>
          <div style={{fontSize:11,color:"#e2e8f0",fontWeight:700,marginTop:2,fontFamily:"Georgia,serif"}}>How History Shaped This Category</div>
        </div>
        <span style={{color:"#475569",fontSize:12}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{background:"#f8fafc",padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
          {ctx.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:12}}>
              <div style={{flexShrink:0,background:"#0f172a",borderRadius:3,padding:"6px 8px",display:"flex",alignItems:"center",justifyContent:"center",minWidth:44}}>
                <span style={{fontSize:8,color:"#f97316",fontWeight:700,fontFamily:"monospace",textAlign:"center"}}>{e.y}</span>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"#0f172a",marginBottom:3,fontFamily:"monospace"}}>{e.t}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.68,fontFamily:"Georgia,serif"}}>{e.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Ticker() {
  const all=[...GRADES,...GRADES,...GRADES];
  return (
    <div style={{background:"#0f172a",display:"flex",alignItems:"center",overflow:"hidden"}}>
      <div style={{background:"#dc2626",color:"#fff",padding:"7px 14px",fontSize:9,fontWeight:800,letterSpacing:"0.15em",whiteSpace:"nowrap",flexShrink:0,fontFamily:"monospace"}}>● LIVE</div>
      <div style={{overflow:"hidden",flex:1}}>
        <div style={{display:"flex",animation:"ticker 55s linear infinite",whiteSpace:"nowrap"}}>
          {all.map((g,i)=>{const d=PRICES[g.id];return(
            <span key={i} style={{display:"inline-flex",alignItems:"center",padding:"7px 18px",borderRight:"1px solid #1e293b"}}>
              <span style={{color:"#94a3b8",fontSize:9,marginRight:7,fontFamily:"monospace"}}>{g.name.toUpperCase()}</span>
              <span style={{color:"#f8fafc",fontSize:10,fontWeight:700,marginRight:5,fontFamily:"monospace"}}>${d.price.toFixed(2)}</span>
              <span style={{fontSize:9,color:d.change>=0?"#4ade80":"#f87171",fontFamily:"monospace"}}>{d.change>=0?"▲":"▼"}{Math.abs(d.change).toFixed(2)}%</span>
            </span>
          );})}
        </div>
      </div>
    </div>
  );
}

const CATS=[
  {id:"geopolitical",label:"Geopolitical",   icon:"⚔️", color:"#dc2626"},
  {id:"opec",        label:"OPEC & Supply",  icon:"🛢️", color:"#ea580c"},
  {id:"economic",    label:"Economic",        icon:"📈", color:"#0369a1"},
  {id:"climate",     label:"Climate & Policy",icon:"🌿", color:"#16a34a"},
  {id:"demand",      label:"Demand Trends",   icon:"🏭", color:"#7c3aed"},
];

export default function App() {
  const [activeCat,  setActiveCat]  = useState("geopolitical");
  const [selEvent,   setSelEvent]   = useState(null);
  const [showChart,  setShowChart]  = useState(true);
  const [chatInput,  setChatInput]  = useState("");
  const [chatMsgs,   setChatMsgs]   = useState([]);
  const [showChat,   setShowChat]   = useState(false);
  const [activeTab,  setActiveTab]  = useState("news");

  const cat=CATS.find(c=>c.id===activeCat);
  const pvals=Object.values(PRICES).map(p=>p.price);
  const avg=(pvals.reduce((a,b)=>a+b,0)/pvals.length).toFixed(2);
  const rising=Object.values(PRICES).filter(p=>p.change>0).length;
  const falling=Object.values(PRICES).filter(p=>p.change<0).length;

  const sendChat=()=>{
    if(!chatInput.trim()) return;
    const q=chatInput.trim();
    setChatInput("");
    const ans=getAnswer(q);
    setChatMsgs(prev=>[...prev,{role:"user",content:q},{role:"assistant",content:ans}]);
    setTimeout(()=>{
      const el=document.getElementById("chat-bottom");
      if(el) el.scrollIntoView({behavior:"smooth"});
    },50);
  };

  return (
    <div style={{minHeight:"100vh",background:"#f1f5f9"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap');
        @keyframes ticker    {0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes livepulse {0%,100%{box-shadow:0 0 0 2px #bbf7d0}50%{box-shadow:0 0 0 6px #86efac33}}
        @keyframes slideIn   {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp    {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink     {0%,100%{opacity:1}50%{opacity:0.15}}
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{background:"#fff",borderBottom:"3px solid #0369a1",boxShadow:"0 2px 16px rgba(0,0,0,0.07)",display:"flex",alignItems:"stretch",justifyContent:"space-between",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:13,padding:"11px 0"}}>
          <div style={{background:"#0369a1",color:"#fff",width:44,height:44,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🛢️</div>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,letterSpacing:"0.04em",color:"#0f172a",lineHeight:1}}>
              HARD <span style={{color:"#0369a1"}}>CRUDE</span> INTELLIGENCE
            </div>
            <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.2em",marginTop:2,fontFamily:"monospace"}}>GLOBAL OIL MARKETS & ENERGY INTELLIGENCE PLATFORM</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",borderLeft:"1px solid #e2e8f0"}}>
          {[
            {label:"STATUS",  val:<><div style={{width:8,height:8,borderRadius:"50%",background:"#16a34a",animation:"livepulse 2s infinite",display:"inline-block",marginRight:5}}/><span style={{color:"#16a34a",fontWeight:700,fontSize:11}}>LIVE</span></>, pad:"0 14px"},
            {label:"AVG SPOT",val:<><div style={{fontSize:17,fontWeight:800,color:"#0f172a",fontFamily:"monospace"}}>${avg}</div><div style={{fontSize:8,color:"#94a3b8",fontFamily:"monospace"}}>USD/BBL</div></>, pad:"0 14px"},
            {label:"MOVERS",  val:<div style={{display:"flex",gap:10}}><div><div style={{fontSize:14,fontWeight:800,color:"#16a34a",fontFamily:"monospace"}}>▲{rising}</div><div style={{fontSize:7,color:"#16a34a"}}>UP</div></div><div><div style={{fontSize:14,fontWeight:800,color:"#dc2626",fontFamily:"monospace"}}>▼{falling}</div><div style={{fontSize:7,color:"#dc2626"}}>DOWN</div></div></div>, pad:"0 14px"},
          ].map((s,i)=>(
            <div key={i} style={{padding:s.pad,borderRight:"1px solid #e2e8f0",textAlign:"center"}}>
              <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.12em",marginBottom:3,fontFamily:"monospace"}}>{s.label}</div>
              <div>{s.val}</div>
            </div>
          ))}
          <div style={{padding:"0 12px",display:"flex",gap:7,alignItems:"center"}}>
            <button onClick={()=>setShowChart(!showChart)} style={{background:showChart?"#0f172a":"#f8fafc",border:`1.5px solid ${showChart?"#f97316":"#e2e8f0"}`,color:showChart?"#f97316":"#64748b",padding:"6px 11px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>📈 CHART</button>
            <button onClick={()=>setShowChat(!showChat)} style={{background:showChat?"#0369a1":"#f8fafc",border:`1.5px solid ${showChat?"#0369a1":"#e2e8f0"}`,color:showChat?"#fff":"#0369a1",padding:"6px 11px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>🤖 ANALYST</button>
          </div>
        </div>
      </div>

      <Ticker/>

      <div style={{background:"#dc2626",color:"#fff",padding:"10px 24px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{background:"#fff",color:"#dc2626",fontWeight:900,fontSize:9,padding:"3px 8px",borderRadius:2,fontFamily:"monospace",letterSpacing:"0.15em",flexShrink:0,animation:"blink 1s infinite"}}>⚡ BREAKING</div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.05em",fontFamily:"monospace"}}>
          ⚡ KHAMENEI CONFIRMED DEAD · IRAN RESTRICTS HORMUZ · BRENT TARGETING $100 · DUBAI AIRPORT CLOSED · BOMBING CONTINUES THROUGH THE WEEK · MARKETS REOPEN SUNDAY ASIA
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"20px 24px"}}>
        {showChart&&<PriceChart/>}

        <div style={{background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:4,padding:"14px 16px",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:4,height:18,background:"#f97316",borderRadius:2}}/>
            <span style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:"0.15em",fontFamily:"monospace"}}>KEY PRICE EVENTS — CLICK ANY TO READ THE FULL STORY</span>
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:selEvent?14:0}}>
            {TIMELINE.map((e,i)=>(
              <TimelineCard key={i} event={e} selected={selEvent?.year===e.year} onClick={()=>setSelEvent(selEvent?.year===e.year?null:e)}/>
            ))}
          </div>
          {selEvent&&(
            <div style={{background:"#0f172a",borderRadius:4,padding:"14px 16px",animation:"fadeUp 0.2s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:9,color:"#f97316",letterSpacing:"0.15em",fontWeight:700,fontFamily:"monospace"}}>{selEvent.year} · {selEvent.price}/BBL · {selEvent.label.toUpperCase()}</div>
                  <div style={{fontSize:15,color:"#f1f5f9",fontWeight:700,marginTop:3,fontFamily:"Georgia,serif"}}>{selEvent.label}</div>
                </div>
                <button onClick={()=>setSelEvent(null)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,padding:0,lineHeight:1}}>×</button>
              </div>
              <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.82,fontFamily:"Georgia,serif",margin:0}}>{selEvent.detail}</p>
            </div>
          )}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:4,height:20,background:"#0369a1",borderRadius:2}}/>
          <span style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:"0.18em",fontFamily:"monospace"}}>BENCHMARK CRUDE — SPOT PRICES (USD / BARREL) · FEB 2026</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:11,marginBottom:22}}>
          {GRADES.map(g=><PriceCard key={g.id} grade={g}/>)}
        </div>

        {showChat&&(
          <div style={{background:"#fff",border:"1.5px solid #0369a1",borderRadius:6,marginBottom:22,overflow:"hidden",boxShadow:"0 4px 24px rgba(3,105,161,0.12)"}}>
            <div style={{background:"#0369a1",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:17}}>🤖</span>
              <div>
                <div style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:"0.1em",fontFamily:"monospace"}}>MARKET ANALYST — OIL INTELLIGENCE ENGINE</div>
                <div style={{color:"#bae6fd",fontSize:8,letterSpacing:"0.1em",fontFamily:"monospace"}}>BRENT · WTI · OPEC · IRAN · RUSSIA · CHINA · SHALE · HISTORY · FORECASTS</div>
              </div>
            </div>
            <div style={{maxHeight:300,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
              {chatMsgs.length===0&&(
                <div style={{color:"#94a3b8",fontSize:11,fontStyle:"italic",textAlign:"center",padding:"18px 0",fontFamily:"Georgia,serif"}}>
                  Ask anything: "What does Khamenei's death mean for oil?" · "Will Hormuz close?" · "Goldman's $130 scenario" · "Canada's role now"
                </div>
              )}
              {chatMsgs.map((m,i)=>(
                <div key={i} style={{padding:"10px 13px",borderRadius:4,background:m.role==="user"?"#f8fafc":"#f0f9ff",border:`1px solid ${m.role==="user"?"#e2e8f0":"#bae6fd"}`,alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"88%"}}>
                  <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.12em",marginBottom:4,fontFamily:"monospace"}}>{m.role==="user"?"YOU":"ANALYST"}</div>
                  <div style={{fontSize:12,color:"#0f172a",lineHeight:1.75,fontFamily:"Georgia,serif"}}>{m.content}</div>
                </div>
              ))}
              <div id="chat-bottom"/>
            </div>
            <div style={{padding:"11px 14px",borderTop:"1px solid #e2e8f0",display:"flex",gap:7}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about Khamenei, Hormuz, Goldman scenarios, Canada, SPR..." style={{flex:1,border:"1.5px solid #e2e8f0",borderRadius:4,padding:"8px 12px",fontSize:12,fontFamily:"monospace",outline:"none",color:"#0f172a",background:"#f8fafc"}}/>
              <button onClick={sendChat} style={{background:"#0369a1",border:"none",color:"#fff",padding:"8px 16px",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"monospace"}}>ASK</button>
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"195px 1fr",gap:18}}>
          <div>
            <div style={{fontSize:9,color:"#64748b",letterSpacing:"0.2em",fontWeight:700,marginBottom:8,fontFamily:"monospace"}}>INTELLIGENCE FEEDS</div>
            <div style={{display:"flex",gap:4,marginBottom:10}}>
              {["news","history"].map(t=>(
                <button key={t} onClick={()=>setActiveTab(t)} style={{flex:1,background:activeTab===t?"#0369a1":"#f8fafc",border:`1.5px solid ${activeTab===t?"#0369a1":"#e2e8f0"}`,color:activeTab===t?"#fff":"#64748b",padding:"6px 0",borderRadius:3,cursor:"pointer",fontSize:8,fontWeight:700,fontFamily:"monospace",letterSpacing:"0.1em"}}>
                  {t==="news"?"📰 BRIEFS":"📚 HISTORY"}
                </button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {CATS.map(c=>(
                <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{background:activeCat===c.id?c.color:"#fff",border:`1.5px solid ${activeCat===c.id?c.color:"#e2e8f0"}`,color:activeCat===c.id?"#fff":"#475569",padding:"9px 12px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace",textAlign:"left",display:"flex",alignItems:"center",gap:7,transition:"all 0.15s"}}>
                  <span style={{fontSize:13}}>{c.icon}</span>
                  <span>{c.label.toUpperCase()}</span>
                  {activeCat===c.id&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#fff",animation:"blink 1.5s infinite"}}/>}
                </button>
              ))}
            </div>
            <div style={{marginTop:14,background:"#0f172a",borderRadius:6,padding:13}}>
              <div style={{fontSize:8,color:"#334155",letterSpacing:"0.15em",fontWeight:700,marginBottom:10,fontFamily:"monospace"}}>⚙ SYSTEM STATUS</div>
              {[{l:"HORMUZ",v:"RESTRICTED",ok:false},{l:"KHAMENEI",v:"CONFIRMED DEAD",ok:false},{l:"DUBAI AIRPORT",v:"CLOSED",ok:false},{l:"IRAN REGIME",v:"COLLAPSING",ok:false},{l:"BRENT TARGET",v:"$100+",ok:false}].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,paddingBottom:7,borderBottom:"1px solid #1e293b"}}>
                  <span style={{fontSize:7,color:"#475569",letterSpacing:"0.07em",fontFamily:"monospace"}}>{s.l}</span>
                  <span style={{fontSize:7,fontWeight:700,color:s.ok?"#4ade80":"#fbbf24",display:"flex",alignItems:"center",gap:3,fontFamily:"monospace"}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:s.ok?"#4ade80":"#fbbf24",display:"inline-block"}}/>
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:4,height:18,background:cat?.color,borderRadius:2}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:"0.15em",fontFamily:"monospace"}}>
                {cat?.icon} {cat?.label.toUpperCase()} — {activeTab==="news"?"MARKET INTELLIGENCE BRIEFS":"HISTORICAL ANALYSIS"}
              </span>
            </div>
            {activeTab==="news" ? (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {(NEWS[activeCat]||[]).map((a,i)=><NewsCard key={i} article={a} index={i} color={cat?.color||"#0369a1"}/>)}
              </div>
            ) : (
              <HistoricalPanel catId={activeCat}/>
            )}
          </div>
        </div>

        <div style={{marginTop:30,paddingTop:14,borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:8,color:"#cbd5e1",letterSpacing:"0.1em",fontFamily:"monospace"}}>HARD CRUDE INTELLIGENCE © 2026 — FOR INFORMATIONAL PURPOSES ONLY. NOT FINANCIAL ADVICE.</span>
          <span style={{fontSize:8,color:"#cbd5e1",letterSpacing:"0.1em",fontFamily:"monospace"}}>AI MARKET INTELLIGENCE · 56-YEAR PRICE HISTORY · LIVE DEPLOYMENT GUIDE AVAILABLE</span>
        </div>
      </div>
    </div>
  );
}
