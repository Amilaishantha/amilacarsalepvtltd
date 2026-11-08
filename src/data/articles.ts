/**
 * Built-in knowledge-centre guides. Written for Sri Lankan buyers; legal/tax statements are kept general
 * and point to official sources. Review the "updated" date and content whenever regulations change.
 * Admin-written posts (stored in the database) are listed alongside these.
 */

export type Source = { label: string; url: string }

export type Article = {
  slug: string
  title: string
  seoTitle: string
  description: string
  image: string
  imageAlt: string
  author: string
  published: string
  updated: string
  category: 'Importing' | 'Tax' | 'Buying guide' | 'Model guide'
  sources: Source[]
  body: string
}

const AUTHOR = 'Amila Car Sale Pvt Ltd'
const CLD = 'https://res.cloudinary.com/ddnvaijcc/image/upload'

export const OFFICIAL_SOURCES = {
  customs: { label: 'Sri Lanka Customs', url: 'https://www.customs.gov.lk/' },
  dmt: { label: 'Department of Motor Traffic', url: 'https://dmt.gov.lk/' },
  treasury: { label: 'Ministry of Finance, Sri Lanka', url: 'https://www.treasury.gov.lk/' },
  gazettes: { label: 'Department of Government Printing — Gazettes', url: 'https://documents.gov.lk/' },
  ird: { label: 'Inland Revenue Department (VAT & SSCL)', url: 'https://www.ird.gov.lk/' },
  cbsl: { label: 'Central Bank of Sri Lanka — exchange rates', url: 'https://www.cbsl.gov.lk/' },
  importControl: { label: 'Department of Import and Export Control', url: 'https://www.imexport.gov.lk/' },
} satisfies Record<string, Source>

