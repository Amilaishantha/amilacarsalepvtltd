import type { Faq } from '@/lib/seo'

export type BrandPage = {
  slug: string
  name: string
  /** Upper-case make values in stock data that belong to this brand. */
  matches: string[]
  tagline: string
  intro: string[]
  popularModels: { name: string; body: string }[]
  importNotes: string[]
  faqs: Faq[]
}

const commonImportFaq = (brand: string): Faq => ({
  q: `Can you import a specific ${brand} model for me if it is not in stock?`,
  a: `Yes. Tell us the ${brand} model, grade, colour, year range and budget. We search Japanese auctions and dealer stock, share the auction sheet and photos with you, and give you an estimated landed cost using our import tax calculator before you commit.`,
})

const taxFaq = (brand: string): Faq => ({
  q: `How much tax will I pay to import a ${brand} into Sri Lanka?`,
  a: `Import taxes depend mainly on the CIF value, engine capacity (or motor power for EVs), fuel type and vehicle age. Use our free vehicle import tax calculator for an estimate, and contact us for a confirmed landed-cost quote — final duty is always determined by Sri Lanka Customs.`,
})

export const BRAND_PAGES: BrandPage[] = [
  {
    slug: 'toyota',
    name: 'Toyota',
    matches: ['TOYOTA'],
    tagline: 'Japanese Toyota cars, SUVs and vans for sale in Sri Lanka',
    intro: [
      'Toyota is the most popular vehicle brand among Sri Lankan buyers, and for good reason: strong resale value, wide parts availability and a long record of reliability on both highland and coastal roads.',
      'Amila Car Sale imports Toyota vehicles directly from Japan — from compact hatchbacks and small SUVs to hybrids, vans and four-wheel-drive models — and sells them from our showroom on Diyathalawa Road, Kahagolla, Bandarawela.',
    ],
    popularModels: [
      { name: 'Toyota Yaris', body: 'A compact hatchback that is easy to drive and park, with low running costs. Petrol and hybrid versions are sold in Japan; check the engine capacity of each listing.' },
      { name: 'Toyota Raize', body: 'A compact SUV with higher ground clearance — popular for hill-country driving. Japanese-market Raize models have been offered with a 1.0 L turbo petrol engine, and later 1.2 L petrol and hybrid options.' },
      { name: 'Toyota Yaris Cross', body: 'A slightly larger compact SUV based on the Yaris platform, offered in Japan with a 1.5 L petrol or 1.5 L hybrid powertrain.' },
      { name: 'Toyota Roomy', body: 'A tall, practical small car with sliding rear doors — a family favourite for city use.' },
      { name: 'Toyota Prius, RAV4, Alphard, Land Cruiser Prado, Hilux and Hiace', body: 'Larger hybrids, SUVs, MPVs, pickups and vans — we can source these on request.' },
    ],
    importNotes: [
      'Most Toyota hatchbacks and small SUVs fall into the lower engine-capacity bands, which usually means lower excise duty than larger vehicles.',
      'Hybrid versions are taxed under separate hybrid excise categories — choose the correct category in the tax calculator.',
      'Always ask for the auction sheet so you can confirm the grade, mileage and any repairs before reserving.',
    ],
    faqs: [
      { q: 'Which Toyota models are best for driving around Bandarawela and the hill country?', a: 'Compact SUVs such as the Raize and Yaris Cross offer more ground clearance than a hatchback, which many hill-country buyers prefer. For families who need more space, a Roomy or larger SUV may suit better. We are happy to advise based on your daily routes.' },
      taxFaq('Toyota'),
      commonImportFaq('Toyota'),
    ],
  },
  {
    slug: 'honda',
    name: 'Honda',
    matches: ['HONDA'],
    tagline: 'Honda Vezel, Fit and more — imported from Japan',
    intro: [
      'Honda vehicles are known in Sri Lanka for efficient engines, comfortable interiors and clever packaging. The Honda Vezel in particular is one of the most sought-after compact SUVs among Sri Lankan buyers.',
      'We import Honda vehicles directly from Japan and can source specific grades and colours on request.',
    ],
    popularModels: [
      { name: 'Honda Vezel', body: 'A compact SUV offered in Japan with a 1.5 L petrol engine and Honda’s e:HEV hybrid system. Grades and option packages vary by year — each listing shows the grade as recorded.' },
      { name: 'Honda Fit', body: 'A small hatchback with Honda’s flexible “Magic Seat” rear seating, offered with petrol and e:HEV hybrid powertrains.' },
      { name: 'Honda N-Box / N-WGN', body: 'Kei cars with 660 cc engines — very economical for short daily trips. Available on request.' },
    ],
    importNotes: [
      'e:HEV hybrid models use the petrol-hybrid excise categories in the tax calculator.',
      'Brand-new and nearly-new Vezels are often reserved quickly; ask us about upcoming arrivals.',
    ],
    faqs: [
      { q: 'Is the Honda Vezel a hybrid?', a: 'The Japanese-market Vezel has been offered with both a 1.5 L petrol engine and the e:HEV hybrid system. Each of our listings shows the fuel type and engine capacity of that specific vehicle.' },
      taxFaq('Honda'),
      commonImportFaq('Honda'),
    ],
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    matches: ['NISSAN'],
    tagline: 'Nissan Roox, Dayz and other Japanese Nissan models',
    intro: [
      'Nissan’s Japanese-market kei cars such as the Roox and Dayz have become popular in Sri Lanka as economical, well-equipped city cars. Many are available with Nissan’s ProPILOT driver-assistance system.',
      'We import Nissan vehicles directly from Japan, from 660 cc kei cars to larger models on request.',
    ],
    popularModels: [
      { name: 'Nissan Roox', body: 'A tall kei car with sliding rear doors and a 660 cc engine (turbo versions are offered). Roomy for its size and easy to park.' },
      { name: 'Nissan Dayz', body: 'A 660 cc kei hatchback — economical and practical for daily commuting.' },
      { name: 'Nissan Leaf, X-Trail and others', body: 'Electric and larger models can be sourced on request. EVs are taxed by motor power (kW) rather than engine capacity.' },
    ],
    importNotes: [
      '660 cc kei cars fall into the lowest petrol engine-capacity band in the tax calculator.',
      'ProPILOT grades include adaptive cruise control and lane-keeping assistance — check the grade on each listing.',
    ],
    faqs: [
      { q: 'What does “ProPILOT” mean on a Nissan listing?', a: 'ProPILOT is Nissan’s driver-assistance package, combining adaptive cruise control with steering assistance on suitable roads. Whether a specific vehicle has it depends on its grade, which we show on each listing.' },
      taxFaq('Nissan'),
      commonImportFaq('Nissan'),
    ],
  },
  {
    slug: 'suzuki',
    name: 'Suzuki',
    matches: ['SUZUKI'],
    tagline: 'Suzuki Every, Alto, Wagon R and more from Japan',
    intro: [
      'Suzuki is a household name in Sri Lanka. Its compact cars and kei vans are affordable to run, simple to maintain and well suited to narrow town roads.',
      'We import Suzuki passenger cars and kei vans directly from Japan.',
    ],
    popularModels: [
      { name: 'Suzuki Every', body: 'A 660 cc kei van that is popular for small businesses and families who need cargo or passenger space.' },
      { name: 'Suzuki Alto and Wagon R', body: 'Small, economical hatchbacks ideal for first-time buyers and daily commuting.' },
      { name: 'Suzuki Jimny', body: 'A compact, genuinely capable four-wheel-drive vehicle — available on request.' },
    ],
    importNotes: [
      'Kei vans may be classified differently from passenger cars for tax purposes — confirm the HS classification with us before ordering.',
    ],
    faqs: [
      { q: 'Is the Suzuki Every a passenger vehicle or a goods van?', a: 'Japanese Every models come in both passenger (Every Wagon) and van versions, and the classification affects import duty. We confirm the exact version and its HS code for every vehicle we import.' },
      taxFaq('Suzuki'),
      commonImportFaq('Suzuki'),
    ],
  },
  {
    slug: 'daihatsu',
    name: 'Daihatsu',
    matches: ['DAIHATSU'],
    tagline: 'Daihatsu Mira, Cast and kei cars imported from Japan',
    intro: [
      'Daihatsu, part of the Toyota group, specialises in small cars. Daihatsu kei cars such as the Mira and Cast are among the most economical vehicles you can buy in Sri Lanka.',
      'Many recent Daihatsu models are fitted with “Smart Assist” safety technology — look for “SA” in the grade name.',
    ],
    popularModels: [
      { name: 'Daihatsu Mira (Mira e:S)', body: 'A 660 cc kei hatchback focused on fuel economy and low running costs.' },
      { name: 'Daihatsu Cast', body: 'A stylish 660 cc kei car offered in several body styles.' },
      { name: 'Daihatsu Tanto and Move', body: 'Taller kei cars with more interior space — available on request.' },
    ],
    importNotes: ['660 cc kei cars fall into the lowest petrol engine-capacity band in the tax calculator.'],
    faqs: [
      { q: 'What does “SA3” mean in a Daihatsu grade?', a: 'SA refers to Daihatsu’s Smart Assist safety package; “SA3” indicates the third generation of that system. The exact features depend on the model and year.' },
      taxFaq('Daihatsu'),
      commonImportFaq('Daihatsu'),
    ],
  },
  {
    slug: 'mitsubishi',
    name: 'Mitsubishi',
    matches: ['MITSUBISHI', 'MITSUBSHI'],
    tagline: 'Mitsubishi eK X, Outlander, Canter and more',
    intro: [
      'Mitsubishi offers everything from 660 cc kei cars like the eK X to plug-in hybrid SUVs and the Canter light truck used widely by Sri Lankan businesses.',
      'We import Mitsubishi passenger and commercial vehicles directly from Japan.',
    ],
    popularModels: [
      { name: 'Mitsubishi eK X', body: 'A crossover-styled kei car with a 660 cc engine.' },
      { name: 'Mitsubishi Outlander PHEV', body: 'A plug-in hybrid SUV — taxed under the plug-in hybrid categories in the calculator.' },
      { name: 'Mitsubishi Canter', body: 'A light truck for commercial use. Commercial vehicles have separate tax categories and age rules.' },
    ],
    importNotes: ['Commercial vehicles such as trucks are classified differently from passenger cars — ask us to confirm duty before ordering.'],
    faqs: [taxFaq('Mitsubishi'), commonImportFaq('Mitsubishi')],
  },
  {
    slug: 'mazda',
    name: 'Mazda',
    matches: ['MAZDA'],
    tagline: 'Import a Mazda from Japan to Sri Lanka',
    intro: [
      'Mazda is known for stylish design and engaging driving dynamics, with models such as the Mazda2, Mazda3, CX-3 and CX-5 popular in Japan.',
      'We do not always have Mazda vehicles in stock, but we can source one for you directly from Japanese auctions and dealers.',
    ],
    popularModels: [
      { name: 'Mazda2 and Mazda3', body: 'Hatchbacks and sedans with SKYACTIV petrol and diesel engines.' },
      { name: 'Mazda CX-3, CX-30 and CX-5', body: 'Compact and mid-size SUVs.' },
    ],
    importNotes: ['Diesel models use the diesel excise categories in the tax calculator, which carry higher rates per cc than petrol equivalents.'],
    faqs: [taxFaq('Mazda'), commonImportFaq('Mazda')],
  },
  {
    slug: 'subaru',
    name: 'Subaru',
    matches: ['SUBARU'],
    tagline: 'Import a Subaru from Japan to Sri Lanka',
    intro: [
      'Subaru is famous for its symmetrical all-wheel-drive system and boxer engines — features that appeal to drivers who regularly travel on hill-country roads.',
      'We can source Subaru models such as the Impreza, XV/Crosstrek and Forester directly from Japan on request.',
    ],
    popularModels: [
      { name: 'Subaru XV / Crosstrek', body: 'A compact crossover with all-wheel drive.' },
      { name: 'Subaru Forester', body: 'A practical mid-size SUV with all-wheel drive.' },
      { name: 'Subaru Impreza', body: 'A compact hatchback or sedan.' },
    ],
    importNotes: ['Some Subaru models have larger engines, which move them into higher excise bands — check the calculator before choosing.'],
    faqs: [taxFaq('Subaru'), commonImportFaq('Subaru')],
  },
  {
    slug: 'lexus',
    name: 'Lexus',
    matches: ['LEXUS'],
    tagline: 'Import a Lexus luxury vehicle from Japan',
    intro: [
      'Lexus is Toyota’s luxury brand, with hybrid models such as the UX, NX, RX and ES offering refined comfort and strong reliability.',
      'We can source Lexus vehicles from Japan on request and prepare a full landed-cost estimate, including any luxury tax that applies.',
    ],
    popularModels: [
      { name: 'Lexus UX and NX', body: 'Compact and mid-size luxury SUVs, widely available as hybrids.' },
      { name: 'Lexus RX', body: 'A larger luxury SUV.' },
      { name: 'Lexus ES', body: 'A luxury sedan.' },
    ],
    importNotes: ['Higher-value vehicles may attract luxury tax on the portion of CIF value above the threshold for their category — the calculator includes this.'],
    faqs: [taxFaq('Lexus'), commonImportFaq('Lexus')],
  },
]

export function findBrandPage(slug: string): BrandPage | undefined {
  return BRAND_PAGES.find(b => b.slug === slug)
}
