import { combineReducers } from 'redux';

import AppState from './app.reducer';
import BlogState from './blog.reducer';
import WArticleState from './warticle.reducer';

export default combineReducers({
    AppState,
    BlogState,
    WArticleState
})