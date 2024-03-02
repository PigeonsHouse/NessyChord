import React, { useMemo } from "react";
import { cx } from "@emotion/css";
import { Palette } from "components/Palette/Palette"
import { ChordLine, Container, Editor, EditorContainer, LineHeader, ChordBox, ChordContainer, RhythmLine, DominantChordBox, SubDominantChordBox, TonicChordBox } from "./styled"

const degreeLabel = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
];

const intervalLabel = {
  "major": "",
  "minor": "m",
};

export type Chord = Readonly<{
  degree: 1|2|3|4|5|6|7,
  interval: "major"|"minor",
}>;

type ChordEditorProps = Readonly<{
  beat: number,
  viewMeasure: number,
  offset: number,
  key: "A"|"B"|"C"|"D"|"E"|"F"|"G",
  chordProgression: (Chord|null)[],
  setOffset: (value: number) => void;
  updateChordProgression: (value: (Chord)[]) => void;
}>;

export const ChordEditor: React.FC<ChordEditorProps> = ({
  beat,
  viewMeasure,
  offset,
  chordProgression,
}) => {
  const viewChordCount = useMemo(() => {
    return beat * viewMeasure;
  }, [beat, viewMeasure]);

  const viewChords = useMemo(() => {
    const sliceChords = chordProgression.slice(offset, offset+viewChordCount);
    const shortageCount = viewChordCount - sliceChords.length;
    if (shortageCount !== 0) {
      for (let i = 0; i < shortageCount; i++) {
        sliceChords.push(null);
      }
    }
    return sliceChords;
  }, [chordProgression, offset, viewChordCount]);

  return (
    <Container>
      <EditorContainer>
        <Editor>
          <ChordLine>
            <LineHeader>
              コード
            </LineHeader>
            <ChordContainer>
              {
                viewChords.map((viewChord, index) => {
                  const existChordBox = viewChord === null ? null : (
                    viewChord.degree === 5 ? DominantChordBox : (
                      [2, 4].includes(viewChord.degree) ? SubDominantChordBox : TonicChordBox
                    )
                  )
                  const style = cx(ChordBox(viewChordCount), existChordBox);
                  return (
                    <div key={index} className={style}>
                      {
                        viewChord === null ? (
                          "なし"
                        ) : (
                          <p>
                            {degreeLabel[viewChord.degree-1]}
                            {intervalLabel[viewChord.interval]}
                          </p>
                        )
                      }
                    </div>
                  )
                })
              }
            </ChordContainer>
          </ChordLine>
          <RhythmLine>
            <LineHeader>
              リズム
            </LineHeader>
            <ChordContainer>
            </ChordContainer>
          </RhythmLine>
        </Editor>
      </EditorContainer>
      <Palette />
    </Container>
  )
}
