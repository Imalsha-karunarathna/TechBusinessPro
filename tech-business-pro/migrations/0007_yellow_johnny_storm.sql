CREATE TABLE "provider_expertise" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"name" text NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"reviewer_id" integer,
	"review_notes" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "provider_expertise" ADD CONSTRAINT "provider_expertise_provider_id_solution_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."solution_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "provider_expertise" ADD CONSTRAINT "provider_expertise_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_providers" DROP COLUMN "expertise";