import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

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
  price: integer("price").notNull(),
  image: text("image").notNull().default("/placeholder.png"),
  features: text("features").notNull().default("[]"),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("Available"),
  grade: text("grade").notNull().default(""),
});
