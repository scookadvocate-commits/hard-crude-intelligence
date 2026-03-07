import { useState } from “react”;

// ─── PRICES ──────────────────────────────────────────────────────────────────
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
{ id:“brent”,      name:“Brent Crude”,  region:“North Sea”,    flag:“🌊”, api:38.3 },
{ id:“wti”,        name:“WTI Crude”,    region:“USA”,          flag:“🇺🇸”, api:39.6 },
{ id:“wcs”,        name:“Western Canadian Select”, region:“Canada / Alberta”, flag:“🇨🇦”, api:20.5 },
{ id:“opec”,       name:“OPEC Basket”,  region:“Multi-Nation”, flag:“🛢️”, api:36.1 },
{ id:“dubai”,      name:“Dubai/Oman”,   region:“Middle East”,  flag:“🇦🇪”, api:31.0 },
{ id:“urals”,      name:“Urals Blend”,  region:“Russia”,       flag:“🇷🇺”, api:31.7 },
{ id:“bonny”,      name:“Bonny Light”,  region:“Nigeria”,      flag:“🇳🇬”, api:33.9 },
{ id:“maya”,       name:“Maya Crude”,   region:“Mexico”,       flag:“🇲🇽”, api:22.0 },
{ id:“arab_light”, name:“Arab Light”,   region:“Saudi Arabia”, flag:“🇸🇦”, api:32.8 },
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
{y:2024,p:72.0},{y:2025,p:74.2},{y:2026,p:92.9},
];

const CHART_EVENTS = [
{y:1973,l:“Embargo”},{y:1979,l:“Iran Rev.”},{y:1986,l:“Glut”},
{y:1990,l:“Gulf War”},{y:1998,l:“Asia”},{y:2008,l:”$147”},
{y:2014,l:“Shale”},{y:2020,l:“COVID”},{y:2022,l:“Ukraine”},
];

// ─── TIMELINE EVENTS ─────────────────────────────────────────────────────────
const TIMELINE = [
{ year:“1973”, price:”$3→$12”,  label:“Arab Embargo”,       cat:“geopolitical”,
detail:“OAPEC nations embargoed the US and Netherlands following the Yom Kippur War. Oil quadrupled overnight. The IEA was founded in direct response. Energy security entered the geopolitical lexicon permanently. Petrol rationing and speed limits were introduced across the West as emergency measures. The shock transferred ~$70 billion annually from consuming to producing nations and ended the era of cheap energy.” },
{ year:“1979”, price:”$13→$35”, label:“Iranian Revolution”,  cat:“geopolitical”,
detail:“The fall of the Shah removed 5.7 million bpd from global markets. When the Iran-Iraq War erupted in 1980, a further 4 million bpd was disrupted. Prices surged to $35/bbl nominal — over $120 in 2024 dollars. The crisis permanently elevated the Persian Gulf’s strategic importance, triggered the Carter Doctrine committing US military force to defend Gulf oil, and launched the era of strategic petroleum reserves as policy tools.” },
{ year:“1986”, price:”$27→$10”, label:“Saudi Price War”,     cat:“opec”,
detail:“Tired of cutting while other OPEC members cheated and non-OPEC producers grew, Saudi Arabia flooded the market. Prices crashed from $27 to $10/bbl. The economic devastation was geopolitically consequential: it halved Soviet hard currency earnings, accelerating the fiscal crisis that would end the USSR in 1991. It also bankrupted hundreds of US oil companies and delayed North Sea and Alaskan investment by a decade.” },
{ year:“1990”, price:”$17→$40”, label:“Gulf War”,            cat:“geopolitical”,
detail:“Iraq’s invasion of Kuwait instantly removed 4.3 million bpd. Prices spiked to $40/bbl — but the swift Desert Storm response and the first coordinated IEA SPR release demonstrated that political action can cap geopolitical price spikes. Prices collapsed back to pre-war levels within six months, establishing a template for crisis management that the IEA still uses today.” },
{ year:“1998”, price:”$20→$10”, label:“Asian Crisis”,        cat:“economic”,
detail:“The 1997 Asian currency crisis collapsed demand across the region just as OPEC raised output quotas. Brent fell below $10/bbl — the lowest in inflation-adjusted terms since the 1970s. The crisis forced an historic meeting between Saudi Oil Minister Ali al-Naimi and Venezuelan President Hugo Chávez, kicking off serious cartel coordination and laying the groundwork for the OPEC+ alliance that emerged 18 years later.” },
{ year:“2008”, price:”$62→$147”,label:“All-Time Peak”,       cat:“economic”,
detail:“A perfect storm: surging Chinese and Indian demand, a weak US dollar, Iraq war uncertainty, and speculative commodity investment drove Brent to $147.50/bbl in July 2008 — a record that still stands. Goldman Sachs predicted $200 oil. Six months later, the Global Financial Crisis destroyed demand and prices crashed 75% to $35 — the most violent six-month collapse in oil market history.” },
{ year:“2016”, price:”$27”,     label:“OPEC+ Born”,          cat:“opec”,
detail:“Brent touched $27/bbl in January 2016, the lowest since 2003, as US shale flooded the market. The crisis forced Saudi Arabia and Russia to set aside decades of rivalry. In December 2016, 23 nations signed the Declaration of Cooperation — creating OPEC+ and giving the cartel its most powerful instrument since the 1970s embargo. The price doubled within a year.” },
{ year:“2020”, price:”-$37”,    label:“Negative Oil”,        cat:“economic”,
detail:“COVID lockdowns destroyed 30% of global demand in weeks. On April 20 2020, WTI futures traded at -$37.63/bbl — the only time in history a major commodity went negative. With Cushing, Oklahoma physically full, producers paid buyers to take crude. The OPEC+ emergency cut of 9.7 million bpd — the largest in history — stabilised markets. Brent recovered from $16 to $50 within six months, one of the fastest recoveries ever recorded.” },
{ year:“2022”, price:”$80→$130”,label:“Ukraine War”,         cat:“geopolitical”,
detail:“Russia’s February 24 2022 invasion triggered the most severe energy crisis since 1973. Brent surged to $130/bbl as Europe scrambled to replace 4 million bpd of Russian crude and 150 bcm of pipeline gas. The crisis permanently redrew global energy trade: Europe built LNG terminals at record speed, Russia pivoted to India and China at steep discounts, and Western sanctions created a two-tier global oil market that persists today.” },
];

