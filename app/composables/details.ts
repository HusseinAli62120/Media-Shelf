// To prevent reinitialization when calling the composable in nested components.
let rating = ref<number>(0);
let reviewText = ref<string>("");

export default function details({ movie }: { movie: MovieDetails }) {
  const router = useRouter();
  const toast = useToast();
  const route = useRoute();
  const { watchListIds, favoriteIds } = useIdRef();

  // Watchlist and Seen states (local simulation for frontend interaction)
  const isWatchlisted = computed(() => {
    return watchListIds.value.includes(movie.id);
  });

  const isFavorite = computed(() => {
    return favoriteIds.value.includes(movie.id);
  });

  const isSeen = ref(false);

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
            media_type: route.params?.type,
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
            media_type: route.params?.type,
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

  const resetValues = () => {
    rating.value = 0;
    reviewText.value = "";
  };

  const toggleSeen = () => {
    isSeen.value = !isSeen.value;
  };

  const goBack = () => {
    router.back();
  };

  const hasBackdrop = computed(() => {
    const path = movie?.backdrop_path;
    return path && !path.endsWith("/null") && !path.endsWith("undefined");
  });

  const hasPoster = computed(() => {
    const path = movie?.poster_path;
    return path && !path.endsWith("/null") && !path.endsWith("undefined");
  });

  // Formatting helpers
  const getReleaseYear = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return "";
    }
  };

  // Get language
  const getLanguageName = (code?: string) => {
    if (!code) return "";
    try {
      const names = new Intl.DisplayNames(["en"], { type: "language" });
      return names.of(code) || code.toUpperCase();
    } catch {
      return code.toUpperCase();
    }
  };

  // Get country
  const getCountryName = (code?: string) => {
    if (!code) return "";
    try {
      const names = new Intl.DisplayNames(["en"], { type: "region" });
      return names.of(code) || code.toUpperCase();
    } catch {
      return code.toUpperCase();
    }
  };
  return {
    isWatchlisted,
    isSeen,
    toggleWatchlist,
    isFavorite,
    toggleFavorite,
    toggleSeen,
    rating,
    handleMediaRating,
    reviewText,
    goBack,
    hasBackdrop,
    hasPoster,
    getReleaseYear,
    getLanguageName,
    getCountryName,
    resetValues,
  };
}
