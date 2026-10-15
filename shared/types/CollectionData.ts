import type { CardData } from "./CardData";

export type CollectionData = {
  id: number;
  name: string;
  overview: string;
  parts: CardData[];
};
