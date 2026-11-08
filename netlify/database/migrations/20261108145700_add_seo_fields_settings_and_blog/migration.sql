CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"seo_title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"image_alt" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"author" text DEFAULT 'Amila Car Sale Pvt Ltd' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY,
	"value" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "source" text DEFAULT 'vehicle' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "gallery" text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "image_alt" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "seo_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "seo_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "visibility" text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "noindex" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "condition" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "manufacture_date" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "auction_grade" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "chassis_number" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;