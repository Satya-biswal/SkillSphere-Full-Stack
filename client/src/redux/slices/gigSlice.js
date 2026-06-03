import { createSlice } from '@reduxjs/toolkit';

const gigSlice = createSlice({
  name: 'gigs',
  initialState: { gigs: [], loading: false, error: null },
  reducers: {
    setGigs: (state, action) => { state.gigs = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setGigs, setLoading, setError } = gigSlice.actions;
export default gigSlice.reducer;
