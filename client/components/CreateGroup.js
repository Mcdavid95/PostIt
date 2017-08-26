import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getUserGroupsAction from '../actions/getUserGroupsAction';
import clearStoreAction from '../actions/clearStoreAction';

/**
 * [createGroup component for creating new group]
 * @type {[class]}
 */
class CreateGroup extends React.Component {
  /**
   * [constructor creates the state]
   * @method constructor
   * @param  {[object]}    props [data]
   * @return {[object]}          [description]
   */
  constructor(props) {
    super(props);
    this.createGroup = this.createGroup.bind(this);
    this.state = {
      groupname: '',
      purpose: '',
      members: '',
      status: ''
    };
    this.onChange = this.onChange.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.clear = this.clear.bind(this);
  }
  /**
   * [onChange stores the form component value in the state]
   * @method onChange
   * @param  {[object]} event [the event triggered on the HTML element]
   * @return {[object]}       [new state]
   */
  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  /**
   * [createGroup sends the form data to the API for form creation]
   * @method createGroup
   * @param  {[object]}    event [the event triggered on the form]
   * @return {[object]}          []
   */
  createGroup(event) {
    event.preventDefault();
    const members = this.refs.members.value;
    const groupData = {
      groupname: this.state.groupname,
      purpose: this.state.purpose,
      users: members
    };
    this.props.createGroupAction(groupData, this.props.userId)
    .then(() => {
      this.setState({
        groupname: '',
        purpose: '',
        members: ''
      });
      $('#creategroup').modal('hide');
    });
  }
  clear() {
    this.setState({
      user: '',
      termIsEmpty: true,
      searchTerm: '',
      offset: 0,
      pageCount: ''
    });
    this.props.clearStoreAction('createGroup');
  }
  /**
   * [render ]
   * @method render
   * @return {[type]} []
   */
  render() {
    return (
      <div id="creategroup" className="modal fade reg-form" role="dialog">
        <form className="modal-dialog" onSubmit={this.createGroup}>
          <h2 className="center"> Create a Group </h2>
          <h6 className="center">{this.props.status}</h6>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="What will you like to call your Group?"
              required
              value={this.state.groupname}
              onChange={this.onChange}
              name="groupname"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Purpose (optional)"
              value={this.state.purpose}
              onChange={this.onChange}
              name="purpose"
            />
          </div>
          <div className="form-group">
            <label htmlFor="input"> Add members by username </label>
            <div className="chips chips-autocomplete" />
            <input
              type="hidden"
              id="members"
              value=""
              name="members"
              ref="members"
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="form-control btn custombutton deep-purple lighten-3"
              value="Create"
            />
            <button
              type="reset"
              onClick={this.clear}
              className="form-control close custombutton"
              data-dismiss="modal"
            >Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

CreateGroup.propTypes = {
  createGroupAction: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  clearStoreAction: PropTypes.func.isRequired
};
/**
 * [mapStateToProps description]
 * @method mapStateToProps
 * @param  {[type]}        state [description]
 * @return {[type]}              [description]
 */
function mapStateToProps(state) {
  let status = 'xcvxcv';
  let userId = '';
  if (state.createGroupReducer !== undefined) {
    status = state.createGroupReducer.status;
    userId = state.authUser.user_details.id;
  }
  return {
    status,
    userId
  };
}

export default connect(mapStateToProps, { getUserGroupsAction, clearStoreAction })(CreateGroup);
