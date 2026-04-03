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
]
