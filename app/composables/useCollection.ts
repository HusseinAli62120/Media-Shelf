export default function useCollection({ autoFetch }: { autoFetch?: boolean }) {
  let skip = ref<number>(0);
  let limit = ref<number>(16);
  let pageCount = ref<number>(0);
  let isFetching = ref<boolean>(false);
  let collection = ref<CardData[]>([]);
  let filter = ref<string | Record<string, Record<string, string>> | null>(
    null,
  );
  let order = ref<"Asc" | "Desc">("Desc");
  let totalCount = ref<number>(0);

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
        count: number;
      }>(endpoint, {
        method: "GET",
        query: {
          skip: skip.value,
          limit: limit.value,
          filter: filter?.value ? filter?.value : null,
          order: order.value,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        const newItems =
          res?.userWatchList || res?.userWatched || res?.userFavorites || [];

        // Set the new values
        collection.value = [...collection.value, ...newItems];
        pageCount.value = res.pageCount ?? 0;
        skip.value += limit.value;
        totalCount.value = res.count;
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
    filter,
    order,
    totalCount,
  };
}
