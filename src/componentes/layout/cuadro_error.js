import React, {Component} from 'react';

import './css/errdiv.css';

export default class ErrorCuadro extends Component
{
    constructor( props ) { super(props) }
    render()
    {
        return (
            <div class="errors_div">
                <p>Ocurrió un error</p>
                
                <ul>
    
                    {
                        this.props.errors.map( (err, indx) =>
                        {
                            return <li key={indx}>{err}</li>
                        })
                    }
                </ul>
            </div>
        )
    }
    
}