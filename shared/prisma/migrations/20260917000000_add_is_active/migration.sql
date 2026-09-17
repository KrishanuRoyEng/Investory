-- AlterTable
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_registrationEmail_liveSessionId_key" ON "Attendance"("registrationEmail", "liveSessionId");
