export type CardData = {
  id?: string | null; // db id if present
  mediaId: number | null; // tmdb id
  name: string | null;
  first_air_date: string | null;
  overview: string | null;
  imgURL: string | null;
  averageRating: string | null;
  media_type: "movie" | "tv" | null;
  voteCount: number | null;
  createdAt?: string | null; // Populated only by cards fetched from db
};
