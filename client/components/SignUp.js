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
    // console.log(this.state);
    e.preventDefault();
    this.props.userSignup(this.state).then((res) => {
        console.log('************************');
      console.log(res);
    });
  }

  render() {
    return (
      <div id="signup" className="modal fade reg-form" role="dialog">
        <form className="modal-dialog signupform" onSubmit={this.onSubmit}>
          <div className="modal-header">
            <h2 className="form-header center" >Sign Up </h2>
            <h5 className="center"><a href="">Sign Up with Google+ </a></h5>
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={this.onChange}
              className="customform form-control"
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
              className="form-control validate"
              value={this.state.email}
              placeholder="Email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={this.onChange}
              className="form-control validate"
              value={this.state.phone}
              placeholder="Phone Number"
              name="phone"
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
              className="form-control btn deep-purple lighten-3 custombutton"
              value="Submit"
            />
            <button
              type="button"
              className="right close form-header"
              data-dismiss="modal"
            >Close</button>
          </div>
        </form>
      </div>
    );
  }
}

SignUp.propTypes = {
  userSignup: React.PropTypes.func.isRequired
};
export default SignUp;