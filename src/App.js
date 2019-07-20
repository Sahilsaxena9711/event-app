import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './screens/Auth';
import Events from './screens/Events';
import Bookings from './screens/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context';
import {Hooks} from './screens/Hooks';

export default class App extends React.Component{

  state = {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId')
  }

  login = (token, userId) => {
     this.setState({ token, userId});
     localStorage.setItem('token', token);
     localStorage.setItem('userId', userId);
  }

  logout = () => {
    this.setState({token: null, userId: null});
    localStorage.clear();
  }

  render(){
    const { userId, token } = this.state;
    return(
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{token, userId, login: this.login, logout: this.logout}}>
            <MainNavigation />
            <main className="main">
              <Switch>
                <Route path="/hook" component={Hooks} />
                {!token && (<Redirect from="/" to="/auth" exact/>)}
                {token && (<Redirect from="/" to="/events" exact/>)}
                {!token && (<Redirect from="/bookings" to="/auth" exact/>)}
                {token && (<Redirect from="/auth" to="/events" exact/>)}
                {!token && (<Route path="/auth" component={Auth}/>)}
                <Route path="/events" component={Events}/>
                {token && (<Route path="/bookings" component={Bookings }/>)}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}