import { createSlice } from '@reduxjs/toolkit';

export const cryptodataSlice = createSlice({
    name: 'Cryptoinfo',
    initialState: {
      cryptoinfoData: {}, // Utiliser un objet pour stocker les données de chaque crypto individuellement
    },
    reducers: {
      update_crypto_info: (state, action) => {
        const { symbol, data } = action.payload;
       
        // Utiliser le code comme clé pour stocker les données de chaque crypto
        state.cryptoinfoData[symbol] = data;
      },
    },
  });

// Action creator generated for the case reducer function
export const { update_crypto_info } = cryptodataSlice.actions;

export default cryptodataSlice.reducer;
