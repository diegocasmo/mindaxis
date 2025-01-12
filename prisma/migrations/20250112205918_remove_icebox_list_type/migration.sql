/*
  Warnings:

  - The values [ICEBOX] on the enum `ListType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListType_new" AS ENUM ('TODO', 'DOING', 'DONE');
ALTER TABLE "lists" ALTER COLUMN "type" TYPE "ListType_new" USING ("type"::text::"ListType_new");
ALTER TYPE "ListType" RENAME TO "ListType_old";
ALTER TYPE "ListType_new" RENAME TO "ListType";
DROP TYPE "ListType_old";
COMMIT;
