import React, { useMemo, useState } from "react";
import { cx } from "@emotion/css";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Button, Popover } from "@mui/material";
import { Palette } from "components"
import { Chord, Key, degreeLabel, functionColor, intervalLabel, majorScaleDistance, majorScaleFunction } from "definitions";
import {
  ChordLine,
  Container,
  Editor,
  EditorContainer,
  LineHeader,
  ChordBox,
  ChordContainer,
  RhythmLine,
  ButtonContainer,
  BoxContainer,
  ExistChordBox,
} from "./styled"

type ChordEditorProps = Readonly<{
  isPlaying: boolean,
  beat: number,
  viewMeasure: number,
  offset: number,
  scaleKey: Key,
  chordProgression: (Chord|null)[],
  setOffset: (value: number) => void;
  updateChordProgression: (value: (Chord|null)[]) => void;
}>;

export const ChordEditor: React.FC<ChordEditorProps> = ({
  isPlaying,
  scaleKey,
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
    {
      degree: 7,
      interval: "minorFlatFive",
    },
  ]);
  const [selectingChordNum, setSelectingChordNum] = useState<number>(-1);

  const viewChordCount = useMemo(() => {
    return beat * viewMeasure;
  }, [beat, viewMeasure]);

  const viewChords = useMemo(() => {
    const sliceChords = chordProgression.slice(offset*beat, offset*beat+viewChordCount);
    const shortageCount = viewChordCount - sliceChords.length;
    if (shortageCount !== 0) {
      for (let i = 0; i < shortageCount; i++) {
        sliceChords.push(null);
      }
    }
    return sliceChords;
  }, [chordProgression, offset, viewChordCount, beat]);

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
                  const existChordBox = viewChord !== null && ExistChordBox(functionColor[majorScaleFunction[viewChord.degree-1]]);
                  const style = cx(ChordBox(viewChordCount, beat), existChordBox);
                  const keyIndex = Key.indexOf(scaleKey);
                  return (
                    <div key={index} className={style}
                      onClick={(e) => {
                        if (!isPlaying) {
                          setSelectingChordNum(offset*beat+index)
                          setAnchorEl(e.currentTarget)
                        }
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (!isPlaying) {
                          const copyChordProgression = [...chordProgression];
                          const diff = offset * beat + index - copyChordProgression.length;
                          for (let i = 0; i < diff; i++) {
                            copyChordProgression.push(null);
                          }
                          copyChordProgression[offset*beat+index] = null;
                          updateChordProgression(copyChordProgression);
                        }
                      }}
                    >
                      {
                        viewChord === null ? (
                          "なし"
                        ) : (
                          <>
                            <div>
                              <b>
                                {degreeLabel[viewChord.degree-1]}
                                {intervalLabel[viewChord.interval]}
                              </b>
                            </div>
                            <div>
                              {`(${Key[(keyIndex + majorScaleDistance[viewChord.degree-1]) % 12]}${intervalLabel[viewChord.interval]})`}
                            </div>
                          </>
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
                    <div key={index} className={ChordBox(viewChordCount, beat)}>
                      -
                    </div>
                  )
                })
              }
            </ChordContainer>
          </RhythmLine>
        </Editor>
      </EditorContainer>
      <Palette scaleKey={scaleKey} menu={paletteMenu} setMenu={setPaletteMenu} />
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
          {paletteMenu.map((menuItem, index) => {
            const keyIndex = Key.indexOf(scaleKey);
            return (
              <Box
                key={index}
                onClick={updateChordProgressionFactory(index)}
                sx={{
                  height: 80,
                  width: 80,
                  backgroundColor: functionColor[majorScaleFunction[menuItem.degree-1]],
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <div>
                  <b>
                    {degreeLabel[menuItem.degree-1]}{intervalLabel[menuItem.interval]}
                  </b>
                </div>
                <div>
                  {`(${Key[(keyIndex + majorScaleDistance[menuItem.degree-1]) % 12]}${intervalLabel[menuItem.interval]})`}
                </div>
              </Box>
            )
          })}
        </BoxContainer>
      </Popover>
    </Container>
  )
}
