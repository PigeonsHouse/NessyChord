import { useCallback, useState } from 'react';
import useToggle from 'react-use/lib/useToggle'
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, ThemeProvider, createTheme } from '@mui/material';
import { cyan } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { Header, FirstModal, SecondModal, ChordEditor, MelodyEditor, RhythmEditor, Chord, BeatType } from './components';
import { Main, Root } from './App.styled';

type EditTarget = "chord"|"melody"|"rhythm";

function App() {
  const dummyData = {
    openFile: "",
    beatType: "4/4" as BeatType,
    chordProgression: [
      {
        degree: 4,
        interval: "major"
      },
      {
        degree: 5,
        interval: "major"
      },
      {
        degree: 3,
        interval: "minor"
      },
      {
        degree: 6,
        interval: "minor"
      },
    ] as Chord[],
  }

  const theme = createTheme({
    palette: {
      primary: cyan,
    }
  });

  const [openFile, changeFile] = useState<string|undefined>(dummyData.openFile);
  const [beatType, setBeatType] = useState<BeatType|undefined>(dummyData.beatType);
  const [key, changeKey] = useState<"A"|"B"|"C"|"D"|"E"|"F"|"G">("C");
  const [viewMeasure, changeViewMeasure] = useState<number>(2);
  const [chordProgression, updateChordProgression] = useState<Chord[]>(dummyData.chordProgression);
  const [offset, setOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useToggle(false);
  const [target, setTarget] = useState<EditTarget>("chord");
  const [bpm, setBpm] = useState<number>(120);
  const changeBpm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
  }, [setBpm]);

  const onSelectFirstModal = useCallback((value: string) => {
    if (value === "newfile") {
      changeFile("newfile");
    }
  }, [changeFile]);
  const onSubmitBeatType = useCallback((value: BeatType) => {
    setBeatType(value);
  }, [setBeatType]);
  const onChangeTarget = useCallback((_: React.MouseEvent, value: string) => {
    setTarget(value as EditTarget)
  }, [setTarget]);

  const notOpenFile = openFile === undefined;
  const beforeInitSetting = beatType === undefined;

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Header />
        {!beforeInitSetting && (
          <>
            <Toolbar sx={{ gap: 2, backgroundColor: "lightGray" }}>
              <ToggleButtonGroup
                color="primary"
                value={target}
                exclusive
                onChange={onChangeTarget}
                aria-label="Platform"
              >
                <ToggleButton value="chord">コード</ToggleButton>
                <ToggleButton value="melody">メロディ</ToggleButton>
                <ToggleButton value="rhythm">リズム</ToggleButton>
              </ToggleButtonGroup>
              <Button onClick={setIsPlaying}>
                {isPlaying ? <Stop /> : <PlayArrow /> }
              </Button>
              <span>
                拍子：{beatType}
              </span>
              <FormControl sx={{ margin: 2 }}>
                <InputLabel htmlFor="bpm">BPM</InputLabel>
                <OutlinedInput placeholder="BPM" type="number" value={bpm} onChange={changeBpm} />
              </FormControl>
              <FormControl sx={{ my: 2 }}>
                <InputLabel>キー</InputLabel>
                <Select
                  value={key}
                  onChange={(event) => {
                    changeKey(event.target.value as "A"|"B"|"C"|"D"|"E"|"F"|"G")
                  }}
                  label="キー"
                >
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                  <MenuItem value="G">G</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ my: 2, width: 120 }}>
                <InputLabel>表示する小節数</InputLabel>
                <Select
                  value={viewMeasure}
                  onChange={(event) => {
                    changeViewMeasure(Number(event.target.value))
                  }}
                  label="表示する小節数"
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={16}>16</MenuItem>
                </Select>
              </FormControl>
            </Toolbar>
            <Main>
            {
              target === "chord" ? (
                <ChordEditor
                  beat={Number(beatType[0])}
                  key={key}
                  chordProgression={chordProgression}
                  offset={offset}
                  viewMeasure={viewMeasure}
                  setOffset={setOffset}
                  updateChordProgression={updateChordProgression}
                />
              ) : target === "melody" ? (
                <MelodyEditor />
              ) : (
                <RhythmEditor />
              )
            }
            </Main>
          </>
        )}
      </Root>
      <FirstModal open={notOpenFile} onSelect={onSelectFirstModal} />
      <SecondModal open={!notOpenFile && beforeInitSetting} onSelect={onSubmitBeatType} />
    </ThemeProvider>
  )
}

export default App;
