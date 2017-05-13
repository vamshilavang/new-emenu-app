import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './createStore';
import Emenu from './components/eMenu/eMenu';
const store = createStore(
  reducers,
  applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
    	<Provider store={store}>
	      <div>
	        <div className="container-fluid" style={{marginTop: '10px'}}>
	          <Emenu />
	        </div>
	      </div>
	    </Provider>
    );
  }
}
export default App;
