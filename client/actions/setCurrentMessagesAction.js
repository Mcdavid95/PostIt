import axios from 'axios';
import { SET_CURRENT_MESSAGES, SET_CURRENT_MESSAGES_ERROR } from './types/types';

const setCurrentMessagesAction = (data, groupName) => {
  const url = `/api/v1/group/${data}/messages`;
  return (dispatch) => {
    return axios.get(url)
  .then((res) => {
    const messages = res.data.messages;
    const status = res.data.message;
    return dispatch({
      messages,
      type: SET_CURRENT_MESSAGES,
      status,
      groupName
    });
  })
  .catch((err) => {
    const status = err.response.data.message;
    return dispatch({
      messages: '',
      type: SET_CURRENT_MESSAGES_ERROR,
      status,
      groupName
    });
  });
  };
};

export default setCurrentMessagesAction;
