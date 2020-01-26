import React, { Component } from 'react';
import $ from 'jquery';

import '../css/post_wa.css';

import Logo from '../img/validation.png';

export default class PostWArticle extends Component
{
    constructor(props)
    {
        super(props);

    }

    componentDidMount()
    {
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
    }

    componentWillUnmount()
    {
        $("body, html, .container-fluid").css(
            {
                height: "auto"
            }
        );
    }
    render()
    {
        return(
            <div class="post_wa row justify-content-center">

                <img src={Logo} alt="" class="img-fluid col-md-2" />

                <div class="pwa_p col-md-4">
                    <div class="row justify-content-center">
                        <h2>Tu Artículo fue publicado!</h2>
                        <small>En pocos segundos serás redireccionado al post</small>
                    </div>
                </div>
            </div>
        )
    }
}