import { configureStore } from '@reduxjs/toolkit';
import {apiSlice} from "../features/api/apiSlice";
import authSliceReducer from "../features/auth/authSlice";
import messagesSliceReducer from "../features/messages/messagesSlice";
import conversationsSliceReducer from "../features/conversations/conversationsSlice";

export const store = configureStore({
  reducer: {
      [apiSlice.reducerPath] : apiSlice.reducer,
      auth: authSliceReducer,
      conversations: conversationsSliceReducer,
      messages: messagesSliceReducer,
  },
    middleware: (getDefaultMiddlewares) => {getDefaultMiddlewares().concat(apiSlice.middleware)}
});
