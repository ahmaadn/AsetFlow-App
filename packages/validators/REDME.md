Aturan penulisan README.md untuk paket validators.

1. Gunakan akhiran `Schema` untuk setiap validator skema.
   Contoh: `UserSchema`, `ProductSchema`.
2. Gunakan awalan `http` dan akhiran `Schema` untuk validator skema HTTP.
   Contoh: `httpRequestSchema`, `httpResponseSchema`.
3. Gunakan akhiran `Input` untuk setiap infer yang di konversi dari skema.
   Contoh: `UserInput`, `ProductInput`.
4. Gunakan awalan `http` dan akhiran `Input` untuk infer HTTP
   Contoh: `httpRequestInput`, `httpResponseInput`.
5. filename harus berakhiran dengan `.schema.ts` untuk file skema.
   Contoh: `user.schema.ts`, `product.schema.ts`.
