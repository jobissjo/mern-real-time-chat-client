import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        allUsers: [],
        allChats: [],
        selectedChat: null,
        allMessages: []
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },
        setAllUsers: (state, action) => { state.allUsers = action.payload },
        setAllChats: (state, action) => { state.allChats = action.payload },
        setSelectedChat: (state, action) => { state.selectedChat = action.payload},
        setAllMessages: (state, action) => { state.allMessages = action.payload }
    }
})

export const { setUser, setAllUsers , setAllChats, setSelectedChat,
    setAllMessages } = userSlice.actions;

export default userSlice.reducer;