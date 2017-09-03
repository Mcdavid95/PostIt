import User from '../helpers/user';
import errorResponseHandler from '../helpers/errorresponsehandler';
import * as validate from '../helpers/validate';

const user = new User();

const Group = {
  /**
   * addUser controls the addition of a user to a group
   *
   * @param  {object} req request sent from frontend
   * @param  {object} res response from the server
   *
   * @return {object} API response
   */
  addUser: (req, res) => {
    const groupId = req.params.groupId;
    const usersToAdd = req.body.user;
    const userAdding = req.token.data.id;
    user.addUsers(groupId, usersToAdd, userAdding, (result) => {
      if (typeof result === 'string') {
        if (result.search('UserId') >= 0) {
          errorResponseHandler(res, 404, 'User Does not exist');
        } else if (result.search('GroupId') >= 0) {
          errorResponseHandler(res, 404, 'Group Does not exist');
        }
        errorResponseHandler(res, 400, result);
      } else {
        res.status(200).json({
          user: result,
          message: 'Added Successfully'
        });
      }
    });
  },

  /**
   * createGroup controls the creation of a group
   *
   * @param  {object} req request sent from frontend
   * @param  {object} res response from the server
   *
   * @return {object} API response
   */
  createGroup: (req, res) => {
    const groupName = req.body.groupName;
    let users = req.body.users;
    const userId = req.token.data.id;
    if (typeof users === 'string') {
      users = users.replace(/ /g, '');
      users = users.split(',');
    }
    user.createGroup(groupName, userId, users, (result) => {
      if (typeof result === 'string') {
        errorResponseHandler(res, 400, result);
      } else {
        res.status(201).json({
          group: result,
          message: 'Group creation Successful'
        });
      }
    });
  },

  /**
   * getGroupMessages controls the retrieval of messages for a group
   *
   * @param  {object} req request sent from frontend
   * @param  {object} res response from the server
   *
   * @return {object} API response
   */
  getGroupMessages: (req, res) => {
    const groupId = req.params.groupId;
    const username = req.token.data.username;
    if (validate.group(groupId, res)) {
      user.retrieveMessage(groupId, username, (result) => {
        if (result.length === 0) {
          errorResponseHandler(res, 404, 'No Message For that Group');
        } else if (typeof result === 'string') {
          errorResponseHandler(res, 500, 'Error Reading Message');
        } else {
          res.status(200).json({
            messages: result,
            message: 'Message Retrival Successful'
          });
        }
      });
    }
  },
  /**
   * getGroupUsers controls the retrieval of every member of a group
   *
   * @param  {object} req request sent from frontend
   * @param  {object} res response from the server
   *
   * @return {object} API response
   */
  getGroupUsers: (req, res) => {
    const groupId = req.params.groupId;
    if (validate.group(groupId, res)) {
      user.getGroupMembers(groupId, (result) => {
        if (typeof result === 'string' || result.length === 0) {
          errorResponseHandler(res, 404, 'No Such Group');
        } else {
          res.status(200).json({
            users: result,
            message: 'Users Retrival Successful'
          });
        }
      });
    }
  },


  postMessage: (req, res) => {
    const groupId = req.params.groupId;
    const message = req.body.message;
    const priority = (req.body.priority) ? req.body.priority : 'Normal';
    const from = req.token.data.id;
    if (validate.messageData(groupId, message, priority, from, res)) {
      user.postMessage(groupId, from, message, priority, (result, users) => {
        if (typeof result === 'string') {
          errorResponseHandler(res, 404, 'Group does not Exist');
        } else {
          user.inAppNotify(users, groupId, from, () => {
          });
          res.status(201).json({
            messageData: result,
            message: 'Message Added.'
          });
        }
      });
    }
  },
};

export default Group;
