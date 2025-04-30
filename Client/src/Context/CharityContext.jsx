import { createContext, useContext, useEffect, useState } from "react";
import { getCharity } from "../Services/CharityService";


const CharityContext = createContext();
export const CharityProvider = ({children}) =>{
    const [charity , setCharity] = useState({});

    const fetchCharity = async()=>{
        try {
            const response = await getCharity();
            console.log("charity: ", response);
            setCharity(response.data.data.charity);
            


            
        } catch (error) {
            console.log("Error to fetch charity: ",error);

            
            
        }
    }

    useEffect(()=>{
        fetchCharity();
    },[])

    
    return(
        <CharityContext.Provider value={{charity,setCharity,fetchCharity}}>{children}</CharityContext.Provider>

    )


}

export const useCharity = () =>{
    return useContext(CharityContext);
}