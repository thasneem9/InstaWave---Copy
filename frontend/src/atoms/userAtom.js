import { atom } from "recoil"
const userAtom=atom({
    key:'userAtom',
    //get default value forouruser formthelocalStorage (we saved in signupcard user-instawave)
    default:JSON.parse(localStorage.getItem('user-instawave'))
})

export default userAtom