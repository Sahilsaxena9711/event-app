import React from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../../context';

const MainNavigation = props =>
    (
        <AuthContext.Consumer >
         {(context) => {
             return (
                <header className="nav-header">
                    <div className="NavLogo">
                        <h1>Eventify</h1>
                    </div>
                    <nav className="mainNavItems">
                        <ul> 
                            {!context.token && (<li><NavLink to="/auth">Authentication</NavLink></li>)}
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token &&(<li><NavLink to="/bookings">Bookings</NavLink></li>)}
                            {context.token && (<li><button onClick={context.logout}>Logout</button></li>)}                   
                        </ul>
                    </nav>
                </header>
            )
         }}   
        </AuthContext.Consumer>
    )

export default MainNavigation;