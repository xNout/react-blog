import React, { useState, useEffect } from 'react';
import {Switch, Route} from 'react-router-dom';
import Sesion from './utiles/session';


// Componentes
import Home from './componentes/home.component';
import Login from './componentes/login.component';
import LogOut from './componentes/logout.component';
import Registro from './componentes/register.component';
import WArticle from './componentes/write_article.component';
import Article from './componentes/article.component';
import Err404 from './componentes/404.component';
import AboutMe from './componentes/aboutme.component';
import Search from './componentes/busquedas.component';


import { Redirect } from 'react-router-dom';

// Redux Actions
import { ResetRedirectUrl, RedirectUrl, PendingUrlAfterAction } from './reducers/app.reducer_actions';

// CSS
import './App.css'

const ProtectedRoute = ( props ) =>
{

    // Creditos: https://stackoverflow.com/questions/59696916/create-a-protected-react-route
    
    /*
    # en los hooks debe seguirse un orden.
    # Primero, debe crearse los estados
    # Segundo, usar los efectos de estado
    # Luego, realizar cualquier condicional que trabaje con los estados.
    */

    // Creacion de los hooks de estados
    const [isLogged, setIsLogged] = useState(false);

    // Este sirvió como referencia para marcar el componente como inicializado.
    const [isInitialized, setIsInitialized] = React.useState(false);

    
    const { Componente, Uri } = props.Options;
    
    // El Hook de efecto permite llevar a cabo efectos secundarios.
    useEffect( () => 
    {

        let U_LOGGED = Sesion.IsUserLogged();
        if( ! U_LOGGED )
        {
            setIsLogged(false);
            setIsInitialized(true);
        }
        else
            U_LOGGED.then( res =>
            {
                setIsLogged(res);
                setIsInitialized(true);
            })
    });

    if(!isInitialized) {
        return null;
    }

    if( isLogged )
        return <Componente {...props}/>
    else
    {
        Sesion.RemoveSessionCookies();
        props.AppStore.dispatch( PendingUrlAfterAction({UrlAfterAction: { pending: true, uri: Uri }}) );
        props.AppStore.dispatch( RedirectUrl("/login") );
        return null;
    }
}

export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.AppStore = this.props.AppStore;
    }

    CheckRedirect( )
    {
        let state = this.AppStore.getState().AppState;

        if( state.redirection.pending)
        {
            let Uri = state.redirection.uri;
            this.AppStore.dispatch( ResetRedirectUrl() );
            return <Redirect to={Uri} />
        }
                        
    }

    render()
    {
        
        return(

            <React.Fragment>
                <Switch>

                    {/* Rutas NO protegidas */}
                    <Route exact path="/" render={(props) => <Home {...props} AppStore={this.AppStore} />} />
                    <Route exact path="/login" render={ (props) => <Login {...props} AppStore={this.AppStore} /> }/>
                    <Route exact path="/logout" render={ (props) => <LogOut {...props} AppStore={this.AppStore} /> }/>
                    <Route exact path="/registro" render={ (props) => <Registro {...props} AppStore={this.AppStore} /> }/>
                    {/* Forma correcta de enviar parametros */}
                    <Route path="/article/:IDOrTitle?" render={(props) => <Article {...props} AppStore={this.AppStore} />} />
                    <Route exact path="/aboutme" render={(props) => <AboutMe />} />

                    <Route path="/search/:SearchStr?" render={(props) => <Search {...props} AppStore={this.AppStore} />} />
                    {/* Forma INCORRECTA de enviar parametros */}
                    {/* <Route exact path="/test/:MyArg" component={() => <WArticle AppStore={this.AppStore}/>}/> */}


                    {/* Rutas protegidas */}
                    <Route exact path="/warticle" render={(props) => <ProtectedRoute {...this.props} Options={ { Componente: WArticle, Uri: '/warticle'}} />} />


                    {/* Pagina 404 Err404 */}
                    <Route exact path="/err404" render={(props) => <Err404 {...props} AppStore={this.AppStore} />} />
                    <Route render={(props) => <Err404 {...props} AppStore={this.AppStore} />} />
                </Switch>

                {this.CheckRedirect( )}
            </React.Fragment>
            
        )
    }
}