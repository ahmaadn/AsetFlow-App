-- This is an empty migration.
-- Ubah created_at
ALTER TABLE "assets"
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6)
USING "created_at"::timestamptz;

-- Ubah updated_at
ALTER TABLE "assets"
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6)
USING "updated_at"::timestamptz;
