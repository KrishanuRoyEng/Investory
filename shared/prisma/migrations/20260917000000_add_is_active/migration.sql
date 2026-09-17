-- CreateEnum
CREATE TYPE "LiveSessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FLAT');

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "registrationEmail" TEXT NOT NULL,
ADD COLUMN     "registrationName" TEXT NOT NULL,
ADD COLUMN     "registrationPhone" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "discountType",
ADD COLUMN     "discountType" "DiscountType" NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "LiveSession" ADD COLUMN     "recordingUrl" TEXT,
ADD COLUMN     "status" "LiveSessionStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "invoiceUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_registrationEmail_liveSessionId_key" ON "Attendance"("registrationEmail", "liveSessionId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

