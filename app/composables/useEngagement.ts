import { CalendarDate } from "@internationalized/date";

// To prevent reinitialization when calling the composable in nested components.

// The onChange rating value
let rating = ref<number>(0);

// A reference rating value, to set it back when closing popover/drawer without actually updating.
let ratingRef = ref<number>(0);
let reviewText = ref<string>("");
// Default value today
let diaryDate = shallowRef<CalendarDate>(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
);

export default function useEngagement({
  movie,
}: {
  movie: MovieDetails | TvDetails;
}) {
  // Composables
  const toast = useToast();
  const route = useRoute();
  const { watchListIds, favoriteIds, watchedIds } = useIdRef();
  const loading = ref<boolean>(false);

  // Watchlist and Seen states (local simulation for frontend interaction)
  const isWatchlisted = computed(() => {
    return watchListIds.value.includes(movie.id);
  });

  const isFavorite = computed(() => {
    return favoriteIds.value.includes(movie.id);
  });

  const isSeen = computed(() => {
    return watchedIds.value.includes(movie.id);
  });

  // Check media type based on route
  const mediaType = computed(() => {
    return route?.path.split("/")[1];
  });

  const toggleWatchlist = async () => {
    try {
      let res;
      if (!isWatchlisted.value) {
        res = await $fetch("/api/watchlist/watchlist", {
          method: "POST",
          body: {
            mediaId: movie?.id,
            name: movie?.title,
            first_air_date: movie?.release_date,
            overview: movie?.overview,
            imgURL: movie?.poster_path,
            averageRating: movie?.averageRating,
            media_type: mediaType.value,
            voteCount: movie?.voteCount,
          },
        });

        // Add the new id to the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          watchListIds.value.push(movie?.id);
        }
        // Remove from watchlist
      } else {
        res = await $fetch("/api/watchlist/watchlist", {
          method: "DELETE",
          body: {
            mediaId: movie?.id,
          },
        });

        // Remove the id from the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          watchListIds.value = watchListIds.value.filter(
            (id) => id !== movie?.id,
          );
        }
      }

      if (res.statusCode === 200) {
        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error.data?.statusMessage,
        color: "error",
      });
    }
  };

  const toggleFavorite = async () => {
    try {
      let res;
      if (!isFavorite.value) {
        res = await $fetch("/api/favorites/favorites", {
          method: "POST",
          body: {
            mediaId: movie?.id,
            name: movie?.title,
            first_air_date: movie?.release_date,
            overview: movie?.overview,
            imgURL: movie?.poster_path,
            averageRating: movie?.averageRating,
            media_type: mediaType.value,
            voteCount: movie?.voteCount,
          },
        });

        // Add the new id to the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          favoriteIds.value.push(movie?.id);
        }
        // Remove from favorites
      } else {
        res = await $fetch("/api/favorites/favorites", {
          method: "DELETE",
          body: {
            mediaId: movie?.id,
          },
        });

        // Remove the id from the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          favoriteIds.value = favoriteIds.value.filter(
            (id) => id !== movie?.id,
          );
        }
      }

      if (res.statusCode === 200) {
        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error.data?.statusMessage,
        color: "error",
      });
    }
  };

  const handleMediaRating = ({
    selectedRating,
  }: {
    selectedRating: number;
  }) => {
    rating.value = selectedRating;
  };

  const addToWatched = async () => {
    try {
      const res = await $fetch("/api/watched/watched", {
        method: "POST",
        body: {
          mediaId: movie?.id,
          rating: rating.value,
          name: movie?.title,
          first_air_date: movie?.release_date,
          overview: movie?.overview,
          imgURL: movie?.poster_path,
          averageRating: movie?.averageRating,
          media_type: mediaType.value,
          voteCount: movie?.voteCount,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        // Add the media id to the ids reference
        watchedIds.value.push(movie?.id);
        // Set the ratingRef to the new rating
        ratingRef.value = rating.value;
        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });

        resetValues();
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error.data?.statusMessage,
        color: "error",
      });
    }
  };

  const updateRating = async () => {
    try {
      loading.value = true;
      const res = await $fetch("/api/watched/updateRating", {
        method: "PUT",
        body: {
          mediaId: movie?.id,
          rating: rating.value,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        // Make the new value the ref
        ratingRef.value = rating.value;
        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const resetValues = () => {
    reviewText.value = "";
    diaryDate.value = new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
    );
  };

  return {
    isWatchlisted,
    toggleWatchlist,
    isFavorite,
    toggleFavorite,
    isSeen,
    addToWatched,
    rating,
    ratingRef,
    updateRating,
    loading,
    handleMediaRating,
    reviewText,
    diaryDate,
    resetValues,
  };
}
