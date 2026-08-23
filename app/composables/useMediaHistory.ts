// So that it is not renintialized when called in useEngagement
let historyEntries = ref<DiaryData[]>([]);
let skip = ref<number>(0);
let limit = ref<number>(10);
let isFetchingMore = ref<boolean>(false);
let pageCount = ref<number>(1);
let count = ref<number>(0);

export default function useMediaHistory({ mediaId }: { mediaId: number }) {
  const toast = useToast();
  const route = useRoute();

  const fetchMediaHistory = async ({
    updateFetch = false,
  }: {
    updateFetch?: boolean;
  }) => {
    try {
      // Fetch again from scratch when adding a new diary entry
      if (updateFetch) {
        skip.value = 0;
        pageCount.value = 1;
        historyEntries.value = [];
      }

      isFetchingMore.value = true;
      const response = await $fetch("/api/mediaHistory/getHistory", {
        method: "GET",
        query: {
          skip: skip.value,
          limit: limit.value,
          mediaId: mediaId,
        },
      });
      if (response.statusCode === 200 || response?.statusCode === 304) {
        historyEntries.value = [
          ...historyEntries?.value,
          ...response?.entries?.map((entry) => entry),
        ];

        pageCount.value = response?.pageCount;
        count.value = response?.count;

        // Update the pagination value
        skip.value += limit.value;
      }
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.data?.message,
        color: "error",
      });
    } finally {
      isFetchingMore.value = false;
    }
  };

  // Delete specific history entry
  const deleteEntry = async ({ id }: { id: string }) => {
    try {
      const response = await $fetch("/api/diary/deleteEntry", {
        method: "DELETE",
        body: {
          id,
        },
      });

      if (response?.statusCode === 200 || response?.statusCode === 304) {
        // Remove the item from the array
        historyEntries.value = historyEntries.value.filter(
          (entry) => entry.id !== id,
        );

        toast.add({
          title: "Success",
          description: response?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error.data?.message,
        color: "error",
      });
    }
  };

  const resetPagination = () => {
    skip.value = 0;
    pageCount.value = 1;
    count.value = 0;
    historyEntries.value = [];
  };

  // Resets when route updates
  onBeforeRouteUpdate(() => {
    // reset pagination
    resetPagination();
  });

  // Reset pagination values when leaving the page
  onBeforeRouteLeave(() => {
    resetPagination();
  });

  return {
    historyEntries,
    fetchMediaHistory,
    isFetchingMore,
    skip,
    limit,
    pageCount,
    count,
    deleteEntry,
  };
}
