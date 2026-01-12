import type {
  FolderItemType,
  PaginationResponse,
} from '@asetflow/shared-types';
import type {
  CreateFolderInput,
  UpdateFolderInput,
} from '@asetflow/validators';
import { FetchError } from 'ofetch';

interface FolderState {
  folders: FolderItemType[];
  isLoading: boolean;
  searchQuery: string;
  sortBy: 'name' | 'createdAt';
  sortDesc: boolean;
  page: number;
  perPage: number;
  hasMore: boolean;
  totalItems: number;
}

export const useFolderStore = defineStore('folder', {
  state: (): FolderState => ({
    folders: [],
    isLoading: true,
    searchQuery: '',
    sortBy: 'createdAt',
    sortDesc: true,
    page: 1,
    perPage: 10,
    hasMore: true,
    totalItems: 0,
  }),

  getters: {
    filteredFolders(state): FolderItemType[] {
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
    async loadFolders(append: boolean = false) {
      if (!append && !this.hasMore && this.folders.length > 0) {
        return;
      }

      this.isLoading = true;
      try {
        const { $api } = useNuxtApp();
        const data = await $api<PaginationResponse<FolderItemType>>(
          'v1/folders',
          {
            method: 'GET',
            params: {
              page: this.page,
              per_page: this.perPage,
              search: this.searchQuery,
              sort_by: this.sortBy,
              order: this.sortDesc ? 'desc' : 'asc',
            },
          }
        );

        if (data) {
          if (append) {
            const tempFolders = [...this.folders, ...data.items];
            this.folders = tempFolders;
          } else {
            this.folders = data.items;
          }
          this.totalItems = data.total;
          this.hasMore = this.folders.length < data.total;
        }
      } catch (error) {
        console.error('Failed to load folders:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadMoreFolders() {
      if (!this.hasMore || this.isLoading) {
        return;
      }
      this.page += 1;
      await this.loadFolders(true);
    },

    resetPagination() {
      this.page = 1;
      this.hasMore = true;
      this.folders = [];
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    async searchFolders(query: string) {
      this.searchQuery = query;
      this.resetPagination();
      await this.loadFolders();
    },

    async createFolder({ name }: CreateFolderInput) {
      this.isLoading = true;
      const toast = useToast();
      const { $api } = useNuxtApp();

      toast.promise(
        $api<FolderItemType>('v1/folders', {
          method: 'POST',
          body: { name },
        }),
        {
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
        }
      );
      this.isLoading = false;
    },

    async updateFolder(folderId: string, data: UpdateFolderInput) {
      this.isLoading = true;
      const toast = useToast();
      const { $api } = useNuxtApp();

      toast.promise(
        $api<FolderItemType>(`v1/folders/${folderId}`, {
          method: 'PUT',
          body: data,
        }),
        {
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
        }
      );
      this.isLoading = false;
    },

    async deleteFolder(folderId: string) {
      this.isLoading = true;
      const toast = useToast();
      const { $api } = useNuxtApp();

      toast.promise(
        $api(`v1/folders/${folderId}`, {
          method: 'DELETE',
        }),
        {
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
        }
      );
      this.isLoading = false;
    },

    /**
     * Set folders
     */
    setFolders(folders: Array<FolderItemType>) {
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
      this.page = 1;
      this.hasMore = true;
      this.totalItems = 0;
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
  },
});
