import axios from 'axios';
import { GET_ARCHIVED_MESSAGE, GET_ARCHIVED_MESSAGE_ERROR } from './types/types';

/**
 * archivedMessageAction creates redux actions
 * @method archivedMessageAction
 *
 * @param  {number} groupId unique identifer for group
 * @param  {number} groupName name of group
 *
 * @return {function} redux action
 */
const archivedMessageAction = (groupId, groupName) => (dispatch) => {
  const url = `/api/v1/user/${groupId}/messages/archived`;
  return axios.get(url)
  .then(res => dispatch({
    groupName,
    messages: res.data.messages,
    status: res.data.message,
    type: GET_ARCHIVED_MESSAGE,
  }))
  .catch(err => dispatch({
    groupName,
    status: err.response.data.message,
    messages: '',
    type: GET_ARCHIVED_MESSAGE_ERROR,
  }));
};

export default archivedMessageAction;
