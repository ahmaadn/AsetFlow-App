import { AssetService } from '~/lib/services/modules/asset';
import { FolderService } from '~/lib/services/modules/folder';
import { UploadService } from '~/lib/services/modules/upload';

export function useApi() {
  const folder = new FolderService();
  const asset = new AssetService();
  const upload = new UploadService();

  return {
    folder,
    asset,
    upload,
  };
}
