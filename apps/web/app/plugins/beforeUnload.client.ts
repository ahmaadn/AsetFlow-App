export default defineNuxtPlugin((nuxtApp) => {
  const { isUploading } = useUploadQueue();

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isUploading.value) {
      e.preventDefault();
      e.returnValue =
        ' You have ongoing uploads. Are you sure you want to leave?';
      return '';
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  nuxtApp.hook('app:beforeMount', () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
});
