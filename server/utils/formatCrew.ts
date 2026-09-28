const formatCrew = ({ crew }: { crew: any[] }) => {
  let crewMemebers: any = [];
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;

  crew
    ?.filter((value) => value?.job === "Director")
    .map((member) => {
      crewMemebers.push({
        id: member.id,
        name: member.name,
        job: member?.job,
        image: `${baseURL}${member.profile_path}`,
      });
    });
  return crewMemebers;
};

export default formatCrew;
