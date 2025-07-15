import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import type { Player } from '../types/player';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (player: Partial<Player>) => void;
  initialData?: Player;
}

export const PlayerModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [name, setName] = useState('');
  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setGoals(initialData.goals);
      setAssists(initialData.assists);
    } else {
      setName('');
      setGoals(0);
      setAssists(0);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({
      ...(initialData ? { _id: initialData._id } : {}),
      name,
      goals,
      assists,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? 'Edit Player' : 'Add Player'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Name" value={name} onChange={e => setName(e.target.value)} />
        <TextField fullWidth type="number" margin="dense" label="Goals" value={goals} onChange={e => setGoals(+e.target.value)} />
        <TextField fullWidth type="number" margin="dense" label="Assists" value={assists} onChange={e => setAssists(+e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};