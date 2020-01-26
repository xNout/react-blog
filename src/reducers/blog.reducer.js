const EstadoInicial = {
    onlyPage: 1,
    totalPages: 0,
    CategorySelected: 'Desarrollo Web',
    loading: false,
    Articles: [],
}

export default function BlogState ( state = EstadoInicial, action)
{
    switch( action.type )
    { 
        case "CHANGE_DATA_VALUE_BLOG":
            return Object.assign( {}, state, action.data )
            
        default:
            return state;
    }
}