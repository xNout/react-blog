import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

// Componentes
import Header from './layout/header.component';
import CuadroValidaciones from './layout/cuadro_error';
import PostWA from './vistas_parciales/post_warticle';

// CSS
import './css/write_article.css';

// Configs
import { Config } from '../utiles/configs';
import Sesion from '../utiles/session';

// REDUX
import { RedirectUrl, PendingUrlAfterAction } from '../reducers/app.reducer_actions';
import { HandleChanges, PreUploadImage, ResetEditing } from '../reducers/warticle.reducer_actions';

export default class WriteArticle extends Component
{
    constructor(props)
    {
        super(props);
        this.AppStore = this.props.AppStore;

        // En caso de no bindear los metodos, el 'this' aparecerá como undefined
        this.HandleChanges = this.HandleChanges.bind(this);
        this.SelectCategory = this.SelectCategory.bind(this);
        this.PreUploadImage = this.PreUploadImage.bind(this);
        this.SubmitForm = this.SubmitForm.bind(this);

    }

    componentDidMount()
    {
        const { UrlAfterAction : { pending } } = this.AppStore.getState().AppState;
        if( !pending)
            this.AppStore.dispatch(ResetEditing());
        else
            this.AppStore.dispatch( PendingUrlAfterAction({UrlAfterAction: { pending: false, uri: "/" }}) );
    }

    HandleChanges( evento )
    {
        const { name, value } = evento.target;
        this.AppStore.dispatch(HandleChanges({ [name]: value }));
    }

    PreUploadImage(e)
    {
        // Cuando subimos la imagen, la almacenamos en el estado
        const { files } = e.target;
        let archivo = files[0];
        // la imagen estará almacenada en un FormData
        const formData = new FormData();
        formData.append("image_background", archivo);

        this.AppStore.dispatch(PreUploadImage({ uploadedImageName: archivo.name, preUploadedImage: formData }));
    }

    SelectCategory = ( categoria ) =>  this.AppStore.dispatch(HandleChanges({ "categoria": categoria }));
    Validar ( )
    {
        let validaciones = [];
        let respuesta = false;

        // Estados
        const { titulo, categoria, contenido, preUploadedImage } = this.AppStore.getState().WArticleState;

        if( titulo.length === 0)
            validaciones.push("Debes escribir un tema");
        
        if ( categoria === "Sin Categoria")
            validaciones.push("No se ha seleccionado una categoria");

        if ( preUploadedImage === null)
            validaciones.push("Debes subir una imagen para la portada!");

        if( contenido.length <= 20)
            validaciones.push("Redacta un artículo más largo");

        if( validaciones.length === 0)
            respuesta = true;
        
        
        this.AppStore.dispatch(HandleChanges({ "validaciones": validaciones }));

        return respuesta;
    }

    CheckIsLogged()
    {
        function Redir(state)
        {
            state.dispatch( PendingUrlAfterAction({UrlAfterAction: { pending: true, uri: "/warticle" }}) );
            state.dispatch( RedirectUrl("/login") );
        }

        let U_LOGGED = Sesion.IsUserLogged();
        if( ! U_LOGGED )
            Redir(this.AppStore);
        else
            U_LOGGED.then( res =>
            {
                if( ! res )
                    Redir(this.AppStore);
            })
    }

    async SubmitForm(e)
    {
        e.preventDefault();

        this.CheckIsLogged();

        // En caso de que falte llenar algunos campos
        // se mostrará un cuadro con las validaciones a realizar
        if( !this.Validar())
        {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            // this.setState({ uploading: false } );
            this.AppStore.dispatch(HandleChanges({ "uploading": false }));
            return;
        }

        // Si el modelo es correcto, procederemos a subir el articulo.
        // this.setState({uploading: true});
        this.AppStore.dispatch(HandleChanges({ "uploading": true }));

        const { titulo, categoria, contenido, preUploadedImage } = this.AppStore.getState().WArticleState;

        let UserInfo = await Sesion.GetUserInfo();
        // Los formularios que contienen ficheros, deben ser enviados a través de FormData
        // Por lo que se procede a instanciarlo y rellenar los datos.
        var Articulo = new FormData();
        Articulo.append("titulo", titulo);
        Articulo.append("categoria", categoria);
        Articulo.append("contenido", contenido);
        Articulo.append("AuthorID", UserInfo.id);
        Articulo.append("image", preUploadedImage.get("image_background"));
        
        axios.post("http://localhost:3535/api/articles", Articulo)
        .then( res =>
        {
            this.AppStore.dispatch(HandleChanges({ "publicado": true }));
            // Una vez la API devuelva la respuesta, de que el articulo fue publicado
            // Se procederá a realizar una redirección al mismo para su visualización
            setTimeout(() => { this.AppStore.dispatch( RedirectUrl(`article/${res.data._id}`) ); }, 3000);
        })

        .catch( (error) =>
        {
            if (error.response) 
            {
                const { data: { message } } = error.response;
                this.AppStore.dispatch(HandleChanges({ "validaciones": ["Error en la subida", message] }));
            }
        });

        this.AppStore.dispatch(HandleChanges({ "uploading": false } )); 
    }

