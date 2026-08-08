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
  media,
}: {
  media: MovieDetails | TvDetails;
}) {
  // Composables
  const toast = useToast();
  const route = useRoute();
  const { watchListIds, favoriteIds, watchedIds } = useIdRef();

  // Variables
  let loading = ref<boolean>(false);
  let slideoverOpen = ref<boolean>(false); // Used to close the slideover/drawer after adding an entry

  // Watchlist and Seen states (local simulation for frontend interaction)
  const isWatchlisted = computed(() => {
    return watchListIds.value.includes(media.id);
  });

  const isFavorite = computed(() => {
    return favoriteIds.value.includes(media.id);
  });

  const isSeen = computed(() => {
    return watchedIds.value.includes(media.id);
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
            mediaId: media?.id,
            name: media?.title,
            first_air_date: media?.release_date,
            overview: media?.overview,
            imgURL: media?.poster_path,
            averageRating: media?.averageRating,
            media_type: mediaType.value,
            voteCount: media?.voteCount,
          },
        });

        // Add the new id to the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          watchListIds.value.push(media?.id);
        }
        // Remove from watchlist
      } else {
        res = await $fetch("/api/watchlist/watchlist", {
          method: "DELETE",
          body: {
            mediaId: media?.id,
          },
        });

        // Remove the id from the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          watchListIds.value = watchListIds.value.filter(
            (id) => id !== media?.id,
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
            mediaId: media?.id,
            name: media?.title,
            first_air_date: media?.release_date,
            overview: media?.overview,
            imgURL: media?.poster_path,
            averageRating: media?.averageRating,
            media_type: mediaType.value,
            voteCount: media?.voteCount,
          },
        });

        // Add the new id to the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          favoriteIds.value.push(media?.id);
        }
        // Remove from favorites
      } else {
        res = await $fetch("/api/favorites/favorites", {
          method: "DELETE",
          body: {
            mediaId: media?.id,
          },
        });

        // Remove the id from the list
        if (res.statusCode === 200 || res.statusCode === 304) {
          favoriteIds.value = favoriteIds.value.filter(
            (id) => id !== media?.id,
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
          mediaId: media?.id,
          rating: rating.value,
          name: media?.title,
          first_air_date: media?.release_date,
          overview: media?.overview,
          imgURL: media?.poster_path,
          averageRating: media?.averageRating,
          media_type: mediaType.value,
          voteCount: media?.voteCount,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        // Add the media id to the ids reference
        watchedIds.value.push(media?.id);
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
          mediaId: media?.id,
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

  const addDiaryEntry = async () => {
    const now = new Date();

    // Construct the timestamp for the diary entry
    const timestampInfo = new Date(
      diaryDate.value.year,
      diaryDate.value.month - 1,
      diaryDate.value.day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    const diaryTimestamp = timestampInfo.toISOString();
    try {
      loading.value = true;

      const res = await $fetch("/api/diary/add", {
        method: "POST",
        body: {
          mediaId: media.id,
          review: reviewText.value,
          rating: rating.value,
          timestamp: diaryTimestamp,
          name: media.title,
          first_air_date: media.release_date,
          overview: media.overview,
          imgURL: media.poster_path,
          averageRating: media.averageRating,
          media_type: mediaType.value,
          voteCount: media.voteCount,
        },
      });

      if (res.statusCode === 200 || res.statusCode === 304) {
        // Check if it was a new watch or a previously watched
        if (!isSeen.value) {
          // New watch, add it to watched and update the rating
          watchedIds.value.push(media?.id);
          ratingRef.value = rating.value;
        } else {
          // Update the rating only if a new rating was selected
          if (rating.value > 0) {
            ratingRef.value = rating.value;
          }
        }
        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });

        resetValues();
      }
      // console.log(
      //   "Date: ",
      //   formatDateTime({ timestamp: diaryTimestamp })?.dateTime,
      // );
      // console.log("DB Value: ", diaryTimestamp);
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      loading.value = false;
      slideoverOpen.value = false;
    }
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
    slideoverOpen,
    handleMediaRating,
    reviewText,
    diaryDate,
    resetValues,
    addDiaryEntry,
  };
}
