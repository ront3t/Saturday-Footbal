import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { fetchPlayers, addNewPlayer, updateExistingPlayer, deleteExistingPlayer } from '../redux/playersSlice';
import type { Player } from '../types/player';
import { PlayerModal } from './PlayerModal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const PlayerTable = () => {
  const dispatch = useDispatch<any>();
  const { players, loading, error } = useSelector((state: RootState) => state.players);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteExistingPlayer(id));
  };

  const handleSave = (playerData: Partial<Player>) => {
    if ('_id' in playerData && playerData._id) {
      dispatch(updateExistingPlayer(playerData as Player));
    } else {
      // Ensure all required fields are present before adding
      const { name, goals, assists } = playerData;
      if (typeof name === 'string' && typeof goals === 'number' && typeof assists === 'number') {
        dispatch(addNewPlayer({ name, goals, assists }));
      } else {
        // Optionally handle the error (e.g., show a message)
        alert('Please provide valid name, goals, and assists for the player.');
      }
    }
  };

  return (
    <Stack spacing={3} padding={4} bgcolor="#0B0B45" minHeight="100vh" color="white">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Players Table</Typography>
        <Button variant="contained" color="secondary" onClick={() => setModalOpen(true)}>
          + Add Player
        </Button>
      </Stack>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper} sx={{ backgroundColor: '#1C1C5A' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Goals</TableCell>
              <TableCell sx={{ color: 'white' }}>Assists</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map(p => (
              <TableRow key={p._id} hover>
                <TableCell sx={{ color: 'white' }}>{p.name}</TableCell>
                <TableCell sx={{ color: 'white' }}>{p.goals}</TableCell>
                <TableCell sx={{ color: 'white' }}>{p.assists}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(p)} color="warning">Edit</Button>
                  <Button size="small" onClick={() => handleDelete(p._id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PlayerModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedPlayer(undefined); }} onSubmit={handleSave} initialData={selectedPlayer} />
    </Stack>
  );
};