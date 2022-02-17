import { Component } from 'react';
import style from '../styles/SignUp.module.scss';
import Meta from '../Components/Meta';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '../Components/Spinner';
import Router from 'next/router';
import AuthContext from '../Components/Context';

// SVG
import USERICON from '../SVG/user_icon.png';
import EMAILICON from '../SVG/email_icon.png';
import EYE from '../SVG/eye_icon.png';
import EYECROSSED from '../SVG/eye_crossed_icon.png';
import IDCARD from '../SVG/id_card_icon.png';
import AGE from '../SVG/calendar_icon.png';
import EXCLAMATION from '../SVG/exclam_icon.png';
import TICK from '../SVG/tick_icon.png';


export default class Signup extends Component {
    static contextType = AuthContext; 

    state = {
        username: "",
        email: "",
        fname: "",
        pwd: "",
        pwd_re: "",
        dateOfBirth: null,
        usernameValidationMessage: "",
        emailValidationMessage: "",
        usernameRegex: false,
        emailRegex: false,
        ageValidation: false,
        pwd8Char: false,
        pwd1Number: false,
        pwd1Symbol: false,
        pwdUpperAndLowerCase: false,
        passwordsMustMatch: false,
        visiblePass: false,
        visiblePassRe: false,
        DontFitAllCriteria: false,
        fillAllFields: false,
        finalAPIMessagePossitive: "",
        finalAPIMessageNegative: "",
        loader: false,
    }

    redirect = () => {
        Router.push('/signin');
    }

    authRedirect = () => {
        Router.push('/');
    }

    // Component Did Mount Handles Navbar Extension On Mobile Devices. It retracts it if user navigated here through this navbar.
    componentDidMount() {
        if (this.context.dropDown) {
            this.context.handleDropDown();
        }
    }

    // Post Data to API
    async postData (data) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/signup`;
            let result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
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


    async validateUsername(username) {
        try {
            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/validate/username/${username}`;
            let result = await fetch(url, { method: 'GET'});

            const message = await result.json();

