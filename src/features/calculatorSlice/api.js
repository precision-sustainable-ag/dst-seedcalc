import { createAsyncThunk } from '@reduxjs/toolkit';

// eslint-disable-next-line import/prefer-default-export
export const getCropsNew = createAsyncThunk(
  'calculator/getCropsNew',
  async ({ regionId }) => {
    const res = await fetch(
      `https://developapi.covercrop-selector.org/v2/crops/?regions=${regionId}&context=seed_calc`,
    ).then((data) => data.json());
    return res;
  },
);
