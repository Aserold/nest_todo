/*
  Warnings:

  - You are about to drop the `TaskFieldValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskFieldValue" DROP CONSTRAINT "TaskFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "TaskFieldValue" DROP CONSTRAINT "TaskFieldValue_taskId_fkey";

-- DropTable
DROP TABLE "TaskFieldValue";
