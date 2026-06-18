export interface EconomicIndicator {
  id: string;
  label: string;
  value: string;
  raw: number;          // normalised 0–100 for bar rendering
  trend: "up" | "down" | "stable";
  explanation: string;  // shown when indicator is clicked
}

export interface CityEconomics {
  country: string;
  population: string;
  regionNote: string;
  indicators: EconomicIndicator[];
}

// All values are approximate real figures (2023–2024 sources).
export const CITY_ECONOMICS: Record<string, CityEconomics> = {
  Paris: {
    country: "France",
    population: "2.1M (city) · 12M (metro)",
    regionNote: "Île-de-France — largest economic zone in continental Europe",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$54 200",
        raw: 72,
        trend: "stable",
        explanation:
          "Gross Domestic Product per person, adjusted for purchasing power parity. Paris is among the wealthiest cities in the EU, driven by finance, luxury goods, tourism, and aerospace. The figure is above France's national average due to the concentration of high-value industries in Île-de-France.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "7.4%",
        raw: 56,
        trend: "down",
        explanation:
          "Share of the active labour force currently without work. Paris sits above Germany or Austria but below southern Europe. Youth unemployment (~17%) remains a structural issue despite strong demand in tech and professional services.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "4.9%",
        raw: 42,
        trend: "down",
        explanation:
          "Consumer Price Index change year-on-year. France's relatively regulated energy market dampened inflation compared to neighbours. The ECB's rate hikes since 2022 are gradually bringing it toward the 2% target.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$2 850",
        raw: 68,
        trend: "up",
        explanation:
          "Average take-home pay after income tax and social contributions. Paris wages are 20–30% above the French national median, reflecting the premium on skilled knowledge workers. High housing costs (~€1 400/mo for a one-bedroom) offset the advantage for many workers.",
      },
      {
        id: "special",
        label: "Tourism receipts",
        value: "€21.4B / yr",
        raw: 91,
        trend: "up",
        explanation:
          "Annual revenue from international tourists, the highest of any city in the world. Paris receives ~38 million foreign visitors annually. Tourism accounts for roughly 7% of regional GDP and is a major employer in hospitality and retail.",
      },
    ],
  },

  Strassburg: {
    country: "France (Alsace)",
    population: "285 000 (city) · 800 000 (metro)",
    regionNote: "Seat of the European Parliament and European Court of Human Rights",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$42 100",
        raw: 56,
        trend: "stable",
        explanation:
          "Strasbourg's economy is bolstered by EU institutions, which employ ~10 000 people directly and sustain thousands more in services. Manufacturing (pharma, automotive parts) and cross-border trade with Germany are the other pillars.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "9.8%",
        raw: 42,
        trend: "stable",
        explanation:
          "Higher than the national average, partly due to a large student population (60 000+ students) and the mismatch between skilled EU-institution jobs and local vocational workers. Cross-border commuting to Germany (90 000 workers daily) provides a pressure valve.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "4.9%",
        raw: 42,
        trend: "down",
        explanation:
          "Same national figure as Paris — France uses a unified monetary and fiscal framework. The Rhine border means Alsatians frequently shop in Germany where some goods are cheaper, creating informal arbitrage that dampens local price pressure.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$2 310",
        raw: 52,
        trend: "up",
        explanation:
          "Below Paris but above most French provincial cities. EU civil servants in Strasbourg earn significantly more and skew the average upward. Industrial and service workers in the broader metro earn €1 600–2 000/month net.",
      },
      {
        id: "special",
        label: "Cross-border workers",
        value: "90 000 / day",
        raw: 78,
        trend: "up",
        explanation:
          "The number of workers who cross the Rhine into Germany daily for employment — one of the highest cross-border labour flows in Europe. This reflects a deep labour-market integration between Alsace and Baden-Württemberg, driven by higher German wages and lower French housing costs.",
      },
    ],
  },

  Stuttgart: {
    country: "Germany (Baden-Württemberg)",
    population: "635 000 (city) · 2.8M (metro)",
    regionNote: "Cradle of the automobile — birthplace of Daimler, Bosch, and Porsche",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$71 400",
        raw: 95,
        trend: "down",
        explanation:
          "One of the highest GDPs per capita of any European metro area. Baden-Württemberg generates ~€540B in annual GDP. The figure is under pressure as the automotive industry navigates the electric-vehicle transition — legacy combustion engine expertise is rapidly devaluing.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "3.8%",
        raw: 82,
        trend: "up",
        explanation:
          "Near full employment, though rising from historic lows. VW and Mercedes job-cut announcements in 2024 are adding supply-side pressure. The skilled-worker shortage (Fachkräftemangel) paradoxically keeps unemployment low even as some large firms restructure.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "5.1%",
        raw: 41,
        trend: "down",
        explanation:
          "Germany's inflation was driven by energy dependency on Russia pre-2022 and supply chain disruptions. Stuttgart's industrial base was hit hard by input cost spikes. The Bundesbank's alignment with ECB tightening has helped cool it from the 2022 peak of 8.8%.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$3 640",
        raw: 88,
        trend: "stable",
        explanation:
          "Among the highest in Germany. Automotive engineers at Porsche or Bosch earn €4 000–6 000/month net. IG Metall collective bargaining agreements ensure relatively compressed wage distribution — shop-floor workers receive around €2 600/month net.",
      },
      {
        id: "special",
        label: "Auto export value / capita",
        value: "$18 200",
        raw: 99,
        trend: "down",
        explanation:
          "Stuttgart's per-capita automobile export value is the highest of any city in the world. The region exports approximately €50B in vehicles and parts annually. This extreme specialisation is now a vulnerability as global EV adoption accelerates and Asian competitors close the gap.",
      },
    ],
  },

  Vienna: {
    country: "Austria",
    population: "1.93M (city) · 2.6M (metro)",
    regionNote: "Gateway between Western and Central-Eastern Europe",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$57 800",
        raw: 77,
        trend: "stable",
        explanation:
          "Austria's economy is highly internationalised — Vienna's banks and law firms serve as intermediaries for Central and Eastern European business. Manufacturing (machinery, electronics) and a large public sector provide stability. Growth is modest at ~1.5% per year.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "4.8%",
        raw: 72,
        trend: "up",
        explanation:
          "Relatively low but rising. Austria's dual vocational training system (apprenticeships) historically kept youth unemployment in check. Immigration from Eastern Europe has increased labour supply, particularly in construction, hospitality, and healthcare.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "8.0%",
        raw: 28,
        trend: "down",
        explanation:
          "Unusually high for a developed economy — Austria's inflation has been persistently above the Eurozone average due to energy price pass-through and a landlord-friendly rental indexation system that built CPI rises into rent automatically. ECB rate hikes are slowing it.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$2 780",
        raw: 66,
        trend: "up",
        explanation:
          "Austrian wages are mid-range in Western Europe. Recent collective bargaining rounds saw 8–9% increases to offset inflation. Vienna wages are ~15% above the Austrian national average. High marginal income taxes (up to 55%) compress net-of-tax take-home significantly.",
      },
      {
        id: "special",
        label: "Quality of Life Index (OECD)",
        value: "7.5 / 10",
        raw: 75,
        trend: "stable",
        explanation:
          "Vienna consistently ranks #1 in the Economist Intelligence Unit's Global Liveability Index. The OECD Better Life Index score of 7.5 reflects excellent public transit, healthcare, green space, and safety. This makes it one of the most expensive cities to recruit skilled workers away from.",
      },
    ],
  },

  Budapest: {
    country: "Hungary",
    population: "1.76M (city) · 3.3M (metro)",
    regionNote: "Largest economy in Central-Eastern Europe outside Warsaw",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$35 200",
        raw: 47,
        trend: "down",
        explanation:
          "Hungary has converged rapidly with Western Europe since EU accession in 2004, but convergence has stalled. Budapest accounts for ~40% of Hungarian GDP while holding 18% of the population. FDI-driven manufacturing (Samsung, Audi, Mercedes plants) is the growth engine, with weak domestic demand.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "4.1%",
        raw: 78,
        trend: "up",
        explanation:
          "Very low — Hungary has near-full employment. However, this masks significant outmigration: approximately 600 000 Hungarians work abroad, primarily in Germany, Austria, and the UK. The domestic labour shortage is driving up wages but also constraining industrial expansion.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "15.2%",
        raw: 12,
        trend: "down",
        explanation:
          "Hungary had the highest inflation in the EU in 2023 — driven by energy import costs, the weak forint (HUF), and expansionary pre-election fiscal policy in 2022. The National Bank of Hungary hiked rates to 13% to combat it. The forint lost ~30% of its value against the EUR between 2020–2023.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$1 140",
        raw: 27,
        trend: "up",
        explanation:
          "Wages are rising fast in nominal terms (15–20%/year) but real wage growth is negative when inflation is factored in. Budapest wages are roughly double the Hungarian national average. The gap with Vienna (1 hour away) remains a major driver of westward emigration.",
      },
      {
        id: "special",
        label: "FDI stock",
        value: "$93B",
        raw: 62,
        trend: "stable",
        explanation:
          "Hungary has attracted outsized Foreign Direct Investment relative to its size — among the highest FDI/GDP ratios in the EU. Low corporate taxes (9%, lowest in Europe), flexible labour law, and central location are key attractions. However, rule-of-law concerns have caused some investors to shift focus to Poland or Romania.",
      },
    ],
  },

  Bucharest: {
    country: "Romania",
    population: "1.83M (city) · 2.4M (metro)",
    regionNote: "Fastest-growing tech hub in South-Eastern Europe",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$32 000",
        raw: 43,
        trend: "up",
        explanation:
          "Romania has grown consistently at 3–5% per year since EU accession in 2007. Bucharest leads this growth, housing the country's financial sector, IT industry, and retail. Romania is still one of the poorest EU members by per-capita income but the gap is closing faster than most peers.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "5.6%",
        raw: 65,
        trend: "stable",
        explanation:
          "Moderate, but masks severe structural issues: Romania has one of the EU's largest undeclared labour sectors (~25% of employment) and ~3.5 million citizens work abroad. Official unemployment statistics capture only formal employment and likely understate true labour market stress.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "9.4%",
        raw: 22,
        trend: "down",
        explanation:
          "Romania's inflation was driven by energy price shocks, a large fiscal deficit, and food price increases. The National Bank of Romania raised the policy rate to 7% in response. Unlike Hungary, Romania's currency (RON) has been relatively stable against the EUR, limiting import inflation.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$1 200",
        raw: 29,
        trend: "up",
        explanation:
          "Rapidly rising — Romanian IT workers in Bucharest often earn €2 000–4 000/month net, comparable to Western Europe. This has created a bifurcated economy: a knowledge-economy elite and a large lower-wage service and agricultural sector. Minimum wage doubled between 2017 and 2023.",
      },
      {
        id: "special",
        label: "IT sector growth (YoY)",
        value: "+18%",
        raw: 84,
        trend: "up",
        explanation:
          "Romania's IT and software sector is one of the fastest-growing in Europe, driven by a large pipeline of engineering graduates, competitive wages vs Western Europe, and a favourable 0% income tax for IT workers (a law still in effect as of 2024). Bucharest hosts regional offices of UiPath, Bitdefender, and many Western tech firms.",
      },
    ],
  },

  Sinaia: {
    country: "Romania (Prahova County)",
    population: "11 000 (town)",
    regionNote: "Royal mountain resort at 800–2000m; 'Pearl of the Carpathians'",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$19 200",
        raw: 26,
        trend: "up",
        explanation:
          "Far below Bucharest but above Romania's rural average. Sinaia's economy is almost entirely tourism-driven — ski season (Dec–Mar) and summer hiking (Jun–Sep). Outside these windows, economic activity drops sharply. The completion of the A3 motorway improved access and has boosted visitor numbers.",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "6.8%",
        raw: 57,
        trend: "stable",
        explanation:
          "Seasonal and structurally elevated. Hotel and ski-lift workers may work 6 months and be unemployed the rest of the year. Youth leave for Bucharest or Western Europe at high rates. The town's small permanent population limits the statistical significance of the figure.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "9.4%",
        raw: 22,
        trend: "down",
        explanation:
          "Same national rate as Bucharest, but the impact is sharper in a tourism economy. Accommodation prices are set in euros by international booking platforms, so cost-of-living for locals has risen faster than the national CPI in practical terms.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$790",
        raw: 19,
        trend: "up",
        explanation:
          "Well below the national average. Hotel and hospitality work dominates the labour market, with wages around RON 2 500–3 500/month (€500–700). Ski instructors and high-end resort managers can earn 3–5× more, but they are a small minority.",
      },
      {
        id: "special",
        label: "Ski season revenue",
        value: "€45M / yr",
        raw: 38,
        trend: "up",
        explanation:
          "Total ski-related revenue for the Sinaia ski area (lift tickets, ski rentals, lessons, apres-ski). Investment in snowmaking infrastructure has made the season more reliable. Competing with Poiana Brasov for domestic and regional tourism. Sinaia's casino and casino-hotel complex also contribute meaningfully to off-season revenue.",
      },
    ],
  },

  Istanbul: {
    country: "Turkey",
    population: "15.9M (city) · 16.5M (metro)",
    regionNote: "Turkey's economic capital — generates ~31% of national GDP",
    indicators: [
      {
        id: "gdp",
        label: "GDP per capita (PPP)",
        value: "$29 400",
        raw: 39,
        trend: "up",
        explanation:
          "Turkey has grown rapidly over the past two decades, but the official PPP figure understates the divergence between Istanbul's elite and the broader population. The city's finance, logistics, and manufacturing sectors are world-class; its informal economy is also enormous (~25% of GDP).",
      },
      {
        id: "unemployment",
        label: "Unemployment rate",
        value: "11.2%",
        raw: 34,
        trend: "down",
        explanation:
          "Officially 11%, though youth unemployment (ages 15–24) exceeds 25%. Istanbul absorbs massive internal migration from rural Anatolia, creating a constant surplus of low-skill labour. High rates of informal employment (street vendors, day labour) are captured poorly in official statistics.",
      },
      {
        id: "inflation",
        label: "Annual inflation (CPI)",
        value: "58.5%",
        raw: 3,
        trend: "down",
        explanation:
          "Turkey experienced one of the worst inflation crises in its modern history — peaking above 85% in 2022. The cause was the Central Bank of Turkey's policy of cutting rates during inflation (driven by President Erdoğan's unorthodox monetary theory). In mid-2023, policy reversed: rates rose from 8.5% to 40%. Inflation is declining but eroding purchasing power rapidly.",
      },
      {
        id: "wage",
        label: "Avg monthly wage (net)",
        value: "$740",
        raw: 18,
        trend: "down",
        explanation:
          "Nominal wages in TRY have risen sharply, but the lira's collapse against USD/EUR has compressed real dollar-equivalent wages dramatically. A Turkish white-collar worker earning TRY 25 000/month earned ~$1 800 in 2021; today the same salary is worth ~$800. Brain drain to Germany, Netherlands, and UAE is accelerating.",
      },
      {
        id: "special",
        label: "Bosphorus daily shipping",
        value: "150 vessels",
        raw: 82,
        trend: "stable",
        explanation:
          "The Turkish Straits (Bosphorus + Dardanelles) see approximately 150 commercial vessels daily — roughly 48 000 per year — making it one of the world's busiest waterways. Turkey controls access under the 1936 Montreux Convention, giving it significant geopolitical leverage. Tanker traffic from Russia's Black Sea ports became a flashpoint after 2022.",
      },
    ],
  },
};
