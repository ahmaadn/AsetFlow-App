UPDATE "assets"
SET "metadata" = jsonb_strip_nulls(
    jsonb_build_object(
        -- If width is 0, convert to NULL. If already NULL, keep NULL.
        'width', NULLIF("width", 0),

        -- If height is 0, convert to NULL. If already NULL, keep NULL.
        'height', NULLIF("height", 0)
    )
);

-- Now safe to drop old columns as data has been migrated
ALTER TABLE "assets" DROP COLUMN "width", DROP COLUMN "height";
