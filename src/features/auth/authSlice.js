import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    accessToken: undefined,
    users: undefined
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        userLoggedIn: (state,action) => {

        }
    }
})

export const {} = authSlice.actions;
export default authSlice.reducer