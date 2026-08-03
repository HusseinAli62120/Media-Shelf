const watchListIds = useState<number[]>("watchListIds", () => []);
const favoriteIds = useState<number[]>("favoriteIds", () => []);

export default function useIdRef() {
  const toast = useToast();

  // Fetch watchlist ids
  onMounted(async () => {
    // Ids already fetched
    if (watchListIds?.value?.length && watchListIds.value.length > 0) {
      return;
    }

    try {
      const res = await $fetch("/api/watchlist/ids");

      if (res?.statusCode === 200 && res?.watchListIds) {
        // Extract IDs and remove any null or undefined entries
        watchListIds.value = res.watchListIds
          .map((item) => item?.id)
          .filter((id): id is number => typeof id === "number");
      }
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    }
  });

  // Fetch Favorite ids
  onMounted(async () => {
    // Ids already fetched
    if (favoriteIds?.value?.length && favoriteIds.value.length > 0) {
      return;
    }

    try {
      const res = await $fetch("/api/favorites/ids");

      if (res?.statusCode === 200 && res?.favoriteIds) {
        // Extract IDs and remove any null or undefined entries
        favoriteIds.value = res.favoriteIds
          .map((item) => item?.id)
          .filter((id): id is number => typeof id === "number");
      }
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    }
  });

  return { watchListIds, favoriteIds };
}
