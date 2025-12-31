import type { FolderItem } from '@asetflow/shared-types';
import type {
  CreateFolderInput,
  UpdateFolderInput,
} from '@asetflow/validators';
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
    /**
     * Get all folders
     */
    getAllFolders: (state) => {
      return state.folders;
    },

    /**
     * Find folder by ID
     */
    findFolderById: (state) => (folderId: string) => {
      return state.folders.find((folder) => folder.id === folderId);
    },
  },

  actions: {
    async loadFolders() {
      this.isLoading = true;
      try {
        const { folder } = useApi();
        const data = await folder.getFolders({
          search: this.searchQuery,
        });
        if (data) {
          this.folders = data.items;
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
      const { folder } = useApi();

      if (!slug || slug === '') {
        slug = name.toLowerCase().replace(/\s+/g, '-');
      }

      const folderData: CreateFolderInput = { name, slug };

      toast.promise(folder.createFolder(folderData), {
        loading: 'Creating folder...',
        onSuccess: (data) => {
          if (data) {
            this.folders.push(data);
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

    async updateFolder(folderId: string, data: UpdateFolderInput) {
      this.isLoading = true;
      const toast = useToast();
      const { folder } = useApi();

      toast.promise(folder.updateFolder(folderId, data), {
        loading: 'Updating folder...',
        onSuccess: (updatedFolder) => {
          if (updatedFolder) {
            const index = this.folders.findIndex(
              (folder) => folder.id === folderId
            );
            if (index !== -1) {
              this.folders[index] = updatedFolder;
            }
          }
          return `Folder updated successfully!`;
        },
        onError: (err) => {
          if (err instanceof FetchError) {
            return `Failed to update folder: ${err.data.message}`;
          }
          return `Failed to update folder: ${err.message}`;
        },
      });
      this.isLoading = false;
    },

    async deleteFolder(folderId: string) {
      this.isLoading = true;
      const toast = useToast();
      const { folder } = useApi();

      toast.promise(folder.deleteFolder(folderId), {
        loading: 'Deleting folder...',
        onSuccess: () => {
          const tempFolders = this.folders.filter(
            (folder) => folder.id !== folderId
          );
          this.folders = tempFolders;
          return `Folder deleted successfully!`;
        },
        onError: (err) => {
          if (err instanceof FetchError) {
            return `Failed to delete folder: ${err.data.message}`;
          }
          return `Failed to delete folder: ${err.message}`;
        },
      });
      this.isLoading = false;
    },

    findFolderById(folderId: string): FolderItem | null {
      const folder = this.folders.find((folder) => folder.id === folderId);
      return folder || null;
    },

    /**
     * Set folders
     */
    setFolders(folders: Array<FolderItem>) {
      this.folders = folders;
    },

    /**
     * Clear folders
     */
    clearFolders() {
      this.folders = [];
    },

    clear() {
      this.clearFolders();
      this.isLoading = false;
      this.searchQuery = '';
    },
  },
});
