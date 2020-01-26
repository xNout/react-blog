import React, { Component } from 'react';
import axios from 'axios';

// Componentes
import Loading from './loading_main';
import Header from './layout/header.component';

// CSS
import './css/articulo.css';

// Acciones Redux
import { EnableLoading, DisableLoading, LoadOnlyArticle, RedirectUrl } from '../reducers/app.reducer_actions';

export default class Article extends Component
{
    constructor(props)
    {
        super(props);

        this.AppStore = this.props.AppStore;
        
        // El componente inicia en su estado de carga
        this.AppStore.dispatch( EnableLoading());
    }
    async componentDidMount()
    {
        const { IDOrTitle } = this.props.match.params;

        // Utilizando el parametro recibido desde la url, procederemos a realizar una solicitud al Api.
        try {
            const { data } = await axios.get(`http://localhost:3535/api/article/${IDOrTitle}`)

            // Respuesta la cual usaremos para actualizar el estado y mostrar el articulo
            this.AppStore.dispatch(LoadOnlyArticle(data));
            this.AppStore.dispatch(DisableLoading());
        } 

        catch (error) {
            this.AppStore.dispatch(DisableLoading());
            this.AppStore.dispatch( RedirectUrl('/err404') )
        }

        
    }

    RenderArticle (data) 
    {

        return (
            <article class="article col-md-8">

                <div class="article_headerinf">

                    <h1 class="title">{data.titulo}</h1>

                    <div class="madeby_article">
                        <i class="fas fa-at"></i>
                        <small>{data.author.nombres}</small>
                        <i class="far fa-clock"></i>
                        <small>{data.fecha}</small>
                    </div>

                </div>

                <div class="background row justify-content-center">  
                    <img src={`http://localhost:3535/api/article/image/${data.id}`} alt="" class="img-fluid col-md-8" />
                </div>

                <div class="body_article row justify-content-center">
                    <div class="content col-md-10">
                        {
                            data.contenido.map((parrafo, _) =>
                            {
                                return <p>{parrafo}</p>
                            })
                        }
                    </div>
                </div>
            </article>
        )
    }

    render()
    {

        const { AppState : { ViewingArticle, LoadingMain } } = this.AppStore.getState();
        return(

            <React.Fragment>
                <Header {...this.props} AppStore={this.AppStore}/>
                { LoadingMain === true ?
                    <Loading />
                :
                    <div class="main_page row justify-content-center">
                        {this.RenderArticle(ViewingArticle)}
                    </div> 
                }
            </React.Fragment>
            
            
        )
    }
}