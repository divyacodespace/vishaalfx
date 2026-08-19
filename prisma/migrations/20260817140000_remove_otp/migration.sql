-- Remove OTP/email verification entirely. Email and mobile become plain,
-- self-declared contact fields with no verification step in the flow.

-- DropForeignKey
ALTER TABLE "OtpRequest" DROP CONSTRAINT "OtpRequest_userId_fkey";

-- DropTable
DROP TABLE "OtpRequest";

-- AlterTable: User
ALTER TABLE "User" DROP COLUMN "emailVerified";
