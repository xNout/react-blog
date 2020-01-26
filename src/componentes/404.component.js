import React, { Component } from 'react';
import $ from 'jquery';

// Componentes
import Header from './layout/header.component';

// CSS
import './css/err404.css';

// Imagenes
import er404 from './img/404image.png';

export default class Err404 extends Component
{

    constructor(props)
    {
        super(props);
        this.AppStore = this.props.AppStore;
    }
    componentDidMount()
    {
        $("body, html, .container-fluid").css(
        {
            height: "100%"
        });
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

            <React.Fragment>
                <Header {...this.props} AppStore={this.AppStore}/>
                <div class="err404_page row justify-content-center">

                    <img src={er404} alt="" class="img-fluid col-md-2" />
                    <div class="err404body col-md-4">

                        <div class="row justify-content-center">
                            <h2>Oops. Lo sentimos.</h2>
                            <small>No encontramos la página que buscabas :(</small>
                        </div>

                    </div>
                </div>
            </React.Fragment>
            
        )
    }
}