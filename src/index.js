import React from 'react';
import { createStore } from 'redux';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

// Componentes
import App from './App';
// Ruducers Combinados
import Reducer from './reducers/index';
// Reducer store
let AppStore = createStore(Reducer);

const Aplicacion = () =>
{
    return(
        <BrowserRouter >
            <App AppStore={AppStore} />
        </BrowserRouter>
    )
}
const Renderizar = () => {
    render( <Aplicacion />, document.getElementById('root'));
}


AppStore.subscribe(Renderizar);

Renderizar();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
