import {
  extractFileName,
  formatSize,
  generateSlug,
  getAssetTypeFromMime,
} from '@asetflow/shared';
import type { StaggingFile } from '~/types';

interface StagingFilesState {
  stagingFiles: StaggingFile[];

  targetFolderId: string | null;

  files: File[];
  isUploading: boolean;
}

export const useStaggingFilesStore = defineStore('stagingFiles', {
  state: (): StagingFilesState => ({
    stagingFiles: [],
    files: [],
    isUploading: false,
    targetFolderId: null,
  }),

  getters: {
    getStagingFiles(state): StaggingFile[] {
      return state.stagingFiles;
    },

    hasErrors(state): boolean {
      return state.stagingFiles.some((file) => file.errors.length > 0);
    },

    isAllValid(state): boolean {
      return state.stagingFiles.every((file) => file.errors.length === 0);
    },

    totalFiles(state): number {
      return state.stagingFiles.length;
    },
  },

  actions: {
    /**
     * Delete a staging file by its index and revoke its object URL
     * @param index
     */
    deleteStagingFile(index: number) {
      // Pindahkan stagingFiles ke tempFiles untuk manipulasi
      const tempFiles = this.stagingFiles;
      const item = tempFiles[index];
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      tempFiles.splice(index, 1);

      // Re-validate semua file setelah penghapusan
      tempFiles.forEach((file, idx) => {
        file.errors = this.checkError(file.name, file.slug, idx);
      });

      // Perbarui stagingFiles dengan tempFiles yang sudah dimodifikasi
      this.stagingFiles = tempFiles;
    },

    /**
     * Clear all staging files and revoke their object URLs
     */
    clearStagingFiles() {
      this.stagingFiles.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      this.stagingFiles = [];
    },

    addFileToStaging(file: File) {
      const { name, extension } = extractFileName(file.name);
      const slug = generateSlug(name);

      const stagingFile: StaggingFile = {
        name,
        slug,
        extension,
        file,
        assetType: getAssetTypeFromMime(file.type),
        size: formatSize(file.size),
        previewUrl: URL.createObjectURL(file),
        errors: [],
        isUploading: false,
      };

      const tempStagingFiles = this.stagingFiles;
      tempStagingFiles.push(stagingFile);

      // Re-validate semua file setelah penambahan
      tempStagingFiles.forEach((f, idx) => {
        f.errors = this.checkError(f.name, f.slug, idx);
      });

      this.stagingFiles = tempStagingFiles;
    },

    addFilesToStaging(files: File[]) {
      files.forEach((file) => {
        this.addFileToStaging(file);
      });
    },

    checkError(name: string, slug: string, currentIndex: number) {
      const errors = [];
      if (!name.trim()) {
        errors.push('File name is required');
      }
      if (!slug.trim()) {
        errors.push('Slug is required');
      }
      if (this.isNameExists(name, currentIndex)) {
        errors.push('Duplicate file name');
      }
      if (this.isSlugExists(slug, currentIndex)) {
        errors.push('Duplicate slug');
      }
      return errors;
    },
    isNameExists(name: string, currentIndex: number) {
      const key = (name || '').trim().toLowerCase();
      return (
        key &&
        this.stagingFiles.some(
          (f, idx) =>
            idx !== currentIndex && f.name.trim().toLowerCase() === key
        )
      );
    },
    isSlugExists(slug: string, currentIndex: number) {
      const key = (slug || '').trim().toLowerCase();
      return (
        key &&
        this.stagingFiles.some(
          (f, idx) =>
            idx !== currentIndex && f.slug.trim().toLowerCase() === key
        )
      );
    },

    reValidateStagingFile() {
      const tempStagingFiles = this.stagingFiles;
      // re-valoidate all files
      tempStagingFiles.forEach((file, idx) => {
        file.errors = this.checkError(file.name, file.slug, idx);
      });

      this.stagingFiles = tempStagingFiles;
    },

    clear() {
      this.clearStagingFiles();
      this.files = [];
      this.isUploading = false;
      this.targetFolderId = null;
    },

    setUploading(isUploading: boolean) {
      this.isUploading = isUploading;
    },

    setTargetFolderId(folderId: string | null) {
      this.targetFolderId = folderId;
    },
  },
});
