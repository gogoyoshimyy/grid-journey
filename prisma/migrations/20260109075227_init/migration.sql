-- CreateTable
CREATE TABLE "OrganizerUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "gridSize" INTEGER NOT NULL DEFAULT 3,
    "timeLimitMinutes" INTEGER NOT NULL,
    "lineBonusPoints" INTEGER NOT NULL DEFAULT 100,
    "maxResubmits" INTEGER NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "rules" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "OrganizerUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "coordinateX" INTEGER NOT NULL,
    "coordinateY" INTEGER NOT NULL,
    "kanji" TEXT NOT NULL,
    "description" TEXT,
    "hint" TEXT,
    "tilePoints" INTEGER NOT NULL DEFAULT 10,
    "tileType" TEXT NOT NULL DEFAULT 'normal',
    "eventBonusPoints" INTEGER NOT NULL DEFAULT 0,
    "submissionMode" TEXT NOT NULL DEFAULT 'photo_or_text',
    "publishAt" DATETIME,
    "expiresAt" DATETIME,
    "sponsorId" TEXT,
    CONSTRAINT "Tile_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tile_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "message" TEXT,
    "linkUrl" TEXT,
    "perkText" TEXT,
    CONSTRAINT "Sponsor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "slotKey" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "sponsorId" TEXT,
    "messageText" TEXT,
    CONSTRAINT "AdSlot_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AdSlot_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "participantName" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "lastSubmissionAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Run_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "tileId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "photoUrl" TEXT,
    "textContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNote" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    CONSTRAINT "Submission_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submission_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BingoLineState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "achievedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BingoLineState_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PointLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "refId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PointLedger_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizerUser_email_key" ON "OrganizerUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tile_eventId_coordinateX_coordinateY_key" ON "Tile"("eventId", "coordinateX", "coordinateY");

-- CreateIndex
CREATE UNIQUE INDEX "BingoLineState_runId_lineId_key" ON "BingoLineState"("runId", "lineId");
