import { useCallback, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { green } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { Header, FirstModal, SongSetting, SecondModal, ChordEditor, MelodyEditor, RhythmEditor } from './components';
import { Main, Root } from './App.styled';

const beatTypeLabel = {
  "fourQuarter": "4/4",
  "threeQuarter": "3/4",
}

type EditTarget = "chord"|"melody"|"rhythm";

function App() {
  const theme = createTheme({
    palette: {
      primary: green,
    }
  });

  const [openFile, changeFile] = useState<string|undefined>(undefined);
  const [songSetting, setSongSetting] = useState<SongSetting|undefined>(undefined);
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
                拍子：{beatTypeLabel[songSetting.beatType]}
              </span>
              <span>
                BPM：{songSetting.bpm}
              </span>
            </Toolbar>
            <Main>
            {
              target === "chord" ? (
                <ChordEditor />
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
