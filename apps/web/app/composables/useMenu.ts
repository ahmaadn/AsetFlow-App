import type { MenuSection } from '~/types';

export const useMenu = () => {
  const defaultMenuSections: MenuSection[] = [
    // {
    //   title: 'Recently',
    //   items: [
    //     {
    //       label: 'Overview',
    //       icon: 'ri:search-eye-line',
    //       to: '/overview',
    //     },
    //   ],
    // },
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
        { label: 'Media Library', icon: 'ri:stack-line', to: '/media/all' },
        { label: 'Documents', icon: 'ri:file-2-line', to: '/media/document' },
        { label: 'Photos', icon: 'ri:multi-image-line', to: '/media/image' },
        { label: 'Videos', icon: 'ri:video-on-line', to: '/media/video' },
        { label: 'Music', icon: 'ri:music-line', to: '/media/audio' },
      ],
    },
    {
      title: 'Account',
      items: [
        // { label: 'Settings', icon: 'ri:settings-line', to: '/settings' },
        {
          label: 'Logout',
          icon: 'ri:logout-box-line',
          action: () => {
            navigateTo('/logout');
          },
        },
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
