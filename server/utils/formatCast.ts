const formatCast = ({ cast }: { cast: any[] }) => {
  let castMemebers: any = [];
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;

  cast?.slice(0, 10)?.map((member) => {
    castMemebers.push({
      id: member.id,
      name: member.name,
      character: member?.character || member?.roles[0]?.character,
      image: `${baseURL}${member.profile_path}`,
    });
  });
  return castMemebers;
};

export default formatCast;
