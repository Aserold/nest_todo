-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('STRING', 'NUMBER', 'OPTION');

-- CreateTable
CREATE TABLE "TaskField" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fieldType" "FieldType" NOT NULL,

    CONSTRAINT "TaskField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskFieldValue" (
    "taskId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "stringValue" TEXT,
    "numberValue" DOUBLE PRECISION,

    CONSTRAINT "TaskFieldValue_pkey" PRIMARY KEY ("taskId","fieldId")
);

-- CreateIndex
CREATE INDEX "TaskField_projectId_idx" ON "TaskField"("projectId");

-- AddForeignKey
ALTER TABLE "TaskField" ADD CONSTRAINT "TaskField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFieldValue" ADD CONSTRAINT "TaskFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "TaskField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
