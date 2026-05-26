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
    useEffect(() => {
        const fetchGastos = async () =>{
        setLoading(true)
        try{
            const response = await fetch(BASE_URL + '/latest', {headers})
            setGastos(response.data.record.gastos ?? [])
        }catch{
            setError('Error, no se puede cargar el registro de gastos')
        }finally{
            setLoading(false)
        }
    }
        fetchGastos()
    },[])
    
    //create - agregar gasto
    const agregarGasto = useCallback( async ({detalle, monto,descripcion, fecha_gasto}) =>{
        setLoading(true) // Indicar que se está cargando
        try{
            const response = await fetch(BASE_URL + '/latest', {headers}) // Obtener los gastos actuales
            const gastosActuales = response.data.record.gastos ?? [] 
            // Crear un nuevo gasto con un ID único
            const nuevoGasto = { 
                id: Date.now(),
                detalle,
                monto: parseFloat(monto),
                descripcion,
                fecha_gasto, 
            }
            const gastosActualizados = [...gastosActuales, nuevoGasto]
            await fetch.put(BASE_URL, {gastos: gastosActualizados}, {headers}) // Actualizar el estado local con los gastos actualizados
            setGastos(gastosActualizados)
        }catch{
            setError('Error, no es posible agregar el gasto')
        }finally{
            setLoading(false) // Indicar que se ha terminado de cargar
        }
    },[])
   
    return{gastos,loading,error,agregarGasto}
    
}