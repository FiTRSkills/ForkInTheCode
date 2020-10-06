import { combineReducers } from 'redux';
import authentication from './Authentication';
import navigation from './Navigation';

export default combineReducers({
    authentication,
    navigation
});
