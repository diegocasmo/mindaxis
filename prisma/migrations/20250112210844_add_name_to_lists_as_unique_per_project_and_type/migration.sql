/*
  Warnings:

  - A unique constraint covering the columns `[type,project_id,name]` on the table `lists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lists_type_project_id_name_key" ON "lists"("type", "project_id", "name");
