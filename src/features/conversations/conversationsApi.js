import {apiSlice} from "../api/apiSlice";
import {messagesApi} from "../messages/messagesApi";
import {data} from "autoprefixer";

export const conversationsApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getConversations: builder.query({
            query: (email) => `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`
        }),
        getConversation: builder.query({
            query: ({userEmail, participantEmail}) => `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`
        }),

        addConversation: builder.mutation({
            query: ({sender, data}) => ({
                url: '/conversations',
                method: 'POST',
                body: data
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                const converasation = await queryFulfilled;
                if(converasation?.data?.id){
                    const users = arg.data.users;
                    const senderUser = users.find(user => user.email === arg.sender)
                    const receiverUser = users.find(user => user.email !== arg.sender)
                    dispatch(messagesApi.endpoints.addMessage.initiate({
                        conversationId: converasation?.data?.id,
                        sender: senderUser,
                        receiver: receiverUser,
                        message: arg.data.message,
                        timestamp: arg.data.timestamp
                    }))
                }
            }
        }),

        editConversation: builder.mutation({
            query: ({id, sender,data}) => ({
                url: `/conversations/${id}`,
                method: 'PATCH',
                body: data
            }),

            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                const converasation = await queryFulfilled;
                console.log('converasation',converasation);
                console.log('arg',arg);
                if(converasation?.data?.id){
                    const users = arg.data.users;
                    const senderUser = users.find(user => user.email === arg.sender)
                    const receiverUser = users.find(user => user.email !== arg.sender)
                    dispatch(messagesApi.endpoints.addMessage.initiate({
                        conversationId: converasation?.data?.id,
                        sender: senderUser,
                        receiver: receiverUser,
                        message: arg.data.message,
                        timestamp: arg.data.timestamp
                    }))
                }
            }
        }),
    })
})

export const {useGetConversationsQuery,useGetConversationQuery, useAddConversationMutation, useEditConversationMutation} = conversationsApi;