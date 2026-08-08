export default function details({
  media,
}: {
  media: MovieDetails | TvDetails;
}) {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const hasBackdrop = computed(() => {
    const path = media?.backdrop_path;
    return path && !path.endsWith("/null") && !path.endsWith("undefined");
  });

  const hasPoster = computed(() => {
    const path = media?.poster_path;
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
    goBack,
    hasBackdrop,
    hasPoster,
    getReleaseYear,
    getLanguageName,
    getCountryName,
  };
}
