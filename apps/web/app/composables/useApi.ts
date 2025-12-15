import { AssetService } from '~/lib/services/modules/asset';
import { AuthService } from '~/lib/services/modules/auth';
import { FolderService } from '~/lib/services/modules/folder';
import { UploadService } from '~/lib/services/modules/upload';

export function useApi() {
  const auth = new AuthService();
  const folder = new FolderService();
  const asset = new AssetService();
  const upload = new UploadService();

  return {
    auth,
    folder,
    asset,
    upload,
  };
}
