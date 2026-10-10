import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  searchTerm: '',
  category: '',
  page: 1,
  totalPages: 1,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setEvents(state, action) {
      state.events = action.payload.events;
      state.totalPages = action.payload.totalPages;
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const {
  setLoading,
  setEvents,
  setSelectedEvent,
  setError,
  setSearchTerm,
  setCategory,
  setPage,
} = eventsSlice.actions;
export default eventsSlice.reducer;
