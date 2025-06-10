ALTER TABLE "vehicle" ALTER COLUMN "floor_size" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vehicle" ADD COLUMN "location_coordinates" "point";--> statement-breakpoint
ALTER TABLE "vehicle" DROP COLUMN "latitude";--> statement-breakpoint
ALTER TABLE "vehicle" DROP COLUMN "longitude";