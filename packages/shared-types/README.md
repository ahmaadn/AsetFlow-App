Aturan penulisan type dan interface yang digunakan bersama di seluruh proyek AsetFlow.

1. untuk hasil database gunakan postfix 'Query' pada nama type atau interface
   contoh: `UserQuery`, `AssetQuery`, `FolderWithAssetCountQuery`
2. untuk hasil dari API gunakan postfix 'Response' pada nama type atau interface
   contoh: `UserResponse`, `AssetResponse`
3. untuk data yang dikirim ke API gunakan postfix 'Input' pada nama type atau interface
   contoh: `CreateUserInput`, `UpdateAssetInput`
4. untuk data yang digunakan di dalam aplikasi gunakan postfix 'DTO' pada nama type atau interface
   contoh: `CreateUserDTO`, `UpdateAssetDTO`, `FolderQueryOptionsDTO`
5. untuk model database gunakan postfix 'Model' pada nama type atau interface
   contoh: `UserModel`, `AssetModel`
6. untuk enum gunakan postfix 'Enum' pada nama enum
   contoh: `UserRoleEnum`, `AssetTypeEnum`
7. untuk type utilitas gunakan postfix 'Type' pada nama type atau interface
   contoh: `PaginationType`, `SortOrderType`
8. untuk nama file gunakan format lowercase dengan pemisah tanda hubung (-) dengan akhiran .types.ts
   contoh: `user.types.ts`, `asset-response.types.ts`, `folder-query-options.types.ts`
