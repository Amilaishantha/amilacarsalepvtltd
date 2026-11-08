import type { Faq } from '@/lib/seo'
import { site } from '@/data/site'

export const HOME_FAQS: Faq[] = [
  {
    q: 'Where is Amila Car Sale located?',
    a: `Our showroom is on ${site.addressLine}. We are open ${site.hoursDisplay}. You can call or WhatsApp us on ${site.phoneDisplay}.`,
  },
  {
    q: 'Do you sell brand-new Japanese vehicles?',
    a: 'Yes. We import brand-new, zero-mileage and low-mileage vehicles directly from Japan. Each listing on our website shows the recorded mileage and condition of that vehicle.',
  },
  {
    q: 'Can you import a vehicle from Japan that is not in your stock?',
    a: 'Yes. Tell us the make, model, grade, colour, year and budget. We source the vehicle from Japanese auctions or dealers, share the auction sheet and photos with you, and give you an estimated landed cost before you commit.',
  },
  {
    q: 'How do I reserve a vehicle?',
    a: 'Open the vehicle page and send a reservation request on WhatsApp, or call us. We confirm availability, price and the reservation terms with you directly, in writing.',
  },
  {
    q: 'Why do some vehicles show “Price on Request”?',
    a: 'Prices for vehicles that are still being imported depend on final duty and exchange rates, so we only show a price once it is confirmed. Message us and we will give you the current price or estimate.',
  },
  {
    q: 'Do you help with bank finance?',
    a: 'Yes. We work with Sri Lankan banks and leasing companies and can help you arrange finance for your vehicle.',
  },
  {
    q: 'Do you sell to customers outside Bandarawela?',
    a: 'Yes. We serve customers in Badulla District, the wider Uva Province and across Sri Lanka.',
  },
]

export const IMPORT_FAQS: Faq[] = [
  {
    q: 'How long does it take to import a car from Japan?',
    a: 'Timing depends on finding the right vehicle, shipping schedules and customs clearance. We give you an estimated timeline when we confirm the vehicle, and keep you updated at each stage.',
  },
  {
    q: 'Will I see the auction sheet before buying?',
    a: 'Yes. For auction vehicles we share the auction sheet, photos and a translation of the important notes before purchase.',
  },
  {
    q: 'How is the import tax calculated?',
    a: 'Mainly from the CIF value, engine capacity (or motor power for EVs), fuel type and vehicle category. Use our vehicle import tax calculator for an estimate; final duty is assessed by Sri Lanka Customs.',
  },
  {
    q: 'Can you import vehicles other than Japanese brands?',
    a: 'Our speciality is vehicles from Japan, which includes many European and other brands sold in the Japanese market. Ask us about the vehicle you want.',
  },
]

export const TAX_FAQS: Faq[] = [
  {
    q: 'How is vehicle import tax calculated in Sri Lanka?',
    a: 'The main components are excise duty (XID, based on engine capacity in cc, or motor power in kW for electric vehicles), Customs Import Duty (a percentage of CIF), a surcharge on the Customs Import Duty, luxury tax where the CIF value exceeds the category threshold, SSCL, VAT and VEL. The calculator adds these together to estimate the total.',
  },
  {
    q: 'What is CIF value?',
    a: 'CIF means Cost, Insurance and Freight — the price of the vehicle plus marine insurance and shipping to Sri Lanka, converted to rupees. Most import taxes are calculated from it.',
  },
  {
    q: 'What is XID or excise duty on vehicles?',
    a: 'Excise duty is the largest tax on most imported vehicles. For petrol, diesel and hybrid vehicles it is charged per cc of engine capacity (or as a fixed amount for some categories); for electric vehicles it is charged per kW of motor power, with different rates by vehicle age.',
  },
  {
    q: 'Does every vehicle pay luxury tax?',
    a: 'No. Luxury tax only applies when the CIF value exceeds the threshold set for the vehicle category, and it is charged on the amount above that threshold.',
  },
  {
    q: 'Is the calculator result the final amount I will pay?',
    a: 'No — it is an estimate. Final duty depends on Customs valuation, HS classification, exchange rate on the day, vehicle age and any new Gazette notification. Contact us for a confirmed landed-cost quote.',
  },
  {
    q: 'Are the calculator rates up to date?',
    a: 'The rates are based on the Gazette XID rates used by our team. We only change them after checking official Gazette notifications. You can also edit the CID, surcharge, SSCL, VAT and VEL fields if a rate changes.',
  },
]
