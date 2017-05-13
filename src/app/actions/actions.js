import {GET_RATES} from '../constants/index';
import {data} from '../mockAPI/rate-request-body';
import axios from 'axios';
import rateResponse from '../mockAPI/rates';

export var setInitialValues = (values) => {
  return {
    type: 'SET_INITIAL_VALUES',
    values
  }
}
export function updateProductRate(rate, productId) {
  return (dispatch) => {
		dispatch({type:'UPDATE_PRODUCT_RATE', values: {rate: rate, id: productId}});
  }
}

export function getDealerRates() {
  return (dispatch) => {
    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
		dispatch({
			type: GET_RATES,
			values: {data: rateResponse}
		});
    // const url = 'http://10.117.18.27:6220/Rating/RatingRESTAPI/json/rates_json';
    // axios.post(url, data, config).then(function(response) {
    //     //console.log('asdasdasd',rateResponse);
    //     dispatch({
    //       type: GET_RATES,
    //       values: response
    //     });
    //   })
    //   .catch((e) => {
    //     console.log('something went wrong', e);
    //   });
  }
}
