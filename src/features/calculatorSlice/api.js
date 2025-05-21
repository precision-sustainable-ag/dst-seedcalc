import { createAsyncThunk } from '@reduxjs/toolkit';
import apiBaseURL from '../../shared/utils/apiBaseURL';

// eslint-disable-next-line import/prefer-default-export
export const getCrops = createAsyncThunk(
  'calculator/getCrops',
  async ({ regionId }) => {
    const res = await fetch(
      `${apiBaseURL}/v2/crops/?regions=${regionId}&context=seed_calc`,
    ).then((data) => data.json());
    return res;
  },
);
