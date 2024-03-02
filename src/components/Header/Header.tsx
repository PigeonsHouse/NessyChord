import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar disableGutters sx={{ px: 5 }}>
        NessyChord
      </Toolbar>
    </AppBar>
  )
}