    render()
    {

        const Categorias = () => 
        {
            return (
                Config.Categorias.tipos.map
                ( 
                    (categoria, index) => 
                    {
                        return <option 
                        value={categoria} 
                        key={index} 
                        onClick={() => this.SelectCategory(categoria)}
                        >{categoria}</option>
                    }
                )
            )
        }
        
        const { titulo, uploadedImageName, contenido, publicado, validaciones, uploading } = this.AppStore.getState().WArticleState;

        return(
            <React.Fragment>
                <Header {...this.props} AppStore={this.AppStore}/>

                {
                    publicado ?
                        <PostWA />
                    :
                        <div class="main_page row justify-content-center">
                
                        <div class="write_article col-md-6">

                            <div class="head_wa text-center">
                                <h3>Escribir un Artículo</h3>
                            </div>

                            {
                                validaciones.length > 0 &&
                                    <CuadroValidaciones errors={validaciones}/>
                            }
                            
                            <form class="body_wa_form" encType="multipart/form-data" onSubmit={this.SubmitForm}>
                                <div class="form-group row">
                                    <label for="ArticleTitle" class="col-md-12">Escribe un tema</label>
                                    <input type="text" class="form-control col-md-8" id="ArticleTitle" name="titulo" value={titulo} onChange={this.HandleChanges}  placeholder="Tema" />
                                </div>
            
                                <div class="input-group mb-3 row">
                                    <label class="col-md-12">Foto de portada</label>
                                    <div class="custom-file col-md-8">
                                        <input type="file" class="custom-file-input" id="inputGroupFile02" onChange={this.PreUploadImage}accept="image/*" />
                                        <label class="custom-file-label" for="inputGroupFile02">{uploadedImageName}</label>
                                    </div>
                                </div>

                                {/* <div className="row">
                                    
                                    {
                                        // Para renderizar una imagen antes de subir, necesitamos crear un Objeto URL
                                        // URL.createObjectURL(file-data);
                                        this.state.preUploadedImage !== null &&
                                            <img src={URL.createObjectURL(this.state.preUploadedImage.get("image_background"))} alt="" class="img-fluid" />
                                    }
                                </div> */}

                                <div class="categorias_lista_wa row">
                                    <label class="col-md-12">Selecciona una Categoria</label>
                                    <select class="custom-select col-md-5">
                                        
                                        <option disabled selected>Sin Categoria</option>
                                        
                                        {Categorias()}
                                    </select>
                                </div>

                                <div class="contenido_wa row">
                                    <label class="col-md-12">Contenido</label>
                                    
                                    <div class="editing_content col-md-12">

                                        <textarea name="contenido" onChange={this.HandleChanges}>{contenido}</textarea>
                                        
                                    </div>
                                </div>
                                
                                {/* No tengo idea de como hacer una condición para que añada o no el 'disabled' :( */}
                                {
                                    uploading ?
                                        <div class="botones_wa row justify-content-end">
                                        
                                            {/* <button type="button" class="btn btn-primary" disabled>Pre-visualizar</button> */}
                                            <button type="submit" class="btn btn-primary" disabled>Publicar</button>
                                        </div>
                                    :
                                        <div class="botones_wa row justify-content-end">
                                        
                                            {/* <button type="button" class="btn btn-primary">Pre-visualizar</button> */}
                                            <button type="submit" class="btn btn-primary">Publicar</button>
                                        </div>

                                }
                                
                                
                            </form>
                            
                        </div>
                    </div>
                }
                
            </ React.Fragment>
        )
    }
}