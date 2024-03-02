export const Key = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type Key = (typeof Key)[number];
