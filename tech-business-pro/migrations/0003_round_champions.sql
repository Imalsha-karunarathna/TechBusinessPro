ALTER TABLE "partner_applications" ALTER COLUMN "expertise" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "solution_providers" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "solution_providers" ADD COLUMN "application_id" integer;--> statement-breakpoint
ALTER TABLE "solution_providers" ADD CONSTRAINT "solution_providers_user_id_unique" UNIQUE("user_id");