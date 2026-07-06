const formatVideos = ({ videos }: { videos: any }) => {
  // Filter the array and return only the trailer
  const trailer = videos?.filter(
    (vid: any) =>
      vid.type === "Trailer" && vid.site === "YouTube" && vid.official,
  );

  const videoUrl = `https://www.youtube.com/watch?v=${trailer[0]?.key}`;

  return videoUrl;
};

export default formatVideos;
