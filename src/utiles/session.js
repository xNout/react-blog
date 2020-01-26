import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { Config } from './configs';

class Session 
{
    IsUserLogged() 
    {
        let cookie = this.GetSessionCookie();

        if( cookie === undefined)
            return false;
        
        return this.ValidateUserSession(cookie);
    }


    ValidateUserSession(cookie)
    {

        return axios.post("http://localhost:3535/api/auth/validate", cookie)
            .then( function (res) 
            {
                return true;
            })
            .catch( function(err)
            {
                return false;
            })
    }

    GetUserInfo()
    {  

        let cookie = this.GetSessionCookie();
        if( cookie === undefined)
            return undefined;
            
        return axios.get(`http://localhost:3535/api/usrinfo/${cookie.UserID}`)
            .then( function (res) 
            {
                return res.data;
            })
            .catch( function(err)
            {
                // this.RemoveSessionCookies( );
                return undefined;
            })

    }

    RemoveSessionCookies( )
    {
        let COOKIE_NAME = Config.SesionCookieName;
        const cookie = new Cookies();
        cookie.remove(COOKIE_NAME, { path: '/' });
    }

    GetSessionCookie()
    {
        let COOKIE_NAME = Config.SesionCookieName;
        const cookie = new Cookies();
        return cookie.get(COOKIE_NAME);
    }
}

export default new Session();