// ─── NEWS BY CATEGORY — DAY 2 UPDATE: MARCH 1 2026 ──────────────────────────
const NEWS = {
geopolitical:[
{ headline:“DAY 7: Trump Signals Willingness to Talk — Iran’s New Leadership Council Responds Cautiously”, summary:“US President Trump said Saturday that Iran’s new three-person leadership council has ‘indicated they want to talk’ and that he has agreed to preliminary diplomatic contact. Iranian Foreign Minister Araghchi told Reuters that Tehran is ‘open to discussions’ but will not ‘negotiate under bombs.’ The diplomatic opening has taken some heat out of oil markets — Brent pulled back slightly from its $97/bbl intraday peak on Friday. US-Iran talks scheduled through Omani intermediaries next week, according to two senior officials who spoke to Reuters anonymously. The conflict has now entered its seventh day.”, source:“Reuters / CNBC”, time:“LIVE”, region:“Washington / Tehran” },
{ headline:“Strait of Hormuz: Diplomacy Opens But Tankers Still Anchored — 150+ Ships Waiting”, summary:“Despite diplomatic signals, vessel tracking service Kpler confirmed Saturday that the Strait of Hormuz remains effectively closed to commercial traffic. Over 150 tankers are still anchored in open Gulf waters waiting for a safe transit window. The IRGC has not rescinded its warning that vessels attempting passage will be ‘set ablaze.’ Major shipping firms Maersk, CMA CGM, and Hapag-Lloyd confirmed continued Hormuz suspension. US Navy 5th Fleet confirmed it is providing military escorts for vessels attempting Cape of Good Hope rerouting.”, source:“Kpler / Reuters”, time:“2h ago”, region:“Strait of Hormuz” },
{ headline:“Israel-Iran Ceasefire Talks Begin in Cyprus — Both Sides Signal ‘Limited’ De-Escalation Possible”, summary:“Israeli and Iranian intermediaries are meeting in Cyprus for preliminary ceasefire discussions, according to three senior European officials cited by Reuters. Israel has indicated it may pause strikes on Iranian civilian infrastructure — but not military targets — as a gesture of good faith. Iran has not formally responded. The talks are being facilitated by the European Union’s foreign policy chief. Meanwhile, combat operations continued Saturday with Israeli strikes on two IRGC weapons depots outside Ahvaz and Iranian drone launches toward US bases in Bahrain, which were intercepted by US Patriot systems.”, source:“Reuters / Times of Israel”, time:“3h ago”, region:“Cyprus / Middle East” },
{ headline:“South Korea and Japan Draw Down Strategic Reserves — Asia’s 90-Day Buffer Being Tested”, summary:“South Korea’s Ministry of Trade confirmed Saturday that it has authorised withdrawal from its strategic petroleum reserves at a rate of 500,000 barrels per day — the first emergency drawdown since COVID-19. Japan’s government announced a similar release of 300,000 bpd. Both nations expressed cautious optimism about diplomatic signals but warned their strategic reserves, covering roughly 90 days of consumption, will be ‘significantly tested’ if Hormuz remains closed beyond two weeks. The IEA confirmed it is coordinating a combined member-state release of up to 120 million barrels.”, source:“Reuters / Bloomberg”, time:“4h ago”, region:“South Korea / Japan / IEA” },
{ headline:“Hezbollah Remains on Sidelines — Arab World Splits Between Official Condemnation and Street Support for Iran”, summary:“Hezbollah has not entered the conflict after seven days — analysts say its leadership is weighing the catastrophic damage Lebanon would sustain in a full-scale war against Israel. Arab governments across the region have issued official condemnations of the US-Israeli strikes while dealing with popular street demonstrations in support of Iran. Jordan intercepted 49 Iranian drones in transit toward Israel during the first three days; Jordanian officials told Al Jazeera that the government ‘acted in self-defence of Jordanian airspace.’ Saudi Arabia has so far maintained official silence.”, source:“Al Jazeera / Reuters”, time:“6h ago”, region:“Lebanon / Arab World” },
],
opec:[
{ headline:“WTI Posts Biggest Weekly Gain in Futures History — +35.63% as Hormuz Crisis Enters Week Two”, summary:“West Texas Intermediate crude posted a weekly gain of 35.63% — the largest in the history of the futures contract dating back to 1983, CNBC confirmed. Brent rose 26.82% for the week, also its biggest gain since April 2020. The surge reflects not just a geopolitical risk premium but genuine physical supply disruption — tankers unable to exit the Gulf, LNG facilities offline in Qatar, and insurance markets effectively shut. As of Saturday morning, Brent trades at $92.86/bbl and WTI at $90.90/bbl, having pulled back from intraday highs near $97 on Friday as diplomatic signals emerged.”, source:“CNBC / Reuters”, time:“LIVE”, region:“Global Markets” },
{ headline:“OPEC+ Emergency Call Scheduled for Monday — Symbolic Output Increase Still Can’t Reach Market”, summary:“OPEC+ Secretary-General Haitham Al-Ghais confirmed an emergency ministerial call for Monday to assess the supply situation and discuss policy options. Analysts immediately noted the fundamental constraint: Saudi Arabia and UAE hold virtually all OPEC+ spare capacity, and their export terminals depend on Strait of Hormuz access. The East-West pipeline through Saudi Arabia to Yanbu handles roughly 1–1.5 million bpd — covering less than 10% of normal Gulf export volumes. Any OPEC+ gesture on production is ‘the right political move but the wrong physical solution,’ as TradingNews put it.”, source:“OPEC+ / TradingNews”, time:“2h ago”, region:“Vienna / OPEC+” },
{ headline:“Saudi Arabia’s Yanbu Terminal Running at Maximum — But It’s a Fraction of Normal Exports”, summary:“Saudi Aramco confirmed Saturday that its Yanbu Red Sea terminal — connected to oil fields via the East-West pipeline — is running at absolute maximum capacity of approximately 1.5 million bpd. Saudi Arabia normally exports 6–7 million bpd, meaning Yanbu covers roughly 20% of normal volume. The remaining 80% has no viable route to market while Hormuz remains closed. Aramco said it has no timeline for resuming full export operations and is monitoring diplomatic developments. Asian refiners are paying record premiums for any non-Hormuz supply available.”, source:“Bloomberg / Aramco”, time:“3h ago”, region:“Saudi Arabia” },
{ headline:“Three Scenarios Still Hold — $80–85 De-escalation, $90–95 Prolonged, $120+ Escalation”, summary:“Oil market analysts have maintained their three-scenario framework through the first week of conflict. Base case (now 40%): Diplomatic breakthrough within 1–2 weeks, Brent settles $88–95. Optimistic case (35%): Rapid de-escalation following Monday’s diplomacy, Brent retraces toward $80–85. Worst case (25%): Escalation to Saudi/UAE infrastructure, Hormuz fully blocked indefinitely, Brent $120+. The probability distribution has shifted slightly toward the optimistic scenario following Saturday’s diplomatic signals. JPMorgan has revised its worst-case to $150/bbl if Gulf production infrastructure is directly attacked.”, source:“UBS / JPMorgan / Goldman”, time:“5h ago”, region:“Global” },
{ headline:“Cape of Good Hope Rerouting Now in Full Effect — Freight Rates Hit All-Time Records”, summary:“The oil shipping industry has now fully pivoted to Cape of Good Hope rerouting for all vessels that were previously transiting Hormuz or the Red Sea. The benchmark freight rate for Very Large Crude Carriers hit an all-time record of $423,736 per day this week — up 94% from pre-conflict levels. The Cape route adds 10–15 days and significant fuel cost to Asian deliveries. Freight brokers say they are booking vessels ‘weeks in advance at any price available.’ The rerouting means barrels that left the Gulf before the closure are still in transit — the first physical supply shortages will hit Asian refiners approximately two weeks from now.”, source:“Reuters / CNBC / LSEG”, time:“6h ago”, region:“Global Shipping” },
],
economic:[
{ headline:“Brent Pulls Back From $97 Peak — Diplomatic Signals Introduce Volatility Both Ways”, summary:“Brent crude pulled back from an intraday high near $97/bbl on Friday to settle around $92.86 Saturday morning as diplomatic signals introduced two-way volatility for the first time since the conflict began. WTI similarly retreated from $94+ to $90.90. Analysts cautioned that the diplomatic pullback is fragile — any breakdown in talks could send prices back above $95 immediately. Goldman Sachs maintained its $100 Brent call for a scenario involving two or more weeks of Hormuz restriction, while noting the de-escalation scenario points toward $80–85 within 72 hours of a ceasefire announcement.”, source:“Goldman Sachs / Reuters”, time:“1h ago”, region:“Global Markets” },
{ headline:“US Pump Prices Approach $4.50/Gallon — SPR Release Moderating but Not Stopping Surge”, summary:“US retail gasoline prices hit $4.34/gallon nationally on Friday according to GasBuddy — up from $3.14 before the conflict began one week ago. The White House’s 30-million-barrel SPR release is having a moderating effect, but GasBuddy’s Patrick De Haan warned prices could reach $4.80–5.00 without further emergency action if diplomatic talks fail. Congressional pressure for an expanded SPR release is mounting. Trump said Saturday he is ‘not concerned if gas prices go up’ — a comment that surprised markets and contradicted his previous energy price messaging.”, source:“GasBuddy / White House”, time:“2h ago”, region:“United States” },
{ headline:“European Gas Prices Pull Back From 30% Spike — QatarEnergy Assessing Restart Timeline”, summary:“European natural gas futures have retreated from their 30% spike to settle at elevated but more stable levels as QatarEnergy began assessing when its Ras Laffan and Mesaieed LNG facilities — damaged in Iranian drone attacks — can resume operations. Engineers estimate 2–4 weeks for repairs if no further attacks occur. European storage, rebuilt after the 2022 Ukraine crisis, provides a meaningful buffer. EU energy commissioner told Reuters that Europe has ‘sufficient reserves to manage a 4-week disruption’ but acknowledged a 6-week closure would be ‘significantly challenging.’”, source:“Reuters / Bloomberg”, time:“4h ago”, region:“Europe / Qatar” },
{ headline:“Canada and US Shale Identified as Primary Alternative Supply — Alberta WCS Discount Narrows to Record Low”, summary:“With Gulf barrels trapped and the world scrambling for non-Hormuz supply, Canada and US shale producers have emerged as the primary alternative. Western Canadian Select’s discount to WTI has narrowed to approximately $14/bbl — the tightest since Trans Mountain opened. Alberta oil sands operators are running at maximum sustainable production. Trans Mountain pipeline bookings are fully committed months forward. US Energy Secretary said Washington is ‘working with Canadian counterparts’ to maximise North American output. Alberta premier declared the province ‘Canada’s strategic energy answer.’”, source:“Globe and Mail / Bloomberg”, time:“5h ago”, region:“Canada / Alberta / USA” },
{ headline:“IEA Coordinates 120-Million-Barrel Emergency Reserve Release — Largest in History”, summary:“The International Energy Agency announced Saturday it is coordinating an emergency strategic reserve release of up to 120 million barrels from member nations — the largest coordinated release in the agency’s 51-year history. The previous record was the 60-million-barrel release during the 2022 Ukraine crisis. The IEA said the release is intended to ‘bridge the supply gap’ while diplomatic efforts proceed. The agency warned that if Hormuz remains closed beyond 30 days, strategic reserves would be insufficient to offset physical supply shortages reaching Asian markets.”, source:“IEA”, time:“6h ago”, region:“Global / IEA” },
],
climate:[
{ headline:“IEA: Hormuz Crisis Is Largest Supply Disruption in History — 4× Bigger Than 1973 Embargo”, summary:“The IEA’s updated emergency assessment confirmed that the current Hormuz disruption represents the single largest potential supply shock in the recorded history of oil markets. The 1973 Arab Embargo removed 4–5 million bpd. The 1979 Iranian Revolution removed 5.7 million bpd. A full Hormuz closure removes 20 million bpd — nearly four times any previous shock. IEA Executive Director Fatih Birol said the agency is in ‘continuous emergency session’ and has authorised member nations to release strategic reserves at an unprecedented combined rate.”, source:“IEA”, time:“2h ago”, region:“Global” },
{ headline:“Canada’s Strategic Moment: Trans Mountain Fully Booked, Alberta Output at Maximum”, summary:“Trans Mountain pipeline bookings have reached 100% capacity with a months-long waiting list. Alberta oil sands operators — Cenovus, CNRL, Imperial Oil, Suncor — are running at or near maximum sustainable output of approximately 3.4 million bpd. WCS is trading at its narrowest discount to WTI since Trans Mountain’s opening last year as Asian refiners pay premium prices for non-Hormuz supply. Canada’s natural resources minister said Ottawa is ‘in discussions with industry about any additional capacity measures’ to maximise exports to Asian markets during the crisis.”, source:“Globe and Mail / Bloomberg”, time:“3h ago”, region:“Canada / Alberta” },
{ headline:“Energy Crisis Accelerates Nuclear and Renewables — What Climate Policy Couldn’t Do, War Is Doing”, summary:“The Hormuz crisis is accelerating every non-oil energy source simultaneously. South Korea fast-tracked four nuclear reactor approvals on Thursday. Germany reversed its nuclear exit policy for the second time in four years, authorising restart studies for three shuttered plants. Offshore wind permitting in the UK has been streamlined via emergency powers. Solar installation orders have surged globally as industrial buyers scramble for energy diversification. The IEA called the development ‘the most consequential single-week acceleration of energy transition investment in history.’”, source:“Bloomberg / IEA / Reuters”, time:“5h ago”, region:“Global” },
{ headline:“Qatar LNG Facilities Assessing Restart — Europe’s Gas Buffer Being Tested After 30% Spike”, summary:“QatarEnergy engineers are assessing damage at the Ras Laffan and Mesaieed LNG facilities targeted in Iranian drone attacks on March 1. A senior QatarEnergy official told Reuters the facilities sustained ‘significant but repairable’ damage with an estimated restart timeline of 2–4 weeks assuming no further attacks. European natural gas prices spiked 30% at the start of the week before retreating as Europe’s rebuilt storage provided a buffer. The EU has coordinated emergency LNG purchases from US Gulf Coast terminals, which are operating at record spot premiums.”, source:“Reuters / FT”, time:“6h ago”, region:“Qatar / Europe” },
{ headline:“Civilian Casualty Reports Deepen International Pressure on Washington and Tel Aviv”, summary:“Ongoing reporting of civilian casualties in Iran — including a school strike in Minab that Iranian officials say killed 158 children — continues to generate significant international pressure. The UN Human Rights Council voted to convene an emergency session. France and Germany issued joint statements calling for an ‘immediate humanitarian ceasefire’ while stopping short of opposing the campaign outright. The casualty reports are complicating political sustainability of the strikes in Washington, where Congressional opposition is intensifying ahead of a War Powers Resolution vote scheduled for next week.”, source:“NPR / Al Jazeera / Reuters”, time:“7h ago”, region:“Iran / International” },
],
demand:[
{ headline:“Gulf Aviation Beginning to Recover — Emirates and Etihad Announce Partial Restart Plans”, summary:“Emirates and Etihad Airlines announced Saturday that they are preparing to resume limited international operations as Gulf airspace conditions improve slightly. Both carriers said initial flights will avoid Iranian airspace entirely, using longer routes over Saudi Arabia and the Red Sea. Dubai International Airport confirmed that all runways are operational but air traffic control is operating with reduced capacity. Qatar Airways has not yet announced a restart timeline as Doha’s Hamad International Airport sustained minor damage in the initial Iranian drone attacks.”, source:“IATA / Reuters”, time:“1h ago”, region:“Gulf / Aviation” },
{ headline:“China’s State Tankers Testing Hormuz — Beijing Weighing Risk of Unilateral Transit”, summary:“Two Chinese state-owned tankers operated by COSCO attempted to transit the Strait of Hormuz on Friday with their AIS transponders switched off, according to vessel tracking data from MarineTraffic. It is unclear whether either vessel successfully passed. China’s foreign ministry declined to confirm or deny the transits. Analysts say Beijing is walking a tightrope: it desperately needs the approximately 1.8 million bpd of Iranian crude it receives through shadow fleet arrangements, but does not want a maritime confrontation with US Navy forces in the strait.”, source:“MarineTraffic / Reuters”, time:“3h ago”, region:“China / Hormuz” },
{ headline:“India’s Jamnagar Refinery Has Three Weeks of Inventory — Emergency Supply Deals Being Finalised”, summary:“India’s Reliance Industries confirmed Saturday that its Jamnagar refinery complex — the world’s largest — has approximately three weeks of crude inventory at current throughput rates. Emergency supply deals with US, Canadian, Brazilian, and Norwegian exporters are being finalised. India activated emergency fuel price controls on Sunday March 1 and strategic petroleum reserve drawdown of 500,000 bpd is underway. The Indian government said it is ‘monitoring the situation hourly’ and expects supply continuity ‘well beyond’ the current diplomatic timeline.”, source:“Bloomberg / Reuters”, time:“4h ago”, region:“India” },
{ headline:“US Gasoline at $4.34 Nationally — First Signs of Demand Destruction Emerging”, summary:“US national average gasoline prices hit $4.34/gallon on Friday according to GasBuddy — the highest since June 2022 — with prices at major coastal ports reaching $4.80–5.10. Early data suggests demand destruction is beginning: GasBuddy reported that fuel purchase frequency dropped 8% week-over-week in the $4.50+ price zones. AAA said the number of Americans reporting they are ‘cutting back on driving’ has risen sharply. The demand destruction effect would moderate price pressure if sustained, but analysts say significant supply-side resolution is still needed.”, source:“GasBuddy / AAA / Reuters”, time:“5h ago”, region:“United States” },
{ headline:“South Korea Declares 9-Day LNG Supply Warning — $68 Billion Stabilisation Fund Activated”, summary:“South Korea confirmed it could exhaust LNG supplies within nine days if Hormuz remains closed and Qatar’s LNG facilities stay offline. President Lee Jae Myung announced a 100 trillion won ($68.3 billion) energy stabilisation fund — the largest emergency energy intervention in Korean history. South Korea imports approximately 20% of its gas from the region and 70% of its crude oil through the Strait of Hormuz. The Korean government said it is ‘in continuous contact with Washington, Tokyo, and IEA partners’ and is expediting permits for LNG regasification terminal expansion.”, source:“Reuters / Bloomberg”, time:“6h ago”, region:“South Korea” },
],
};
// ─── HISTORICAL CONTEXT PER CATEGORY ─────────────────────────────────────────
const HIST = {
geopolitical:[
{y:“1973”,t:“Arab Oil Embargo”,d:“OAPEC cuts supply to punish US/Netherlands support for Israel. Oil quadruples. The IEA is founded in direct response. Energy security enters the geopolitical lexicon permanently.”},
{y:“1979–80”,t:“Iranian Revolution & Iran-Iraq War”,d:“Shah’s fall removes 5.7m bpd. Ensuing war adds further disruption. The Carter Doctrine commits US military force to Gulf oil defence — defining US Middle East policy for 40+ years.”},
{y:“1990”,t:“Gulf War”,d:“Iraq invades Kuwait, removes 4.3m bpd. Swift coalition response and first SPR deployment show that coordinated political action can cap price spikes from geopolitical disruptions.”},
{y:“2011”,t:“Arab Spring & Libya Collapse”,d:“Libya’s civil war removes 1.6m bpd. Unrest across Yemen, Bahrain, Syria creates a persistent Middle East risk premium. OPEC loses a major member to chronic instability.”},
{y:“2022”,t:“Russia-Ukraine War”,d:“Largest energy shock since 1973. Europe replaces Russian pipeline gas with LNG. Russia pivots to India and China at deep discounts. Western sanctions create a permanently bifurcated global oil market.”},
],
opec:[
{y:“1960”,t:“OPEC Founded in Baghdad”,d:“Venezuela and Arab nations create OPEC to counter the Western ‘Seven Sisters’ who unilaterally set prices. The founding shifts the centre of oil power from consuming to producing nations.”},
{y:“1973”,t:“First Oil Weapon”,d:“OPEC demonstrates it can weaponise oil geopolitically — transferring ~$70 billion annually from consumers to producers and permanently altering the global economic order.”},
{y:“1986”,t:“Saudi Price War & Internal Breakdown”,d:“Tired of cutting while others cheat, Saudi Arabia floods the market. The cartel’s chronic discipline problem — still present today with Iraq and UAE overproduction — is exposed in full.”},
{y:“2016”,t:“OPEC+ Alliance Created”,d:“The shale-driven price collapse forces Saudi Arabia and Russia together. 23 nations sign the Declaration of Cooperation — the most significant restructuring of global oil governance since 1960.”},
{y:“2020”,t:“9.7 Million bpd Historic Cut”,d:“COVID forces the largest coordinated production cut in history. Saudi Arabia and Russia set aside their March 2020 price war within weeks, proving the alliance can survive extreme stress.”},
],
economic:[
{y:“1973–74”,t:“Stagflation Invented”,d:“The oil shock drives double-digit inflation while simultaneously causing recession — ‘stagflation’ — a combination economists thought impossible. It ends the postwar Keynesian economic consensus.”},
{y:“1986”,t:“Soviet Fiscal Crisis Begins”,d:“The Saudi-driven price crash halves Soviet hard currency earnings. Many historians mark this as the beginning of the fiscal crisis that ended the USSR in 1991.”},
{y:“1998”,t:”$10 Oil Forces OPEC Emergency”,d:“Asian crisis demand collapse plus OPEC quota increase drives prices below $10/bbl. Forces emergency cartel coordination — the template for modern OPEC crisis management.”},
{y:“2008”,t:”$147 Peak and 75% Crash”,d:“Oil’s parabolic rise contributed to consumer squeeze that deepened the financial crisis; its collapse reflected the severity of demand destruction. The six-month range: $147 to $35.”},
{y:“2020”,t:“Negative Oil: -$37.63/bbl”,d:“WTI May futures trade negative for the only time in history as Cushing storage fills physically. Financial market mechanics collide with physical commodity reality in an event no model predicted.”},
],
climate:[
{y:“1988”,t:“IPCC Founded”,d:“The Intergovernmental Panel on Climate Change begins the scientific consensus-building that will ultimately challenge the long-term future of fossil fuels as the world’s primary energy source.”},
{y:“1997”,t:“Kyoto Protocol”,d:“First binding international climate agreement. Oil industry dismisses it — but it begins the regulatory trajectory that now drives ESG investing, carbon pricing, and energy transition capital allocation.”},
{y:“2015”,t:“Paris Agreement”,d:“196 nations commit to limiting warming to 1.5–2°C. The IEA subsequently calculates that no new oil and gas fields should be approved after 2021 to meet this target.”},
{y:“2021”,t:“IEA Net Zero Report”,d:“The world’s energy watchdog declares peak oil demand achievable by 2030 under aggressive transition — a seismic shift from an institution that once only tracked fossil fuel supply.”},
{y:“2023”,t:“EV Price Parity in China”,d:“Electric vehicles reach price parity with combustion cars in China. Global EV sales hit 14 million. Oil demand displacement from EVs becomes statistically measurable in consumption data for the first time.”},
],
demand:[
{y:“1908”,t:“Ford Model T”,d:“Mass automobile production begins the century-long marriage of oil and transportation. Within 20 years: 23 million registered US vehicles. Within 50 years: the oil-dependent suburban civilisation.”},
{y:“1950s”,t:“The Postwar Automobile Age”,d:“Western suburbanisation, the US interstate highway system, and cheap gasoline create car-dependent civilisation. Decisions made in the 1950s about urban planning still lock in oil demand today.”},
{y:“1993”,t:“China Becomes Oil Importer”,d:“China shifts from oil exporter to net importer. Over the next 30 years it adds 10 million bpd of demand — the single greatest demand growth story in oil history, reshaping OPEC strategy globally.”},
{y:“2000s”,t:“Aviation Democratised”,d:“Low-cost carriers make air travel a mass market. Jet fuel becomes one of the fastest-growing demand categories — now 7% of global oil consumption and the hardest sector to decarbonise.”},
{y:“2020s”,t:“India’s Turn”,d:“With 1.4 billion people and rapid motorisation, India replicates China’s demand growth story — but larger. Expected to add 4 million bpd by 2040, making it the defining demand variable of the next decade.”},
],
};

