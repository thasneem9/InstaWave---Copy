import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/AuthAtom.js"



const AuthPage=()=>{
    const authScreenState=useRecoilValue(authScreenAtom)
   console.log(authScreenState)
    return(
        <>
        {authScreenState==="login"?<LoginCard/>:<SignupCard/>}

        </>

    )

}
export default AuthPage;
        ///* when u click signup change the state and the loginCard 