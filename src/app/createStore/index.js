import { combineReducers } from 'redux';
import {setInitialValuesReducer} from '../reducers/reducers';
import	rates	 from '../reducers/provider-rates';
export default combineReducers({
	setInitialValues: setInitialValuesReducer,
	rates
});