// ─── ANALYST KNOWLEDGE BASE ───────────────────────────────────────────────────
const KB = [
{keys:[“brent”,“wti”,“spread”,“premium”,“difference”,“benchmark”],
ans:“The Brent-WTI spread currently sits around $3.57/bbl — within its historic normal range. Brent trades at a premium because it is a seaborne benchmark priced at the North Sea export point, freely accessible to global refiners. WTI is landlocked at Cushing, Oklahoma and subject to pipeline and storage constraints. When US crude builds at Cushing, the WTI discount widens. The spread narrowed significantly after the US lifted its crude export ban in 2015, but structural differences in quality, location, and logistics keep Brent as the world’s dominant reference price — roughly 70% of global crude is priced against Brent.”},
{keys:[“opec”,“cartel”,“quota”,“cut”,“compliance”,“saudi”,“riyadh”],
ans:“OPEC+ is managing its most delicate balancing act since 2016. Saudi Arabia is extending its voluntary 1 million bpd cut through Q3 2026 to defend prices near its $80/bbl fiscal breakeven. The core problem: Iraq and UAE chronically overproduce their quotas while US Permian, Guyana, and Brazil add non-OPEC barrels that offset every Saudi cut. OPEC+‘s effective spare capacity has shrunk to ~3.2 million bpd — the lowest since 2008. The cartel retains influence, but its structural power is considerably weaker than in the 1970s when it controlled 55% of global output.”},
{keys:[“iran”,“sanction”,“nuclear”,“tehran”,“hormuz”],
ans:“Iran exports approximately 1.5–1.8 million bpd despite US maximum-pressure sanctions, primarily to China through a shadow fleet and ship-to-ship transfers. Any escalation — military strike on nuclear facilities, Hormuz closure threat, or snapback of multilateral sanctions — would immediately impact the 21 million bpd flowing through the Strait of Hormuz daily. That is 20% of global supply with no realistic alternative route. The geopolitical risk premium Iran adds to Brent is estimated at $2–4/bbl in normal conditions, rising sharply during confrontations.”},
{keys:[“russia”,“ukraine”,“war”,“urals”,“moscow”,“volga”,“siberia”],
ans:“Russia continues exporting ~7.5 million bpd despite Western sanctions, redirecting flows to India and China at $10–13/bbl discounts to Brent — the Urals differential that now defines the sanctioned-oil market. Drone strikes on Russian refineries have disrupted domestic fuel supply more than crude exports, as export infrastructure has proven resilient. Russia’s fiscal breakeven is approximately $65/bbl; below that, war financing becomes strained. The longer the war continues, the greater the deferred maintenance risk to Russian oil infrastructure — a slow-burning supply risk the market has not fully priced.”},
{keys:[“china”,“beijing”,“demand”,“import”,“pmi”,“refinery”],
ans:“China is the swing demand variable in global oil markets. January 2026 imports hit 11.8 million bpd — the highest since 2023 — driven by stockpiling rather than pure consumption strength. Structural demand growth is real across petrochemicals, aviation, and trucking, but the property sector downturn has dampened industrial oil use. China accounted for 58% of global EV sales in 2025, meaning its gasoline demand growth is structurally decelerating even as total oil demand rises. Beijing’s policy decisions — stimulus, tariffs, strategic reserve fills — can move global prices by $3–5/bbl overnight.”},
{keys:[“canada”,“wcs”,“western canadian”,“alberta”,“oil sands”,“tar sands”,“athabasca”,“hardisty”,“pipeline”,“trans mountain”,“keystone”],
ans:“Western Canadian Select is Canada’s benchmark heavy crude, produced from Alberta’s oil sands and priced at Hardisty, Alberta. WCS typically trades at a significant discount to WTI — currently around $15/bbl — due to three structural factors: its heavy, sour quality requires specialised refinery upgrading; pipeline capacity out of Alberta is chronically constrained; and the US Midwest is the primary market, limiting price competition. The Trans Mountain Expansion pipeline, completed in 2024, opened Pacific tidewater access and has partially narrowed the WCS-WTI differential by enabling exports to Asian refiners. Canada produces approximately 5.8 million bpd of oil equivalent, making it the world’s fourth-largest producer — most of it from oil sands that are among the most carbon-intensive barrels in global supply.”},
{keys:[“shale”,“permian”,“eagle ford”,“bakken”,“tight oil”,“fracking”,“us oil”],
ans:“US tight oil has fundamentally restructured global oil markets. Permian Basin output alone reached 7.1 million bpd — more than any OPEC nation except Saudi Arabia. The key innovation was the industrialisation of drilling: operators now drill faster and cheaper with each iteration, achieving Permian breakevens of $45–55/bbl — well below Saudi Arabia’s $80/bbl fiscal breakeven. This means every OPEC+ cut is partially offset by US production growth. American shale has effectively capped oil prices at around $80–90/bbl by acting as a global swing producer — a role Saudi Arabia used to hold alone.”},
{keys:[“price”,“forecast”,“outlook”,“target”,“prediction”,“2026”],
ans:“Brent is trading at $92.86/bbl and WTI at $90.90/bbl as of March 7, 2026 — WTI’s weekly gain of +35.63% is the largest in futures history. Goldman Sachs forecasts $100 Brent if Hormuz remains closed beyond 2 weeks; JPMorgan worst-case is $150 if Gulf production infrastructure is directly attacked. The diplomatic de-escalation scenario points to $80–85 within 72 hours of a ceasefire. Three scenarios dominate analyst thinking: optimistic (35%): talks succeed, Brent $80–85; base case (40%): prolonged disruption, Brent $88–95; worst case (25%): escalation to Saudi/UAE infrastructure, Brent $120–150. Canada and US shale are the primary beneficiaries as non-Hormuz supply.”},
{keys:[“history”,“1973”,“embargo”,“1979”,“1986”,“1990”,“2008”,“2020”,“2022”,“crisis”,“shock”],
ans:“The history of oil prices is essentially the history of the modern world. The 1973 Arab Embargo quadrupled prices overnight and created energy security as a policy concept — the IEA was founded directly in response. The 1979 Iranian Revolution drove prices to $35/bbl, triggering the Carter Doctrine. The 1986 Saudi price war contributed to Soviet collapse. The 2008 spike to $147 preceded the financial crisis. The 2020 COVID crash took WTI to -$37.63 — the only time a major commodity went negative in history. The 2022 Ukraine invasion triggered the worst energy crisis since 1973. Each shock is annotated on the price chart above. Click any event in the timeline to read the full story.”},
{keys:[“red sea”,“suez”,“shipping”,“tanker”,“chokepoint”,“route”,“houthi”],
ans:“The world’s oil chokepoints are among the most strategically important geography on Earth. The Strait of Hormuz carries 21 million bpd — 20% of global supply — and is Iran’s primary geopolitical leverage point. The Red Sea/Bab-el-Mandeb corridor carries 6 million bpd and has been disrupted by Houthi drone and missile attacks since late 2023, forcing dozens of tankers to reroute around the Cape of Good Hope. The Turkish Straits carry Russian Black Sea exports. A sustained Hormuz closure would be the most severe supply shock since 1973, adding $20–40 to global oil prices within days.”},
{keys:[“india”,“mumbai”,“delhi”,“refinery”,“reliance”],
ans:“India has overtaken Japan to become the world’s third-largest oil consumer at 5.6 million bpd. Rapid motorisation, industrial expansion, and petrochemical growth are driving consumption in a nation of 1.4 billion people — most still without a car. The IEA projects India will account for one-third of all global demand growth through 2030, making it the defining demand story of the next decade. India is also a sophisticated buyer, purchasing heavily discounted Russian Urals crude since the Ukraine war began — a pragmatic energy policy that has brought it into diplomatic tension with Western partners but delivered significant economic benefit.”},
];

