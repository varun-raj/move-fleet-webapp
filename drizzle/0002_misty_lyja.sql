ALTER TABLE "job" ALTER COLUMN "job_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "job_status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "job" ALTER COLUMN "job_status" SET NOT NULL;