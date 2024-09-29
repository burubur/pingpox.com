-- CreateTable
CREATE TABLE "identity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "phone_number" TEXT,
    "address" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "superadmin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enabled" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "venue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "s2id_7" INTEGER NOT NULL,
    "s2id_12" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "provider_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME,
    CONSTRAINT "venue_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "court" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "venue_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME,
    CONSTRAINT "court_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partner_work_hour" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partner_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "hour_of_day" TEXT NOT NULL,
    CONSTRAINT "partner_work_hour_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partner_leave_plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partner_id" TEXT NOT NULL,
    "leave_date" DATETIME NOT NULL,
    "leave_type" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "partner_leave_plan_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partner_slot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partner_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "slot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "venue_id" TEXT,
    "court_id" TEXT,
    "user_id" TEXT,
    "trainer_id" TEXT NOT NULL,
    "assistan_ids" TEXT,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slot_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "participants" TEXT,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "private_url" TEXT NOT NULL,
    "public_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaction_type" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "transaction_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaction_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaction_id" TEXT NOT NULL,
    "total_amount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transaction_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "deleted_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_id_key" ON "identity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_email_key" ON "identity"("email");

-- CreateIndex
CREATE INDEX "identity_created_at_updated_at_deleted_at_idx" ON "identity"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "superadmin_id_key" ON "superadmin"("id");

-- CreateIndex
CREATE INDEX "superadmin_created_at_updated_at_deleted_at_idx" ON "superadmin"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE INDEX "user_created_at_updated_at_deleted_at_idx" ON "user"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "partner_id_key" ON "partner"("id");

-- CreateIndex
CREATE INDEX "partner_status_idx" ON "partner"("status");

-- CreateIndex
CREATE INDEX "partner_created_at_updated_at_deleted_at_idx" ON "partner"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "provider_id_key" ON "provider"("id");

-- CreateIndex
CREATE INDEX "provider_created_at_updated_at_deleted_at_idx" ON "provider"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "venue_id_key" ON "venue"("id");

-- CreateIndex
CREATE INDEX "venue_created_at_updated_at_deleted_at_idx" ON "venue"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "court_id_key" ON "court"("id");

-- CreateIndex
CREATE INDEX "court_created_at_updated_at_deleted_at_idx" ON "court"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "partner_work_hour_id_key" ON "partner_work_hour"("id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_leave_plan_id_key" ON "partner_leave_plan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_slot_id_key" ON "partner_slot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_id_key" ON "slot"("id");

-- CreateIndex
CREATE INDEX "slot_created_at_updated_at_deleted_at_idx" ON "slot"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "stream_id_key" ON "stream"("id");

-- CreateIndex
CREATE UNIQUE INDEX "video_id_key" ON "video"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_id_key" ON "transaction"("id");

-- CreateIndex
CREATE INDEX "transaction_created_at_updated_at_idx" ON "transaction"("created_at", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_id_key" ON "transaction_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_id_key" ON "payments"("id");

-- CreateIndex
CREATE INDEX "payments_created_at_updated_at_deleted_at_idx" ON "payments"("created_at", "updated_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "review_id_key" ON "review"("id");

-- CreateIndex
CREATE INDEX "review_created_at_updated_at_deleted_at_idx" ON "review"("created_at", "updated_at", "deleted_at");
