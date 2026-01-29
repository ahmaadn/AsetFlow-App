import type { MenuItem, MenuSection } from '~/types';

const homeMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'ri:function-line',
    to: '/dashboard',
  },
];

const fileMenuItems: MenuItem[] = [
  { label: 'Folder', icon: 'ri:folder-line', to: '/drive' },
  {
    label: 'Media Library',
    icon: 'ri:stack-line',
    to: '/assets',
    children: [
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

export const defaultMenuSections: MenuSection[] = [
  {
    title: 'Home',
    items: homeMenuItems,
  },
  {
    title: 'Files',
    items: fileMenuItems,
  },
];

const flattenMenuItems = (sections: MenuSection[]): MenuItem[] => {
  const walk = (items: MenuItem[]): MenuItem[] =>
    items.flatMap((item) => [
      item,
      ...(item.children ? walk(item.children) : []),
    ]);

  return sections.flatMap((section) => walk(section.items));
};

export const findMenuLabel = (path: string) => {
  return flattenMenuItems(defaultMenuSections).find((item) => item.to === path)
    ?.label;
};
