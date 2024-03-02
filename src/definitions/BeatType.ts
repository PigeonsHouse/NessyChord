export const BeatType = ["4/4", "3/4"] as const;
export type BeatType =  typeof BeatType[number];
