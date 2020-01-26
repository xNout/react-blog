const EstadoInicial = {
    searchString: '',
    redirection: {
        pending: false,
        uri: '/'
    },
    LoadingMain: true,

    ViewingArticle: {
        id: '',
        titulo: '',
        categoria: '',
        fecha: '',
        contenido: [],
        author: {
            id: '',
            nombres: 'Desconocido',
            usuario: ''
        }
    },

    UrlAfterAction: {
        pending: false,
        uri: '/'
    }

}

export default function AppState ( state = EstadoInicial, action)
{
    switch( action.type )
    {

        case "CHANGE_DATA_VALUE_APP":
            return Object.assign( {}, state, action.data )

        case "RESET_REDIRECT_URL":
            return Object.assign( {}, state, {
                redirection: { pending: false, uri: '/' }
            })
        case "SET_REDIRECT_URL":
            return Object.assign( {}, state, {
                redirection: { pending: true, uri: action.uri }
            })

        case "ON_LOADING":
            return Object.assign( {}, state, {
                LoadingMain: true
            })

        case "OFF_LOADING":
            return Object.assign( {}, state, {
                LoadingMain: false 
            })

        case "LOAD_ONLYARTICLE":

            return Object.assign( {}, state, {
                ViewingArticle: action.data 
            })   
            
        case "REDIRECT_AFTERACTION":
            return Object.assign( {}, state, action.data )

        default:
            return state;
    }
}