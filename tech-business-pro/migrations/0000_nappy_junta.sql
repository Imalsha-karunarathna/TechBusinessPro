DO $$ BEGIN
  CREATE TYPE "conversation_status" AS ENUM ('pending', 'active', 'closed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "deal_status" AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "solution_category" AS ENUM ('website_development', 'it_security', 'crm_systems', 'business_applications', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "status" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('admin', 'solution_provider', 'solution_seeker');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'solution_seeker' NOT NULL,
	"avatar_url" text,
	"organization_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solution_providers"  (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"email" text NOT NULL,
	"website" text,
	"phone" text,
	"logo_url" text,
	"regions_served" text[],
	"verification_status" "status" DEFAULT 'pending' NOT NULL,
	"approved_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" text NOT NULL,
	"author_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"author_image" text,
	"image_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"reading_time" integer DEFAULT 5,
	"views_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"inquiry_type" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"solution_type" text,
	"preferred_contact" text,
	"ai_response" text,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"resolved_by" integer,
	"resolution_notes" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"solution_id" integer NOT NULL,
	"seeker_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"status" "conversation_status" DEFAULT 'active' NOT NULL,
	"subject" text NOT NULL,
	"last_message_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"seeker_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"solution_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"proposed_amount" text,
	"final_amount" text,
	"status" "deal_status" DEFAULT 'proposed' NOT NULL,
	"custom_terms" text,
	"proposed_timeline" text,
	"finalized_timeline" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"attachments" text[],
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_name" text NOT NULL,
	"organization_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"website" text,
	"expertise" text NOT NULL,
	"collaboration" text NOT NULL,
	"experience_years" integer,
	"reason" text,
	"additional_notes" text,
	"application_status" "status" DEFAULT 'pending' NOT NULL,
	"reviewer_id" integer,
	"review_notes" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "statistics"(
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"visitors_count" integer DEFAULT 0 NOT NULL,
	"solutions_views" integer DEFAULT 0 NOT NULL,
	"conversations_started" integer DEFAULT 0 NOT NULL,
	"deals_proposed" integer DEFAULT 0 NOT NULL,
	"deals_closed" integer DEFAULT 0 NOT NULL,
	"new_users" integer DEFAULT 0 NOT NULL,
	"chat_interactions" integer DEFAULT 0 NOT NULL,
	"search_queries" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "solution_category" NOT NULL,
	"provider_id" integer NOT NULL,
	"regions" text[] NOT NULL,
	"image_url" text,
	"features" text[],
	"pricing_info" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"inquiries_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitor_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"conversation_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
