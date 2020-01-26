import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Componentes
import Loading from './loading_main';
import Header from './layout/header.component';

import './css/busquedas.css';

import axios from 'axios';


// Acciones Redux
import { EnableLoading, DisableLoading, RedirectUrl } from '../reducers/app.reducer_actions';

export default class Busquedas extends Component
{

    constructor(props)
    {
        super(props);

        this.AppStore = this.props.AppStore;

        this.state = 
        {
            busquedaStr: '',
            resultados: []
        }
    }

    async componentDidMount()
    {
        await this.RefreshSearch();
    }

    async RefreshSearch()
    {
        this.AppStore.dispatch( EnableLoading());
        const { SearchStr } = this.props.match.params;
        this.setState({busquedaStr: SearchStr})

        try {
            const { data } = await axios.get(`http://localhost:3535/api/article/search/${SearchStr}`)

            this.setState({ resultados : data })
            this.AppStore.dispatch(DisableLoading());
        } 

        catch (error) {
            this.AppStore.dispatch(DisableLoading());
            this.AppStore.dispatch( RedirectUrl('/err404') )
        }
    }
    componentDidUpdate()
    {
        // Aquí se extrae el parametro de search.
        // search/:SearchStr
        const { SearchStr } = this.props.match.params;
        
        // este estado, guarda la anterior busqueda realizada la cual sirve para comprobar si se está buscando nuevos articulos.
        let BusquedaInicial = this.state.busquedaStr;

        /* 
            Por ejemplo, al buscar el termino "politica" la ruta se actualizaría y quedaria de esta forma: '/search/politica
            El termino politica se guarda en el estado 'busquedaStr' y enseguida hace una consulta al API
            la cual devuelve el conjunto de resultados.

            Ahora, este ciclo se ejecuta cada que se escribe, pero no se actualiza hasta que se presione enter.
            ¿Que sucede cuando se presiona enter?

            el parametro de la ruta search llamado '/:SearchStr' toma un nuevo valor y el mismo se compara con el guardado en el estado
            'BusquedaInicial' y al verificar que son diferentes con la última busqueda realizada. Procede a realizar una nueva petición al API
        */
        if( BusquedaInicial !== SearchStr)
            this.RefreshSearch();
            
        /*
            En la consola se muestra esta advertencia: 
            
            * Warning: Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

            No tengo idea de como solucionarla.
        */
    }
    render()
    {
        const { AppState : { LoadingMain } } = this.AppStore.getState();
        
        return(
            <React.Fragment>
                {/* Espero en el siguiente proyecto aprender sobre las "nested routes" y evitar copiar los componentes miles de veces. */}
                <Header {...this.props} AppStore={this.AppStore}/>
                { LoadingMain === true ?
                    <Loading />
                :
                <div class="main_page row justify-content-center">
                    <div class="busquedas col-md-7">
                        <h4>Resultados de busqueda</h4>
                        <hr />

                        <div class="listado_resultados">
                            
                            {
                                this.state.resultados.length > 0 ?

                                    this.state.resultados.map( (article, indx) =>
                                    {
                                        return <div class="resultado_busq" key={indx}>
                                            <div class="header_rbus">
                                                <Link to={`/article/${article._id}`}>{article.titulo}</Link>
                                            </div>
                                            <div class="body_rbus">
                                                <small class="text-muted">{article.resumen.substr(0, 247)}...</small>
                                            </div>
                                        </div>
                                    })
                                :
                                    <p class="text-muted">No se encontraron resultados</p>
                                    
                            }

                        </div>
                    </div>
                </div>
                }
            </React.Fragment>
            
        )
    }
}