ALTER TABLE "job_bid_line_item" ALTER COLUMN "job_consignment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_bid_line_item" ADD COLUMN "transporter_id" uuid NOT NULL;