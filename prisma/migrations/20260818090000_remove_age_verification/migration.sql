-- Remove age verification/eligibility gating entirely. Date of birth remains
-- a plain, self-declared field on User; nothing blocks registration based on it.

-- DropForeignKey
ALTER TABLE "AgeVerification" DROP CONSTRAINT "AgeVerification_userId_fkey";

-- DropTable
DROP TABLE "AgeVerification";
