import React, {Component} from 'react';
import axios from 'axios';

// CSS
import './css/articles.css';

// Utiles
import { Config } from '../utiles/configs';

// Componentes
import Header from './layout/header.component';

// REDUX
import { PendingUrlAfterAction, RedirectUrl } from '../reducers/app.reducer_actions';
import { HandleChange } from '../reducers/blog.reducer_actions';

const Article = ( data, AppStore ) =>
{
    return ( 
    <article class="row article_blog" onClick={() => AppStore.dispatch( RedirectUrl(`article/${data._id}`) )}>

        <div class="col-md-4 bckg_image">
            <img src={`http://localhost:3535/api/article/image/${data._id}`} alt="" class="img-fluid" />
        </div>
        <div class="col-md-7 body_art">
            <h5>{data.titulo}</h5>
            <p class="resumen_art">
                {data.contenido[0].substr(0, 247)}...
            </p>
        </div>
        
    </article>)
}

export default class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.AppStore = this.props.AppStore;
        this.AppStore.dispatch( PendingUrlAfterAction({UrlAfterAction: { pending: false, uri: "/" }}) );

        // binds
        this.SetCategory = this.SetCategory.bind(this);
        this.RenderArticleSection = this.RenderArticleSection.bind(this);
    }

    componentDidMount()
    {
        this.RefreshPage ( )
    }

    SetCategory = ( categoria ) => 
    {
        const { CategorySelected } = this.AppStore.getState().BlogState;
        if( CategorySelected === categoria)
            return;

        this.AppStore.dispatch( HandleChange( { CategorySelected : categoria, loading : true, onlyPage: 1, totalPages : 0 }));
        this.RefreshPage ( );
    }

    RefreshPage ( )
    {
        const { CategorySelected, onlyPage } = this.AppStore.getState().BlogState;

        axios.get(`http://localhost:3535/api/articles?Categoria=${CategorySelected}&Pagina=${onlyPage}`)
        .then( respuesta =>
        {
            const { TotalPages, Articulos } = respuesta.data;
            this.AppStore.dispatch( HandleChange( { totalPages : TotalPages, Articles: Articulos, loading : false }));
        })
        .catch( (err) =>
        {
            this.AppStore.dispatch( HandleChange( { totalPages : 0, Articles: [], loading : false, onlyPage: 1 }));
        })
    }

    RenderCategorias()
    {
        return (
            <div class="row body_part_categorys">
                {
                    Config.Categorias.tipos.map(
                    ( categoria, indx) =>
                    {
                        const { BlogState : { CategorySelected }} = this.AppStore.getState();

                        let C_TAG_CLASS = "col-md-auto category_item";

                        if( CategorySelected === categoria)
                            C_TAG_CLASS += " category_item_selected";

                        let PATH_ICON = process.env.PUBLIC_URL + Config.Categorias.logos[categoria];

                        return ( 
                            <React.Fragment>
                                <div class={C_TAG_CLASS} onClick={() => this.SetCategory(categoria)}>
                                    <img src={PATH_ICON} alt="" />
                                    <p>{categoria}</p>
                                </div>
                                <div class="w-100"></div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        )
    }

    RenderPaginacion()
    {
        const { BlogState: { onlyPage, totalPages } } = this.AppStore.getState();

        let PaginacionItems = [];

        // Se creará un array que contendrá los numeros de paginacion.
        // Es decir, que si existen 10 paginas se creará un array asi: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let Paginas = Array.from( Array(totalPages), (_, indx) => indx + 1);

        /*
        Ahora, la variable indx va a guardar el indice de la pagina actual.
        Es decir, que si la pagina actual que se está visualizando es 3, su indice en el array es 2.
        */
        let indx = onlyPage - 1;

        // Si el indice está entre 0 y 1. Se mostrará botones para seleccionar cualquiera de las 5 primeras paginas
        if( indx <= 1)
            PaginacionItems = Paginas.slice( 0, 5);

        // En cambio, si la pagina seleccionada es igual o mayor que 2.
        else if( indx >= 2)
        {
            // Creamos un algoritmo que ubica la pagina actual en la parte media
            // Mostrando 2 paginas del lado izquierdo y dos del derecho.
            let initPg = indx - 2;
            let endPg = indx + 3;

            // En caso, de por ejemplo haber un total de 8 paginas
            // y la actual seleccionada es 7.
            // Se mostrarian 4 botones de paginas a la izquierda y 1 a la derecha.
            if( endPg > totalPages)
                initPg -= endPg - totalPages;
            
            PaginacionItems = Paginas.slice( initPg, endPg);
        } 

        return (
            <nav class="paginacion row">
                <ul class="col-md-auto">
                    {
                        // Esto para evitar que se muestre una paginación con un solo item.
                        totalPages > 1 &&
                            PaginacionItems.map( (pagina, indx_pagina) =>
                            {
                                if( pagina === onlyPage)  
                                    return <li class="item_pgn only_item" key={indx_pagina}>{pagina}</li>
                                else
                                    return <li class="item_pgn" 
                                    key={indx_pagina} 
                                    onClick={ () => 
                                        {
                                            this.AppStore.dispatch( HandleChange( { onlyPage: pagina }) );
                                            this.RefreshPage ( );
                                        }
                                    }>{pagina}</li>
                            })
                    }
                </ul>
                <div class="w-100"></div>
                <small class="text-muted">{`Resultados ${onlyPage} - ${totalPages} páginas`}</small>
            </nav>
        )

    }
    
    RenderArticleSection ( )
    {
        const { BlogState: { Articles, totalPages, loading } } = this.AppStore.getState();

        return (
            <React.Fragment>
                {
                    ( loading ?
                        <div class="text-center">
                            <small class="text-muted">Cargando...</small>
                        </div>
                    :
                        Articles.length > 0 ?
                            Articles.map( ( document ) => Article(document, this.AppStore)) 
                        :
                            <small class="text-muted">No hay articulos para mostrar</small>
                    )
                }
                {
                    totalPages > 0 &&
                        this.RenderPaginacion()
                }
                
            </React.Fragment>
            
        )
        

    }
    
    render()
    {
        return (
            
            <React.Fragment>
                <Header {...this.props} AppStore={this.AppStore}/>
 
                <div class="main_page row justify-content-center">
                    <div class="blog_principalpg col-md-11">

                        <div class="row justify-content-center">

                            <div class="articles_posted col-md-7">

                                <div class="row header_part_blog">
                                    <h5 class="col-md-12">Articulos publicados</h5>
                                </div>

                                { this.RenderArticleSection() }

                            </div>

                            <div class="articles_categorys col-md-3">
                                <div class="row header_part_blog">
                                    <h5 class="col-md-12">Categorias</h5>
                                </div>

                                {this.RenderCategorias()}
                            </div>



                            <div class="rwrite_article_btn col-md-2">
                                <button 
                                type="button" 
                                class="btn" 
                                onClick={() => this.AppStore.dispatch( RedirectUrl("/warticle") )}>Escribir un articulo</button>
                            </div>

                        </div>
                        </div>
                </div>
                
                
            
            </React.Fragment>
        )
    }
}