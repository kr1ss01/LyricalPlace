import React, { Component } from 'react';

const AuthContext = React.createContext();

export class AuthProvider extends Component {

    state = {
        userData: "",
        isAuth: false,
        lang: "GR",
        dropDown: false,
        token: "",
    }

    componentDidMount() {
        let AUTH = JSON.parse(localStorage.getItem("en34dfgP0#ti!"));
        let LANG = JSON.parse(localStorage.getItem("c72fcc729006344f"));
        // let TOKEN = JSON.parse(localStorage.getItem("567da65d88d4c0b66f8c417b1ec273e2"));

        // * HANDLE AUTH
        if (AUTH !== null) {
            this.setState({
                userData: AUTH,
                isAuth: true,
                // token: TOKEN
            })
        }

        // * HANDLE LANGUAGE
        if (LANG !== null) {
            this.setState({
                lang: LANG.lang
            })
        } else {
            localStorage.setItem('c72fcc729006344f', JSON.stringify({lang: this.state.lang}));
        }
    }


    logIn = (userData) => {
        // ! Should Get Props From Log In
        this.setState({
            userData: userData,
            isAuth: true,
            // token: token,
        })
    }

    logOut = () => {
        if (localStorage.getItem("en34dfgP0#ti!") !== null) { localStorage.removeItem("en34dfgP0#ti!") }
        // if (localStorage.getItem("567da65d88d4c0b66f8c417b1ec273e2") !== null) {localStorage.removeItem("567da65d88d4c0b66f8c417b1ec273e2") }
        this.setState({
            userData: "",
            isAuth: false,
            token: "",
        })
    }

    changeLang = () => {
        this.setState({
            lang: this.state.lang === "GR" ? "EN" : "GR",
        })
        localStorage.setItem('c72fcc729006344f', JSON.stringify({lang: this.state.lang}));
    }

    handleDropDown = () => {
        this.setState({
            dropDown: !this.state.dropDown
        })
    }

    setFavouarites = (data, type, user_data) => {
        if (type == 1) {
            user_data.fav.push(data);

            localStorage.setItem('en34dfgP0#ti!', JSON.stringify(user_data));

            this.setState({
                userData: user_data
            })
        } else if (type == 0) {
            const index = user_data.fav.indexOf(data);

            user_data.fav.splice(index, 1);

            localStorage.setItem('en34dfgP0#ti!', JSON.stringify(user_data));

            this.setState({
                userData: user_data
            })
        }
    }

    render() {
        const { userData, isAuth, lang, dropDown } = this.state;
        const { logIn, logOut, changeLang, handleDropDown, setFavouarites } = this;
        return (
            <AuthContext.Provider value={{ userData, isAuth, logIn, logOut, lang, changeLang, dropDown, handleDropDown, setFavouarites }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export default AuthContext;
