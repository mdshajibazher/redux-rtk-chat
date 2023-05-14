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
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state,action) => {
            state.accessToken = undefined;
            state.user = undefined;
        }
    }
})

export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer