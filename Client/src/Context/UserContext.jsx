import { Children, createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../Services/UserService";


const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [user , setUser] = useState({});
    const fetchUser = async()=>{

        try {
            const response = await getUser();
            console.log("User: ", response);
            setUser(response.data.data.user);
            
        } catch (error) {
            console.log("Error to fetch user: ",error);
            
        }

    }

    useEffect(()=>{
        fetchUser();
    },[]);

    return(
        <UserContext.Provider value={{user,setUser,fetchUser}}>{children}</UserContext.Provider>

    )
}


//custom hook
export const useUser = () =>{
    return useContext(UserContext);
}