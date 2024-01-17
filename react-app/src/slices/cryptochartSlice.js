import { createSlice } from '@reduxjs/toolkit';

export const cryptochartSlice = createSlice({
  name: 'cryptochartData',
  initialState: {
    cryptochartData: {}, // Utiliser un objet pour stocker les données de chaque crypto individuellement
  },
  reducers: {
    update_crypto_chart: (state, action) => {
      const { meta, quotes } = action.payload;
      // console.log(action.payload)
      // Utiliser le symbol comme clé pour stocker les données de chaque crypto
      state.cryptochartData[meta.symbol] = { meta, quotes };
    },
  },
});

// Action creators générés pour les cas de réduction
export const { update_crypto_chart } = cryptochartSlice.actions;

export default cryptochartSlice.reducer;
