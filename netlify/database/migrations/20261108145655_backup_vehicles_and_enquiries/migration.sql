-- Safety backup taken before the SEO upgrade alters the vehicles and enquiries tables.
-- These are plain copies; nothing reads from them. They can be dropped once the upgrade is verified.
CREATE TABLE IF NOT EXISTS "backup_20261108_vehicles" AS SELECT * FROM "vehicles";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "backup_20261108_enquiries" AS SELECT * FROM "enquiries";
