-- Change column type with conversion instruction (casting)
ALTER TABLE "assets"
ALTER COLUMN "size" TYPE BIGINT
USING "size"::bigint;
