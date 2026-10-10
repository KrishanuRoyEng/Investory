-- CreateEnum
CREATE TYPE "BannerTag" AS ENUM ('LIVE', 'RECORDED', 'LIVE_AND_RECORDED');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "bannerTag" "BannerTag",
ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "compareAtPricePaise" INTEGER,
ADD COLUMN     "cutoutImageUrl" TEXT,
ADD COLUMN     "displayLearnerCount" INTEGER,
ADD COLUMN     "instructorId" TEXT,
ADD COLUMN     "instructorName" TEXT,
ADD COLUMN     "skills" TEXT[];

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_slug_key" ON "CourseCategory"("slug");

-- CreateIndex
CREATE INDEX "CourseCategory_sortOrder_idx" ON "CourseCategory"("sortOrder");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
