import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery'

// Componentes
import Header from './layout/header_login.component';

// Redux
import { RedirectUrl } from '../reducers/app.reducer_actions';

// Utils
import Sesion from '../utiles/session';

// CSS
import './css/login/fondo.css';
import './css/login/registro.css';


// Vistas Parciales
const InputRegistro = (Inputs) =>
{
    return Inputs.map( (data, indx) =>
    {
        let InputValue = data.state[data.input_name].value;
        let InputType = "input_empty";

        let Title = data.title;

        // Validaciones
        if(data.state[data.input_name].isValid === true)
        {
            if(InputValue.length > 0)
                InputType = "input_valid";
        }
        else
        {
            InputType = "input_invalid";
            Title = `${data.state[data.input_name].eMessage} *`;
        }

        return (
            <div class={`finput ${data.col_size}`} key={indx}>

                <div class={`row ${InputType}`}>

                    <small class="col-md-12">{Title}</small>
                    <input type={data.input_type} class="finput col-md-12" name={data.input_name} placeholder={data.title} value={InputValue} onChange={data.change_value_cb}/>
                    
                </div>
                
            </div>
        )
    })
    
}
// Componente
export default class Registro extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            completedRegistry: false,
            firstname: {
                value: '',
                isValid: true,
                isFilled: false,
                eMessage: ''
            },
            lastname: {
                value: '',
                isValid: true,
                isFilled: false,
                eMessage: ''
            },
            email: {
                value: '',
                isValid: true,
                isFilled: false,
                eMessage: ''
            },
            username: {
                value: '',
                isValid: true,
                isFilled: false,
                eMessage: ''
            },
            password: {
                value: '',
                isValid: true,
                isFilled: false,
                eMessage: ''
            },
            eGlobalMessage: ''
        };

        this.AppStore = this.props.AppStore;
    }

    componentDidMount()
    {
        $(".formulario_registro").css(
            {
                marginTop: "80px",
                opacity: ".0"
            }
        );
    
        $(".formulario_registro").animate(
            {
                marginTop: "0px",
                opacity: "1"
            }, 500
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

    componentWillUnmount()
    {
        $("body, html, .container-fluid").css(
            {
                height: "auto"
            }
        );
    }

    LocalValidation()
    {
        const { lastname, firstname, email, username, password } = this.state;
        
        let Apellidos = lastname.value.length === 0;
        let Nombres = firstname.value.length === 0;
        let Correo = email.value.length === 0;
        let Usuario = username.value.length === 0;
        let Contrasena = password.value.length === 0;

        let ValidateEmail = validateEmail(email.value);

        if( Correo === false)
            Correo = !ValidateEmail;

        if( !ValidateEmail )
            this.setState({eGlobalMessage: "Tu email tiene un formato no válido."});
        else
            this.setState({eGlobalMessage: ""});
        
        this.setState({ 
            lastname: {
                value: lastname.value,
                isFilled: lastname.value.length > 0,
                isValid: ! Apellidos,
                eMessage: Apellidos ? "Apellidos" : ""
            },
            firstname: {
                value: firstname.value,
                isFilled: firstname.value.length > 0,
                isValid: ! Nombres,
                eMessage: Nombres ? "Nombres" : ""
            },
            email: {
                value: email.value,
                isFilled: email.value.length > 0,
                isValid: ! Correo,
                eMessage: Correo ? "Correo" : ""
            },
            username: {
                value: username.value,
                isFilled: username.value.length > 0,
                isValid: ! Usuario,
                eMessage: Usuario ? "Usuario" : ""
            },
            password: {
                value: password.value,
                isFilled: password.value.length > 0,
                isValid: ! Contrasena,
                eMessage: Contrasena ? "Contraseña" : ""
            },
        })
        
        if( Apellidos || Nombres || Usuario || Contrasena)
            this.setState({eGlobalMessage: "Hay campos incompletos"});

        if( Apellidos || Nombres || Correo || Usuario || Contrasena)
            return false;

        return true;
    }

    SubmitForm = (event) =>
    {
        event.preventDefault();

        const { lastname, firstname, email, username, password } = this.state;

        if(!this.LocalValidation())
            return;

        let User = {
            lastname: lastname.value,
            firstname: firstname.value,
            email: email.value,
            username: username.value,
            password: password.value
        }

        axios.post("http://localhost:3535/api/users", User)
            .then( res =>
            {
                // const User = res.data;
                // console.log("El usuario fue creado! ");
                // console.log( res.data);

                this.setState({completedRegistry: true});
            })

            // En caso de ingresar datos incorrectos
            // manejaremos los errores desde el catch
            .catch( (error) =>
            {
                if (error.response) 
                {
                    const { data: { message, campo } } = error.response;
                    
                    this.setState({eGlobalMessage: message});

                    if( campo !== undefined)
                    {
                        this.setState({ 
                            [campo]: {
                                value: this.state[campo].value,
                                isFilled: this.state[campo].isFilled,
                                isValid: false,
                                eMessage: message
                            } 
                        })
                    }

                }
                else
                {
                    this.setState({eGlobalMessage: "Ocurrió un error inesperado"});
                }
            });
        
    }

    ChangeValue = (event) =>
    {
        
        const { target: { name, value }} = event;
        
        this.setState({ 
            [name]: {
                value: value,
                isFilled: value.length > 0,
                isValid: this.state[name].isValid,
                eMessage: this.state[name].eMessage
            } 
        })
    }



    render()
    {
        return(
            <React.Fragment>
                <Header />

                <div class="main_body">

                    {
                        this.state.completedRegistry === false ?
                            <div class="formulario_registro col-md-5">
                                <div class="head">
                                    <h2>Formulario de registro</h2>
                                    <hr />
                                </div>

                                <form onSubmit={this.SubmitForm} class="row bodyform justify-content-between" autoComplete="off">
                                    

                                    { InputRegistro(
                                        [
                                            {
                                                state: this.state,
                                                col_size: 'col-md-6', 
                                                title: 'Apellidos', 
                                                input_name: 'lastname',
                                                input_type: "text",
                                                change_value_cb: this.ChangeValue
                                            },
                                            {
                                                state: this.state,
                                                col_size: 'col-md-6', 
                                                title: 'Nombres',
                                                input_name: 'firstname', 
                                                input_type: "text",
                                                change_value_cb: this.ChangeValue
                                            },
                                            {
                                                state: this.state,
                                                col_size: 'col-md-12', 
                                                title: 'Correo', 
                                                input_name: 'email', 
                                                input_type: "text",
                                                change_value_cb: this.ChangeValue
                                            },
                                            {
                                                state: this.state,
                                                col_size: 'col-md-6', 
                                                title: 'Usuario',
                                                input_name: 'username', 
                                                input_type: "text",
                                                change_value_cb: this.ChangeValue
                                            },
                                            {
                                                state: this.state,
                                                col_size: 'col-md-6', 
                                                title: 'Contraseña',
                                                input_name: 'password', 
                                                input_type: "password",
                                                change_value_cb: this.ChangeValue
                                            }
                                        ])
                                        
                                    }

                                    {
                                        this.state.eGlobalMessage.length > 0 &&
                                            <div class="gerrormsg text-center col-md-12">
                                                <i class="fas fa-exclamation-circle"></i>
                                                <small>{this.state.eGlobalMessage}</small>
                                            </div>
                                    }
                                    <button type="submit" class="submit_btn">Registrarme</button>
                                </form>
                            </div>
                        :
                            <div class="success_registry col-md-4">
                                <div class="head_border"></div>
                
                                <div class="body_sr text-center">
                                    <h5>
                                        Usuario registrado con éxito
                                    </h5>
                
                                    <small>Ahora puedes ingresar a tu cuenta dando click </small><small class="t_link"><Link to="/login">Aqui</Link></small>
                                </div>
                            </div>
                    }
                    
                </div>
            </React.Fragment>
        )
    }
}

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}