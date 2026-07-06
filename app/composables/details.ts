export default function details({ movie }: { movie: MovieDetails }) {
  const router = useRouter();

  // Watchlist and Seen states (local simulation for frontend interaction)
  const isWatchlisted = ref(false);
  const isSeen = ref(false);

  const toggleWatchlist = () => {
    isWatchlisted.value = !isWatchlisted.value;
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
    toggleSeen,
    goBack,
    hasBackdrop,
    hasPoster,
    getReleaseYear,
    getLanguageName,
    getCountryName,
  };
}
