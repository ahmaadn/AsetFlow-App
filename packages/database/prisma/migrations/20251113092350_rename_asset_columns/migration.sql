-- Remove assetsType
ALTER TABLE "assets" DROP COLUMN "asset_type";

-- Rename originalName to name
ALTER TABLE "assets" RENAME COLUMN "original_name" TO "name";