const S = OFFICIAL_SOURCES

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-import-a-car-from-japan-to-sri-lanka',
    title: 'How to Import a Car from Japan to Sri Lanka: Step-by-Step Guide',
    seoTitle: 'How to Import a Car from Japan to Sri Lanka (Step-by-Step)',
    description:
      'A practical step-by-step guide to importing a car from Japan to Sri Lanka — choosing a vehicle, auction sheets, CIF value, shipping, customs clearance, taxes and registration.',
    image: `${CLD}/v1781451832/pic_t7mntx.jpg`,
    imageAlt: 'Japanese vehicle imported to Sri Lanka by Amila Car Sale',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Importing',
    sources: [S.customs, S.importControl, S.dmt, S.gazettes],
    body: `Importing a vehicle from Japan gives Sri Lankan buyers access to a huge choice of well-maintained cars, many with low mileage and full auction history. The process has several stages, and knowing them in advance helps you budget accurately and avoid delays.

## 1. Decide what you want — and what it will cost

Start with the basics: body type, fuel type (petrol, hybrid, diesel or electric), engine capacity, budget and how you will use the vehicle. Engine capacity matters a great deal in Sri Lanka because **excise duty is charged per cc** for most passenger vehicles (or per kW for electric vehicles). A small change in engine size can move a car into a different tax band.

Before choosing, run a few scenarios in our [vehicle import tax calculator](/tax-calculator) so you understand how CIF value, engine capacity and fuel type affect the total.

## 2. Find the vehicle in Japan

Most imported vehicles are bought through Japanese auto auctions or from Japanese dealers. Every auction vehicle is inspected and given an **auction sheet** with an overall grade, an interior grade, a mileage reading and a diagram of any scratches, dents or repairs. Read our guide to [Japanese auction grades](/blog/understanding-japanese-vehicle-auction-grades) to understand what the numbers and letters mean.

When you work with Amila Car Sale, we share the auction sheet and photos with you before bidding or purchasing, so you know exactly what you are buying.

## 3. Agree the CIF value

CIF stands for **Cost, Insurance and Freight** — the price of the vehicle plus marine insurance and shipping to a Sri Lankan port. Customs duty and most other import taxes are calculated from the CIF value, converted to rupees. See [how to calculate CIF value](/blog/how-to-calculate-cif-value) for a worked explanation.

## 4. Payment, export and shipping

Once the vehicle is purchased, it is de-registered for export in Japan, prepared at the port and shipped — usually on a roll-on/roll-off (RoRo) vessel. The exporter issues documents such as the export certificate, invoice and bill of lading. Payment for imports must go through the formal banking system.

## 5. Customs clearance in Sri Lanka

When the vessel arrives, the importer (or their clearing agent) lodges a customs declaration. Sri Lanka Customs confirms the vehicle's classification (HS code), checks the documents and assesses the duties. The main components are:

- **Excise duty (XID)** — based on engine capacity or motor power
- **Customs Import Duty (CID)** and **surcharge**
- **Luxury tax** — only where the CIF value exceeds the threshold for the vehicle category
- **SSCL** and **VAT**
- Other levies such as **VEL**

Our article [Sri Lanka vehicle import tax explained](/blog/sri-lanka-vehicle-import-tax-explained) describes each one.

## 6. Registration

After duties are paid and the vehicle is released, it is registered with the [Department of Motor Traffic](https://dmt.gov.lk/), which issues the registration number and certificate. Insurance must be in place before the vehicle is driven on public roads.

## Rules change — always check the latest position

Import eligibility (for example, permitted vehicle age and categories) and tax rates are set by government regulations and Gazette notifications, and they change from time to time. Before committing to an import, check the latest notices from [Sri Lanka Customs](https://www.customs.gov.lk/) and the [Department of Import and Export Control](https://www.imexport.gov.lk/), or ask us — we keep track of changes as part of every import we handle.

## Let us handle it for you

Amila Car Sale Pvt Ltd imports vehicles directly from Japan and manages the process end to end. [Tell us what you are looking for](/import-from-japan) or [browse vehicles already in Sri Lanka](/vehicles).`,
  },
  {
    slug: 'sri-lanka-vehicle-import-tax-explained',
    title: 'Sri Lanka Vehicle Import Tax Explained: XID, CID, Surcharge, Luxury Tax, SSCL, VAT and VEL',
    seoTitle: 'Sri Lanka Vehicle Import Tax Explained (XID, CID, VAT & more)',
    description:
      'Understand each part of Sri Lanka vehicle import tax — excise duty (XID), customs import duty, surcharge, luxury tax, SSCL, VAT and VEL — and how they combine into the total.',
    image: `${CLD}/v1781363464/R00475596-06_jmh4ek.jpg`,
    imageAlt: 'Toyota Yaris imported from Japan — example vehicle for import tax calculation',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Tax',
    sources: [S.customs, S.gazettes, S.treasury, S.ird],
    body: `Import taxes are usually the single largest part of the cost of an imported vehicle in Sri Lanka. They are made up of several separate charges, and some are calculated on top of others. This guide explains each one in plain language and shows how our [vehicle import tax calculator](/tax-calculator) puts them together.

> The rates mentioned below are the default values pre-filled in our calculator. Rates are set by law and Gazette notifications and can change — always confirm the current rates with Sri Lanka Customs or with us before you commit.

## Excise duty (XID)

Excise duty is normally the largest component. For petrol, diesel and hybrid passenger vehicles it is charged **per cubic centimetre (cc) of engine capacity**, with a higher rate per cc for larger engines. Some small-engine categories are charged a fixed amount per vehicle. For electric vehicles, excise duty is charged **per kilowatt (kW) of motor power**, and the rate depends on the vehicle's age.

This is why engine capacity is so important: a 1,000 cc car and a 1,500 cc car can fall into quite different bands. The calculator applies the gazetted band for the category and engine capacity you choose.

## Customs Import Duty (CID)

Customs Import Duty is a percentage of the **CIF value**. Our calculator pre-fills **20%** of CIF.

## Surcharge (SUR)

A surcharge is applied as a percentage **of the Customs Import Duty** (not of the CIF value). The calculator's default is **50% of CID**.

## Luxury tax

Luxury tax applies only when the CIF value is above a **threshold for the vehicle category** — for example, the threshold differs for petrol cars, hybrids and electric vehicles. Where it applies, it is charged on the amount above the threshold, multiplied by a category-specific rate. Many everyday vehicles fall below the threshold and pay no luxury tax.

## Social Security Contribution Levy (SSCL)

SSCL is calculated on the CIF value plus the duties above (XID, CID, surcharge and luxury tax). The calculator's default is **2.5%**.

## Value Added Tax (VAT)

VAT is charged on a base that includes the CIF value with a 10% uplift, plus the other duties and SSCL. The calculator's default VAT rate is **18%**. See the [Inland Revenue Department](https://www.ird.gov.lk/) for current VAT information.

## VEL

VEL is a fixed levy per vehicle. The calculator pre-fills **Rs. 15,000**, which you can change if the current amount differs.

## How the total is built

1. Start with the CIF value in rupees.
2. Add excise duty based on category and engine capacity (or kW).
3. Add CID (a percentage of CIF) and the surcharge (a percentage of CID).
4. Add luxury tax if the CIF value exceeds the category threshold.
5. Calculate SSCL on CIF plus those duties.
6. Calculate VAT on the uplifted CIF plus duties and SSCL.
7. Add VEL.

The total import tax is the sum of steps 2–7. Your **landed cost** is the CIF value plus total import tax, plus clearing, port and registration charges.

## Things that change the final amount

- The exchange rate on the day of clearance — see the [Central Bank of Sri Lanka](https://www.cbsl.gov.lk/)
- How Customs values the vehicle and which HS code it is classified under
- The vehicle's age and category
- Any new Gazette notification issued after you plan your purchase

## Try it yourself

Open the [vehicle import tax calculator](/tax-calculator), choose the vehicle category, enter the CIF value and engine capacity, and you will see a full breakdown. If you would like a confirmed landed-cost quote, [contact us](/contact).`,
  },
  {
    slug: 'how-to-calculate-cif-value',
    title: 'How to Calculate CIF Value for a Vehicle Imported to Sri Lanka',
    seoTitle: 'How to Calculate CIF Value for Car Imports to Sri Lanka',
    description:
      'CIF value is the basis for most Sri Lankan vehicle import taxes. Learn what Cost, Insurance and Freight include, how to convert from yen or dollars, and common mistakes to avoid.',
    image: `${CLD}/v1781364172/R00471979-07_l19bvy.jpg`,
    imageAlt: 'Toyota Roomy imported from Japan — CIF value example',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Tax',
    sources: [S.customs, S.cbsl],
    body: `**CIF** stands for **Cost, Insurance and Freight**. It is the value of an imported vehicle when it arrives at a Sri Lankan port, and it is the starting point for most of the import taxes you will pay. Getting it right is the first step to an accurate cost estimate.

## What CIF includes

- **Cost** — the purchase price of the vehicle in Japan (for example, the auction hammer price plus auction and exporter fees, or a dealer's export price).
- **Insurance** — marine insurance covering the vehicle while it is shipped.
- **Freight** — the cost of shipping the vehicle from Japan to Sri Lanka.

CIF does **not** include Sri Lankan duties, taxes, port charges, clearing-agent fees or registration costs. Those come on top.

## Converting CIF to rupees

Vehicles from Japan are usually priced in Japanese yen (JPY) or US dollars (USD). Customs converts the CIF value to Sri Lankan rupees using the applicable exchange rate. To estimate it yourself:

1. Add up the cost, insurance and freight in the original currency.
2. Multiply by the exchange rate to LKR.

For example, if the total CIF is ¥2,000,000 and the rate is Rs. 2.00 per yen, the CIF value is Rs. 4,000,000. (These numbers are only an illustration — check the current rate published by the [Central Bank of Sri Lanka](https://www.cbsl.gov.lk/).)

Our [tax calculator](/tax-calculator) has a built-in converter: enter the exchange rate and the foreign CIF amount and it fills in the CIF value in rupees for you.

## Why CIF matters so much

- **Customs Import Duty** is a percentage of CIF.
- The **surcharge** is a percentage of the Customs Import Duty, so it rises with CIF too.
- **Luxury tax** applies only when CIF exceeds the threshold for the vehicle category.
- **SSCL** and **VAT** are calculated on bases that include CIF.

A small change in exchange rate or freight cost can therefore change the final tax noticeably.

## Common mistakes

- Using the vehicle price alone and forgetting freight and insurance.
- Using an old exchange rate — rates move, sometimes quickly.
- Assuming Customs will accept any invoice value. Customs can assess the value independently.

## Get a CIF estimate from us

When we source a vehicle for you, we give you the expected CIF value and a full tax breakdown before you commit. [Request an import quote](/import-from-japan) or read [how import tax is calculated](/blog/sri-lanka-vehicle-import-tax-explained).`,
  },
  {
    slug: 'toyota-raize-price-and-specifications-sri-lanka',
    title: 'Toyota Raize in Sri Lanka: Specifications, Grades and Buying Guide',
    seoTitle: 'Toyota Raize Sri Lanka — Specs, Grades & Price Guide',
    description:
      'Toyota Raize specifications, engine options, grades and what to check when buying an imported Raize in Sri Lanka — with current Raize stock and price-on-request guidance.',
    image: `${CLD}/v1781363659/R00476669-01_psv7fx.jpg`,
    imageAlt: 'Toyota Raize compact SUV in pearl white imported from Japan',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Model guide',
    sources: [{ label: 'Toyota Japan — Raize (official)', url: 'https://toyota.jp/raize/' }, S.customs],
    body: `The **Toyota Raize** is a compact SUV built for Toyota by Daihatsu and sold in Japan since 2019. Its small footprint, raised ride height and low running costs make it one of the most popular imports among Sri Lankan buyers, especially in the hill country.

## Engines and drivetrains

Japanese-market Raize models have been offered with:

- A **1.0 litre three-cylinder turbo petrol** engine with a CVT — the original engine, also offered with four-wheel drive.
- A **1.2 litre petrol** engine, introduced in a later update.
- A **1.2 litre series hybrid** ("e-SMART HYBRID"), also introduced in a later update.

The exact engine, drivetrain and equipment of an individual car depend on its year and grade, so always check the listing. On our site, each Raize shows the engine capacity recorded for that specific vehicle.

## Grades

Raize grades in Japan include **X**, **G** and **Z**, with Z typically the best-equipped. Equipment varies by year — for example, safety and driver-assistance features were upgraded over the model's life. The auction sheet and the car itself are the best guide to what a particular vehicle has.

## Size

The Raize is just under four metres long, which makes it easy to park in town while still offering more ground clearance than a typical hatchback. Check the official [Toyota Japan Raize page](https://toyota.jp/raize/) for full dimensions of current models.

## Price in Sri Lanka

The price of a Raize in Sri Lanka depends on the year, grade, mileage, condition and — above all — the import taxes paid, which change with Gazette revisions and exchange rates. For that reason we show a price only where one is confirmed; otherwise the listing says **Price on Request**. You can estimate duty yourself with the [tax calculator](/tax-calculator): choose the petrol (or petrol hybrid) category and enter the engine capacity.

## What to check before you buy

- The **auction grade** and the repair diagram on the auction sheet ([how to read auction grades](/blog/understanding-japanese-vehicle-auction-grades))
- Whether it is a turbo, non-turbo or hybrid version — it affects both tax and running costs
- Two-wheel drive or four-wheel drive
- Service history and the condition of tyres and brakes

## See Raize stock

Browse our [Toyota vehicles](/brands/toyota) or [all vehicles for sale](/vehicles). Comparing with the Yaris Cross? Read [Toyota Yaris Cross vs Toyota Raize](/blog/toyota-yaris-cross-vs-toyota-raize).`,
  },
  {
    slug: 'honda-vezel-specifications-and-buying-guide',
    title: 'Honda Vezel Specifications and Buying Guide for Sri Lanka',
    seoTitle: 'Honda Vezel Sri Lanka — Specifications & Buying Guide',
    description:
      'A buyer’s guide to the Honda Vezel in Sri Lanka: second-generation specifications, e:HEV hybrid vs petrol, grades, what to check on an imported Vezel and how to reserve one.',
    image: `${CLD}/v1781366908/R00479220-05_yedjor.jpg`,
    imageAlt: 'Red Honda Vezel RS compact SUV imported from Japan',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Model guide',
    sources: [{ label: 'Honda Japan — Vezel (official)', url: 'https://www.honda.co.jp/VEZEL/' }, S.customs],
    body: `The **Honda Vezel** (sold in some markets as the HR-V) is a compact SUV that combines a spacious, flexible cabin with efficient powertrains. The second-generation Vezel went on sale in Japan in 2021 and is a frequent request from our customers.

## Powertrains

The second-generation Vezel has been offered in Japan with:

- **e:HEV** — Honda's two-motor hybrid system paired with a 1.5 litre petrol engine. Most of the time the engine acts as a generator and the electric motor drives the wheels, giving smooth, quiet progress in town.
- A conventional **1.5 litre petrol** engine on some grades.

Front-wheel drive and four-wheel-drive versions exist. Each of our listings shows the fuel type and engine capacity of that specific car.

## Grades

Japanese grades have included **G** (petrol), **e:HEV X**, **e:HEV Z** and **e:HEV PLaY**, with further grades and packages added in later updates — such as the sportier **RS**. Equipment such as the panoramic roof, alloy wheel size and interior trim depends on the grade and year. If a particular feature matters to you, ask us to confirm it on the vehicle.

## Why buyers choose the Vezel

- A versatile interior with Honda's fold-flat rear seats
- Efficient e:HEV hybrid in city driving
- Higher seating position than a hatchback
- Honda SENSING driver-assistance features on most grades

## Tax considerations

Hybrid Vezels use the **petrol hybrid** excise categories, and the 1.5 litre engine places them in a specific band — use our [vehicle import tax calculator](/tax-calculator) with your CIF value for an estimate. Brand-new and nearly-new Vezels can carry a higher CIF value, so check whether luxury tax applies.

## What to check on an imported Vezel

- Auction sheet grade and repair diagram
- Hybrid system warning lights and battery health (we can arrange a check)
- Grade and options — they vary more than many buyers expect
- Tyre and brake condition, especially on higher-mileage cars

## Reserve a Vezel

Popular Vezels are often reserved before they arrive. See [how to reserve a Japanese vehicle](/blog/how-to-reserve-a-japanese-vehicle), browse our [Honda vehicles](/brands/honda), or [message us on WhatsApp](/contact).`,
  },
  {
    slug: 'toyota-yaris-cross-vs-toyota-raize',
    title: 'Toyota Yaris Cross vs Toyota Raize: Which Compact SUV Suits You?',
    seoTitle: 'Toyota Yaris Cross vs Raize — Sri Lanka Comparison',
    description:
      'Comparing the Toyota Yaris Cross and Toyota Raize for Sri Lankan buyers — size, engines, hybrid options, tax bands and which one fits your driving.',
    image: `${CLD}/v1781410949/R00509296-03_om5thn.jpg`,
    imageAlt: 'Black Toyota Yaris Cross Adventure compact SUV imported from Japan',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Model guide',
    sources: [
      { label: 'Toyota Japan — Yaris Cross (official)', url: 'https://toyota.jp/yariscross/' },
      { label: 'Toyota Japan — Raize (official)', url: 'https://toyota.jp/raize/' },
    ],
    body: `The **Toyota Raize** and **Toyota Yaris Cross** are both compact SUVs and both popular imports in Sri Lanka. They look similar on paper, but they are aimed at slightly different buyers.

## At a glance

| | Toyota Raize | Toyota Yaris Cross |
|---|---|---|
| Size class | Under 4 m long — very compact | Around 4.2 m long — a little larger |
| Japanese-market engines | 1.0 L turbo petrol; later 1.2 L petrol and 1.2 L hybrid | 1.5 L petrol and 1.5 L hybrid |
| Platform | Daihatsu-developed (DNGA) | Toyota TNGA (GA-B), shared with the Yaris |
| Typical buyer | Town driving, easy parking, lower running costs | More space and refinement, longer trips |

Check the official [Yaris Cross](https://toyota.jp/yariscross/) and [Raize](https://toyota.jp/raize/) pages for the exact specification of each year and grade.

## Engine size and tax

Engine capacity is a key factor in Sri Lankan excise duty. A Raize with the 1.0 litre engine falls into a lower engine-capacity band than a 1.5 litre Yaris Cross, which usually means a lower excise duty — though the CIF value, fuel type and grade also matter. Compare the two directly in our [tax calculator](/tax-calculator).

## Space and comfort

The Yaris Cross is longer and generally offers more rear legroom and boot space. The Raize is easier to manoeuvre and park in busy towns and narrow roads.

## Hybrid options

Both are available as hybrids in Japan, but the systems differ: the Yaris Cross uses Toyota's full hybrid system with a 1.5 litre engine, while the later Raize hybrid uses a 1.2 litre series-hybrid layout. Hybrids are taxed under the petrol hybrid categories.

## Which should you choose?

- Choose the **Raize** if you mainly drive in town, want the lowest running costs and value easy parking.
- Choose the **Yaris Cross** if you carry passengers often, drive long distances, or want a more spacious cabin.

## See both in stock

Browse [Toyota vehicles](/brands/toyota) or [all vehicles](/vehicles), or read our [Raize buying guide](/blog/toyota-raize-price-and-specifications-sri-lanka).`,
  },
  {
    slug: 'understanding-japanese-vehicle-auction-grades',
    title: 'Understanding Japanese Vehicle Auction Grades and Auction Sheets',
    seoTitle: 'Japanese Car Auction Grades Explained (Auction Sheet Guide)',
    description:
      'What do Japanese auction grades like 4.5, 4, 3.5 and R mean? Learn how to read an auction sheet — overall grade, interior grade, damage codes and mileage — before you buy.',
    image: `${CLD}/v1781413354/R00480393-05_gnla8d.jpg`,
    imageAlt: 'Nissan Roox kei car with auction grade inspection, imported from Japan',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Buying guide',
    sources: [],
    body: `Almost every used vehicle sold at a Japanese auction is inspected by the auction house before sale. The inspector records the findings on an **auction sheet**, and the most important number on that sheet is the **overall grade**. Understanding the sheet is the best protection you have when buying an imported car.

## Overall grade

Each auction house uses its own scale, but most follow a similar pattern:

| Grade | Typical meaning |
|---|---|
| S or 6 | Brand new or nearly new, very low mileage |
| 5 | Excellent condition, very low mileage |
| 4.5 | Very good condition, only very minor marks |
| 4 | Good condition, some small scratches or dents |
| 3.5 | Average condition, more visible wear or marks |
| 3 | Below average; may need cosmetic repair |
| 2 or 1 | Poor condition, or heavily modified/damaged |
| R or RA | Repaired accident history (RA usually means a minor repair) |

A grade of **4 or 4.5** is generally considered a good buy for a used car. An **R** grade does not automatically mean a bad car, but you should understand exactly what was repaired.

## Interior grade

Interior condition is usually given as a letter, typically from **A** (excellent) to **E** (poor). B is common for clean used cars.

## The damage diagram and codes

The sheet includes a diagram of the car with codes marking each issue. Common codes include:

- **A** — scratch (A1 small, A2 medium, A3 large)
- **U** — dent (U1 small to U3 large)
- **B** — dent with a scratch
- **W** — wave or repaired panel
- **S** — rust; **C** — corrosion
- **P** — paint marks or paint fading
- **X** — part needs replacing; **XX** — part has been replaced
- **Y** — crack or hole

## Mileage and other notes

The sheet records the odometer reading at inspection. Inspectors also write comments about things like interior wear, smoke smells, aftermarket parts or warning lights. These notes are often written in Japanese, so ask your importer to translate them.

## How we use auction sheets

When we source a vehicle for you, we share the auction sheet, photos and a translation of the important notes before purchase. Where a listing on our site has an auction grade recorded, it is shown in the vehicle's specifications.

Next, read [what to check before buying an imported vehicle](/blog/what-to-check-before-buying-an-imported-vehicle) or [browse vehicles for sale](/vehicles).`,
  },
  {
    slug: 'what-to-check-before-buying-an-imported-vehicle',
    title: 'What to Check Before Buying an Imported Vehicle in Sri Lanka',
    seoTitle: 'What to Check Before Buying an Imported Car in Sri Lanka',
    description:
      'A practical checklist for buying an imported Japanese vehicle in Sri Lanka — documents, auction sheet, mileage, condition, test drive, tax and registration details.',
    image: `${CLD}/v1781364068/R00481660-06_sjw4yj.jpg`,
    imageAlt: 'Red Toyota Yaris inspected before sale at Amila Car Sale',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Buying guide',
    sources: [S.dmt, S.customs],
    body: `Whether you are buying a brand-new import, an unregistered reconditioned car or a registered vehicle, a careful check before you pay saves money and stress later. Use this checklist when viewing any imported vehicle — including ours.

## Documents

- **Auction sheet** (for used imports) — check the grade, mileage and repair diagram. See [how to read auction grades](/blog/understanding-japanese-vehicle-auction-grades).
- **Export certificate** from Japan, showing chassis number, first registration date in Japan and other details.
- **Customs documents** showing the duty paid.
- For registered vehicles, the **registration certificate** (CR) from the [Department of Motor Traffic](https://dmt.gov.lk/) — confirm the owner details match the seller.

## Match the numbers

Make sure the **chassis number** and **engine number** on the vehicle match the documents. Check the year of manufacture as well as the model year.

## Mileage

Compare the odometer with the auction sheet and export documents. Very low mileage on an older vehicle deserves a closer look.

## Exterior and underbody

- Look along the panels for uneven gaps or paint mismatch (signs of repair).
- Check under the car for rust, oil leaks and damage — especially on vehicles from snowy regions of Japan.
- Inspect tyre condition and date codes.

## Interior and electronics

- Test every window, the air conditioning, infotainment, cameras and sensors.
- Note any warning lights on the dashboard after starting.
- Japanese-market infotainment may need localisation — ask what has been done.

## Hybrid and electric vehicles

Ask about the hybrid battery or EV battery health. A diagnostic scan can reveal stored fault codes and battery condition.

## Test drive

Drive on a mix of roads, including a hill if possible. Listen for knocks, check the transmission changes smoothly and that the car tracks straight under braking.

## Price, tax and paperwork

Make sure you understand whether the price includes duties and registration. If you are importing a vehicle yourself, estimate the duty first with our [import tax calculator](/tax-calculator).

## View our vehicles

Every vehicle at Amila Car Sale can be inspected at our Bandarawela showroom. [Browse current stock](/vehicles), see [our location](/location), or [book a viewing on WhatsApp](/contact).`,
  },
  {
    slug: 'how-to-reserve-a-japanese-vehicle',
    title: 'How to Reserve a Japanese Vehicle with Amila Car Sale',
    seoTitle: 'How to Reserve a Japanese Vehicle | Amila Car Sale',
    description:
      'How reservations work at Amila Car Sale Pvt Ltd — choosing a vehicle in stock or on order, confirming details, the reservation and what happens before handover.',
    image: `${CLD}/v1781944098/R00516001-01_z4hxxn.jpg`,
    imageAlt: 'Honda Vezel reserved by a customer at Amila Car Sale',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Importing',
    sources: [],
    body: `Popular Japanese vehicles — especially new-model Toyota and Honda SUVs — are often reserved before they reach our showroom. Here is how reserving a vehicle with us works.

## 1. Choose the vehicle

You can reserve:

- A vehicle **already in our showroom** — see [vehicles for sale](/vehicles).
- A vehicle **arriving soon** — some listings are marked *Reserved* or have no confirmed price yet because they are still being cleared.
- A vehicle **sourced to your requirements** from Japan — see [import from Japan](/import-from-japan).

## 2. Send an enquiry

Open the vehicle page and use **Enquire / Reserve on WhatsApp**. Your enquiry is sent to us with the full vehicle details, so we know exactly which car you mean. You can also call us on 075 454 3533.

## 3. Confirm the details

We will confirm availability, the price (or the estimated landed cost for vehicles still being imported), and answer any questions about condition, grade and documents. For vehicles being sourced, we share the auction sheet and photos before purchase.

## 4. Place the reservation

Once you are happy, we agree the reservation terms with you directly — including the reservation amount, what happens if the vehicle does not meet the agreed description, and the expected handover timeline. We always put these terms in writing.

## 5. Inspection and handover

Before handover you can inspect the vehicle at our [Bandarawela showroom](/location). We help with registration paperwork and can advise on bank finance and insurance.

## Status labels on our website

- **Available** — in stock and available to reserve.
- **Reserved** — a customer has reserved this vehicle. Ask us about similar vehicles.
- **Sold** — kept on the site for reference only.

## Ready to reserve?

[Browse vehicles](/vehicles) or [contact us](/contact) — we usually reply quickly on WhatsApp.`,
  },
  {
    slug: 'sri-lanka-vehicle-import-regulations',
    title: 'Sri Lanka Vehicle Import Regulations: What Buyers Should Know',
    seoTitle: 'Sri Lanka Vehicle Import Regulations — Buyer’s Overview',
    description:
      'An overview of how vehicle import rules work in Sri Lanka — who sets them, where they are published, age limits, tax changes and how to check the latest official position.',
    image: `${CLD}/v1781451741/pic_gg2f0l.jpg`,
    imageAlt: 'Toyota RAV4 hybrid imported to Sri Lanka under current regulations',
    author: AUTHOR,
    published: '2026-11-08',
    updated: '2026-11-08',
    category: 'Importing',
    sources: [S.gazettes, S.importControl, S.customs, S.treasury, S.dmt],
    body: `Vehicle imports into Sri Lanka are governed by several sets of rules: **import control regulations** (what may be imported and under what conditions), **tax laws** (excise duty, customs duty, VAT and levies) and **registration rules**. These rules have changed significantly in recent years and continue to be revised.

> This page is a general overview, last reviewed on the date shown above. It is not legal advice. Always confirm the current position with the official sources linked below — or ask us before you commit to an import.

## Recent history

Vehicle imports were heavily restricted from 2020 to protect foreign-exchange reserves. The restrictions were lifted in stages, with private passenger vehicles permitted again from early 2025, alongside a revised excise duty structure. Since then, further adjustments have been made through Gazette notifications.

## Who sets the rules

- **Import conditions** — the [Department of Import and Export Control](https://www.imexport.gov.lk/) under the Imports and Exports (Control) regulations.
- **Excise duty rates** — published by Gazette notification under the Excise (Special Provisions) Act, administered by the Ministry of Finance. Gazettes are available from the [Department of Government Printing](https://documents.gov.lk/).
- **Customs duty, classification and valuation** — [Sri Lanka Customs](https://www.customs.gov.lk/).
- **Registration** — the [Department of Motor Traffic](https://dmt.gov.lk/).

## Key things to check before importing

1. **Eligibility and age limits.** Used (reconditioned) vehicles must fall within the permitted age for their category, measured from the date of manufacture or first registration. The limits differ between passenger and commercial vehicles.
2. **Current excise duty rates** for the vehicle's category, engine capacity or motor power.
3. **Other taxes** — Customs Import Duty, surcharge, luxury tax, SSCL, VAT and VEL. See [Sri Lanka vehicle import tax explained](/blog/sri-lanka-vehicle-import-tax-explained).
4. **Payment conditions** — imports must be paid through the formal banking system.
5. **Timelines** — some rules set deadlines for clearing or registering an imported vehicle.

## How we keep you up to date

As direct importers, we follow every Gazette and Customs notice that affects vehicle imports. When rates change, we update our [vehicle import tax calculator](/tax-calculator) only after checking the official Gazette.

## Talk to us

If you are planning an import, [contact us](/contact) and we will confirm the rules that apply to the specific vehicle you want, or read our [step-by-step import guide](/blog/how-to-import-a-car-from-japan-to-sri-lanka).`,
  },
]

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}
