-- Add an editable .docx copy of the agreement alongside the signed, tamper-evident PDF.

-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN "docxStoragePath" TEXT;
ALTER TABLE "Agreement" ADD COLUMN "docxDocumentHash" TEXT;
