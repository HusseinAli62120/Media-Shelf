import { CardData } from "~~/shared/types/CardData";

export default function formatCollection({ data }: { data: any }) {
  let parts: CardData[] = [];

  parts = formatCardData({ items: data?.parts, mediaType: "movie" });
  return {
    id: data?.id,
    name: data?.name,
    overview: data?.overview,
    // Keep only released parts, and sort by release date
    parts: parts
      .filter((value) => new Date(value.first_air_date || "") < new Date())
      .sort((a, b) => {
        const dateA = new Date(a.first_air_date || "");
        const dateB = new Date(b.first_air_date || "");
        return dateA.getTime() - dateB.getTime();
      }),
  };
}
