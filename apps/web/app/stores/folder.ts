import type { FolderItem } from '@asetflow/shared-types';
import { createFolder, fetchFolders } from '~/lib/api/folder';
import { FetchError } from 'ofetch';

interface FolderState {
  folders: FolderItem[];
  isLoading: boolean;
  searchQuery: string;
}

export const useFolderStore = defineStore('folder', {
  state: (): FolderState => ({
    folders: [],
    isLoading: false,
    searchQuery: '',
  }),

  getters: {
    filteredFolders(state): FolderItem[] {
      if (!state.searchQuery) {
        return state.folders;
      }
      return state.folders.filter((folder) =>
        folder.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
  },

  actions: {
    async loadFolders() {
      this.isLoading = true;
      try {
        const { data, error } = await fetchFolders({
          search: this.searchQuery,
        });
        if (data) {
          this.folders = data.items;
        } else if (error) {
          console.error('Error fetching folders:', error);
        }
      } catch (error) {
        console.error('Failed to load folders:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async createFolder(name: string, slug?: string) {
      this.isLoading = true;
      const toast = useToast();

      if (!slug || slug === '') {
        slug = name.toLowerCase().replace(/\s+/g, '-');
      }

      toast.promise(createFolder({ name, slug }), {
        loading: 'Creating folder...',
        onSuccess: (data) => {
          if (data.data) {
            this.folders.push(data.data);
          }
          return `Folder "${name}" created successfully!`;
        },
        onError: (err) => {
          if (err instanceof FetchError) {
            return `Failed to create folder: ${err.data.message}`;
          }
          return `Failed to create folder: ${err.message}`;
        },
      });
      this.isLoading = false;
    },
  },
});
