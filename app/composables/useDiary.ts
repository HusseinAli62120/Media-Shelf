export default function useDiary({ autoFetch }: { autoFetch: boolean }) {
  const toast = useToast();

  let skip = ref(0);
  let limit = ref(10);
  let isFetchingMore = ref(false);
  let pageCount = ref(1);
  const diaryEntries = ref<DiaryData[]>([]);

  const fetchDiaryEntries = async () => {
    try {
      isFetchingMore.value = true;
      const response = await $fetch("/api/diary/getEntries", {
        method: "GET",
        query: {
          skip: skip.value,
          limit: limit.value,
        },
      });
      if (response.statusCode === 200 || response?.statusCode === 304) {
        diaryEntries.value = [
          ...diaryEntries?.value,
          ...response?.entries?.map((entry) => entry),
        ];

        pageCount.value = response?.pageCount;

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

  //  Initial fetch
  if (autoFetch) {
    onMounted(() => {
      fetchDiaryEntries();
    });
  }

  const deleteDiaryEntry = async ({ id }: { id: string }) => {
    try {
      const response = await $fetch("/api/diary/deleteEntry", {
        method: "DELETE",
        body: {
          id,
        },
      });

      if (response?.statusCode === 200 || response?.statusCode === 304) {
        // Remove the item from the array
        diaryEntries.value = diaryEntries.value.filter(
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

  return {
    diaryEntries,
    fetchDiaryEntries,
    isFetchingMore,
    skip,
    limit,
    pageCount,
    deleteDiaryEntry,
  };
}
