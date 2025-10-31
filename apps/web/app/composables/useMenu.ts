import type { MenuSection } from '~/types';

export const useMenu = () => {
  const defaultMenuSections: MenuSection[] = [
    {
      title: 'Recently',
      items: [
        {
          label: 'Overview',
          icon: 'ri:search-eye-line',
          to: '/overview',
        },
      ],
    },
    {
      title: 'Dashboard',
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
        { label: 'Folder', icon: 'ri:folder-line', to: '/folder' },
        { label: 'Media Library', icon: 'ri:stack-line', to: '/media' },
        { label: 'Documents', icon: 'ri:file-2-line', to: '/documents' },
        { label: 'Photos', icon: 'ri:multi-image-line', to: '/photos' },
        { label: 'Videos', icon: 'ri:video-on-line', to: '/videos' },
        { label: 'Music', icon: 'ri:music-line', to: '/music' },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Settings', icon: 'ri:settings-line', to: '/settings' },
        { label: 'Logout', icon: 'ri:logout-box-line', to: '/logout' },
      ],
    },
  ];

  const menuSections = computed((): MenuSection[] => {
    return defaultMenuSections;
  });

  return {
    menuSections,
  };
};
