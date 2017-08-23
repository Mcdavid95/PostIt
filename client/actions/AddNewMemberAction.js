import axios from 'axios';
import { ADD_NEW_MEMBER } from './types/types';


export default function addNewMemberAction(groupId, userId) {
  return (dispatch) => {
    axios.post(`http://localhost:3300/api/group/${groupId}/user`, { user: userId })
    .then((res) => {
      return dispatch({
        type: ADD_NEW_MEMBER,
        status: res.data.message
      });
    })
    .catch((err) => {
      return dispatch({
        type: ADD_NEW_MEMBER,
        status: err.response.data.message
      });
    });
  };
}
