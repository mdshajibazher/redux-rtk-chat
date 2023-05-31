import {apiSlice} from "../api/apiSlice";
import {messagesApi} from "../messages/messagesApi";
import io from 'socket.io-client';

export const conversationsApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getConversations: builder.query({
            query: (email) => `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`
            ,async onCacheEntryAdded(arg, {
                updateCachedData, cacheDataLoaded, cacheEntryRemoved
            }){

                const socket = io('http://localhost:9000',{
                    reconnectionDelay: 1000,
                    reconnection: true,
                    reconnectionAttempts: 10,
                    transports: ["websocket"],
                    agent: false,
                    upgrade: false,
                    rejectUnauthorized: false,
                })
                
                try{
                    await cacheDataLoaded;
                    socket.on('conversations',(data) => {
                        updateCachedData(draft => {
                            const conversations = draft.find(c =>  c.id == data?.data?.id );
                            if(conversations?.id){
                                conversations.message = data?.data?.message
                                conversations.timestamp = data?.data?.timestamp
                            }else{
                                console.log('else')
                            }
                        })
                    })
                }catch (e) {
                    console.log('e',e)
                }
                await cacheEntryRemoved;
                socket.close();
            }
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

                // Optimistic Cache update start
                const pathResult2 = dispatch(apiSlice.util.updateQueryData('getConversations',arg.sender, (draft) => {
                    draft.push(arg.data);
                }));
                // Optimistic Cache update end


                try{
                    const converasation = await queryFulfilled;
                    if(converasation?.data?.id){
                        const users = arg.data.users;
                        const senderUser = users.find(user => user.email === arg.sender)
                        const receiverUser = users.find(user => user.email !== arg.sender)
                        const  res =  await  dispatch(messagesApi.endpoints.addMessage.initiate({
                            conversationId: converasation?.data?.id,
                            sender: senderUser,
                            receiver: receiverUser,
                            message: arg.data.message,
                            timestamp: arg.data.timestamp
                        })).unwrap()

                        // update cache pessimistically start

                        // update cache pessimistically end
                    }
                }catch (e){
                    pathResult2.undo();
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
                // Optimistic Cache update start
                const pathResult1 = dispatch(apiSlice.util.updateQueryData('getConversations',arg.sender, (draft) => {
                    console.log('draft',draft);
                    const draftConversation =  draft.find(c => c.id == arg.id);
                    draftConversation.message = arg.data.message;
                    draftConversation.timestamp = arg.data.timestamp;
                }));
                // Optimistic Cache update end


                try{
                    const converasation = await queryFulfilled;
                    if(converasation?.data?.id){
                        const users = arg.data.users;
                        const senderUser = users.find(user => user.email === arg.sender)
                        const receiverUser = users.find(user => user.email !== arg.sender)
                        const  res = await dispatch(messagesApi.endpoints.addMessage.initiate({
                            conversationId: converasation?.data?.id,
                            sender: senderUser,
                            receiver: receiverUser,
                            message: arg.data.message,
                            timestamp: arg.data.timestamp
                        })).unwrap()

                        console.log('res.conversationId',res.conversationId)


                        // update cache pessimistically start
                        dispatch(apiSlice.util.updateQueryData('getMessages',res.conversationId.toString(), (draft) => {
                            console.log('draft',draft)
                                draft.push(res)
                        }));
                        // update cache pessimistically end


                    }
                }catch (e){
                    pathResult1.undo();
                }

            }
        }),
    })
})

export const {useGetConversationsQuery,useGetConversationQuery, useAddConversationMutation, useEditConversationMutation} = conversationsApi;