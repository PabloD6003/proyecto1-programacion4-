import {useState,useEffect, useCallback} from 'react';


const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID
const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const headers = {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json'
}

export default function useGastos(){

    const [gastos, setGastos]= useState([])
    const [loading,setLoading]= useState(false)
    const [error,setError] = useState(null)
    
    //Get gastos
    const fecthGastos = useCallback(async () =>{
        setLoading(true)
        try{
            
            const response = await fetch(BASE_URL + '/latest', {headers})
            setGastos(response.data.record.gastos ?? [])
        }catch{
            setError('Error, no se puede cargar el registro de gastos')
        }finally{
            setLoading(false)
        }
    },[])


    return{}
    
}