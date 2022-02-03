import { Component } from 'react';
import style from '../styles/Footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Spinner from './Spinner';
import AuthContext from '../Components/Context';

// SVG
import EMAILICON from '../SVG/email_icon.png';

export default class Footer extends Component {
    static contextType = AuthContext;

    state = {
        email_newsletter: "",
        emailValidationMessage: "",
        emailRegex: false,
        finalAPIMessageNegative: "",
        finalAPIMessagePossitive: "",
        loader: false,
    }

    // Post Data to API
    async postData (email) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/newsletter/new/${email}`;
            let result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }
            })

            const dataJSON = await result.json();

            if (result.status === 400) {
                this.setState({
                    finalAPIMessageNegative: dataJSON.message,
                    loader: false,
                })
            } else if (result.status === 201) {
                this.setState({
                    finalAPIMessagePossitive: dataJSON.message,
                    loader: false,
                })
            } else {
                this.setState({
                    finalAPIMessageNegative: dataJSON.message,
                    loader: false,
                })
            }

        } catch (e) {
            console.warn(e);
        }
    }

    // HANDLE SUBMITION
    handleSubmition = (e) => {
        e.preventDefault();

        this.setState({
            finalAPIMessageNegative: "",
            finalAPIMessagePossitive: "",
            loader: false
        })

        if (this.state.emailRegex && this.state.emailValidationMessage === "" && this.state.email_newsletter !== "") {
            const email = this.state.email_newsletter;
            this.postData(email)
        }
    }

    // Check If Email Already Exists
    async validateEmail(email) {
        try {
            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/newsletter/validate/${email}`;
            let result = await fetch(url, { method: 'GET'});

            const message = await result.json();
            console.log(message)
            this.setState({
                emailValidationMessage: message.message
            })
        } catch (e) {
            console.warn(e)
        }
    }

    // Email String Validation
    emailHandler = (string) => {
        let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexEmail.test(string) === false) {
            this.setState({
                emailRegex: false
            })
        } else {
            this.validateEmail(string);
            this.setState({
                emailRegex: true
            })
        }
    }

    // Make Ellement Dissapear After A Certain Amount Of Time -- Set State to ""
    setTime = (property) => {
        setTimeout(() => {this.setState({ [`${property}`]: "" })}, 2500);
    }

    // HANDLE ON CHANGE EVENTS FROM INPUTS
    handleOnChangeInput = (event) => {
        if (event.target.name === "email_newsletter") {
            // this.validateEmail(event.target.value);
            this.emailHandler(event.target.value);
        }
        this.setState({
            [`${event.target.name}`]: event.target.value
        });
    }

    render() {
        
        const { email_newsletter, emailRegex, emailValidationMessage, loader, finalAPIMessageNegative, finalAPIMessagePossitive } = this.state;
        const { lang } = this.context;

        return (
            <footer className={style.footer} role={"heading"} aria-level={2}>
                <div className={style.footer_outer}>
                    <div className={style.footer_container}>
                        <div className={style.footer_left}>
                            <div className={style.footer_logo_cont}>
                                <div className={style.logo_cont} role={"banner"}>
                                    <Link href="/#">Lyrical Place</Link>
                                </div>
                            </div>
                            <div className={style.newsletter}>
                                <form onSubmit={this.handleSubmition}>
                                    <div>
                                        <legend htmlFor="email" >{lang === "EN" ? "Subscirbe to our newsletter" : "Κάνε εγγραφή στο ενημερωτικό μας δελτίο"}</legend>
                                        <div className={style.input_wrap}>
                                            <input type="email" placeholder="E-mail..." name="email_newsletter" id="email_newsletter" onChange={this.handleOnChangeInput} aria-label={"Email Newsletter Input"} />
                                            <button role={"button"} type="submit" className={style.img_wrap}><Image src={EMAILICON} alt="Envelope Icon" role={"img"} /></button>
                                            {loader ? 
                                                <div className={style.spinner_box}>
                                                    <Spinner />
                                                </div>
                                            : ""}
                                        </div>
                                        {emailValidationMessage !== "" ? 
                                            <>
                                                {this.setTime("emailValidationMessage")}
                                                <small role={"alert"}>{emailValidationMessage}</small>
                                            </>
                                        : ""}
                                        {email_newsletter !== "" && !emailRegex ? 
                                            <>
                                                <small role={"alert"}>{lang === "EN" ? "Please input a valid email!" : "Παρακαώ εισάγεται ένα έγγυρο email!"}</small>
                                            </>
                                        : ""}
                                        {finalAPIMessageNegative !== "" ? 
                                            <>
                                                {this.setTime("finalAPIMessageNegative")}
                                                <small role={"alert"}>{finalAPIMessageNegative}</small>
                                            </>
                                        : ""}
                                        {finalAPIMessagePossitive !== "" ? 
                                            <>
                                            {this.setTime("finalAPIMessagePossitive")}
                                                <small role={"alert"}>{finalAPIMessagePossitive}</small>
                                            </>
                                        : ""}
                                    </div>
                                  
                                        {lang === "EN" ?
                                            <p>
                                                We do not like spam, and sure, so does you! So we keep our newsletters to the minimum sending only what is really important. We do not send regureraly, we try avoiding it!
                                                <br />
                                                So subscribe now and don't miss on upcomming events and prizes!
                                            </p>
                                            : 
                                            <p>
                                                Δεν μας αρέσει το spam, και σίγουρα, το ίδιο και σε εσάς! Έτσι διατηρούμε τα ενημερωτικά δελτία μας στο ελάχιστο αποστέλλοντας μόνο ό,τι είναι πραγματικά σημαντικό. Δεν στέλνουμε τακτικά, προσπαθούμε να το αποφύγουμε! <br />
                                                Εγγραφείτε λοιπόν τώρα και μην χάνετε επερχόμενες εκδηλώσεις και βραβεία!
                                            </p>
                                        }
                                </form>
                            </div>
                        </div>
                        <div className={style.footer_right}>
                            <header>{lang === "EN" ? "Usefull Links" : "Χρήσιμοι Σύνδεσμοι"}</header>
                            <ul>
                                {/* MAYBE ADD SCROLL ON TOP */}
                                <li>
                                    <Link href="/" role={"link"}>{lang === "EN" ? "Home" : "Αρχική"}</Link>
                                </li>
                                <li>
                                    <Link href="/signup" role={"link"}>{lang === "EN" ? "Sign Up" : "Εγγραφή"}</Link>
                                </li>
                                <li>
                                    <Link href="/signin" role={"link"}>{lang === "EN" ? "Sign In" : "Σύνδεση"}</Link>
                                </li>
                                <li>
                                    <Link href="/explore" role={"link"}>{lang === "EN" ? "Explore" : "Εξερεύνηση"}</Link>
                                </li>
                                <li>
                                    <Link href="/trendings" role={"link"}>{lang === "EN" ? "Trendings" : "Τάσεις"}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={style.footer_cr}>
                        <small role={"note"}>Lyrical Place 2021 &copy;. All rights reserved.</small>
                    </div>
                </div>
            </footer>
        )
    }
}
