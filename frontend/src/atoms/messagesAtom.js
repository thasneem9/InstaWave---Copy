import {atom} from "recoil"

export const conversationAtom=atom({
    key:"conversationsAtom",
    default:[],
})          

export const selectedConversationAtom=atom({
    key:"selectedConversationAtom",
    default:{
        _id:"",//id of conversation
        userId:"",//id of the person we r talking to
        username:"",
        userProfilePic:"",
    }

})