import {useState,useEffect, useCallback} from 'react';


const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const API_KEY = import.meta.env.VITE_MASTER_KEY;
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
           const response = await fetch(BASE_URL + '/latest', {headers: {"X-Master-Key": API_KEY}}) 
            const data = await response.json()
            const expenses = data.record.gastos ?? data.record.Gasto ?? []
            const gastosNormalizados = expenses.map((gasto, index) => ({
                ...gasto,
                id: index + 1,
            }))
            setGastos(gastosNormalizados)
        }catch{
            setError('Error, no se puede cargar el registro de gastos')
        }finally{
            setLoading(false)
        }
    }
        fetchGastos()
    },[])
    
    //create - agregar gasto
    const agregarGasto = useCallback( async ({detalle, monto, descripcion, fecha_gasto}) =>{
        setLoading(true) // Indicar que se está cargando
        try{
            const response = await fetch(BASE_URL + '/latest', {headers: {"X-Master-Key": API_KEY}}) // Obtener los gastos actuales
            const data = await response.json()
            const expenseKey = data.record.gastos ? 'gastos' : data.record.Gasto ? 'Gasto' : 'gastos'
            const gastosActuales = data.record[expenseKey] ?? []
            const nuevoGasto = {
                detalle,
                monto: parseFloat(monto),
                descripcion,
                fecha_gasto,
            }
            const gastosActualizados = [...gastosActuales, nuevoGasto].map((gasto, index) => ({
                ...gasto,
                id: index + 1,
            }))
            await fetch(BASE_URL, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                  ...data.record,
                  [expenseKey]: gastosActualizados,
                }),
            })
            setGastos(gastosActualizados)
        }catch{
            setError('Error, no es posible agregar el gasto')
        }finally{
            setLoading(false) // Indicar que se ha terminado de cargar
        }
       
    },[])
   
    return{gastos,loading,error,agregarGasto}
    
}