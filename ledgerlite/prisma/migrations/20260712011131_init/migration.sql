/*
  Warnings:

  - You are about to drop the column `customItem` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "customItem";

-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "customItem" TEXT;
