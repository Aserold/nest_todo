/*
  Warnings:

  - The values [OPTION] on the enum `FieldType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FieldType_new" AS ENUM ('STRING', 'NUMBER');
ALTER TABLE "TaskField" ALTER COLUMN "fieldType" TYPE "FieldType_new" USING ("fieldType"::text::"FieldType_new");
ALTER TYPE "FieldType" RENAME TO "FieldType_old";
ALTER TYPE "FieldType_new" RENAME TO "FieldType";
DROP TYPE "FieldType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TaskFieldValue" DROP CONSTRAINT "TaskFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "TaskFieldValue" DROP CONSTRAINT "TaskFieldValue_taskId_fkey";

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "TaskField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
