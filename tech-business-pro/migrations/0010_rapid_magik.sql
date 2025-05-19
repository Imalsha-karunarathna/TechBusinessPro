CREATE TABLE "contact_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider_id" integer NOT NULL,
	"seeker_id" integer NOT NULL,
	"seeker_name" text NOT NULL,
	"seeker_email" text NOT NULL,
	"requirements" text NOT NULL,
	"preferred_date" varchar(10) NOT NULL,
	"preferred_time_slot" varchar(50) NOT NULL,
	"urgency" varchar(10) NOT NULL,
	"phone" varchar(20),
	"company_name" varchar(100),
	"budget" varchar(50),
	"additional_info" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
