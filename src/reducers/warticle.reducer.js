const EstadoInicial = {
    uploading: false,
    publicado: false,
    validaciones: [],
    uploadedImageName: 'Sube un archivo',
    preUploadedImage: null,
    titulo: '',
    categoria: 'Sin Categoria',
    contenido: ''
}

export default function WArticleState ( state = EstadoInicial, action)
{
    switch( action.type )
    {

        case "HANDLE_WARTICLE_CHANGES":
            // const { name, value } = action.data;
            return Object.assign( {}, state, action.data)

        case "PREUP_WARTICLE_IMAGE":
            // const { name, value } = action.data;
            return Object.assign( {}, state, action.data)

        case "RESET_WARTICLE_EDIT":
            // const { name, value } = action.data;
            return Object.assign( {}, state, {
                uploading: false,
                publicado: false,
                validaciones: [],
                uploadedImageName: 'Sube un archivo',
                preUploadedImage: null,
                titulo: '',
                categoria: 'Sin Categoria',
                contenido: ''
            })
  

        default:
            return state;
    }
}