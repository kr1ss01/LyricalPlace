import { Component } from 'react';
import Meta from '../Components/Meta';
import style from '../styles/SignIn.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import Spinner from '../Components/Spinner';
import AuthContext from '../Components/Context';

// SVG
import USERICON from '../SVG/user_icon.png';
import EYE from '../SVG/eye_icon.png';
import EYECROSSED from '../SVG/eye_crossed_icon.png';
import EXCLAMATION from '../SVG/exclam_icon.png';
import TICK from '../SVG/tick_icon.png';

export default class signin extends Component {
    static contextType = AuthContext;

    state = {
        userData: "",
        username: "",
        pwd: "",
        loader: false,
        fillAllFields: false,
        succesLogIn: false,
        finalAPIMessageNegative: "",
        finalAPIMessagePossitive: "",
    }

    // Component Did Mount Handles Navbar Extension On Mobile Devices. It retracts it if user navigated here through this navbar.
    componentDidMount() {
        if (this.context.dropDown) {
            this.context.handleDropDown();
        }
    }

    // Redirect
    redirect = () => {
        Router.push('/');
    }

    async postData(data) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/login`;
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
                return;
            } else if (result.status === 200) {
                this.setState({
                    finalAPIMessagePossitive: dataJSON.message,
                    loader: false,
                    succesLogIn: true,
                    userData: dataJSON.userData
                })
                 localStorage.setItem('en34dfgP0#ti!', JSON.stringify(dataJSON.userData)); // User Data
                //  localStorage.setItem('567da65d88d4c0b66f8c417b1ec273e2', JSON.stringify(dataJSON.token)); // Token
                 this.context.logIn(dataJSON.userData);
                 return;
            } else {
                this.setState({
                    finalAPIMessageNegative: dataJSON.message,
                    loader: false,
                })
                return;
            }

        } catch (e) {
            console.warn(e);
        }

    }

    // Handle Submition
    handleSubmition = (e) => {
        e.preventDefault();

        this.setState({
            loader: false,
            fillAllFields: false
        })

        const { pwd, username } = this.state;

        if (username !== "" && pwd !== "") {
            const data = {
                username: username,
                password: pwd
            }
            this.setState({
                loader: true
            })
            this.postData(data);
            return null;
        } else {
            this.setState({
                fillAllFields: true
            })
            return null;
        }

    }

    // Password Visibility Handler
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

    // Set Propert To False After 4000 ms
    setTimeFalse = (property) => {
        setTimeout(() => {this.setState({ [`${property}`]: false })}, 4000);
        if (property === "succesLogIn") {
            setTimeout(() => {
                this.redirect();
            }, 4000);
        }
    }
    setTime = (property) => {
        setTimeout(() => {this.setState({ [`${property}`]: "" })}, 4000);
    }

    // HANDLE ON CHANGE EVENTS FROM INPUTS
    handleOnChangeInput = (event) => {
        this.setState({
            [`${event.target.name}`]: event.target.value
        });
    }

    render() {

        const { visiblePass, fillAllFields, loader, succesLogIn, finalAPIMessageNegative } = this.state;
        const { isAuth, lang } = this.context;

        return (
            <main className={style.signin_main}>
                {isAuth ? this.redirect() : ""}
                <Meta title="Sign In" page_topic="Sign-in" />
                <h1>{lang === "EN" ? "Sign In to Lyrical Place" : "Συνδέσου στο Lyrical Place"}</h1>
                <h2>{lang === "EN" ? "Explore a new world full of lyrics and fun!" : "Εξερέυνησε έναν κόσμο γεμάτο απο στοίχους και διασκέδαση!"}</h2>
                <section>
                    <form className={style.sign_up_form} onSubmit={this.handleSubmition}>
                        <h3>{lang === "EN" ? "A Lyric Paradise To Explore" : "Ένας στοιχουργικός παράδισος για να ανακαλύψεις!"}</h3>
                        {loader ? 
                            <div className={style.spinner_box}>
                                <Spinner />
                            </div>
                        : ""}
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
                        : ""}

                        {succesLogIn ? 
                            <>
                                {this.setTimeFalse("succesLogIn")} 
                                <div className={style.api_res_div}>
                                    <div className={style.api_res_div_msg}>
                                        <h3 className={style.api_negative}>{lang === "EN" ? "Authentication Success. Redirecting!" : "Επιτιχής Αυθεντικοποίηση - Επανακατεύθηνη!"}</h3>
                                        
                                        
                                        <div className={style.progress_bar_cont}>
                                            <div className={style.progress_bar}></div>
                                        </div>
                                    </div> 
                                    <button onClick={() => { this.setState({ succesLogIn: false }) }}>
                                        <span id={style.img}><Image src={TICK} alt="Success Icon" /></span>
                                        <span id={style.right}></span>
                                        <span id={style.left}></span>
                                    </button>
                                </div>
                                <div className={style.api_res_div_mobile} onClick={() => { this.setState({ succesLogIn: false }) }}>
                                    <h3 className={style.api_negative}>{lang === "EN" ? "Authentication Success. Redirecting!" : "Επιτιχής Αυθεντικοποίηση - Επανακατεύθηνη!"}</h3>
                                    <div className={style.progress_bar_cont_mobile}>
                                        <div className={style.progress_bar_mobile}></div>
                                    </div>
                                </div>
                            </>
                        : ""}

                        {finalAPIMessageNegative !== "" ? 
                            <>
                                <div className={style.api_res_div}>
                                    <div className={style.api_res_div_msg}>
                                        {this.setTime("finalAPIMessageNegative")}
                                        <h3 className={style.api_negative}>{finalAPIMessageNegative}</h3>
                                        
                                        
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
                                    <h3 className={style.api_negative}>{finalAPIMessageNegative}</h3>
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
                                <input type="text" placeholder="Username..." name="username" id="username" onChange={this.handleOnChangeInput} tabIndex="1"/>
                                <span className={style.img_wrapper}><Image src={USERICON} alt="User Icon" /></span>
                            </div>
                        </div>
                        <div className={style.input_div_form}>
                            <label htmlFor="pwd">{lang === "EN" ? "Password:" : "Κωδικός:"}</label>
                            <div className={style.input_wrapper}>
                                <input type="password" placeholder="Password..." name="pwd" id="pwd" onChange={this.handleOnChangeInput} tabIndex="2" />
                                <button onClick={this.handlePasswordSee} type="button" className={style.img_wrapper}>
                                    {visiblePass ? <Image src={EYECROSSED} alt="Eye Icon Crossed" /> : <Image src={EYE} alt="Eye Icon" />}
                                </button>
                            </div>
                        </div>

                        <div className={style.submit}>
                            <p>
                                {lang === "EN" ? 
                                    <>
                                        Don't have an account? <Link href="/signup">Sign up here!</Link>
                                    </>
                                    :
                                    <>
                                        Δέν έχεις λογαριασμό; <Link href="/signup">Εγγράψου εδώ!</Link>
                                    </>
                                    }
                            </p>
                            <button type="submit">{lang === "EN" ? "Sign In" : "Σύνδεση"}</button>
                        </div>
                    </form>
                    <div className={style.flap_right}>
                        <div className={style.logo_span}>Lyrical Place</div>
                        <div className={style.hr}></div>
                        <header>{lang === "EN" ? "Welcome Back!" : "Καλως ήρθατε"}</header>
                        <p>
                            {lang === "EN" ? 
                                "Sign in and explore the magic world of lyrics! Search among thousand of lyrics and find what you need exactly! If you don't you can always make a suggestion and we will make anything we can to upload it as soon as possible!"
                            : 
                                "Συνδέσου και ανακάλυψε την μαγία απο τον κόσμο των στοιχών! Ψάξε ανάμεσα σε χιλιάδες στοιχούς απο τραγούδια που αγαπάς και βρές αυτό που θες ακριβώς! Αν δεν το βρέις μπορέις πάντα να το προτεινείς και θα κανούμε το καλύτερο που μπορούμε για να το αναρτήσουμε!"
                            }
                        </p>
                    </div>
                </section>
            </main>
        )
    }
}
