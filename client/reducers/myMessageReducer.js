/**
 * reducer
 * @method reducer
 *
 * @param  {Object} state initial state
 * @param  {object} action
 *
 * @return {object} state new state
 */
 const reducer = (state = {
   myMessages: []
 }, action) => {
   switch (action.type) {
     case 'GET_MY_MESSAGES': {
       return { ...state, myMessages: [...action.messages] };
     }
     default:
       return state;
   }
 };

 export default reducer;
