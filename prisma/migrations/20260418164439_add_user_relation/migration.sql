/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Todo` table. All the data in the column will be lost.
*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create a default user for existing todos
INSERT INTO "User" (id, email, name) VALUES ('default_user', 'default@example.com', 'Default User');

-- AlterTable - add userId with default value for existing rows
ALTER TABLE "Todo" DROP COLUMN "createdAt",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'default_user';

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
