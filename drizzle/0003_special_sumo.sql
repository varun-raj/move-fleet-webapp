ALTER TABLE "vehicle" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicle" DROP COLUMN "vehicle_status";