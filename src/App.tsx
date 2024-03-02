import { useCallback, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { green } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { Header, FirstModal, SongSetting, SecondModal, ChordEditor, MelodyEditor, RhythmEditor, Chord } from './components';
import { Main, Root } from './App.styled';

type EditTarget = "chord"|"melody"|"rhythm";

function App() {
  const dummyData = {
    openFile: "",
    songSetting: {
      beatType: "4/4",
      bpm: 200
    } as SongSetting,
    key: "C" as "A"|"B"|"C"|"D"|"E"|"F"|"G",
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
    viewMeasure: 1,
    page: 1,
  }

  const theme = createTheme({
    palette: {
      primary: green,
    }
  });

  const [openFile, changeFile] = useState<string|undefined>(dummyData.openFile);
  const [songSetting, setSongSetting] = useState<SongSetting|undefined>(dummyData.songSetting);
  const [target, setTarget] = useState<EditTarget>("chord");

  const onSelectFirstModal = useCallback((value: string) => {
    if (value === "newfile") {
      changeFile("newfile");
    }
  }, [changeFile]);
  const onSubmitSongSetting = useCallback((value: SongSetting) => {
    setSongSetting(value);
  }, [setSongSetting]);
  const onChangeTarget = useCallback((_: React.MouseEvent, value: string) => {
    setTarget(value as EditTarget)
  }, [setTarget]);

  const notOpenFile = openFile === undefined;
  const beforeInitSetting = songSetting === undefined;

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
              <span>
                拍子：{songSetting.beatType}
              </span>
              <span>
                BPM：{songSetting.bpm}
              </span>
            </Toolbar>
            <Main>
            {
              target === "chord" ? (
                <ChordEditor
                  beat={Number(songSetting.beatType[0])}
                  key={dummyData.key}
                  chordProgression={dummyData.chordProgression}
                  viewMeasure={dummyData.viewMeasure}
                  page={dummyData.page}
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
      <SecondModal open={!notOpenFile && beforeInitSetting} onSelect={onSubmitSongSetting} />
    </ThemeProvider>
  )
}

export default App;
