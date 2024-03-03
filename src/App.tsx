import { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, ThemeProvider, createTheme } from '@mui/material';
import { cyan } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { Header, FirstModal, SecondModal, ChordEditor, MelodyEditor, RhythmEditor } from './components';
import { Key, Chord, BeatType, majorScaleDistance } from "./definitions";
import { Main, Root } from './App.styled';

type EditTarget = "chord"|"melody"|"rhythm";

const createChords = (key: Key, chordProgression: (Chord|null)[]) => {
  const index = Key.indexOf(key);
  const chordTones: string[][] = [];
  for (const chord of chordProgression) {
    if (chord === null) {
      chordTones.push([])
    } else {
      const rootIndex = (index + majorScaleDistance[chord.degree-1]) % 12;
      const thirdIndex = (rootIndex + (chord.interval === "major" ? 4 : 3));
      const fifthIndex = (rootIndex + (chord.interval === "minorFlatFive" ? 6 : 7));
      console.log(thirdIndex)
      chordTones.push([
        Key[rootIndex] + "4",
        Key[thirdIndex % 12] + `${4 + Math.floor(thirdIndex / 12)}`,
        Key[fifthIndex % 12] + `${4 + Math.floor(fifthIndex / 12)}`,
      ])
    }
  }
  return chordTones;
}

function App() {
  const theme = createTheme({
    palette: {
      primary: cyan,
    }
  });

  const [openFile, changeFile] = useState<string|undefined>();
  const [beatType, setBeatType] = useState<BeatType|undefined>();
  const [key, changeKey] = useState<Key>("C");
  const [viewMeasure, changeViewMeasure] = useState<number>(2);
  const [chordProgression, updateChordProgression] = useState<(Chord|null)[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [target, setTarget] = useState<EditTarget>("chord");
  const [bpm, setBpm] = useState<number>(120);
  const [synth, setSynth] = useState<Tone.PolySynth|null>(null);
  const [playingEventId, setPlayingEventId] = useState<number|undefined>();

  useEffect(() => {
    const openFile = localStorage.getItem('openFile');
    if (openFile !== null) {
      changeFile(openFile);
    }
    const beatType = localStorage.getItem('beatType');
    if (beatType !== null) {
      if (BeatType.includes(beatType as BeatType)) {
        setBeatType(beatType as BeatType);
      } else {
        localStorage.removeItem('beatType');
      }
    }
    const key = localStorage.getItem('key');
    if (key !== null) {
      if (Key.includes(key as Key)) {
        changeKey(key as Key);
      } else {
        localStorage.removeItem('key');
      }
    }
    const bpm = localStorage.getItem('bpm');
    if (bpm !== null) {
      setBpm(Number(bpm));
    }
    const viewMeasure = localStorage.getItem('viewMeasure');
    if (viewMeasure !== null) {
      changeViewMeasure(Number(viewMeasure));
    }
    const offset = localStorage.getItem('offset');
    if (offset !== null) {
      setOffset(Number(offset));
    }
  }, []);

  const changeBpm = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
    localStorage.setItem("bpm", event.target.value);
  }, [setBpm]);
  const onSelectFirstModal = useCallback((value: string) => {
    if (value === "newfile") {
      changeFile(value);
      localStorage.setItem("openFile", value);
    }
  }, [changeFile]);
  const onSubmitBeatType = useCallback((value: BeatType) => {
    setBeatType(value);
    localStorage.setItem("beatType", value);
  }, [setBeatType]);
  const onChangeTarget = useCallback((_: React.MouseEvent, value: string) => {
    setTarget(value as EditTarget)
  }, [setTarget]);

  const onToggleMusic = useCallback(async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      Tone.Transport.bpm.value = bpm;
      let localSynth: Tone.PolySynth;
      if (synth === null) {
        localSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setSynth(localSynth);
      } else {
        localSynth = synth;
      }
      const chords = createChords(key, chordProgression);
      console.log(chords[0])
      let eventId = 0;
      eventId = Tone.Transport.scheduleRepeat((time) => {
          const chord = chords.shift();
          if (chord !== undefined) {
            localSynth.triggerAttackRelease(chord, '4n', time);
          } else {
            Tone.Transport.clear(eventId);
            Tone.Transport.stop();
            synth?.releaseAll();
            setIsPlaying(false);
          }
      }, '4n');
      setPlayingEventId(eventId);
      Tone.Transport.start();
    } else {
      if (playingEventId !== undefined) {
        Tone.Transport.clear(playingEventId);
      }
      Tone.Transport.stop();
      synth?.releaseAll();
      setIsPlaying(false);
    }
  }, [key, chordProgression, synth, isPlaying, setIsPlaying, bpm, playingEventId]);

  const notOpenFile = openFile === undefined;
  const beforeInitSetting = beatType === undefined;

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Header />
        {!beforeInitSetting && (
          <>
            <Toolbar sx={{ gap: 2, backgroundColor: "#eee" }}>
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
              <Button onClick={onToggleMusic}>
                {isPlaying ? <Stop /> : <PlayArrow /> }
              </Button>
              <span>
                拍子：{beatType}
              </span>
              <FormControl sx={{ margin: 2, width: 120 }}>
                <InputLabel htmlFor="bpm">BPM</InputLabel>
                <OutlinedInput disabled={isPlaying} placeholder="BPM" type="number" value={bpm} onChange={changeBpm} />
              </FormControl>
              <FormControl sx={{ my: 2 }}>
                <InputLabel>キー</InputLabel>
                <Select
                  disabled={isPlaying}
                  value={key}
                  onChange={(event) => {
                    changeKey(event.target.value as Key);
                    localStorage.setItem("key", event.target.value);
                  }}
                  label="キー"
                >
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="C#">C#</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="D#">D#</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                  <MenuItem value="F#">F#</MenuItem>
                  <MenuItem value="G">G</MenuItem>
                  <MenuItem value="G#">G#</MenuItem>
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="A#">A#</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ my: 2, width: 120 }}>
                <InputLabel>表示する小節数</InputLabel>
                <Select
                  disabled={isPlaying}
                  value={viewMeasure}
                  onChange={(event) => {
                    changeViewMeasure(Number(event.target.value));
                    localStorage.setItem("viewMeasure", String(event.target.value));
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
                  scaleKey={key}
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
