import React from 'react';

class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      cpassword: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
    this.setState({
        [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.userSignupRequest(this.state);
  }

  render() {
    return (
      <div id="signup" className="modal fade" role="dialog">
        <form className="modal-dialog form" onSubmit={this.onSubmit}>
          <div className="modal-header">
            <b className="form-header">Sign Up </b>
            <b className="close" data-dismiss="modal" > Close</b>
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={this.onChange}
              className="form-control"
              value={this.state.name}
              name="name"
              placeholder="FirstName LastName"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={this.onChange}
              className="form-control"
              value={this.state.username}
              placeholder="Username"
              name="username"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              onChange={this.onChange}
              className="form-control"
              value={this.state.email}
              placeholder="Email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              onChange={this.onChange}
              className="form-control"
              value={this.state.password}
              placeholder="Password"
              required
              name="password"
              id="password"
            />
          </div>
          <div className="form-group">
            <span id="showvalidity" />
            <input
              type="password"
              onChange={this.onChange}
              className="form-control"
              value={this.state.cpassword}
              placeholder="Confirm Password"
              name="cpassword"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="form-control btn btn-success teal"
              value="Submit"
            />
          </div>
        </form>
      </div>
    );
  }
}

SignUp.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
};
export default SignUp;
