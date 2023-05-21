import {apiSlice} from "../api/apiSlice";
import {userLoggedIn} from "./authSlice";

export const authApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        register : builder.mutation({
            query: (data) => ({
                url: '/register',
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                    const result = await queryFulfilled;
                    let resultObject = {
                        accessToken: result.data.accessToken,
                        user: result.data.user,
                    };
                    localStorage.setItem("auth",JSON.stringify(resultObject))
                    dispatch(userLoggedIn(resultObject))

            }
        }),

        login : builder.mutation({
            query: (data) => ({
                url: '/login',
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                const result = await queryFulfilled;
                let resultObject = {
                    accessToken: result.data.accessToken,
                    user: result.data.user,
                };
                localStorage.setItem("auth",JSON.stringify(resultObject))
                dispatch(userLoggedIn(resultObject))

            }
        })

    })
})

export const {useLoginMutation, useRegisterMutation} = authApi;