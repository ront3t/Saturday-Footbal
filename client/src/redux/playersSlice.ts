import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { Player } from '../types/player';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/players';

export const fetchPlayers = createAsyncThunk('players/fetchPlayers', async () => {
  const response = await axios.get<Player[]>(BASE_URL);
  return response.data;
});

export const addNewPlayer = createAsyncThunk('players/addNewPlayer', async (player: Omit<Player, '_id'>) => {
  const response = await axios.post<Player>(BASE_URL, player);
  return response.data;
});

export const updateExistingPlayer = createAsyncThunk('players/updatePlayer', async (player: Player) => {
  const response = await axios.put<Player>(`${BASE_URL}/${player._id}`, player);
  return response.data;
});

export const deleteExistingPlayer = createAsyncThunk('players/deletePlayer', async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

interface PlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  loading: false,
  error: null,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPlayers.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchPlayers.fulfilled, (state, action) => { state.loading = false; state.players = action.payload; })
      .addCase(fetchPlayers.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed'; })

      .addCase(addNewPlayer.fulfilled, (state, action) => { state.players.push(action.payload); })
      .addCase(updateExistingPlayer.fulfilled, (state, action) => {
        const idx = state.players.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.players[idx] = action.payload;
      })
      .addCase(deleteExistingPlayer.fulfilled, (state, action) => {
        state.players = state.players.filter(p => p._id !== action.payload);
      });
  },
});

export default playersSlice.reducer;
