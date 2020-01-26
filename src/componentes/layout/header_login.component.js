import React from 'react';

// CSS
import '../css/login/header.css';
// IMAGEN LOGO
import Logo from '../img/logo_short.png';

import { Link } from 'react-router-dom'

const Header = () =>
{
    return (
        <div class="header_identificar">

            <div class="logo_hi col-md-2">
                <img src={Logo} alt="" class="img-fluid" />
            </div>

            <ul class="links col-md-3">
                {/* Falta añadir los links */}

                <li>
                    <Link to="/login">Iniciar Sesion</Link>
                </li>
                <li>
                    <Link to="/registro">Registrarse</Link>
                </li>
            </ul>

        </div>
    )
}
export default Header;