CREATE TYPE "public"."profile_imagery_kind" AS ENUM('profile', 'cover');--> statement-breakpoint
CREATE TABLE "profile_imagery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" "profile_imagery_kind" NOT NULL,
	"public_location" text NOT NULL,
	"storage_adapter" text,
	"storage_key" text,
	"current_revision" integer DEFAULT 1 NOT NULL,
	"revisioned_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_imagery_current_revision_check" CHECK ("profile_imagery"."current_revision" >= 1),
	CONSTRAINT "profile_imagery_adapter_key_pairing_check" CHECK (("profile_imagery"."storage_adapter" IS NULL) = ("profile_imagery"."storage_key" IS NULL)),
	CONSTRAINT "profile_imagery_adapter_known_check" CHECK ("profile_imagery"."storage_adapter" IS NULL OR "profile_imagery"."storage_adapter" IN ('local', 'uploadthing'))
);
--> statement-breakpoint
ALTER TABLE "profile_imagery" ADD CONSTRAINT "profile_imagery_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profile_imagery_user_id_kind_idx" ON "profile_imagery" USING btree ("user_id","kind");