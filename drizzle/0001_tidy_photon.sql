ALTER TABLE "job_consignment" ADD COLUMN "status" text DEFAULT 'bidding' NOT NULL;--> statement-breakpoint
ALTER TABLE "job_consignment" ADD COLUMN "vehicle_id" uuid;--> statement-breakpoint
ALTER TABLE "job_consignment" ADD COLUMN "price" integer;--> statement-breakpoint
ALTER TABLE "job_consignment" ADD COLUMN "transporter_id" uuid;--> statement-breakpoint
ALTER TABLE "job_consignment" ADD COLUMN "bid_line_item_id" uuid;--> statement-breakpoint
ALTER TABLE "job_consignment" ADD COLUMN "bid_id" uuid;