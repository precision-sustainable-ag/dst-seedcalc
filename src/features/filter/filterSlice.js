import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    value: [
        {id: '1', title: 'title 1', content: 'test'},
        {id: '2', title: 'title 2', content: 'test'},
    ]
}
export const getPosts = createAsyncThunk(
    //action type string
    'posts/getPosts',
    // callback function
    async (thunkAPI) => {
      const res = await fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population').then(
      (data) => data.json()
    )
    return res
})
export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        addFilter: (state, action) => {
            state.value.push(action.payload);
        },
        deleteFilter: (state, action) => {
            state.value = state.value.filter((item) => item.id !== action.payload.id)
        }
    },
    extraReducers: {
        [getPosts.pending]: (state) => {
          state.loading = true
        },
        [getPosts.fulfilled]: (state, { payload }) => {
          state.loading = false
          state.entities = payload
        },
        [getPosts.rejected]: (state) => {
          state.loading = false
        },
    }
})

export const { addFilter, deleteFilter } = filterSlice.actions;
export default filterSlice.reducer;
