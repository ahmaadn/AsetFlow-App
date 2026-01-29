import type { MenuSection, ViewMode } from '~/types';
import { defaultMenuSections, findMenuLabel } from '~/utils/menu';

export const useAppState = () => {
  const isCollapsed = useState('sidebar-collapsed', () => false);
  const toggle = () => (isCollapsed.value = !isCollapsed.value);
  const setCollapsed = (value: boolean) => (isCollapsed.value = value);

  const folderViewMode = useState<ViewMode>('folder-view-mode', () => 'list');
  const viewModeAssets = useState<ViewMode>('assets-view-mode', () => 'grid');

  const headerTitle = useState('header-title', () => 'Dashboard');

  const isModalCreateOpen = useState('is-modal-create-open', () => false);
  const setModalCreateOpen = (value: boolean) => {
    isModalCreateOpen.value = value;
  };

  const setHeaderTitle = (title: string) => {
    headerTitle.value = title;
  };

  const setViewModeAssets = (mode: ViewMode) => {
    viewModeAssets.value = mode;
  };

  const setViewFolderMode = (mode: ViewMode) => {
    folderViewMode.value = mode;
  };

  const menuSections = computed((): MenuSection[] => defaultMenuSections);

  const getLabelByRoute = (path: string) => findMenuLabel(path);

  return {
    // Sidebar
    isCollapsed,
    toggle,
    setCollapsed,
    menuSections,
    getLabelByRoute,
    // Header
    headerTitle,
    setHeaderTitle,
    // View Modes
    folderViewMode,
    setViewFolderMode,
    viewModeAssets,
    setViewModeAssets,
    // Modals
    isModalCreateOpen,
    setModalCreateOpen,
  };
};
