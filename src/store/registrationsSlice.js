import { createSlice } from '@reduxjs/toolkit';

const savedRegistrations = localStorage.getItem('registrations');

const initialState = {
  registrations: savedRegistrations ? JSON.parse(savedRegistrations) : [],
};

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userEmail, event } = action.payload;
      const alreadyRegistered = state.registrations.find(
        (r) => r.userEmail === userEmail && r.event.id === event.id
      );
      if (alreadyRegistered) return;

      state.registrations.push({ userEmail, event, registeredAt: new Date().toISOString() });
      localStorage.setItem('registrations', JSON.stringify(state.registrations));
    },
    cancelRegistration(state, action) {
      const { userEmail, eventId } = action.payload;
      state.registrations = state.registrations.filter(
        (r) => !(r.userEmail === userEmail && r.event.id === eventId)
      );
      localStorage.setItem('registrations', JSON.stringify(state.registrations));
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;
