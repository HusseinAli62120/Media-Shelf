export type CardData = {
  id?: string; // db id if present
  mediaId: number; // tmdb id
  name: string;
  first_air_date: string;
  overview: string;
  imgURL: string;
  averageRating: number;
  media_type: "movie" | "tv";
};
