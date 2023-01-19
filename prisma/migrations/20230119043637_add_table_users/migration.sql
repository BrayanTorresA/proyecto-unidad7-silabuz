-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "last_session" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_born" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
