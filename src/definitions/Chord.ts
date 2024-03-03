export const Interval = ["major", "minor", "minorFlatFive"] as const;
type Interval = typeof Interval[number];

export type Chord = {
  degree: 1|2|3|4|5|6|7,
  interval: "major"|"minor"|"minorFlatFive",
};

export const degreeLabel = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
];

export const intervalLabel: Record<Interval, string> = {
  major: "",
  minor: "m",
  minorFlatFive: "m-5",
};

export const majorScaleDistance = [0, 2, 4, 5, 7, 9, 11];

const ChordFunction = ["tonic", "subdominant", "dominant"] as const;
type ChordFunction = typeof ChordFunction[number];

export const majorScaleFunction: ChordFunction[] = [
  "tonic",
  "subdominant",
  "tonic",
  "subdominant",
  "dominant",
  "tonic",
  "dominant",
];

export const functionColor: Record<ChordFunction, string> = {
  tonic: '#477fff',
  subdominant: '#19e341',
  dominant: '#ff475d',
};
