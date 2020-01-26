// Función para añadir dias a una fecha.
// Extraído de stackoverflow. Créditos a su creador.
export function AddDays( date, days){
    date.setDate(date.getDate() + parseInt(days));
    return date;
}