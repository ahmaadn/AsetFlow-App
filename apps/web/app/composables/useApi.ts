import { AssetService } from '~/lib/services/modules/asset';

export function useApi() {
  const asset = new AssetService();

  return {
    asset,
  };
}
