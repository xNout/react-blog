import React, { Component } from 'react';
import $ from 'jquery';

// GIF
import Loading from './img/loading.gif';

// CSS
import './css/loading.css';

export default class LoadingMain extends Component
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
       $("body, html, .container-fluid, .main_page").css(
        {
            height: "100%"
        });

        $(".main_page").css(
        {
            display: "flex",
            alignItems: "center"
        });
    }
    componentWillUnmount()
    {
        $("body, html, .container-fluid, .main_page").css(
            {
                height: "auto"
            }
        );
    }

    render()
    {
        return(
            <div class="main_page justify-content-center">
            
                <div class="row justify-content-center blog_loading_principal">
                    <img src={Loading} />
                    <div class="w-100"></div>
                    <small class="text-muted">Cargando...</small>
                </div>

            </div>
        )
    }

}