            this.setState({
                usernameValidationMessage: message.message
            })
        } catch (e) {
            console.warn(e)
        }
    }

    async validateEmail(email) {
        try {
            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/validate/email/${email}`;
            let result = await fetch(url, { method: 'GET'});

            const message = await result.json();
     
            this.setState({
                emailValidationMessage: message.message
            })
        } catch (e) {
            console.warn(e)
        }
    }

    whiteSpaceHandler = (string) => {
        // let regexUsername = /\s/g;
        let regexUsername = /^[a-z0-9]+$/;
        if (regexUsername.test(string) === false) {
            this.setState({
                usernameRegex: true
            })
        } else {
            this.setState({
                usernameRegex: false
            })
        }
    }

    emailHandler = (string) => {
        let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexEmail.test(string) === false) {
            this.setState({
                emailRegex: true
            })
        } else {
            this.validateEmail(string);
            this.setState({
                emailRegex: false
            })
        }
    }

    fnameHandler = (string) => {
        // let regexFname = /^[a-zA-Z]+$/;
        let regexFname = /^[a-zA-Z\s]*$/g;
        if (regexFname.test(string) === false) {
            this.setState({
                fnameRegex: true
            })
        } else {
            this.setState({
                fnameRegex: false
            })
        }
    }

    handlePasswordValidation = (pass) => {
        if (pass.length >= 8 && pass.length <= 30) {
            this.setState({
                pwd8Char: true
            })
        } else {
            this.setState({
                pwd8Char: false
            })
        }
        // Regexes
        let numberRegex = /[0-9]/g; // Regex To Test If Password Contains Number
        let capitalRegex = /[A-Z]/g; // Regex To Test If Password Contains Upper Case Letters
        let lowerRegex = /[a-z]/g // Regex To Test If Password Contains Lower Case Letters
        let symbolRegex = /[\W]/g; // Regex To Test If Password Contains Symbols
        // Checkers
        if (numberRegex.test(pass)) {
            this.setState({
                pwd1Number: true
            })
        } else {
            this.setState({
                pwd1Number: false
            })
        }
        if (capitalRegex.test(pass) && lowerRegex.test(pass)) {
            this.setState({
                pwdUpperAndLowerCase: true
            })
        } else {
            this.setState({
                pwdUpperAndLowerCase: false
            })
        }
        if (symbolRegex.test(pass)) {
            this.setState({
                pwd1Symbol: true
            })
        } else {
            this.setState({
                pwd1Symbol: false
            })
        }
    }

    // Display Date In Readable Format and Convert it in a <String> type variable
    dateHandler = () => {
        const date = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dateNow = `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        return dateNow;
    }

    // HANDLE SUBMITION
    handleSubmition = (e) => {
        e.preventDefault();

        this.setState({
            DontFitAllCriteria: false,
            fillAllFields: false,
            loader: false,
        })

        const { username, email, fname, dateOfBirth,  pwd, pwd_re, usernameValidationMessage, usernameRegex, emailValidationMessage, emailRegex, fnameRegex, ageValidation, pwd1Number, pwd8Char, pwdUpperAndLowerCase, pwd1Symbol, passwordsMustMatch} = this.state;

        if (username !== "" && email !== "" && fname !== "" && dateOfBirth !== "" && pwd !== "" && pwd_re !== "") {

            if (usernameValidationMessage !== "Username already taken!" && !usernameRegex && emailValidationMessage !== "Email already taken!" && !emailRegex && !fnameRegex && !ageValidation && pwd1Number && pwd8Char && pwdUpperAndLowerCase && pwd1Symbol && passwordsMustMatch) {

                const data = {
                    email: email,
                    password: pwd,
                    username: username,
                    fname: fname,
                    age: dateOfBirth,
                    today: this.dateHandler()
                }
                this.setState({
                    loader: true
                })
                this.postData(data);

            } else {
                this.setState({
                    DontFitAllCriteria: true
                })
            }
        } else {
            this.setState({
                fillAllFields: true
            })
        }
    }


    // HANDLE ON CHANGE EVENTS FROM INPUTS
    handleOnChangeInput = (event) => {
        if (event.target.name === "username") {
            this.validateUsername(event.target.value);
            this.whiteSpaceHandler(event.target.value);
        }
        if (event.target.name === "email") {
            // this.validateEmail(event.target.value);
            this.emailHandler(event.target.value);
        }
        if (event.target.name === "fname") {
            this.fnameHandler(event.target.value);  
        }
        if (event.target.name === "dateOfBirth") {
            if (event.target.value > 100 || event.target.value < 1) {
                this.setState({
                    ageValidation: true
                })
            } else {
                this.setState({
                    ageValidation: false
                })
            }
        }
        if (event.target.name === "pwd_re") {
            if (event.target.value === this.state.pwd) {
                this.setState({
                    passwordsMustMatch: true
                })
            } else {
                this.setState({
                    passwordsMustMatch: false
                })
            }
        }
        if (event.target.name === "pwd") {
            this.handlePasswordValidation(event.target.value);
        }
        this.setState({
            [`${event.target.name}`]: event.target.value
        });
    }

    handlePasswordSee = () => {
        const input = document.getElementById("pwd");
        let visible = this.state.visiblePass;

        if (visible) {
            input.type = 'password';
            this.setState({
                visiblePass: false
            })
        } else {
            input.type = 'text';
            this.setState({
                visiblePass: true
            })
        }
    }

    setTime = (property) => {
        setTimeout(() => {this.setState({ [`${property}`]: "" })}, 4000);
        if (property === "finalAPIMessagePossitive") {
            setTimeout(() => {
                this.redirect();
            }, 4000);
        }
    }

    setTimeFalse = (property) => {
        setTimeout(() => {this.setState({ [`${property}`]: false })}, 4000);
    }

    handlePasswordSeeRe = () => {
        const input = document.getElementById("pwd_re");
        let visible = this.state.visiblePassRe;

        if (visible) {
            input.type = 'password';
            this.setState({
                visiblePassRe: false
            })
        } else {
            input.type = 'text';
            this.setState({
                visiblePassRe: true
            })
        }
    }

    render() {
        var { username, email, fname, dateOfBirth,  pwd, pwd_re,usernameValidationMessage, usernameRegex, emailValidationMessage, emailRegex, fnameRegex, ageValidation, pwd1Number, pwd8Char, pwdUpperAndLowerCase, pwd1Symbol, passwordsMustMatch, visiblePass, visiblePassRe, DontFitAllCriteria, fillAllFields, finalAPIMessagePossitive, finalAPIMessageNegative, loader} = this.state;
        const { isAuth, lang } = this.context;
        return (
            <main className={style.main_cont}>
                {isAuth ? this.authRedirect() : ""}
                <Meta title={"Sign Up"} page_topic={"Sign-up Lyrical Place - Εγγραφή στο Lyrical Place"}/>
                <h1>{lang === "EN" ? "Sign Up to Lyrical Place" : "Εγγραφειτέ στο Lyrical Place"}</h1>
                <h2>{lang === "EN" ? "Become a member of our community today!" : "Γίνετε μέλος της κοινότητας του Lyrical PLace σήμερα!"}</h2>
                <section>
                    <div className={style.flap_right}>
                        <>
                            <div className={style.logo_span}>Lyrical Place</div>
                            <div className={style.hr}></div>
                            <header>{lang === "EN" ? "Sign Up Today!" : "Γίνετε μέλος σήμερα!"}</header>
                            <p>
                                {lang === "EN" ? "Sign up to Lyrical Place and help us expand and make the songs you love discovered by many people around the world!" : "Εγγράψου σήμερα στο Lyrical Place και βοηθησέ μας να αναπτυχθούμε και να φέρουμε τραγούδια που εσύ αγαπάς σε πολλά άτομα ανά τον κόσμο!"}
                            </p>
                            <p>
                                {lang === "EN" ? "Sign up for free and help us expand now! It is and it will always be free! Help us achieve our goals of providing lyrics for everyone!" : "Κάνε εγγραφή δωρεάν και βοήθησέ μας να αναπτυχθούμε! Είναι και θα είναι πάντα δωρεάν! Υποστίριξε μας στην προσπάθειά μας να φέρουμε τους στοίχους απο τραγούδια παντού και για τον καθένα!"} 
                            </p>
                            <p>
                                {lang === "EN" ? "We ensure that we will never give any information regarding you to anyone! We keep any data you provide us for us and to ensure the workflow of the site. We are against of sharing sensitive (or not) data with anyone!" 
                                :
                                    "Σας διαβεβαιόνουμε πως ποτέ δεν θα διαρεύσουμε προσωπικές πληροφορίες σχετίκες με εσάς σε κανέναν! Κρατάμε τα δεδομένα που δίνετε σε εμάς για την ομαλή λειτουργία του site. Είμαστε κατά της δημοσίευσης προσοπικών ( και όχι ) δεδομένων με τον οποιονδήποτε!"
                                }
                            </p>
                        </>
                    </div>
                    <form onSubmit={this.handleSubmition} className={style.sign_up_form}>
                        <h3>{lang === "EN" ? "Sign Up And Discover A New World" : "Συνδέσου και ανακάλυψε έναν καινούργιο κόσμο!"}</h3>
                        {loader ? 
                            <div className={style.spinner_box}>
                                <Spinner />
                            </div>
                        : ""}

                        {DontFitAllCriteria ? 
                            <>
                                {this.setTimeFalse("DontFitAllCriteria")}
                                <div className={style.api_res_div}>
                                    <div className={style.api_res_div_msg}>
                                        <h3 className={style.api_negative}>{lang === "EN" ? "Please make sure you match all criteria!" : "Παρακαλώ, συμπληρώστε σωστά όλα τα πεδία!"}</h3>
                                        <div className={style.progress_bar_cont}>
                                            <div className={style.progress_bar}></div>
                                        </div>
                                    </div> 
                                    <button onClick={() => { this.setState({ DontFitAllCriteria: false }) }}>
                                        <span id={style.img}><Image src={EXCLAMATION} alt="Error Icon" /></span>
                                        <span id={style.right}></span>
                                        <span id={style.left}></span>
                                    </button>
                                </div>
                                <div className={style.api_res_div_mobile} onClick={() => { this.setState({ DontFitAllCriteria: false }) }}>
                                    <h3 className={style.api_negative}>{lang === "EN" ? "Please make sure you match all criteria!" : "Παρακαλώ, συμπληρώστε σωστά όλα τα πεδία!"}</h3>
                                    <div className={style.progress_bar_cont_mobile}>
                                        <div className={style.progress_bar_mobile}></div>
                                    </div>
                                </div>
                            </>
                        : 
                        ""
                        }

                        {fillAllFields ? 
                        <>
                            {this.setTimeFalse("fillAllFields")} 
                            <div className={style.api_res_div}>
                                <div className={style.api_res_div_msg}>
                                    <h3 className={style.api_negative}>{lang === "EN" ? "Please Fill In All The Fields First!" : "Παρακαλώ, συμπληρώστε όλα τα πεδία!"}</h3>
                                    
                                    
                                    <div className={style.progress_bar_cont}>
                                        <div className={style.progress_bar}></div>
                                    </div>
                                </div> 
                                <button onClick={() => { this.setState({ fillAllFields: false }) }}>
                                    <span id={style.img}><Image src={EXCLAMATION} alt="Error Icon" /></span>
                                    <span id={style.right}></span>
                                    <span id={style.left}></span>
                                </button>
                            </div>
                            <div className={style.api_res_div_mobile} onClick={() => { this.setState({ fillAllFields: false }) }}>
                                <h3 className={style.api_negative}>{lang === "EN" ? "Please Fill In All The Fields First!" : "Παρακαλώ, συμπληρώστε όλα τα πεδία!"}</h3>
                                <div className={style.progress_bar_cont_mobile}>
                                    <div className={style.progress_bar_mobile}></div>
                                </div>
                            </div>
                        </>
                        : 
                        ""
                        }

                        {finalAPIMessageNegative !== "" ? 
                            <>
                                <div className={style.api_res_div}>
                                    <div className={style.api_res_div_msg}>
                                        {this.setTime("finalAPIMessageNegative")}
                                        <h3 className={style.api_negative}>{lang === "EN" ? finalAPIMessageNegative : finalAPIMessageNegative === "Server Fatal Error" ? "Υπάρχει πρόβλημα στον Server" : finalAPIMessageNegative === "User With This Username Already Exists!" ? "Υπάρχει ήδη χρήστης με αυτό το όνομα!" : "Άγνωστο Σφάλμα"}</h3>
                                        
                                        
                                        <div className={style.progress_bar_cont}>
                                            <div className={style.progress_bar}></div>
                                        </div>
                                    </div> 
                                    <button onClick={() => { this.setState({ finalAPIMessageNegative: "" }) }}>
                                        <span id={style.img}><Image src={EXCLAMATION} alt="Error Icon" /></span>
                                        <span id={style.right}></span>
                                        <span id={style.left}></span>
                                    </button>
                                </div>
                                <div className={style.api_res_div_mobile} onClick={() => { this.setState({ finalAPIMessageNegative: "" }) }}>
                                    <h3 className={style.api_negative}>{lang === "EN" ? finalAPIMessageNegative : finalAPIMessageNegative === "Server Fatal Error" ? "Υπάρχει πρόβλημα στον Server" : finalAPIMessageNegative === "User With This Username Already Exists!" ? "Υπάρχει ήδη χρήστης με αυτό το όνομα!" : "Άγνωστο Σφάλμα"}</h3>
                                    <div className={style.progress_bar_cont_mobile}>
                                        <div className={style.progress_bar_mobile}></div>
                                    </div>
                                </div>
                            </>
                        : 
                        ""
                        }

                        {finalAPIMessagePossitive !== "" ? 
                            <>
                                <div className={style.api_res_div}>
                                    <div className={style.api_res_div_msg}>
                                        {this.setTime("finalAPIMessagePossitive")}
                                        <h3 className={style.api_possitive}>{lang === "EN" ? finalAPIMessagePossitive : "Επιτυχία Δημοιουργίας Λογαριασμού!"}</h3>
                                        
                                        
                                        <div className={style.progress_bar_cont}>
                                            <div className={style.progress_bar}></div>
                                        </div>
                                    </div> 
                                    <button onClick={() => { this.setState({ finalAPIMessagePossitive: "" }) }}>
                                        <span id={style.img}><Image src={TICK} alt="Success Icon" /></span>
                                        <span id={style.right}></span>
                                        <span id={style.left}></span>
                                    </button>
                                </div>
                                <div className={style.api_res_div_mobile} onClick={() => { this.setState({ finalAPIMessagePossitive: "" }) }}>
                                    <h3 className={style.api_possitive}>{lang === "EN" ? finalAPIMessagePossitive : "Επιτυχία Δημοιουργίας Λογαριασμού!"}</h3>
                                    <div className={style.progress_bar_cont_mobile}>
                                        <div className={style.progress_bar_mobile}></div>
                                    </div>
                                </div>
                            </>
                        : 
                        ""
                        }

                        <div className={style.input_div_form}>
                            <label htmlFor="username">Username:</label>
                            <div className={style.input_wrapper}>
                                <input type="text" placeholder="Username..." name="username" id="username" onChange={this.handleOnChangeInput} tabIndex="1" className={username !== "" && (usernameValidationMessage === "Username already taken!" || usernameRegex) ? `${style.red_input}` : ""}/>
                                <span className={username !== "" && (usernameValidationMessage === "Username already taken!" || usernameRegex) ? `${style.img_wrapper} ${style.red_box}` : style.img_wrapper}><Image src={USERICON} alt="User Icon" /></span>
                            </div>
                            <div className={style.display_errors}>
                                <small className={usernameValidationMessage === "Username already taken!" ? style.small_red : style.small_d_none}>{username === "" ? "" : username !== "" && usernameRegex ? "" : usernameValidationMessage}</small>
                                <small className={style.small_red}>{usernameRegex && username !== "" ? lang === "EN" ? "Username can only contain lowercase charachters and numbers!" : "Τα username πρέπει να περιέχουν μόνο χαρακτήρες και νούμερα!" : ""}</small>
                            </div>
                        </div>
                        <div className={style.input_div_form}>
                            <label htmlFor="email">E-mail:</label>
                            <div className={style.input_wrapper}>
                                <input type="email" placeholder="E-mail..." name="email" id="email" onChange={this.handleOnChangeInput} tabIndex="2" className={email !== "" && (emailValidationMessage === "Email already taken!" || emailRegex) ? `${style.red_input}` : ""} />
                                <span className={email !== "" && (emailValidationMessage === "Email already taken!" || emailRegex) ? `${style.img_wrapper} ${style.red_input}` : style.img_wrapper}><Image src={EMAILICON} alt="Envelope Icon" /></span>
                            </div>
                            <div className={style.display_errors}>
                                <small className={emailValidationMessage === "Email already taken!" ? style.small_red : style.small_d_none}>{email === "" ? "" : emailValidationMessage}</small>
                                <small className={style.small_red}>{emailRegex && email !== "" ? lang === "EN" ? "This does not seem like a valid e-mail address!" : "Εισάγεται μια έγγυρη διέυθηνση e-mail!" : ""}</small>
                            </div>
                        </div>
                        <div className={style.input_div_form}>
                            <label htmlFor="fname">{lang === "EN" ? "Full Name:" : "Ονοματεπώνιμο:" }</label>
                            <div className={style.input_wrapper}>
                                <input type="text" placeholder="Full name..." name="fname" id="fname" onChange={this.handleOnChangeInput} tabIndex="3" className={fname !== "" && fnameRegex ? `${style.red_input}` : ""} />
                                <span className={fname !== "" && fnameRegex ? `${style.img_wrapper} ${style.red_input}` : style.img_wrapper}><Image src={IDCARD} alt="Envelope Icon" /></span>
                            </div>
                            <div className={style.display_errors}>
                                <small className={style.small_red}>{fnameRegex && fname !== "" ? lang === "EN" ? "Full names must contain only upper and lower case characters!" : "Τα ονοματεπώνιμα πρέπει να περιέχουν μόνο χαρακτήρες!" : ""}</small>
                            </div>
                        </div>
                        <div className={style.input_div_form}>
                            <label htmlFor="dateOfBirth">{lang === "EN" ? "Age:" : "Ηλικία:"}</label>
                            <div className={style.input_wrapper}>
                                <input type="number" placeholder="Age..." min="1" max="100" name="dateOfBirth" id="dateOfBirth" onChange={this.handleOnChangeInput} tabIndex="4" className={dateOfBirth !== "" && ageValidation ? `${style.red_input}` : ""} />
                                <span className={dateOfBirth !== "" && ageValidation ? `${style.img_wrapper} ${style.red_input}` : style.img_wrapper}><Image src={AGE} alt="Envelope Icon" /></span>
                            </div>
                            <div className={style.display_errors}>
                                <small className={style.small_red}>{ageValidation && dateOfBirth !== "" ? lang === "EN" ? "Your age must be between 1 and 100" : "Η ηλικία σου πρέπει να είναι απο 1 έως 100" : ""}</small>
                            </div>
                        </div>
                        <div className={style.input_div_form}>
                            <label htmlFor="pwd">{lang === "EN" ? "Password:" : "Κωδικός:" }</label>
                            <div className={style.input_wrapper}>
                                <input type="password" placeholder="Password..." name="pwd" id="pwd" onChange={this.handleOnChangeInput} tabIndex="5" />
                                <button onClick={this.handlePasswordSee} type="button" className={style.img_wrapper}>
                                    {visiblePass ? <Image src={EYECROSSED} alt="Eye Icon Crossed" /> : <Image src={EYE} alt="Eye Icon" />}
                                </button>
                            </div>
                            <div className={style.display_errors}>
                                {pwd !== "" ?
                                <>
                                    <small className={pwd8Char ? style.small_d_none : style.small_red}>{lang === "EN" ? "Password must contain at least 8 charachters and less than 30 charachters" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες και λιγότερους απο 30!"}</small>
                                    <small className={pwdUpperAndLowerCase ? style.small_d_none : style.small_red}>{lang === "EN" ? "Pssword must contain at least 1 uppercase and 1 lowercase charachter" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 καιφαλέο και ένα πεζό χαρακτήρα!"}</small>
                                    <small className={pwd1Symbol ? style.small_d_none : style.small_red}>{lang === "EN" ? "Password must contain at least 1 symbol" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 σύμβολο!"}</small>
                                    <small className={pwd1Number ? style.small_d_none : style.small_red}>{lang === "EN" ? "Password must contain at least 1 number" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 αριθμό!"}</small>
                                </>
                                : 
                                ""
                                }
                            </div>
                        </div>
                        {/* {pwd8Char && pwdUpperAndLowerCase && pwd1Number && pwd1Symbol ?  */}
                        <div className={style.input_div_form}>
                            <label htmlFor="pwd_re">{lang === "EN" ? "Repeat Password:" : "Επανάληψη Κωδικού:"}</label>
                            <div className={style.input_wrapper}>
                                <input type="password" placeholder="Repeat Password..." name="pwd_re" id="pwd_re" onChange={this.handleOnChangeInput} tabIndex="6" />
                                <button onClick={this.handlePasswordSeeRe} type="button" className={style.img_wrapper}>
                                    {visiblePassRe ? <Image src={EYECROSSED} alt="Eye Icon Crossed" /> : <Image src={EYE} alt="Eye Icon" />}
                                </button>
                            </div>
                            <div className={style.display_errors}>
                                {pwd_re !== "" ? 
                                    <small className={passwordsMustMatch ? style.small_d_none : style.small_red}>{lang === "EN" ? "Passwords must match!" : "Οι κωδικοί πρέπει να τεριάζουν!"}</small>
                                : 
                                "" 
                                }
                            </div>
                        </div>
                        {/* : 
                        ""
                        } */}
                        {/* {pwd8Char && pwdUpperAndLowerCase && pwd1Number && pwd1Symbol && passwordsMustMatch && !ageValidation && !fnameRegex && !emailRegex && !usernameRegex ?  */}
                        <div className={style.submit}>
                            <p>
                                {lang === "EN" ? 
                                <>
                                    Already have an account? <Link href="/signin">Sign in here!</Link>
                                </>
                                :
                                <>
                                    Υπάρχει ήδη λογαριασμός; <Link href="/signin">Συνδέσου εδώ!</Link>
                                </>
                                }
                            </p>
                            <button type="submit">{lang === "EN" ? "Sign Up" : "Εγγραφή"}</button>
                        </div>
                        {/* // : "" } */}
                    </form>
                </section>
            </main>
        )
    }
}
