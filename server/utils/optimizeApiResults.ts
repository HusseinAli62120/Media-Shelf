export default function optimizeApiResults({ data }: { data: CardData[] }) {
  let optimizedData: CardData[] = [];
  // filter shows & movies without a poster
  optimizedData = data.filter(
    (item: CardData) =>
      item?.imgURL &&
      item?.imgURL?.length > 0 &&
      !item?.imgURL?.endsWith("null"),
  );

  // remove duplicates by mediaId
  optimizedData = optimizedData.filter((item: CardData, index: number) => {
    return (
      optimizedData.findIndex((i: CardData) => i.mediaId === item.mediaId) ===
      index
    );
  });

  // Filter results with rating less that 4.5
  optimizedData = optimizedData.filter(
    (item: CardData) => Number(item?.averageRating) >= 4.5,
  );

  return optimizedData;
}
