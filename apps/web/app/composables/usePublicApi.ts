export function usePublicApi() {
  const config = useRuntimeConfig();

  /**
   * Get public asset URL
   * @param folderSlug Folder slug
   * @param assetSlug Asset slug
   * @returns Full public asset URL
   */
  const getPublicAssetUrl = (folderSlug: string, assetSlug: string) => {
    return `${config.public.publicApiBase}/${folderSlug}/${assetSlug}`;
  };

  /**
   * Get public folder URL
   * @param folderSlug Folder slug
   * @param type Optional asset type filter
   * @returns Full public folder URL
   */
  const getPublicFolderUrl = (folderSlug: string, type?: string) => {
    const baseUrl = `${config.public.publicApiBase}/${folderSlug}`;
    return type ? `${baseUrl}?type=${type}` : baseUrl;
  };

  return {
    getPublicAssetUrl,
    getPublicFolderUrl,
  };
}
