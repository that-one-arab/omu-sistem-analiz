import React from "react";
import { Switch, Route, Redirect } from "react-router";

const Login = React.lazy(() => import('../../pages/login/Login'));
const Register = React.lazy(() => import('../../pages/register/Register'));
const Test = React.lazy(() => import('../../pages/test/Test'));
const ResetPasswordVerify = React.lazy(() => import('../../pages/resetpassword/ResetPasswordVerify'));
const ResetPasswordNew = React.lazy(() => import('../../pages/resetpassword/ResetPasswordNew'));

function SafeHOC() {
    return (
        <>
            <Redirect to = "/login" />
            <Switch>
                <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
                <Route exact path = "/test" name ="testing page" render = {props => <Test {...props} />} />
                <Route exact path = "/resetpassword/verify" name = "Reset Password Verify Email" render = {props => <ResetPasswordVerify {...props} /> } />
                <Route exact path = "/resetpassword/new" name = "Reset Password Enter Pass" render = {props => <ResetPasswordNew {...props} /> } />
            </Switch>
        </>
    )
}

export default SafeHOC