import { createSlice } from "@reduxjs/toolkit";

const LoaderSlice = createSlice({
    name: 'loader',
    initialState: {loader: false},
    reducers: {
        showLoader: (state)=> {state.loader = true},
        hideLoader: (state)=> {state.loader = false}
    }
})

export const { showLoader, hideLoader } = LoaderSlice.actions;
export default LoaderSlice.reducer;