CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY,
	"vehicle_id" integer,
	"vehicle_title" text DEFAULT '' NOT NULL,
	"vehicle_image" text DEFAULT '' NOT NULL,
	"vehicle_price" integer,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_message" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
