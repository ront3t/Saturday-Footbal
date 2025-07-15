import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export const TopBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#0B0B45' }}>
      <Toolbar>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6">Saturday Football</Typography>
          <Avatar alt="User" src="" sx={{ bgcolor: '#673ab7' }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
