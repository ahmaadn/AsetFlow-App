export default defineNuxtPlugin(() => {
  const uploadQueue = useUploadQueue();

  return {
    provide: {
      uploadQueue,
    },
  };
});
