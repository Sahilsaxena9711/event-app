import React from 'react'
import AuthContext from  '../context';

export default class Auth extends React.Component{

    state = {
        isLogin: true
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.usernameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    submitHandler = (e) => {
        e.preventDefault();
        const username = this.usernameEl.current.value;
        const password = this.passwordEl.current.value;
        
        let requestBody = {
            query: `
                query {
                    login(username: "${username}", password: "${password}") {
                        token
                        tokenexpiration
                        userId
                    }
                }
            `
        };
        
        if(!this.state.isLogin){
            const email = this.emailEl.current.value;
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {username: "${username}", password: "${password}", email: "${email}"}) {
                            _id
                            email
                        }
                    }
                `
            }
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error ('Failed!')
            }
            return res.json();
            }).then((resp) => {
                if(resp.data.login.token){
                    this.context.login(
                        resp.data.login.token, 
                        resp.data.login.userId
                     );
                }
            }).catch((e) => {
                console.log(e)
            })
    }

    switchModuleHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin}
        })
    }

    render(){
        const {isLogin} = this.state;
        return(
            <form onSubmit={this.submitHandler} className="auth-form">
                <div className="formControl">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" ref={this.usernameEl} />
                </div>
                {!isLogin && (<div className="formControl">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email " ref={this.emailEl} />
                </div>)}
                <div className="formControl">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-action">
                    <button type="submit" >Submit</button>
                    <button type="button" onClick={this.switchModuleHandler}>Switch to  {isLogin ? "Signup" : "Login"}</button>
                </div>
            </form>
        )
    }
}