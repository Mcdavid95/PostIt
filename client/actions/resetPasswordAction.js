import axios from 'axios';
import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR } from './types/types';

/**
 * [searchUserAction description]
 * @method searchUserAction
 * @param  {[type]}         searchTerm [description]
 * @param  {[type]}         offset     [description]
 * @param  {[type]}         groupId    [description]
 * @return {[type]}                    [description]
 */
export default function resetPasswordAction(newpassword, userKey) {
  return (dispatch) => {
    axios.post('/api/v1/user/newpassword', { newpassword, userKey })
    .then((res) => {
      return dispatch({
        status: res.data.message,
        type: RESET_PASSWORD_SUCCESS,
        users: res.data.users
      });
    })
    .catch((error) => {
      if (error.resonse === undefined) {
        return dispatch({
          status: error.response.data.message,
          type: RESET_PASSWORD_ERROR
        });
      } else {
        return dispatch({
          status: error.response.message,
          type: RESET_PASSWORD_ERROR
        });
      }
    });
  };
}