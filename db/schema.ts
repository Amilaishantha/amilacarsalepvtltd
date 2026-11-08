import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(),
  fuel: text("fuel").notNull(),
  engineCC: integer("engine_cc"),
  motorKW: integer("motor_kw"),
  mileage: integer("mileage").notNull(),
  color: text("color").notNull(),
  transmission: text("transmission").notNull(),
  /** 0 (or an implausibly small number) means "Price on Request" — never shown as a selling price. */
  price: integer("price").notNull(),
  image: text("image").notNull().default("/placeholder.png"),
  features: text("features").notNull().default("[]"),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("Available"),
  grade: text("grade").notNull().default(""),
  // ── SEO & listing management (added 2026-11) ──
  /** JSON array of extra photo URLs shown in the gallery. */
  gallery: text("gallery").notNull().default("[]"),
  imageAlt: text("image_alt").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  /** 'published' or 'draft'. Drafts are hidden from the public site. */
  visibility: text("visibility").notNull().default("published"),
  featured: boolean("featured").notNull().default(false),
  /** Manual noindex override for an otherwise public page. */
  noindex: boolean("noindex").notNull().default(false),
  /** e.g. "Brand New", "Unregistered (Reconditioned)", "Registered (Used)". Empty = not stated. */
  condition: text("condition").notNull().default(""),
  manufactureDate: text("manufacture_date").notNull().default(""),
  auctionGrade: text("auction_grade").notNull().default(""),
  chassisNumber: text("chassis_number").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id"),
  vehicleTitle: text("vehicle_title").notNull().default(""),
  vehicleImage: text("vehicle_image").notNull().default(""),
  vehiclePrice: integer("vehicle_price"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerMessage: text("customer_message").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  /** Where the enquiry came from: vehicle, contact, tax-calculator, import-request. */
  source: text("source").notNull().default("vehicle"),
});

/** Key/value settings edited from the admin dashboard (analytics IDs, verification codes, page SEO, testimonials). */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Knowledge-centre articles written from the admin dashboard (built-in guides live in src/data/articles.ts). */
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  seoTitle: text("seo_title").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  body: text("body").notNull().default(""),
  author: text("author").notNull().default("Amila Car Sale Pvt Ltd"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
