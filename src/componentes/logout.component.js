import React, { Component } from 'react';
import axios from 'axios';

// Redux
import { RedirectUrl } from '../reducers/app.reducer_actions';
// Utiles
import Sesion from '../utiles/session';

export default class LogOut extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            message: 'Cerrando sesión...'
        }
        this.AppStore = this.props.AppStore;
    }
    componentDidMount()
    {
        let Cookie = Sesion.GetSessionCookie();
        if( Cookie === undefined)
        {   
            this.setState({message: "Ocurrió un error..."})
            return;
        }

        axios.post("http://localhost:3535/api/logout", { UserID: Cookie.UserID})
        .then( () =>
        {
            Sesion.RemoveSessionCookies();
            setTimeout(() => { this.AppStore.dispatch( RedirectUrl('/') ); }, 1000);
        })
        .catch( () =>
        {
            this.setState({message: "Ocurrió un error..."})
        })
    }
    render()
    {
        return (
            <p style={{marginLeft: "10px"}}>{this.state.message}</p>
        )
    }
}
