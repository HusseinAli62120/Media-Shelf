// Used to in [type]-[genre] & [viewMore]

import type { CalendarDate } from "@internationalized/date";

export default function useApi() {
  // Composables
  const toast = useToast();
  const route = useRoute();

  // Filter state
  let dateRangeOpen = ref<boolean>(false);

  // Pagination state
  let page = ref(1);
  let totalShowPages = ref(1);
  let totalMoviePages = ref(1);
  let isFetchingMore = ref(false);
  let data = ref<CardData[]>([]);
  let startDate = ref<CalendarDate>();
  let endDate = ref<CalendarDate>();

  // Flags to prevent fetching past the last page
  let fetchMovies = ref(true);
  let fetchShows = ref(true);

  // Filtered Data Types
  let type = ref<"movie" | "tv" | null>(null);

  // Calendar ranges
  const ranges = [
    { label: "Last Year", years: 1 },
    { label: "Last 3 Years", years: 3 },
    { label: "Last 5 Years", years: 5 },
    { label: "Last Decade", years: 10 },
  ];
  // Function to fetch with on filters & infinite scroll (Top Rated & Discover)
  const fetchMore = async ({
    startDate,
    endDate,
  }: {
    startDate?: string | null;
    endDate?: string | null;
  }) => {
    isFetchingMore.value = true;

    try {
      const res = await $fetch("/api/tmdb/viewMore", {
        method: "get",
        query: {
          viewMoreType: route.params.viewMore,
          page: page.value,
          // Flags to prevent fetching after one has reached the max number of pages
          fetchShows: fetchShows.value,
          fetchMovies: fetchMovies.value,
          startDate: startDate,
          endDate: endDate,
          type: type.value,
        },
      });

      if (res?.statusCode === 200 || res?.statusCode === 304) {
        data.value = [...data.value, ...res.viewMoreData];
        totalMoviePages.value = res.totalMoviePages;
        totalShowPages.value = res.totalShowPages;
      }
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err?.data?.statusMessage ?? "Failed to load more",
        color: "error",
      });
      page.value--;
    } finally {
      isFetchingMore.value = false;
    }
  };

  // Function to fetch with on filters & infinite scroll (Genre)
  const fetchGenreData = async ({
    genreId,
    startDate,
    endDate,
  }: {
    genreId: number;
    startDate?: string | null;
    endDate?: string | null;
  }) => {
    isFetchingMore.value = true;

    try {
      const res = await $fetch("/api/tmdb/discoverByGenre", {
        query: {
          type: route.params.type === "Movies" ? "movie" : "tv",
          genreId: genreId,
          page: page.value,
          startDate: startDate,
          endDate: endDate,
        },
      });
      if (res?.statusCode === 200 || res?.statusCode === 304) {
        data.value = [...data.value, ...res.genreMedia];
        // This could be either shows or movies, but I just used the movies total pages
        totalMoviePages.value = res.totalPages;
      }
    } catch (err: any) {
      toast.add({
        title: "Error",
        description: err?.data?.statusMessage ?? "Failed to load more",
        color: "error",
      });
      page.value--;
    } finally {
      isFetchingMore.value = false;
    }
  };

  return {
    fetchMore,
    fetchGenreData,
    dateRangeOpen,
    ranges,
    page,
    totalShowPages,
    totalMoviePages,
    isFetchingMore,
    data,
    startDate,
    endDate,
    type,
    fetchMovies,
    fetchShows,
  };
}
