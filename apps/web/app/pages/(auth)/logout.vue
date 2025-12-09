<script setup lang="ts">
const { handleSignOut } = useAuth();

function clearApplicationStores(): void {
  const { clear: clearFolder } = useFolderStore();
  const { clear: clearAsset } = useAssetStore();
  const { clear: clearStagingFiles } = useStaggingFilesStore();
  const { closeAll: closeModals } = useModal();
  const { cancelAllUploadTasks } = useUploadQueue();

  try {
    clearFolder();
  } catch (error) {
    console.warn('Failed to clear folder store:', error);
  }
  try {
    clearAsset();
  } catch (error) {
    console.warn('Failed to clear asset store:', error);
  }
  try {
    clearStagingFiles();
  } catch (error) {
    console.warn('Failed to clear staging files store:', error);
  }
  try {
    closeModals();
  } catch (error) {
    console.warn('Failed to close modals:', error);
  }
  try {
    cancelAllUploadTasks();
  } catch (error) {
    console.warn('Failed to cancel upload tasks:', error);
  }
}
await handleSignOut();
clearApplicationStores();
</script>