function getAnswer(q) {
const lower = q.toLowerCase();
for (const e of KB) {
if (e.keys.some(k => lower.includes(k))) return e.ans;
}
return “Oil markets are in the midst of the most severe supply shock in history. Brent is at $92.86/bbl (+26.82% this week) and WTI posted a record weekly gain of +35.63% to $90.90/bbl — the largest in futures history dating to 1983. The Strait of Hormuz has been effectively closed since March 2 following joint US-Israeli strikes on Iran and the killing of Supreme Leader Khamenei. Over 150 tankers remain anchored outside the strait. Diplomatic talks are beginning, introducing two-way volatility. Canada and US shale are the primary beneficiaries as the world scrambles for non-Hormuz supply. Try asking about: Brent vs WTI, OPEC, Iran, Russia, Canada/WCS, US shale, price forecasts, or historical oil shocks.”;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function PriceChart() {
const [hovered, setHovered] = useState(null);
const W=640,H=175,pL=40,pR=14,pT=24,pB=30;
const iW=W-pL-pR, iH=H-pT-pB;
const xS=y=>pL+((y-1970)/(2026-1970))*iW;
const yS=p=>pT+iH-((p-0)/(150-0))*iH;
const pts=HISTORY_PRICES.map(d=>`${xS(d.y)},${yS(d.p)}`).join(” “);
const area=`M${xS(1970)},${yS(0)} `+HISTORY_PRICES.map(d=>`L${xS(d.y)},${yS(d.p)}`).join(” “)+` L${xS(2026)},${yS(0)} Z`;

return (
<div style={{background:”#0f172a”,borderRadius:6,padding:“14px 14px 6px”,marginBottom:20}}>
<div style={{fontSize:9,color:”#f97316”,letterSpacing:“0.15em”,fontWeight:700,marginBottom:10,fontFamily:“monospace”}}>
📈 BRENT CRUDE — 56 YEAR PRICE HISTORY (USD/BBL) · KEY EVENTS ANNOTATED
</div>
<svg width=“100%” viewBox={`0 0 ${W} ${H}`} style={{display:“block”,cursor:“crosshair”}}>
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
<g key={e.y} onMouseEnter={()=>setHovered(e)} onMouseLeave={()=>setHovered(null)} style={{cursor:“pointer”}}>
<circle cx={xS(d.y)} cy={yS(d.p)} r={hovered?.y===e.y?5:3} fill={hovered?.y===e.y?”#fbbf24”:”#f97316”} stroke=”#0f172a” strokeWidth={1.5}/>
<line x1={xS(d.y)} y1={yS(d.p)-5} x2={xS(d.y)} y2={pT+2} stroke="#374151" strokeWidth={1} strokeDasharray="2,2"/>
<text x={xS(d.y)} y={pT-2} textAnchor=“middle” fontSize={6} fill={hovered?.y===e.y?”#fbbf24”:”#6b7280”} fontFamily=“monospace”>{e.l}</text>
</g>
);
})}
{[1975,1985,1995,2005,2015,2026].map(y=>(
<text key={y} x={xS(y)} y={H-4} textAnchor="middle" fontSize={7} fill="#334155" fontFamily="monospace">{y}</text>
))}
{hovered && (()=>{
const d=HISTORY_PRICES.find(h=>h.y===hovered.y);
if(!d) return null;
const tx=Math.min(Math.max(xS(d.y)-50,pL),W-pR-110);
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

function Gauge({ value, max, color }) {
const pct=Math.min(value/max,1),r=28,cx=36,cy=36;
const toRad=d=>d*Math.PI/180, ax=a=>cx+r*Math.cos(toRad(a)), ay=a=>cy+r*Math.sin(toRad(a));
const sa=-210,sw=240,ea=sa+sw*pct;
const tD=`M${ax(sa)} ${ay(sa)} A${r} ${r} 0 1 1 ${ax(sa+sw-0.01)} ${ay(sa+sw-0.01)}`;
const fD=pct>0.01?`M${ax(sa)} ${ay(sa)} A${r} ${r} 0 ${sw*pct>180?1:0} 1 ${ax(ea)} ${ay(ea)}`:””;
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
<div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:hov?”#f0f7ff”:”#fff”,border:`1.5px solid ${hov?"#0369a1":"#e2e8f0"}`,borderTop:`4px solid ${isPos?"#16a34a":"#dc2626"}`,borderRadius:4,padding:“13px 14px”,transition:“all 0.2s”,boxShadow:hov?“0 4px 20px rgba(3,105,161,0.12)”:“0 1px 4px rgba(0,0,0,0.05)”,position:“relative”}}>
<div style={{position:“absolute”,top:10,right:11,width:7,height:7,borderRadius:“50%”,background:”#16a34a”,animation:“livepulse 2s infinite”}}/>
<div style={{display:“flex”,alignItems:“center”,gap:6,marginBottom:7}}>
<span style={{fontSize:14}}>{grade.flag}</span>
<div>
<div style={{fontSize:8,color:”#94a3b8”,letterSpacing:“0.1em”,textTransform:“uppercase”,fontFamily:“monospace”}}>{grade.region}</div>
<div style={{fontSize:11,fontWeight:700,color:”#0f172a”,fontFamily:“monospace”}}>{grade.name}</div>
</div>
</div>
<div style={{display:“flex”,alignItems:“baseline”,gap:7,marginBottom:4}}>
<span style={{fontSize:21,fontWeight:800,color:”#0f172a”,fontFamily:“monospace”}}>${d.price.toFixed(2)}</span>
<span style={{fontSize:10,fontWeight:700,color:isPos?”#16a34a”:”#dc2626”,background:isPos?”#f0fdf4”:”#fef2f2”,padding:“1px 5px”,borderRadius:2}}>{isPos?“▲”:“▼”} {Math.abs(d.change).toFixed(2)}%</span>
</div>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:8,color:”#94a3b8”,fontFamily:“monospace”,marginBottom:6}}>
<span>H: ${d.high}</span><span>L: ${d.low}</span>
</div>
<div style={{display:“flex”,gap:5,alignItems:“center”}}>
<Gauge value={grade.api} max={50} color="#0369a1"/>
<div style={{fontSize:8,color:”#94a3b8”,lineHeight:2,fontFamily:“monospace”}}><div>SPOT · USD/BBL</div><div>API GRAVITY</div></div>
</div>
</div>
);
}

function NewsCard({ article, index, color }) {
const [open,setOpen]=useState(false);
return (
<div onClick={()=>setOpen(!open)} style={{background:”#fff”,border:“1.5px solid #e2e8f0”,borderLeft:`5px solid ${color}`,borderRadius:4,padding:“12px 14px”,cursor:“pointer”,transition:“all 0.15s”,animation:`slideIn 0.3s ease ${Math.min(index,5)*0.06}s both`}}
onMouseEnter={e=>{e.currentTarget.style.background=”#f8fafc”;e.currentTarget.style.boxShadow=“0 3px 12px rgba(0,0,0,0.08)”}}
onMouseLeave={e=>{e.currentTarget.style.background=”#fff”;e.currentTarget.style.boxShadow=“none”}}>
<div style={{display:“flex”,justifyContent:“space-between”,gap:12}}>
<div style={{flex:1}}>
<div style={{display:“flex”,gap:7,alignItems:“center”,marginBottom:4}}>
<span style={{fontSize:8,background:color,color:”#fff”,padding:“1px 7px”,borderRadius:2,fontFamily:“monospace”,fontWeight:700,letterSpacing:“0.08em”,flexShrink:0}}>{article.source}</span>
<span style={{fontSize:8,color:”#94a3b8”,fontFamily:“monospace”}}>{article.time}</span>
{article.region&&<span style={{fontSize:8,color:”#64748b”,fontFamily:“monospace”}}>📍{article.region}</span>}
</div>
<div style={{fontSize:13,fontWeight:700,color:”#0f172a”,lineHeight:1.4,fontFamily:“Georgia,serif”}}>{article.headline}</div>
</div>
<div style={{color:”#cbd5e1”,fontSize:12,flexShrink:0,marginTop:4}}>{open?“▲”:“▼”}</div>
</div>
{open&&(
<div style={{marginTop:10,paddingTop:10,borderTop:“1px solid #f1f5f9”}}>
<p style={{fontSize:12,color:”#475569”,lineHeight:1.78,fontFamily:“Georgia,serif”,margin:0}}>{article.summary}</p>
</div>
)}
</div>
);
}

function TimelineCard({ event, selected, onClick }) {
const isNeg = event.price.startsWith(”-”);
const isHigh = parseFloat(event.price.replace(”$”,””).replace(“→”,””)) > 100 || event.price.includes(“147”);
const bg = isNeg?”#fef2f2”:isHigh?”#fff7ed”:selected?”#0f172a”:”#f8fafc”;
const border = isNeg?”#fecaca”:isHigh?”#fed7aa”:selected?”#f97316”:”#e2e8f0”;
return (
<button onClick={onClick} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:4,padding:“8px 12px”,cursor:“pointer”,textAlign:“left”,transition:“all 0.15s”,minWidth:100}}>
<div style={{fontSize:8,color:selected?”#f97316”:isNeg?”#dc2626”:isHigh?”#ea580c”:”#64748b”,fontWeight:700,fontFamily:“monospace”,marginBottom:2}}>{event.year}</div>
<div style={{fontSize:10,color:selected?”#e2e8f0”:”#0f172a”,fontWeight:700,fontFamily:“monospace”}}>{event.price}</div>
<div style={{fontSize:8,color:selected?”#94a3b8”:”#64748b”,marginTop:2,fontFamily:“monospace”}}>{event.label}</div>
</button>
);
}

function HistoricalPanel({ catId }) {
const ctx=HIST[catId];
const [open,setOpen]=useState(false);
if(!ctx) return null;
return (
<div style={{border:“1.5px solid #e2e8f0”,borderRadius:4,overflow:“hidden”,marginTop:14}}>
<div onClick={()=>setOpen(!open)} style={{background:”#0f172a”,padding:“10px 14px”,cursor:“pointer”,display:“flex”,justifyContent:“space-between”,alignItems:“center”,transition:“background 0.15s”}}
onMouseEnter={e=>e.currentTarget.style.background=”#1e293b”}
onMouseLeave={e=>e.currentTarget.style.background=”#0f172a”}>
<div>
<div style={{fontSize:8,color:”#f97316”,letterSpacing:“0.15em”,fontWeight:700,fontFamily:“monospace”}}>📚 HISTORICAL CONTEXT</div>
<div style={{fontSize:11,color:”#e2e8f0”,fontWeight:700,marginTop:2,fontFamily:“Georgia,serif”}}>How History Shaped This Category</div>
</div>
<span style={{color:”#475569”,fontSize:12}}>{open?“▲”:“▼”}</span>
</div>
{open&&(
<div style={{background:”#f8fafc”,padding:“14px 16px”,display:“flex”,flexDirection:“column”,gap:12}}>
{ctx.map((e,i)=>(
<div key={i} style={{display:“flex”,gap:12,animation:`slideIn 0.3s ease ${i*0.05}s both`}}>
<div style={{flexShrink:0,background:”#0f172a”,borderRadius:3,padding:“6px 8px”,display:“flex”,alignItems:“center”,justifyContent:“center”,minWidth:44}}>
<span style={{fontSize:8,color:”#f97316”,fontWeight:700,fontFamily:“monospace”,textAlign:“center”}}>{e.y}</span>
</div>
<div>
<div style={{fontSize:11,fontWeight:700,color:”#0f172a”,marginBottom:3,fontFamily:“monospace”}}>{e.t}</div>
<div style={{fontSize:11,color:”#64748b”,lineHeight:1.68,fontFamily:“Georgia,serif”}}>{e.d}</div>
</div>
</div>
))}
</div>
)}
</div>
);
}

function Ticker() {
const all=[…GRADES,…GRADES,…GRADES];
return (
<div style={{background:”#0f172a”,display:“flex”,alignItems:“center”,overflow:“hidden”}}>
<div style={{background:”#dc2626”,color:”#fff”,padding:“7px 14px”,fontSize:9,fontWeight:800,letterSpacing:“0.15em”,whiteSpace:“nowrap”,flexShrink:0,fontFamily:“monospace”}}>● LIVE</div>
<div style={{overflow:“hidden”,flex:1}}>
<div style={{display:“flex”,animation:“ticker 55s linear infinite”,whiteSpace:“nowrap”}}>
{all.map((g,i)=>{const d=PRICES[g.id];return(
<span key={i} style={{display:“inline-flex”,alignItems:“center”,padding:“7px 18px”,borderRight:“1px solid #1e293b”}}>
<span style={{color:”#94a3b8”,fontSize:9,marginRight:7,fontFamily:“monospace”}}>{g.name.toUpperCase()}</span>
<span style={{color:”#f8fafc”,fontSize:10,fontWeight:700,marginRight:5,fontFamily:“monospace”}}>${d.price.toFixed(2)}</span>
<span style={{fontSize:9,color:d.change>=0?”#4ade80”:”#f87171”,fontFamily:“monospace”}}>{d.change>=0?“▲”:“▼”}{Math.abs(d.change).toFixed(2)}%</span>
</span>
);})}
</div>
</div>
</div>
);
}

const CATS=[
{id:“geopolitical”,label:“Geopolitical”,   icon:“⚔️”, color:”#dc2626”},
{id:“opec”,        label:“OPEC & Supply”,  icon:“🛢️”, color:”#ea580c”},
{id:“economic”,    label:“Economic”,        icon:“📈”, color:”#0369a1”},
{id:“climate”,     label:“Climate & Policy”,icon:“🌿”, color:”#16a34a”},
{id:“demand”,      label:“Demand Trends”,   icon:“🏭”, color:”#7c3aed”},
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
const [activeCat,  setActiveCat]  = useState(“geopolitical”);
const [selEvent,   setSelEvent]   = useState(null);
const [showChart,  setShowChart]  = useState(true);
const [chatInput,  setChatInput]  = useState(””);
const [chatMsgs,   setChatMsgs]   = useState([]);
const [showChat,   setShowChat]   = useState(false);
const [activeTab,  setActiveTab]  = useState(“news”); // “news” | “history”

const cat=CATS.find(c=>c.id===activeCat);
const pvals=Object.values(PRICES).map(p=>p.price);
const avg=(pvals.reduce((a,b)=>a+b,0)/pvals.length).toFixed(2);
const rising=Object.values(PRICES).filter(p=>p.change>0).length;
const falling=Object.values(PRICES).filter(p=>p.change<0).length;

const sendChat=()=>{
if(!chatInput.trim()) return;
const q=chatInput.trim();
setChatInput(””);
const ans=getAnswer(q);
setChatMsgs(prev=>[…prev,{role:“user”,content:q},{role:“assistant”,content:ans}]);
setTimeout(()=>{
const el=document.getElementById(“chat-bottom”);
if(el) el.scrollIntoView({behavior:“smooth”});
},50);
};

return (
<div style={{minHeight:“100vh”,background:”#f1f5f9”}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap'); @keyframes ticker    {0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}} @keyframes livepulse {0%,100%{box-shadow:0 0 0 2px #bbf7d0}50%{box-shadow:0 0 0 6px #86efac33}} @keyframes slideIn   {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}} @keyframes fadeUp    {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes blink     {0%,100%{opacity:1}50%{opacity:0.15}} @keyframes spin      {to{transform:rotate(360deg)}} *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px} .hci-header{display:flex;align-items:stretch;justify-content:space-between;padding:0 16px} .hci-header-stats{display:flex;align-items:center;border-left:1px solid #e2e8f0} .hci-main{max-width:1400px;margin:0 auto;padding:16px} .hci-news-grid{display:grid;grid-template-columns:195px 1fr;gap:18px} .hci-price-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:11px;margin-bottom:22px} @media(max-width:768px){ .hci-header{flex-direction:column;padding:0 12px} .hci-header-stats{border-left:none;border-top:1px solid #e2e8f0;overflow-x:auto;width:100%} .hci-logo-text{font-size:20px!important} .hci-main{padding:10px} .hci-news-grid{grid-template-columns:1fr!important} .hci-price-grid{grid-template-columns:repeat(2,1fr)!important;gap:8px} .hci-breaking{padding:8px 12px!important;font-size:10px!important} .hci-cats{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;gap:6px!important} .hci-cats button{flex:1!important;min-width:calc(50% - 3px)!important} } @media(max-width:400px){ .hci-price-grid{grid-template-columns:1fr!important} }`}</style>

```
  {/* ── HEADER ── */}
  <div className="hci-header" style={{background:"#fff",borderBottom:"3px solid #0369a1",boxShadow:"0 2px 16px rgba(0,0,0,0.07)"}}>
    <div style={{display:"flex",alignItems:"center",gap:13,padding:"11px 0"}}>
      <div style={{background:"#0369a1",color:"#fff",width:44,height:44,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 2px 8px rgba(3,105,161,0.35)"}}>🛢️</div>
      <div>
        <div className="hci-logo-text" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,letterSpacing:"0.04em",color:"#0f172a",lineHeight:1}}>
          HARD <span style={{color:"#0369a1"}}>CRUDE</span> INTELLIGENCE
        </div>
        <div style={{fontSize:8,color:"#94a3b8",letterSpacing:"0.2em",marginTop:2,fontFamily:"monospace"}}>GLOBAL OIL MARKETS & ENERGY INTELLIGENCE PLATFORM</div>
      </div>
    </div>
    <div className="hci-header-stats">
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

  {/* BREAKING NEWS BANNER */}
  <div style={{background:"#dc2626",color:"#fff",padding:"10px 24px",display:"flex",alignItems:"center",gap:12}}>
    <div style={{background:"#fff",color:"#dc2626",fontWeight:900,fontSize:9,padding:"3px 8px",borderRadius:2,fontFamily:"monospace",letterSpacing:"0.15em",flexShrink:0,animation:"blink 1s infinite"}}>⚡ BREAKING</div>
    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.05em",fontFamily:"monospace"}}>
      ⚡ DAY 7: BRENT +27% THIS WEEK · WTI POSTS BIGGEST WEEKLY GAIN IN FUTURES HISTORY · 150+ TANKERS STILL ANCHORED · US-IRAN DIPLOMACY BEGINS · TRUMP SIGNALS TALKS · SOUTH KOREA ENERGY EMERGENCY
    </div>
  </div>

  <div className="hci-main">

    {/* Price chart */}
    {showChart&&<PriceChart/>}

    {/* Timeline */}
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
              <div style={{fontSize:9,color:"#f97316",letterSpacing:"0.15em",fontWeight:700,fontFamily:"monospace"}}>{selEvent.year} · APPROX. {selEvent.price}/BBL · {selEvent.label.toUpperCase()}</div>
              <div style={{fontSize:15,color:"#f1f5f9",fontWeight:700,marginTop:3,fontFamily:"Georgia,serif"}}>{selEvent.label}</div>
            </div>
            <button onClick={()=>setSelEvent(null)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,padding:0,lineHeight:1}}>×</button>
          </div>
          <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.82,fontFamily:"Georgia,serif",margin:0}}>{selEvent.detail}</p>
        </div>
      )}
    </div>

    {/* Price grid label */}
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div style={{width:4,height:20,background:"#0369a1",borderRadius:2}}/>
      <span style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:"0.18em",fontFamily:"monospace"}}>BENCHMARK CRUDE — SPOT PRICES (USD / BARREL) · MAR 7, 2026</span>
    </div>
    <div className="hci-price-grid" style={{animation:"fadeUp 0.4s ease"}}>
      {GRADES.map(g=><PriceCard key={g.id} grade={g}/>)}
    </div>

    {/* Analyst chat */}
    {showChat&&(
      <div style={{background:"#fff",border:"1.5px solid #0369a1",borderRadius:6,marginBottom:22,overflow:"hidden",boxShadow:"0 4px 24px rgba(3,105,161,0.12)",animation:"fadeUp 0.25s ease"}}>
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
              Ask anything: "Why is Brent at a premium to WTI?" · "Explain OPEC compliance" · "What does Iran's situation mean for prices?" · "Tell me about the 1973 embargo"
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
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about oil prices, geopolitics, OPEC, history..." style={{flex:1,border:"1.5px solid #e2e8f0",borderRadius:4,padding:"8px 12px",fontSize:12,fontFamily:"monospace",outline:"none",color:"#0f172a",background:"#f8fafc"}}/>
          <button onClick={sendChat} style={{background:"#0369a1",border:"none",color:"#fff",padding:"8px 16px",borderRadius:4,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"monospace"}}>ASK</button>
        </div>
      </div>
    )}

    {/* News + historical */}
    <div className="hci-news-grid">
      <div>
        <div style={{fontSize:9,color:"#64748b",letterSpacing:"0.2em",fontWeight:700,marginBottom:8,fontFamily:"monospace"}}>INTELLIGENCE FEEDS</div>
        <div style={{display:"flex",gap:4,marginBottom:10}}>
          {["news","history"].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{flex:1,background:activeTab===t?"#0369a1":"#f8fafc",border:`1.5px solid ${activeTab===t?"#0369a1":"#e2e8f0"}`,color:activeTab===t?"#fff":"#64748b",padding:"6px 0",borderRadius:3,cursor:"pointer",fontSize:8,fontWeight:700,fontFamily:"monospace",letterSpacing:"0.1em"}}>
              {t==="news"?"📰 BRIEFS":"📚 HISTORY"}
            </button>
          ))}
        </div>
        <div className="hci-cats" style={{display:"flex",flexDirection:"column",gap:5}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{background:activeCat===c.id?c.color:"#fff",border:`1.5px solid ${activeCat===c.id?c.color:"#e2e8f0"}`,color:activeCat===c.id?"#fff":"#475569",padding:"9px 12px",borderRadius:4,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"monospace",textAlign:"left",display:"flex",alignItems:"center",gap:7,transition:"all 0.15s",boxShadow:activeCat===c.id?`0 2px 10px ${c.color}44`:"none"}}>
              <span style={{fontSize:13}}>{c.icon}</span>
              <span>{c.label.toUpperCase()}</span>
              {activeCat===c.id&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#fff",animation:"blink 1.5s infinite"}}/>}
            </button>
          ))}
        </div>
        <div style={{marginTop:14,background:"#0f172a",borderRadius:6,padding:13}}>
          <div style={{fontSize:8,color:"#334155",letterSpacing:"0.15em",fontWeight:700,marginBottom:10,fontFamily:"monospace"}}>⚙ SYSTEM STATUS</div>
          {[{l:"HORMUZ",v:"EFFECTIVELY CLOSED",ok:false},{l:"BRENT WK GAIN",v:"+26.82% · $92.86",ok:false},{l:"WTI WK GAIN",v:"+35.63% RECORD",ok:false},{l:"DIPLOMACY",v:"TALKS BEGINNING",ok:false},{l:"TANKERS HALTED",v:"150+ ANCHORED",ok:false}].map((s,i)=>(
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
          <span style={{marginLeft:"auto",fontSize:8,color:"#94a3b8",fontFamily:"monospace"}}>
            {activeTab==="news"?"5 BRIEFS · MAR 7, 2026":"CLICK EVENTS TO EXPAND"}
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
```

);
}