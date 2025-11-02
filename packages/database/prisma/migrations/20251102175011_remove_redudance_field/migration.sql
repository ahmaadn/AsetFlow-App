/*
  Warnings:

  - You are about to drop the column `resource_type` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "resource_type",
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;
