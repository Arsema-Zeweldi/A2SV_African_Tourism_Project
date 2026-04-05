export interface CountryGuide {
  id: string
  country: string
  flag: string
  image: string
  tagline: string
  visa: {
    summary: string
    tip: string
  }
  safety: {
    level: 'Low Risk' | 'Moderate' | 'Exercise Caution'
    notes: string[]
  }
  culture: string[]
  currency: {
    name: string
    code: string
    tip: string
  }
  transport: string[]
  bestTime: string
}

export const COUNTRY_GUIDES: CountryGuide[] = [
  {
    id: 'kenya',
    country: 'Kenya',
    flag: '🇰🇪',
    image: '/plan_trip/gem-nairobi.jpg',
    tagline: 'Safari heartland & coastal charm',
    visa: {
      summary:
        'Most nationalities can get an eVisa online before travel. East African citizens enjoy free movement.',
      tip: 'Apply at evisa.go.ke at least 2 weeks before travel. Fee is ~$50 USD.',
    },
    safety: {
      level: 'Moderate',
      notes: [
        'Nairobi and Mombasa are generally safe in tourist areas — avoid walking alone at night in unfamiliar neighborhoods.',
        'Safari parks are well-managed. Always follow guide instructions around wildlife.',
        'Petty theft can occur in crowded markets — keep valuables secure.',
      ],
    },
    culture: [
      'Greet people with a handshake; elders are addressed respectfully.',
      'Swahili phrases like "Jambo" (hello) and "Asante" (thank you) are appreciated.',
      'Dress modestly when visiting coastal towns with large Muslim communities.',
      'Tipping is common — 10% at restaurants, small tips for safari guides.',
    ],
    currency: {
      name: 'Kenyan Shilling',
      code: 'KES',
      tip: 'M-Pesa mobile payments are widely accepted, even in rural areas. Carry cash for markets.',
    },
    transport: [
      'SGR train connects Nairobi to Mombasa (~5 hours, affordable and scenic).',
      'Matatus (minibuses) are the cheapest option for city travel.',
      'Domestic flights via Safarilink or Jambojet are quick for reaching safari parks.',
      'Boda-bodas (motorcycle taxis) are common but negotiate the fare upfront.',
    ],
    bestTime: 'July–October (Great Migration) and January–February (dry season)',
  },
  {
    id: 'south-africa',
    country: 'South Africa',
    flag: '🇿🇦',
    image: '/plan_trip/gem-capetown.jpg',
    tagline: 'Rainbow Nation, endless landscapes',
    visa: {
      summary:
        'Many African and Commonwealth nationals get visa-free entry for 30–90 days. Others need a tourist visa from the embassy.',
      tip: 'Check your nationality at dha.gov.za — processing takes 5–10 business days.',
    },
    safety: {
      level: 'Exercise Caution',
      notes: [
        'Tourist areas in Cape Town, Stellenbosch, and Garden Route are well-policed.',
        'Avoid displaying expensive electronics or jewelry in public.',
        'Use registered taxis or ride-hailing apps (Bolt/Uber) rather than walking at night.',
      ],
    },
    culture: [
      'South Africa has 11 official languages — English is widely spoken in cities.',
      '"Braai" (barbecue) is a cultural institution — accepting an invitation is a great way to connect.',
      'Respect the history: visiting Robben Island or the Apartheid Museum is deeply meaningful.',
      'Tipping 10–15% is standard at restaurants.',
    ],
    currency: {
      name: 'South African Rand',
      code: 'ZAR',
      tip: 'Cards are accepted almost everywhere. ATMs are widely available but use those inside banks.',
    },
    transport: [
      'Gautrain connects Johannesburg airport to Sandton and Pretoria.',
      'MyCiTi buses in Cape Town are safe and affordable.',
      'Renting a car is ideal for the Garden Route and wine country.',
      'Domestic flights via FlySafair are budget-friendly.',
    ],
    bestTime: 'October–March (summer) for beaches; May–September for safari (dry season)',
  },
  {
    id: 'morocco',
    country: 'Morocco',
    flag: '🇲🇦',
    image: '/plan_trip/gem-marrakech.jpg',
    tagline: 'Ancient medinas & Saharan magic',
    visa: {
      summary:
        'Citizens of 69 countries (including most of Africa, EU, US) can enter visa-free for up to 90 days.',
      tip: 'No eVisa system — just show up with a valid passport (6 months validity).',
    },
    safety: {
      level: 'Low Risk',
      notes: [
        'Morocco is one of the safest countries in Africa for tourists.',
        'Medina areas can be disorienting — download offline maps.',
        'Some persistent vendors in tourist spots — a polite "La shukran" (no thank you) works.',
      ],
    },
    culture: [
      'Islam is central to daily life — dress modestly, especially outside Marrakech.',
      'Friday is the holy day; many shops close for Friday prayers.',
      'Haggling is expected in souks — start at 30–40% of the asking price.',
      'Mint tea is a sign of hospitality — always accept if offered.',
    ],
    currency: {
      name: 'Moroccan Dirham',
      code: 'MAD',
      tip: 'Cash is king in medinas and markets. ATMs are everywhere in cities.',
    },
    transport: [
      'Al Boraq high-speed train connects Casablanca to Tangier in 2 hours.',
      'CTM and Supratours buses are comfortable and cover the whole country.',
      'Grand taxis are shared long-distance rides — cheap but cramped.',
      'Petit taxis are metered within cities — insist on the meter.',
    ],
    bestTime: 'March–May and September–November (mild weather, fewer crowds)',
  },
  {
    id: 'egypt',
    country: 'Egypt',
    flag: '🇪🇬',
    image: '/plan_trip/gem-cairo.jpg',
    tagline: 'Ancient wonders & Nile adventures',
    visa: {
      summary:
        'Most visitors can purchase an eVisa or visa-on-arrival ($25 single entry). Some African nationals get visa-free access.',
      tip: 'Apply at visa2egypt.gov.eg — instant approval for most nationalities.',
    },
    safety: {
      level: 'Moderate',
      notes: [
        'Major tourist sites (pyramids, Luxor, Aswan) are heavily guarded.',
        'Avoid the Sinai border areas — stick to Sharm el-Sheikh resort zone.',
        'Licensed tour guides reduce the hassle from touts at popular sites.',
      ],
    },
    culture: [
      'Modest dress is appreciated, especially for women — cover shoulders and knees.',
      'Baksheesh (small tips) is expected for any small service.',
      'Bargaining is essential in Khan el-Khalili and local markets.',
      'Egyptians are incredibly hospitable — accept invitations to tea.',
    ],
    currency: {
      name: 'Egyptian Pound',
      code: 'EGP',
      tip: 'Cash is preferred outside hotels. Change money at official exchange bureaus, not street changers.',
    },
    transport: [
      'Cairo Metro is cheap and covers key areas — women-only cars are available.',
      'Nile cruises between Luxor and Aswan are the classic Egyptian experience.',
      'EgyptAir domestic flights are affordable for covering long distances.',
      'Uber and Careem are reliable in Cairo and Alexandria.',
    ],
    bestTime: 'October–April (cool, dry season — avoid the summer heat)',
  },
  {
    id: 'ethiopia',
    country: 'Ethiopia',
    flag: '🇪🇹',
    image: '/images/laibela.jpeg',
    tagline: 'Cradle of humanity & ancient kingdoms',
    visa: {
      summary:
        'Most visitors can obtain an eVisa online. Kenyan and Djiboutian nationals enjoy visa-free access.',
      tip: 'Apply at evisa.gov.et — costs $82 for 30 days. Process takes 1–3 business days.',
    },
    safety: {
      level: 'Exercise Caution',
      notes: [
        'Addis Ababa is generally safe for tourists in central areas.',
        'Check travel advisories for specific regions before visiting.',
        'Lalibela, Gondar, and the Omo Valley are popular and well-traveled tourist routes.',
      ],
    },
    culture: [
      'Ethiopia follows its own calendar — 13 months, roughly 7 years behind the Gregorian calendar.',
      'The Ethiopian Orthodox Church is deeply influential — respect religious practices and dress modestly at churches.',
      'The coffee ceremony is sacred — accept the invitation, it can last over an hour.',
      'Injera (spongy flatbread) is eaten with hands from a shared plate — use your right hand.',
    ],
    currency: {
      name: 'Ethiopian Birr',
      code: 'ETB',
      tip: 'Cash is essential outside Addis Ababa. ATMs exist in major cities but can be unreliable — carry enough birr.',
    },
    transport: [
      'Ethiopian Airlines has an extensive domestic network — flights to Lalibela, Axum, and Bahir Dar.',
      'The Addis Ababa Light Rail is Africa\'s first modern tram system.',
      'Long-distance buses (Selam Bus) connect major cities affordably.',
      'Blue Donkey bikes offer bike-sharing in Addis Ababa for short trips.',
    ],
    bestTime: 'October–March (dry season, pleasant temperatures, ideal for trekking)',
  },
  {
    id: 'tanzania',
    country: 'Tanzania',
    flag: '🇹🇿',
    image: '/images/elephant.png',
    tagline: 'Serengeti plains & Zanzibar shores',
    visa: {
      summary:
        'Most visitors can get a visa on arrival ($50) or apply for an eVisa online. East African community citizens have free access.',
      tip: 'Apply at visa.immigration.go.tz — processing takes 2–5 days. Bring yellow fever vaccination proof.',
    },
    safety: {
      level: 'Low Risk',
      notes: [
        'Tanzania is one of the safest countries in East Africa for tourists.',
        'Safari areas and Zanzibar are well-patrolled and tourist-friendly.',
        'Take standard precautions in Dar es Salaam — avoid walking alone at night.',
      ],
    },
    culture: [
      'Swahili is widely spoken — "Karibu" (welcome) and "Hakuna matata" (no worries) are everyday phrases.',
      'Zanzibar is predominantly Muslim — dress modestly outside resort areas.',
      'Respect Maasai communities when visiting — always ask before taking photos.',
      'Tipping safari guides ($10–20/day) and hotel staff is customary.',
    ],
    currency: {
      name: 'Tanzanian Shilling',
      code: 'TZS',
      tip: 'USD is widely accepted for safaris and tourist activities. Carry small bills — change for large notes can be scarce.',
    },
    transport: [
      'Domestic flights via Coastal Aviation or Auric Air connect safari parks and Zanzibar.',
      'Ferries run between Dar es Salaam and Zanzibar (1.5–2 hours).',
      'Dalla-dallas (minibuses) are the cheapest local transport but can be crowded.',
      'Self-driving is possible but 4WD is essential for safari parks.',
    ],
    bestTime: 'June–October (dry season, Great Migration in Serengeti) and January–February',
  },
  {
    id: 'ghana',
    country: 'Ghana',
    flag: '🇬🇭',
    image: '/images/village.png',
    tagline: 'West Africa\'s gateway & vibrant culture',
    visa: {
      summary:
        'ECOWAS nationals enter visa-free. Others need a visa — some can get visa on arrival, most should apply in advance.',
      tip: 'Apply through the Ghana Immigration Service website. Processing takes 5–10 days. Fee is around $60–150.',
    },
    safety: {
      level: 'Low Risk',
      notes: [
        'Ghana is considered one of the safest countries in West Africa.',
        'Accra and Kumasi are friendly to tourists — people are genuinely welcoming.',
        'Petty theft can occur — keep valuables secure in busy markets like Makola.',
      ],
    },
    culture: [
      '"Akwaaba" (welcome) is the word you\'ll hear everywhere — Ghana prides itself on hospitality.',
      'Funerals in Ghana are celebrations of life — elaborate, colorful, and sometimes public.',
      'Kente cloth has deep cultural significance — each pattern tells a story.',
      'Use your right hand for greetings and eating — the left hand is considered impolite.',
    ],
    currency: {
      name: 'Ghanaian Cedi',
      code: 'GHS',
      tip: 'Mobile money (MTN MoMo) is widespread. ATMs are available in cities. Carry cedis for market shopping.',
    },
    transport: [
      'Trotros (shared minibuses) are the primary public transport — cheap but unscheduled.',
      'Uber and Bolt operate in Accra and are affordable.',
      'STC and VIP buses offer comfortable intercity travel.',
      'Domestic flights connect Accra to Kumasi and Tamale.',
    ],
    bestTime: 'November–March (dry season, Harmattan winds bring cooler weather)',
  },
  {
    id: 'senegal',
    country: 'Senegal',
    flag: '🇸🇳',
    image: '/images/ocean.png',
    tagline: 'Teranga hospitality & Saharan crossroads',
    visa: {
      summary:
        'Many nationalities can enter visa-free for 90 days, including EU, US, and most African nations.',
      tip: 'No visa needed for most travelers — just a valid passport with 6 months validity.',
    },
    safety: {
      level: 'Low Risk',
      notes: [
        'Senegal is one of West Africa\'s most stable and safest countries.',
        'Dakar is vibrant and generally safe — the Corniche and Ngor Island are popular tourist areas.',
        'The Casamance region has occasional unrest — check current advisories before visiting.',
      ],
    },
    culture: [
      '"Teranga" (hospitality) defines Senegalese culture — you\'ll be invited into homes and offered food.',
      'Senegal is predominantly Muslim — dress modestly outside beach resorts.',
      'Wrestling (Laamb) is the national sport — catching a match is an incredible experience.',
      'French is the official language, but Wolof is spoken everywhere — "Nanga def?" (how are you?) goes a long way.',
    ],
    currency: {
      name: 'West African CFA Franc',
      code: 'XOF',
      tip: 'Cash is essential. ATMs exist in Dakar and Saint-Louis but are scarce in rural areas. Euros can be exchanged easily.',
    },
    transport: [
      'The TER train connects Dakar to Diamniadio and the new airport (fast and modern).',
      'Sept-place taxis are shared long-distance cars — wait until 7 passengers to depart.',
      'Car rapides are colorful minibuses in Dakar — iconic but chaotic.',
      'Taxis in Dakar don\'t use meters — negotiate before getting in.',
    ],
    bestTime: 'November–May (dry season, cooler temperatures, perfect for exploring)',
  },
]
