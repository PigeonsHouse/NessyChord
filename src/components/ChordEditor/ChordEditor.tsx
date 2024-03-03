import React, { useMemo, useState } from "react";
import { cx } from "@emotion/css";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Button, Popover } from "@mui/material";
import { Palette } from "components"
import { Chord, Key } from "definitions";
import {
  ChordLine,
  Container,
  Editor,
  EditorContainer,
  LineHeader,
  ChordBox,
  ChordContainer,
  RhythmLine,
  DominantChordBox,
  SubDominantChordBox,
  TonicChordBox,
  ButtonContainer,
  BoxContainer,
  TonicIcon,
  SubDominantIcon,
  DominantIcon,
} from "./styled"

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

type ChordEditorProps = Readonly<{
  beat: number,
  viewMeasure: number,
  offset: number,
  key: Key,
  chordProgression: (Chord|null)[],
  setOffset: (value: number) => void;
  updateChordProgression: (value: (Chord|null)[]) => void;
}>;

export const ChordEditor: React.FC<ChordEditorProps> = ({
  beat,
  viewMeasure,
  offset,
  chordProgression,
  setOffset,
  updateChordProgression,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [paletteMenu, setPaletteMenu] = useState<Chord[]>([
    {
      degree: 1,
      interval: "major",
    },
    {
      degree: 2,
      interval: "minor",
    },
    {
      degree: 3,
      interval: "minor",
    },
    {
      degree: 4,
      interval: "major",
    },
    {
      degree: 5,
      interval: "major",
    },
    {
      degree: 6,
      interval: "minor",
    },
  ]);
  const [selectingChordNum, setSelectingChordNum] = useState<number>(-1);

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

  const updateChordProgressionFactory = (val: number) => {
    return () => {
      const copyChordProgression = [...chordProgression];
      const diff = selectingChordNum - copyChordProgression.length;
      for (let i = 0; i < diff; i++) {
        copyChordProgression.push(null);
      }
      copyChordProgression[selectingChordNum] = paletteMenu[val];
      updateChordProgression(copyChordProgression);
      setAnchorEl(null);
      setSelectingChordNum(-1);
    }
  }

  return (
    <Container>
      <EditorContainer>
        <Editor>
          <ButtonContainer>
            <Button onClick={() => {
              if (offset > 0) {
                setOffset(offset-1);
                localStorage.setItem("offset", String(offset-1));
              }
            }}>
              <NavigateBefore />
            </Button>
            <Button onClick={() => {
              setOffset(offset+1);
              localStorage.setItem("offset", String(offset+1));
            }}>
              <NavigateNext />
            </Button>
          </ButtonContainer>
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
                    <div key={index} className={style} onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectingChordNum(offset+index)
                      setAnchorEl(e.currentTarget)
                    }}>
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
              {
                viewChords.map((_, index) => {
                  return (
                    <div key={index} className={ChordBox(viewChordCount)}>
                      -
                    </div>
                  )
                })
              }
            </ChordContainer>
          </RhythmLine>
        </Editor>
      </EditorContainer>
      <Palette menu={paletteMenu} setMenu={setPaletteMenu} />
      <Popover
        open={selectingChordNum > -1} anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setSelectingChordNum(-1);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <BoxContainer>
          <Box
            onClick={updateChordProgressionFactory(0)}
            className={TonicIcon}
          >
            I
          </Box>
          <Box
            onClick={updateChordProgressionFactory(1)}
            className={SubDominantIcon}
          >
            IIm
          </Box>
          <Box
            onClick={updateChordProgressionFactory(2)}
            className={TonicIcon}
          >
            IIIm
          </Box>
          <Box
            onClick={updateChordProgressionFactory(3)}
            className={SubDominantIcon}
          >
            IV
          </Box>
          <Box
            onClick={updateChordProgressionFactory(4)}
            className={DominantIcon}
          >
            V
          </Box>
          <Box
            onClick={updateChordProgressionFactory(5)}
            className={TonicIcon}
          >
            VIm
          </Box>
        </BoxContainer>
      </Popover>
    </Container>
  )
}
