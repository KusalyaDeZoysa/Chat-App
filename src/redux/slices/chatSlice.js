import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
}

const chatSlice = createSlice({
    name: "chat",   
    initialState,
    reducers: {
        changeChat: (state, action) => {
            const { currentUser, chatId, user } = action.payload;

            //check if the current user is blocked
            if (user.blocked.includes(currentUser.id)) {
                state.chatId = chatId;
                state.user = null;
                state.isCurrentUserBlocked = true;
                state.isReceiverBlocked = false;
            }

            //check if the receiver is blocked
            else if (currentUser.blocked.includes(user.id)) {
                state.chatId = chatId;
                state.user = user;
                state.isCurrentUserBlocked = false;
                state.isReceiverBlocked = true;
            }

            // Neither is blocked
            else {
                state.chatId = chatId;
                state.user = user;
                state.isCurrentUserBlocked = false;
                state.isReceiverBlocked = false;
            }
        },

        changeBlock: (state, action) => {
            const { isReceiverBlocked } = action.payload;
            state.isReceiverBlocked = !isReceiverBlocked;
        }
    }
})

export const { changeChat, changeBlock } = chatSlice.actions;
export default chatSlice.reducer;