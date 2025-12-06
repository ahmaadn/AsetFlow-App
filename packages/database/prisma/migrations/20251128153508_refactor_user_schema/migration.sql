

-- Hapus Constraint Foreign Key Sementara
ALTER TABLE "folders" DROP CONSTRAINT IF EXISTS "folders_owner_id_fkey";
ALTER TABLE "assets" DROP CONSTRAINT IF EXISTS "assets_owner_id_fkey";

-- Ubah Tipe Data ID User (Int -> String)
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "id" TYPE TEXT USING "id"::text;

-- Ubah Tipe Data Foreign Key di Tabel Relasi (WAJIB)
ALTER TABLE "folders" ALTER COLUMN "owner_id" TYPE TEXT USING "owner_id"::text;
ALTER TABLE "assets" ALTER COLUMN "owner_id" TYPE TEXT USING "owner_id"::text;

-- Tambah Kolom Baru
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "image" TEXT;

-- Bersih-bersih
ALTER TABLE "users" DROP COLUMN "deleted_at";
ALTER TABLE "users" DROP COLUMN "password_hash";

-- Relasi User -> Folder
ALTER TABLE "folders" ADD CONSTRAINT "folders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Relasi User -> Assets
ALTER TABLE "assets" ADD CONSTRAINT "assets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
