export default function useCollection({ autoFetch }: { autoFetch?: boolean }) {
  let skip = ref<number>(0);
  let limit = ref<number>(16);
  let pageCount = ref<number>(0);
  let isFetching = ref<boolean>(false);
  let collection = ref<CardData[]>([]);

  // Composables
  const toast = useToast();

  const fetchCollection = async ({
    tab,
  }: {
    tab: "watched" | "watchlist" | "favorites";
  }) => {
    try {
      isFetching.value = true;
      const endpoint =
        tab === "watchlist"
          ? "/api/watchlist/watchlist"
          : tab === "favorites"
            ? "/api/favorites/favorites"
            : "/api/watched/watched";

      const res = await $fetch<{
        statusCode: number;
        userWatchList?: CardData[];
        userWatched?: CardData[];
        userFavorites?: CardData[];
        pageCount?: number;
      }>(endpoint, {
        method: "GET",
        query: {
          skip: skip.value,
          limit: limit.value,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        const newItems =
          res?.userWatchList || res?.userWatched || res?.userFavorites || [];
        collection.value = [...collection.value, ...newItems];
        pageCount.value = res.pageCount ?? 0;
        skip.value += limit.value;
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      isFetching.value = false;
    }
  };

  return {
    fetchCollection,
    isFetching,
    collection,
    skip,
    limit,
    pageCount,
  };
}
