export default function formatActorData({ actorData }: { actorData: any }) {
  const baseURL = process?.env?.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;
  return {
    name: actorData?.name,
    biography: actorData?.biography,
    image: `${baseURL}${actorData?.profile_path}`,
    placeOfBirth: actorData?.place_of_birth,
    birthday: actorData?.birthday,
  };
}
