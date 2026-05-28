import {useForm} from '@tanstack/react-form'
export default function FormularioGasto({ onAgregar, loading }) {
    const form = useForm({
        defaultValues: {
            detalle: '',
            monto: '',
            descripcion: '',
            fecha_gasto: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        },
        onSubmit: async ({value}) => {
            console.log('value del form:', value)
            await onAgregar(value)
            form.reset() // Reiniciar el formulario después de agregar el gasto
        },
    })
    return(
        <>
        <div className = "form-card">
            <h3>Agregar Gasto</h3>
            <form onSubmit={(e) =>{e.preventDefault(); form.handleSubmit()}}>
            <form.Field name = "detalle"
            validators={{
                onChange: ({value}) => 
                !value ? 'El detalle es requerido' : undefined,
            }}>
            {(field) => (
                <div className="form-group">
                    <label>Detalle</label>
                    <input
                        type= "text" placeholder= "Ej: viveres,transporte, servicios..." value= {field.state.value} onChange= {(e)=> field.handleChange(e.target.value)} onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                        <span className= "form-error">{field.state.meta.errors[0]}</span>
                    )}
                </div>
            )}
            </form.Field>
            <form.Field name = "monto"
            validators={{
                onChange:({value}) =>{
                    if(!value) return 'monto requerido'
                    if(isNaN(value)||Number(value) <= 0)
                    return 'monto debe ser un numero positivo'
                    return undefined
                },
            }}>
            {(field)=>(
                <div className= "form-group">
                <label>Monto (₡)</label>
                <input type="number" placeholder= "0.00" step="0.01" min="0" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}/>
                {field.state.meta.errors.length > 0 && ( <span className="form-error">{field.state.meta.errors[0]}</span>)}
                </div>
            )}
            </form.Field>
            <form.Field name = "descripcion"
            validators={{
                onChange: ({value}) =>{
                if(value.length > 200) return 'La descripcion no puede exceder los 200 caracteres'
                return undefined
                },
            }}>
            {(field)=>(
                <div className= "form-group">
                <label>Descripcion</label>
                <textarea placeholder= "Opcional: detalles sobre el gasto" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}/>
                {field.state.meta.errors.length > 0 && (
                    <span className="form-error">{field.state.meta.errors[0]}</span>
                )}
                </div>
            )}
            </form.Field>
            <form.Field name = "fecha_gasto"
            validators={{
                onChange: ({value}) =>
                    !value ? 'La fecha es requerida' : undefined,
                }}
            >
            {(field) => (
                <div className="form-group">
                    <label>Fecha</label>
                <input type="date" value={field.state.value} onChange={ (e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}/>
                {field.state.meta.errors.length > 0 && (
                    <span className="form-error">{field.state.meta.errors[0]}</span>
                )}
                </div>
            )}
            </form.Field>
            <button type="submit" disabled={loading || !form.state.canSubmit}>
                {loading ? 'Agregando...' : ' Agregar Gasto'}
            </button>
            </form>
        </div>
    
        </>
    );


}