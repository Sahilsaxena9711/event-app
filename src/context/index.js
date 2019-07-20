import React from 'react';

export default React.createContext({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    login: (token, userId) => {},
    logout: () => {}
})