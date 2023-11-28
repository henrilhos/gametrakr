ALTER TABLE "follows" RENAME COLUMN "followingUserId" TO "following_user_id";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "followedUserId" TO "followed_user_id";--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followinguserid_followeduserid";--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followingUserId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followedUserId_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_users_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_user_id_users_id_fk" FOREIGN KEY ("followed_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_user_id_followed_user_id" PRIMARY KEY("following_user_id","followed_user_id");
