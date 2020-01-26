import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import $ from 'jquery'

// Configuraciones
import { Config } from '../utiles/configs';

// Reducers
import { RedirectUrl } from '../reducers/app.reducer_actions';

// Componentes
import Header from './layout/header_login.component';

// CSS
import './css/login/login.css';
import'./css/login/fondo.css';

// Utils
import { AddDays } from '../Utils';
import Sesion from '../utiles/session';


// Partes del componente
const HeaderLogin = () =>
{
    return (
        <div class="header_lpanel">
            <h2>Identificate</h2>
            <small class="text-muted">Debes escribir tu usuario y contraseña para ingresar</small>
        </div>
    )
}

class Login extends Component
{
    constructor(props) 
    { 
        super(props)
        this.state = {
            showError: false,
            messageError: ''
        };

        this.AppStore = this.props.AppStore;
    }

    componentDidMount()
    {
        $(".login_panel").css(
            {
                marginTop: "100px",
                opacity: ".0"
            }
        );
    
        $(".login_panel").animate(
            {
                marginTop: "0px",
                opacity: "1"
            }, 400
        );

        /*
            La razon por la cual no se incluye estos estilos en un fichero CSS
            Es debido al conflicto que puede existir con los demás componentes
            Es decir, que estos estilos se aplicarán a los demás componentes
            ya que no se lleva un SCOPE. Espero pronto aprender la forma de realizar un SCOPE
            a los estilos CSS de mis componentes
        */
        $("body, html, .container-fluid").css(
            {
                height: "100%"
            }
        );

        const { UrlAfterAction : { pending }} = this.AppStore.getState().AppState;

        if( pending )
            this.setState( {showError: true, messageError: "Primero debes iniciar sesión"});
        else
        {
            let U_LOGGED = Sesion.IsUserLogged();
            if( U_LOGGED )
            {
                U_LOGGED.then( res =>
                {
                    if( res )
                        this.AppStore.dispatch( RedirectUrl("/") );
                })
            }
        }
    }

    componentWillUnmount()
    {
        $("body, html, .container-fluid").css(
            {
                height: "auto"
            }
        );
    }
    // Submit del Formulario
    LogIn = ( event ) =>
    {
        event.preventDefault();

        const { username, password } = event.target;
        let Credentials = 
        {
            usr: username.value,
            pwd: password.value
        };

        axios.post("http://localhost:3535/api/auth", Credentials)
            .then( res =>
            {
                // Al ejecutarse correctamente la solicitud, limpiamos los mensajes de error
                

                // Luego, la token recibida la almacenamos en la cookie
                const { data } = res;
                let cookie = new Cookies();
                let cookie_options = 
                { 
                    path: "/", 
                    expires: AddDays( new Date(), 1) 
                };

                cookie.set(Config.SesionCookieName, data, cookie_options);
                
                // Guardada la cookie, redireccionamos a la página principal
                // this.props.history.push("/");

                this.setState( {showError: false, messageError: ""});
                
                const { UrlAfterAction : { pending, uri }} = this.AppStore.getState().AppState;
                let rUri = pending ? uri : "/";

                this.AppStore.dispatch( RedirectUrl(rUri) );
            })

            // En caso de ingresar datos incorrectos
            // manejaremos los errores desde el catch
            .catch( (error) =>
            {
                if (error.response) 
                {
                    const { data: { message } } = error.response;
                    this.setState( {showError: true, messageError: message});
                }
            });
    }

    render()
    {
        return(
            <React.Fragment>
                <Header />

                <div class="main_body">

                    <div class="login_panel">
                        
                        <HeaderLogin />

                        {/* No se puede migrar el formulario aparte porque tiene utiliza estados para hacer condicionales */}
                        <form onSubmit={this.LogIn} class="body_lpanel" autoComplete="off">

                            <div class="finput">
                                <i class="fas fa-user"></i>
                                <input type="text" name="username" id="" placeholder="Usuario" autoComplete="off"/>
                            </div>

                            <div class="finput">
                                <i class="fas fa-lock"></i>
                                <input type="password" name="password" id="" placeholder="Contraseña" autoComplete="off"/>
                            </div>

                            {
                                // Interesante forma de hacer una condicionante sin retornar un valor en caso de ser falsa
                                // condicion && [ expresion ]
                                this.state.showError === true &&
                                    <div class="error_msg">
                                        <small>{this.state.messageError}</small>
                                    </div>
                            }
                            
                            <input type="submit" class="submit_btn" value="INGRESAR"/>
                        </form>
                    </div>
                    
                </div>
            </React.Fragment>
        )
    }
}


export default Login;