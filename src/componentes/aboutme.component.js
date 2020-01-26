import React, { Component } from 'react';
import $ from 'jquery';

import MyPicture from './img/gamer.png';

// Componentes
import Header from './layout/header.component';

// CSS
import './css/aboutme.css';

export default class AboutMe extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <React.Fragment>
                <Header {...this.props} AppStore={this.AppStore}/>
                <div class="main_page row justify-content-center">
            
                    <div class="aboutme_body row justify-content-center">
                        <div class="col-md-4">
                            <img src={MyPicture} alt="" class="img-fluid" />
                        </div>

                        <div className="col-md-6 aboutme_descp">
                            <h5>Steveen V. Garcia - xN0ut</h5>
                            <small class="text-muted">Desarrollador de Software - Junior</small>

                            <p>¡Hola!, me llamo Steven como lo dice el título, soy alguien que aprendió a programar desde los 15 años de edad de forma autodidácta. Recuerdo muy bien haber empezado con el lenguaje LUA y haber tardado más de 1 año en comprender la lógica de programación. Monte algunos servidores en el juego MTA donde cree algunos scripts y jugue durante horas con mis amigos. Después de un par de años, comencé a agarrar interés por otros lenguajes de programación. Me di un paseo por las sintaxis de: PHP, Python, Javascript, C#, entre otros; de los cuales, tome algunos cursos y terminé más de lleno en C#. He vendido algunos proyectos tanto a nivel nacional como internacional, donde siempre me he preocupado por enfocarme más en la calidad que el precio. He cometido algunos errores de los cuales, he sabido extraer mucha experiencia en el ámbito laboral.</p>
                            <p>Mi carrera profesional es Administración de empresas, nunca estudié nada referido a la programación en la universidad. Todo lo que sé, lo he aprendido de forma autodidácta. Considero la programación hasta ahora, como un hobbie. Pero, aspiro combinar mis conocimientos de administrador con los de programador, para en algún dia conformar una gran empresa de software.</p>
                            <p>Espero que este proyecto te sirva de aprendizaje, si tienes sugerencias o requieres de mi asesoría no dudes en contactarme.</p>
                        </div>
                    </div>
                        
                </div>
            </React.Fragment>
            
        )
    }
}