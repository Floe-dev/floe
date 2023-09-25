-- CreateEnum
CREATE TYPE "Appearance" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "BackgroundPattern" AS ENUM ('DOTS', 'BLOBS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('THUMBS_UP', 'THUMBS_DOWN', 'LAUGH', 'HOORAY', 'CONFUSED', 'HEART', 'RANDOM');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "installationId" INTEGER NOT NULL,
    "encryptedApiKey" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "appearance" "Appearance" NOT NULL DEFAULT 'LIGHT',
    "primary" TEXT NOT NULL DEFAULT '#6366f1',
    "primaryDark" TEXT NOT NULL DEFAULT '#6366f1',
    "background" TEXT NOT NULL DEFAULT '#ffffff',
    "backgroundDark" TEXT NOT NULL DEFAULT '#09090b',
    "backgroundPattern" "BackgroundPattern",
    "customBackground" TEXT,
    "twitterURL" TEXT,
    "githubURL" TEXT,
    "youtubeURL" TEXT,
    "discordURL" TEXT,
    "slackURL" TEXT,
    "instagramURL" TEXT,
    "facebookURL" TEXT,
    "twitchURL" TEXT,
    "linkedinURL" TEXT,
    "homepageURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "baseBranch" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "datasourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,
    "postDataSourceId" TEXT NOT NULL,
    "postFilename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_installationId_slug_idx" ON "Project"("installationId", "slug");

-- CreateIndex
CREATE INDEX "DataSource_projectId_idx" ON "DataSource"("projectId");

-- CreateIndex
CREATE INDEX "Post_datasourceId_idx" ON "Post"("datasourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_datasourceId_filename_key" ON "Post"("datasourceId", "filename");

-- CreateIndex
CREATE INDEX "Reaction_postDataSourceId_postFilename_idx" ON "Reaction"("postDataSourceId", "postFilename");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_postDataSourceId_postFilename_ipAddress_type_key" ON "Reaction"("postDataSourceId", "postFilename", "ipAddress", "type");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "DataSource" ADD CONSTRAINT "DataSource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "DataSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postDataSourceId_postFilename_fkey" FOREIGN KEY ("postDataSourceId", "postFilename") REFERENCES "Post"("datasourceId", "filename") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
