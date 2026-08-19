-- Switch OTP verification from mobile/SMS to email. Mobile number becomes an
-- optional, unverified contact field collected later in the Details step.

-- AlterTable: User
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" DROP COLUMN "mobileVerified";

-- AlterTable: OtpRequest (backfill existing rows with an empty email, then
-- enforce NOT NULL — there is no real historical email to backfill from)
ALTER TABLE "OtpRequest" ADD COLUMN "email" TEXT NOT NULL DEFAULT '';
ALTER TABLE "OtpRequest" ALTER COLUMN "email" DROP DEFAULT;
ALTER TABLE "OtpRequest" DROP COLUMN "countryCode";
ALTER TABLE "OtpRequest" DROP COLUMN "mobile";

-- DropIndex
DROP INDEX "OtpRequest_mobile_createdAt_idx";

-- CreateIndex
CREATE INDEX "OtpRequest_email_createdAt_idx" ON "OtpRequest"("email", "createdAt");
