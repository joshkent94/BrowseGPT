/*
  Warnings:

  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP CONSTRAINT "chats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "chats_id_seq";

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "messages_id_seq";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
