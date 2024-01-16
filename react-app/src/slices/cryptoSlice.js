import { createSlice } from '@reduxjs/toolkit';

export const cryptoSlice = createSlice({
    name: 'Crypto',
    initialState: {
      cryptoData: {}, // Utiliser un objet pour stocker les données de chaque crypto individuellement
    },
    reducers: {
      update_crypto_data: (state, action) => {
        const { code, data } = action.payload;
      
        // Utiliser le code comme clé pour stocker les données de chaque crypto
        state.cryptoData[code] = data;
      },
    },
  });

// Action creator generated for the case reducer function
export const { update_crypto_data } = cryptoSlice.actions;

export default cryptoSlice.reducer;
