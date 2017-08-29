import jwt from 'jsonwebtoken';
import User from '../src/user';

const user = new User();

const controler = {
  /**
   * [addUserControler controls the addition of a user to a group]
   * @method addUserControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  addUserControler: (req, res) => {
    const groupId = req.params.groupid;
    const usersToAdd = req.body.user;
    const userAdding = req.token.data.id;
    user.addUsers(groupId, usersToAdd, userAdding, (result) => {
      if (typeof result === 'string') {
        if (result.search('UserId') >= 0) {
          res.status(404).json({
            message: 'User Does not exist'
          });
        } else if (result.search('GroupId') >= 0) {
          res.status(404).json({
            message: 'Group Does not exist'
          });
        }
        res.status(400).json({
          message: result
        });
      } else {
        res.status(200).json({
          user: result,
          message: 'Added Successfully'
        });
      }
    });
  },
  /**
   * [createGroupControler controls the creation of a group]
   * @method createGroupControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  createGroupControler: (req, res) => {
    const groupName = req.body.groupname;
    let users = req.body.users;
    const userId = req.token.data.id;
    if (typeof users === 'string') {
      users = users.replace(/ /g, '');
      users = users.split(',');
    }
    user.createGroup(groupName, userId, users, (result) => {
      if (typeof result === 'string') {
        res.status(400).json({
          message: result
        });
      } else {
        res.status(201).json({
          group: result,
          message: 'Group creation Successful'
        });
      }
    });
  },
  /**
   * [deleteUserControler controls the removal of an existing user]
   * @method deleteUserControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  deleteUserControler: (req, res) => {
    const userId = req.body.user || req.token.data.email;
    user.deleteUserss(userId, (result) => {
      if (result === 1) {
        res.status(200).json({
          message: 'Deleted'
        });
      }
    });
  },

  /**
   * [getGroupMessagesControler controls the retrieval of messages for a group]
   * @method getGroupMessagesControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  getGroupMessagesControler: (req, res) => {
    const groupId = req.params.groupid;
    if (isNaN(groupId) || parseInt(groupId, 10) > 10000000000) {
      res.status(400).json({
        message: 'Invalid Group Selected'
      });
    }
    user.retrieveMessage(groupId, (result) => {
      if (result.length === 0) {
        res.status(404).json({
          message: 'No Message For that Group'
        });
      } else {
        res.status(200).json({
          messages: result,
          message: 'Message Retrival Successful'
        });
      }
    });
  },
  /**
   * [getGroupUsersControler controls the retrieval of every member of a group]
   * @method getGroupUsersControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  getGroupUsersControler: (req, res) => {
    const groupId = req.params.groupid;
    if (isNaN(groupId) || parseInt(groupId, 10) > 10000000000) {
      res.status(400).json({
        message: 'Invalid Group Selected'
      });
    }
    user.getGroupMembers(groupId, (result) => {
      if (typeof result === 'string' || result.length === 0) {
        res.status(404).json({
          message: 'No Such Group'
        });
      } else {
        res.status(200).json({
          users: result,
          message: 'Users Retrival Successful'
        });
      }
    });
  },
  /**
   * [getUserGroupsControler controls retrieval of every group a user belongs to]
   * @method getUserGroupsControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  getUserGroupsControler: (req, res) => {
    const userId = req.token.data.id;
    user.getUserGroups(userId, (result) => {
      if (result.length === 0) {
        res.status(404).json({
          message: 'No Group Yet'
        });
      } else {
        res.status(200).json({
          groups: result,
          message: 'Group Retrival Successful'
        });
      }
    });
  },
  /**
   * [postMessageControler controls posting of messages to a group]
   * @method postMessageControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  postMessageControler: (req, res) => {
    const groupId = req.params.groupid;
    const message = req.body.message;
    const priority = (req.body.priority) ? req.body.priority : 'Normal';
    const from = req.token.data.id;
    if (groupId === '' || groupId === undefined) {
      res.status(400).json({
        message: 'Group must be specified'
      });
    } else if (from === '' || from === undefined) {
      res.status(400).json({
        message: 'Sender must be specified'
      });
    } else if (message === '' || message === undefined || (message.trim()).length === 0) {
      res.status(400).json({
        message: 'message cannot be null'
      });
    } else if (priority !== 'Normal' && priority !== 'Critical' && priority !== 'Urgent') {
      res.status(400).json({
        message: 'Wrong Priority level'
      });
    } else {
      user.postMessage(groupId, from, message, priority, (result, users) => {
        if (typeof result === 'string') {
          res.status(404).json({
            message: 'Group does not Exist'
          });
        } else {
          user.inAppNotify(users, groupId, from, () => {
          });
          res.status(200).json({
            messageData: result,
            message: 'Message Added.'
          });
        }
      });
    }
  },

  /**
   * [signinControler controls authorization of an existing user]
   * @method signinControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  signinControler: (req, res) => {
    const { username, password } = req.body;
    if (username === undefined || username === '') {
      res.status(400).json({
        message: 'Username can not be empty'
      });
    } else if (password === undefined || password === '') {
      res.status(400).json({
        message: 'Username can not be empty'
      });
    } else {
      user.logIn(username, password, (result) => {
        if (result === 'Failed, Wrong Password' ||
          result === 'Failed, Username not Found') {
          res.status(400).json({
            message: result
          });
        } else {
          res.status(200).json({
            user: result,
            message: 'Sign In Successful'
          });
        }
      });
    }
  },
  /**
   * [signupControler controls registration of a new user]
   * @method signupControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  signupControler: (req, res) => {
    const { name, username, email, password, phone } = req.body;
    user.signUp(name, username, email, password, phone, (result) => {
      if (typeof result !== 'object') {
        res.status(400).json({
          message: result
        });
      } else {
        res.status(201).json({
          user: result,
          message: 'Registration Successful'
        });
      }
    });
  },

  /**
   * [getAllUsersControler retrieves every user in the APp]
   * @method getAllUsersControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  getAllUsersControler: (req, res) => {
    user.getAllUsers((result) => {
      res.json({
        users: result
      });
    });
  },

  /**
   * [messageReadControler controls the group of messages as seen]
   * @method messageReadControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  messageReadControler: (req, res) => {
    const messageId = req.body.messageId;
    const userId = req.token.data.id;
    if (messageId === '' || messageId === undefined) {
      return res.status(404).json({ message: 'No message Specified' });
    } else {
      user.seenMessages(messageId, userId, (result) => {
        if (result === 'Read') {
          return res.status(200).json({
            messageRead: result,
            message: 'Message Read'
          });
        } else {
          return res.status(500).json({
            data: result,
            message: 'Error Reading Message'
          });
        }
      });
    }
  },

  /**
   * [searchUserControler controls searching for user]
   * @method searchUserControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  searchUserControler: (req, res) => {
    const { searchTerm, offset, groupId } = req.body;
    if ((searchTerm === '' || searchTerm === undefined) ||
        (offset === '' || offset === undefined) ||
        (groupId === '' || groupId === undefined)
      ) {
      return res.status(400).json({ message: 'Please supply a search term' });
    } else {
      user.searchUsers(searchTerm, offset, groupId, (result) => {
        return res.status(200).json({
          message: 'Search Result',
          users: result.rows,
          count: result.count
        });
      });
    }
  },

  /**
   * [mymessageControler controls the retrieval of messages sent by a user]
   * @method mymessageControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  mymessageControler: (req, res) => {
    const userId = req.token.data.id;
    user.myMessages(userId, (result) => {
      return res.status(200).json({
        message: 'You Messages',
        messages: result
      });
    });
  },
  /**
   * [archivedMessagesControler controls retrieval of seen messages]
   * @method archivedMessagesControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  archivedMessagesControler: (req, res) => {
    const userId = req.token.data.id;
    user.archivedMessages(userId, (result) => {
      return res.status(200).json({
        message: 'Read Messages',
        messages: result
      });
    });
  },

  /**
   * [ensureToken verifies the validity of json web token]
   * @method ensureToken
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @param  {Function}  next [description]
   * @return {[object]}         []
   */
  ensureToken: (req, res, next) => {
    const token = req.body.token || req.params.token || req.headers.authorization;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid token.' });
        } else {
          req.token = decoded;
          next();
        }
      });
    } else {
      return res.status(412).json({ message: 'Access Token Not Provided. Please Sign In' });
    }
  },

  /**
   * [forgetPasswordControler controls the requesting for changing password]
   * @method forgetPasswordControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  forgetPasswordControler: (req, res) => {
    const email = req.body.email;
    if (email !== '' && email !== undefined) {
      user.sendPasswordResetMail(email, (result) => {
        if (result === 'Email Address Not found') {
          return res.status(404).json({
            message: 'Email Address Not found'
          });
        } else {
          return res.status(200).json({
            message: 'A mail has being sent to you.',
            user: result
          });
        }
      });
    } else {
      return res.status(400).json({
        message: 'Please Supply your Email'
      });
    }
  },

  /**
   * [newPasswordControler controls resetting of password]
   * @method newPasswordControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  newPasswordControler: (req, res) => {
    const { userKey, newpassword } = req.body;
    if ((newpassword !== '' && newpassword !== undefined) && (userKey !== '' && userKey !== undefined)) {
      user.resetPassword(newpassword, userKey, (result) => {
        if (result === 'Password Updated') {
          return res.status(200).json({
            message: 'Password Updated, please sign In with the new Password',
            user: result
          });
        } else if (result === 'Password Must Contain Alphabets, Numbers, Special Characters and Must be Longer than 8') {
          return res.status(400).json({
            message: result,
            user: result
          });
        } else {
          return res.status(500).json({
            message: 'Internal Server Error',
            user: result
          });
        }
      });
    } else {
      return res.status(400).json({
        message: 'Invalid Input Supplied.'
      });
    }
  },

  /**
   * [googleAuthControler controls authorization with google+]
   * @method googleAuthControler
   * @param  {[object]}         req [request sent from frontend]
   * @param  {[object]}         res [response from the server]
   * @return {[object]}         []
   */
  googleAuthControler: (req, res) => {
    const { name, email, state } = req.body;
    const username = (email.split('@')[0]).replace(/[^a-zA-Z0-9]/g, '');
    const password = 'social';
    if ((name !== '' && name !== undefined) && (email !== '' && email !== undefined) && (username !== '' && username !== undefined)) {
      if (state === 'Sign Up') {
        user.googleSignUp(name, email, username, state, password, (result) => {
          if (typeof result === 'string') {
            return res.status(400).json({
              message: result,
            });
          } else {
            return res.status(200).json({
              message: 'Sign Up Successful',
              user: result
            });
          }
        });
      } else {
        user.googleSignIn(name, email, username, state, password, (result) => {
          if (typeof result === 'string') {
            return res.status(400).json({
              message: result,
            });
          } else {
            return res.status(200).json({
              message: 'Sign Up Successful',
              user: result
            });
          }
        });
      }
    }
  },

};

export default controler;
