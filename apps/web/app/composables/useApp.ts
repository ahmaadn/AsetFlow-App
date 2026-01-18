import type { MenuSection, ViewMode } from '~/types';

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

  const defaultMenuSections: MenuSection[] = [
    {
      title: 'Home',
      items: [
        {
          label: 'Dashboard',
          icon: 'ri:function-line',
          to: '/dashboard',
        },
      ],
    },
    {
      title: 'Files',
      items: [
        { label: 'Folder', icon: 'ri:folder-line', to: '/drive' },
        { label: 'Media Library', icon: 'ri:stack-line', to: '/assets' },
        {
          label: 'Documents',
          icon: 'ri:file-2-line',
          to: '/assets?type=document',
        },
        {
          label: 'Photos',
          icon: 'ri:multi-image-line',
          to: '/assets?type=image',
        },
        {
          label: 'Videos',
          icon: 'ri:video-on-line',
          to: '/assets?type=video',
        },
        {
          label: 'Music',
          icon: 'ri:music-line',
          to: '/assets?type=audio',
        },
      ],
    },
  ];

  const menuSections = computed((): MenuSection[] => {
    return defaultMenuSections;
  });

  const getLabelByRoute = (path: string) => {
    for (const section of defaultMenuSections) {
      const found = section.items.find((item) => item.to === path);
      if (found) return found.label;
    }
    return undefined;
  };

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
