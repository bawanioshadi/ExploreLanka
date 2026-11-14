
export type DestinationCategory =
  | "Nature"
  | "Beach"
  | "Historical"
  | "Wildlife";

export interface Destination {
  id: number;
  name: string;
  district: string;
  category: DestinationCategory;
  description: string;
  bestTime: string;
  entryFee: string;
}
