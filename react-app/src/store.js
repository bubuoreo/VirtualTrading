import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cryptoReducer from './slices/cryptoSlice';
import cryptodataReducer from'./slices/cryptodataSlice';
import cryptochartReducer from'./slices/cryptochartSlice';

export default configureStore({
  reducer: {
    userReducer: userReducer,
    cryptoReducer: cryptoReducer,
    cryptodataReducer: cryptodataReducer,
    cryptochartReducer: cryptochartReducer
  },
});
