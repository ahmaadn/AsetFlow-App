import type { ViewMode } from '~/types';

interface Settings {
  viewModeAssets: ViewMode;
}

export function useSetting() {
  const settings = useState<Settings>('settings', () => ({
    viewModeAssets: 'grid',
  }));

  const getViewModeAssets = computed((): ViewMode => {
    return settings.value.viewModeAssets;
  });

  const setViewModeAssets = (mode: ViewMode) => {
    settings.value.viewModeAssets = mode;
  };

  return {
    getViewModeAssets,
    setViewModeAssets,
  };
}
