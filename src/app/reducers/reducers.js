export var setInitialValuesReducer = (state={}, action) => {
	switch(action.type){
		case 'SET_INITIAL_VALUES':
		 return action.value;
		default:
		 return state;
	}
}
