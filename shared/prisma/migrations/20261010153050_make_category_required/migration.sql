/*
  Warnings:

  - Made the column `categoryId` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- Insert a default category to satisfy NOT NULL for existing courses
INSERT INTO "CourseCategory" ("id", "slug", "name", "sortOrder", "createdAt", "updatedAt") 
VALUES (gen_random_uuid()::text, 'uncategorized', 'Uncategorized', 99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- Update existing courses that have null categoryId
UPDATE "Course" 
SET "categoryId" = (SELECT id FROM "CourseCategory" WHERE slug = 'uncategorized' LIMIT 1) 
WHERE "categoryId" IS NULL;

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
