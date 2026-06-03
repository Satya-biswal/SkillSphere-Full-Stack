import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], unreadCount: 0 },
  reducers: {
    setNotifications: (state, action) => { state.notifications = action.payload; },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearUnread: (state) => { state.unreadCount = 0; },
  },
});

export const { setNotifications, addNotification, clearUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
