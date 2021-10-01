import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import './scss/style.scss';
import "./app.css";
import AuthHOC from './views/authHOC/AuthHOC';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}

export const loading = (
    <div className="apploader text-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
)


// Containers
const TheLayout = React.lazy(() => import('./components/layout/Layout'));

class App extends Component {

  componentDidMount() {
    (async () => {
    //validating token on first start
    const res = await fetch("/validate-token", {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        //slice the work 'vitoken' from document.cookie
        'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        //set login to true
        this.props.userLoggingin()
        //pushing user to /anasayfa
        this.props.history.push("/anasayfa")
        //awaiting data regarding user info
        let data = await res.json();
        //sending user data to redux store
        this.props.fillUserInfo(data)
      } else {
        this.props.logoutUser()
      }
    })()
  }

  render() {
    return (
      <React.Suspense fallback={loading}>
        <Switch>
            <ErrorBoundary>
              <AuthHOC>
                <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
              </AuthHOC>
            </ErrorBoundary>
        </Switch>
      </React.Suspense>        
    );
  }
}

const mapStateToProps = (state) => ({
  isUserLoggedIn: state.reducer.isUserLoggedIn
});

const mapDispatchToProps = (dispatch) => {
return {
    userLoggingin : () => {
        dispatch({type: "LOGIN"})
      },
    logoutUser : () => {
        dispatch({type: "LOGOUT"})
      },
    fillUserInfo: (data) => {
        dispatch({type: "FILL_USER_INFO", payload: data})
    }
  }
}  


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));