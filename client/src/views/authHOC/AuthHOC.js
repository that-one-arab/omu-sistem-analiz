import React, { useEffect } from "react";
import { Route, useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import SafeHOC from "../safehoc/SafeHOC";

const AuthHOC = (props) => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(state => state.reducer.isUserLoggedIn)
  const history = useHistory();
  useEffect(() => {
    return history.listen(async (location) => {
        const res = await fetch("/validate-token", {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
          })
        if (res.status < 405 && res.status > 400) {
            dispatch({type: "LOGOUT"})
            // return <Redirect to="/login" />
        } else if (res.status === 200) {
            let payload = await res.json()
            dispatch({type: "LOGIN", })
            dispatch({type: "FILL_USER_INFO", payload: payload})
            // return <Route {...props} />;
        }
      }
    ) 
 },[history, dispatch, isUserLoggedIn, props])

  if (isUserLoggedIn) {
    return (
      <Route {...props} />
    ) 
  }
  else {
    return (
      <SafeHOC/>
    )
  }
}


export default AuthHOC;