import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_home_page_trust_points_icon_key" ADD VALUE 'hospital' BEFORE 'wifi';
  ALTER TYPE "public"."enum_home_page_trust_points_icon_key" ADD VALUE 'shopping' BEFORE 'wifi';
  ALTER TYPE "public"."enum_home_page_why_points_icon_key" ADD VALUE 'hospital' BEFORE 'wifi';
  ALTER TYPE "public"."enum_home_page_why_points_icon_key" ADD VALUE 'shopping' BEFORE 'wifi';
  ALTER TYPE "public"."enum_about_page_values_icon_key" ADD VALUE 'hospital' BEFORE 'wifi';
  ALTER TYPE "public"."enum_about_page_values_icon_key" ADD VALUE 'shopping' BEFORE 'wifi';
  ALTER TYPE "public"."enum_community_page_what_gets_shared_icon_key" ADD VALUE 'hospital' BEFORE 'wifi';
  ALTER TYPE "public"."enum_community_page_what_gets_shared_icon_key" ADD VALUE 'shopping' BEFORE 'wifi';
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_amenities_icon_key";
  CREATE TYPE "public"."enum_amenities_icon_key" AS ENUM('check', 'security', 'securityCheck', 'metro', 'pin', 'campus', 'hospital', 'shopping', 'wifi', 'power', 'water', 'housekeeping', 'inclusive', 'community', 'opportunity', 'chat', 'clock');
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_amenities_icon_key";
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_amenities_icon_key" USING "icon_key"::"public"."enum_amenities_icon_key";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_amenities_icon_key";
  CREATE TYPE "public"."enum_amenities_icon_key" AS ENUM('check', 'wifi', 'power', 'water', 'housekeeping', 'security', 'securityCheck', 'inclusive', 'community', 'metro', 'campus', 'hospital', 'shopping', 'clock');
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_amenities_icon_key";
  ALTER TABLE "amenities" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_amenities_icon_key" USING "icon_key"::"public"."enum_amenities_icon_key";
  ALTER TABLE "home_page_trust_points" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "home_page_trust_points" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_home_page_trust_points_icon_key";
  CREATE TYPE "public"."enum_home_page_trust_points_icon_key" AS ENUM('check', 'security', 'securityCheck', 'metro', 'pin', 'campus', 'wifi', 'power', 'water', 'housekeeping', 'inclusive', 'community', 'opportunity', 'chat', 'clock');
  ALTER TABLE "home_page_trust_points" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_home_page_trust_points_icon_key";
  ALTER TABLE "home_page_trust_points" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_home_page_trust_points_icon_key" USING "icon_key"::"public"."enum_home_page_trust_points_icon_key";
  ALTER TABLE "home_page_why_points" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "home_page_why_points" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_home_page_why_points_icon_key";
  CREATE TYPE "public"."enum_home_page_why_points_icon_key" AS ENUM('check', 'security', 'securityCheck', 'metro', 'pin', 'campus', 'wifi', 'power', 'water', 'housekeeping', 'inclusive', 'community', 'opportunity', 'chat', 'clock');
  ALTER TABLE "home_page_why_points" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_home_page_why_points_icon_key";
  ALTER TABLE "home_page_why_points" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_home_page_why_points_icon_key" USING "icon_key"::"public"."enum_home_page_why_points_icon_key";
  ALTER TABLE "about_page_values" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "about_page_values" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_about_page_values_icon_key";
  CREATE TYPE "public"."enum_about_page_values_icon_key" AS ENUM('check', 'security', 'securityCheck', 'metro', 'pin', 'campus', 'wifi', 'power', 'water', 'housekeeping', 'inclusive', 'community', 'opportunity', 'chat', 'clock');
  ALTER TABLE "about_page_values" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_about_page_values_icon_key";
  ALTER TABLE "about_page_values" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_about_page_values_icon_key" USING "icon_key"::"public"."enum_about_page_values_icon_key";
  ALTER TABLE "community_page_what_gets_shared" ALTER COLUMN "icon_key" SET DATA TYPE text;
  ALTER TABLE "community_page_what_gets_shared" ALTER COLUMN "icon_key" SET DEFAULT 'check'::text;
  DROP TYPE "public"."enum_community_page_what_gets_shared_icon_key";
  CREATE TYPE "public"."enum_community_page_what_gets_shared_icon_key" AS ENUM('check', 'security', 'securityCheck', 'metro', 'pin', 'campus', 'wifi', 'power', 'water', 'housekeeping', 'inclusive', 'community', 'opportunity', 'chat', 'clock');
  ALTER TABLE "community_page_what_gets_shared" ALTER COLUMN "icon_key" SET DEFAULT 'check'::"public"."enum_community_page_what_gets_shared_icon_key";
  ALTER TABLE "community_page_what_gets_shared" ALTER COLUMN "icon_key" SET DATA TYPE "public"."enum_community_page_what_gets_shared_icon_key" USING "icon_key"::"public"."enum_community_page_what_gets_shared_icon_key";`)
}
