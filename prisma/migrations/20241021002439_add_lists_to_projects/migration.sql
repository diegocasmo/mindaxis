-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('ICEBOX', 'TODO', 'DOING', 'DONE');

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "type" "ListType" NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lists_project_id_idx" ON "lists"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "lists_type_project_id_key" ON "lists"("type", "project_id");

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
