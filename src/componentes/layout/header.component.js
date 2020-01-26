import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import $ from 'jquery';

import { HandleChange } from '../../reducers/app.reducer_actions';
import { RedirectUrl } from '../../reducers/app.reducer_actions';

// Utiles
import Sesion from '../../utiles/session';

// Imagenes
import LogoWhite from '../img/logo_short_white.png'

// Estilos CSS
import './css/header_menu.css'

class HeaderLayout extends Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            isLogged: false,
            UserInfo: {}
        }

        this.AppStore = this.props.AppStore;

        this.onChange = this.onChange.bind(this);
        this.SearchArticle = this.SearchArticle.bind(this);
    }
    componentDidMount()
    {
        // JQuery
        $(".menu_user").hide();

        let UserInfo = Sesion.GetUserInfo();

        if( UserInfo !== undefined)
        {
            UserInfo.then( (info) =>
            {
                this.setState({isLogged: true, UserInfo: info});
            });
        }
    }

    onChange(evento)
    {
        const { value } = evento.target;
        this.AppStore.dispatch( HandleChange( { searchString: value }) );
    }

    toggleSB()
    {
        $(".menu_user").slideToggle();
    }

    SearchArticle(e)
    {
        if(e.key === "Enter")
        {   
            
            const { searchString } = this.AppStore.getState().AppState;
            
            // no es permitido realizar busquedas en blanco
            if( searchString === "")
                return;
                
            let LocalUri = this.props.location.pathname.split("/");

            let Uri = `/search/${searchString}`;
            if( LocalUri[1] === "search")
                Uri = `${searchString}`;
            
            this.AppStore.dispatch( RedirectUrl(Uri));
        }
    }

    render()
    {
        const { searchString } = this.AppStore.getState().AppState;
        return (
            <div class="header_menu">

                <div class="logo_hi col-md-2">
                    <img src={LogoWhite} alt="" class="img-fluid" />
                </div>
                
                <ul class="menu_urls col-md-5">
                    <li><Link to="/">Blog</Link></li>
                    <li><Link to="/aboutme">Acerca de mi</Link></li>
                    <li><a href="https://www.linkedin.com/in/steven-vera-5ab009180" target="_blank">Contacto</a></li>

                </ul>

                <form action="#" class="find_article col-md-2">
                    <div class="input_find">
                        <input type="text" class="search_text" placeholder="¿Buscabas algo?" onChange={this.onChange} onKeyPress={this.SearchArticle} value={searchString}/>
                        <i class="fas fa-search"></i>
                    </div>
                </form>

                <div class="users_options col-md-3">
                    <i class="fas fa-user" onClick={this.toggleSB}></i>

                    <ul class="menu_user">

                        {
                            this.state.isLogged ?
                                <React.Fragment>
                                    <li><i class="fas fa-user"></i>{`${this.state.UserInfo.firstname} ${this.state.UserInfo.lastname}`}</li>
                                    <li><i class="fas fa-sign-out-alt"></i><Link to="/logout">Cerrar Sesion</Link></li>
                                </React.Fragment>
                            :
                            <React.Fragment>
                                <li><i class="fas fa-sign-in-alt"></i><Link to="/login">Ingresar</Link></li>
                                <li><i class="fas fa-user-plus"></i><Link to="/registro">Registrarse</Link></li>
                            </React.Fragment>
                        }
                        
                    </ul>
                </div>

            </div>
        )
    }
}

export default HeaderLayout;