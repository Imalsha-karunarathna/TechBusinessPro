ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."solution_category";--> statement-breakpoint
CREATE TYPE "public"."solution_category" AS ENUM('website_development', 'it_security', 'crm_systems', 'business_applications');--> statement-breakpoint
ALTER TABLE "solutions" ALTER COLUMN "category" SET DATA TYPE "public"."solution_category" USING "category"::"public"."solution_category";