import { AssetService } from '~/lib/services/modules/asset';
import { AuthService } from '~/lib/services/modules/auth';
import { FolderService } from '~/lib/services/modules/folder';
import { StatisticsService } from '~/lib/services/modules/statistics';
import { UploadService } from '~/lib/services/modules/upload';

export function useApi() {
  const folder = new FolderService();
  const asset = new AssetService();
  const upload = new UploadService();
  const statistics = new StatisticsService();
  const auth = new AuthService();

  return {
    folder,
    asset,
    upload,
    statistics,
    auth,
  };
}
