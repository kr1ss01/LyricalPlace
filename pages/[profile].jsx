import { Component } from 'react';
import style from '../styles/Profile.module.scss';
import AuthContext from '../Components/Context';
import Spinner from '../Components/Spinner';
import MessageHandler from '../Components/MessageHandler';
import SuggCont from '../Components/SuggCont';
import Meta from '../Components/Meta';
import Recomendations from '../Components/Recomendations';
import LyricalPlaceAnimationSVG from '../Components/LyricalPlaceAnimationSVG';
import Custom404 from './404';
import Link from 'next/link';
import Image from 'next/image';

import ARROW from '../SVG/arrow_white_24.png';
import SqueareAnimation from '../Components/SqueareAnimation';

export default class profile extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            fav_index: 0,
            sugg_index: 0,
            loader_fav: false,
            fav_post: this.props.fav_post == null ? [] : this.props.fav_post,
            old_email: "",
            new_email: "",
            re_new_email: "",
            old_pwd: "",
            new_pwd: "",
            re_new_pwd: "",
            loader_email: false,
            loader_pwd: "",
            email_msg: "",
            pwd_msg: "",
            email_taken_msg: "",
            email_taken: false,
            pwd8Char: false,
            pwd1Number: false,
            pwd1Symbol: false,
            pwdUpperAndLowerCase: false,
        }

        this.handleSuggestionDeletionConfirm = this.handleSuggestionDeletionConfirm.bind(this);
    }

    async getFav(index) {

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/lyrics/${this.props.data.user.favs[index]}`);

            const data = await res.json();

            this.setState({
                loader_fav: false,
            })

            if (res.status == 200) {
                this.setState({
                    fav_post: data.post
                })
            }

        } catch (e) {
            console.warn(e);
        }

    }

    handleFavIndex = (type) => {
        const { fav_index } = this.state;
        const fav_length = this.props.data.user.favs.length;
        const prevIndex = fav_index;

        this.setState({
            loader_fav: true,
        })

        if (type == "incr") {
            if (fav_index == fav_length - 1) {
                // Set To 0
                this.setState({
                    fav_index: 0,
                })
                this.getFav(0);
            } else {
                this.setState({
                    fav_index: prevIndex + 1,
                })
                this.getFav(this.state.fav_index + 1);
            }
        } else {
            if (fav_index == 0) {
                // Set To Max Length
                this.setState({
                    fav_index: fav_length - 1,
                })
                this.getFav(fav_length - 1);
            } else {
                this.setState({
                    fav_index: prevIndex - 1,
                })
                this.getFav(this.state.fav_index - 1);
            }
        }
    }

    async checkEmail(value) {

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/validate/email/${value}`);

            const data = await res.json();

            if (data.message == "Email already taken!") {
                this.setState({
                    email_taken: true,
                    email_taken_msg: "Email already taken...",
                })
                return null;
            } else {
                this.setState({
                    email_taken: false,
                    email_taken_msg: "",
                })
            }

        } catch (e) {
            console.warn(e);
        }
    }

    async changePwd(data) {

        try {
            console.log("Im in", this.context.userData.uid);
            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/update/password/${this.context.userData.uid}`;
            let result = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const ret = await result.json();
            console.log(ret)
            if (ret) {
                this.setState({
                    loader_pwd: false,
                    pwd_msg: ret.message
                })
            }

        } catch (e) {
            console.warn(e);
        }

    }

    async changeEmail(data) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/update/email/${this.context.userData.uid}`;
            let result = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const ret = await result.json();
 
            if (ret) {
                this.setState({
                    loader_email: false,
                    email_msg: ret.message
                })
            }

        } catch (e) {
            console.warn(e);
        }

    }

    handlePwdSubmition = (event) => {
        event.preventDefault();

        this.setState({
            loader_pwd: true,
            pwd_msg: "",
        })

        const { new_pwd, old_pwd, re_new_pwd } = this.state;

        if (new_pwd == "" || old_pwd == "" || re_new_pwd == "") {
            this.setState({
                loader_pwd: false,
                pwd_msg: "Empty Fields...",
            })
            return null;
        }

        if (old_pwd == new_pwd) {
            this.setState({
                loader_pwd: false,
                pwd_msg: "Passwords can't be the same!"
            })
            return null;
        }

        if (new_pwd != re_new_pwd) {
            this.setState({
                loader_pwd: false,
                pwd_msg: "Passwords do not match!"
            })
            return null;
        }

        const pwdObj = {
            oldPwd: old_pwd,
            newPwd: new_pwd,
        }

        this.changePwd(pwdObj);
    }

    handleEmailSubmition = (event) => {
        event.preventDefault();

        this.setState({
            loader_email: true,
            email_msg: "",
        })

        const { new_email, old_email, re_new_email, email_taken } = this.state;

        if (new_email == "" || old_email == "" || re_new_email == "") {
            this.setState({
                loader_email: false,
                email_msg: "Empty Fields...",
            })
            return null;
        }

        if (new_email != re_new_email) {
            this.setState({
                loader_email: false,
                email_msg: "Emails do not match!"
            })
            return null;
        }

        if (new_email == old_email) {
            this.setState({
                loader_email: false,
                email_msg: "Emails can't be the same!"
            })
            return null;
        }

        if (email_taken) {
            this.setState({
                loader_email: false,
                email_msg: "New email already in use!"
            })
            return null;
        }

        const emailObj = {
            oldEmail: old_email,
            email: new_email,
        }

        this.changeEmail(emailObj);
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

    handleSuggestions = (type) => {
        const { sugg_index } = this.state; // Get Index
        const { suggs } = this.props.suggestions; // Get Suggestions

        if (type == "incr") {
            if (sugg_index === suggs.length - 1) {
                this.setState({
                    sugg_index: 0,
                })
            } else {
                this.setState({
                    sugg_index: this.state.sugg_index + 1,
                })
            }
        } else {
            if (sugg_index === 0) {
                this.setState({
                    sugg_index: suggs.length - 1,
                })
            } else {
                this.setState({
                    sugg_index: this.state.sugg_index - 1,
                })
            }
        }
    }

    async handleSuggestionDeletionFinal (sID) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/suggestions/delete/${sID}`;
            let result = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                }
            })

            const data = await result.json();
 
            if (result.status == 200) {
                console.log(data)
            }

        } catch (e) {
            console.warn(e);
        }
    }

    handleSuggestionDeletionConfirm = (sID) => {
        let ans = confirm("Are you sure you want to delete this suggestion?");

        if (ans) {
            this.handleSuggestionDeletionFinal(sID);
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
        if (event.target.name === "new_email") {
            this.checkEmail(event.target.value);
        }
        if (event.target.name === "new_pwd") {
            this.handlePasswordValidation(event.target.value);
        }
    }

    render() {
        const { lang, userData, isAuth } = this.context;
        const { user } = this.props.data;
        const { profile } = this.props.context;
        const { fav_index, fav_post, loader_email, email_msg, new_pwd, pwd1Number, pwd1Symbol, pwd8Char, pwdUpperAndLowerCase, pwd_msg, loader_pwd, sugg_index } = this.state;
        const { suggs } = this.props.suggestions;
        const { docs } = this.props.recomendations;
        // Authentication Chech
        if (profile != userData.uid || !isAuth) {
        // if (!isAuth) {
            return (
                <Custom404 />
            )
        } else {
            // Return Page
            return (
                <main className={style.profile}>
                    <Meta 
                        title={`${profile} Profile`}
                        description={"Here you can see your profile, favouarite songs, recomendations, suggestions you made and change your password and email address."}
                        page_topic={"Profile"}
                        keywords={"profile, change, password, email, suggestions, delete, my"}
                    />
                    <h1 className={style.main_h1}><span>{lang == "EN" ? `${user.username} Profile` : `Το Προφίλ Του ${user.username}`}</span></h1>
                    <h1 className={style.breakpoint_h1}>{lang == "EN" ? `${user.username} Profile` : `Το Προφίλ Του ${user.username}`}</h1>
                    <section className={style.grid_profile}>
                        <div className={user.favs.length == 0 ? `${style.favouarites} ${style.cancel_favs}` : `${style.favouarites}`}>
                            {user.favs.length == 0 ? 
                                <div className={style.no_favs}>
                                    <h3>{lang == "EN" ? "You have no favouarites at this moment..." : "Δεν έχεις αγαπημένα τραγούδια αυτή την στιγμή..."}</h3> 
                                    <Link href={"/explore"}>{lang == "EN" ? "Explore New Songs" : "Εξερεύνησε Νέα Τραγούδια"}</Link>
                                </div>
                            :
                                <>
                                    {fav_post != [] ? 
                                    <div className={style.fav_card_wrapp}>
                                        <h3>{lang === "EN" ? "Your Favouarites" : "Τα αγαπημένα σου"}</h3>
                                        <div className={style.card_out}>
                                            {/* <button id={style.left_arrow} className={style.card_btns} onClick={() => this.handleFavIndex("decr")}><Image src={ARROW} alt='Arrow Icon Left' /></button> */}
                                            <Link href={`/songs/${fav_post[0].singer}/${fav_post[0].title}`}>
                                                <div className={style.card_fav_main}>
                                                    <div className={style.img_wrap}>
                                                        <Image src={`https://img.youtube.com/vi/${fav_post[0].thumbnailURL}/mqdefault.jpg`} alt={`${fav_post[0].title}`} width={320} height={180} layout='fixed' priority={true} />
                                                        <div className={style.content}>
                                                            <p>[{fav_post[0].lang} - {fav_post[0].genre}]</p>
                                                            <p>{fav_post[0].title} - {fav_post[0].singer} {fav_post[0].fts != "" ? `ft. ${fav_post[0].fts}` : ""}</p>
                                                            <p>({fav_post[0].album})</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {/* <button className={style.card_btns} onClick={() => this.handleFavIndex("incr")}><Image src={ARROW} alt='Arrow Icon Right' /></button> */}
                                        </div>
                                        {/* <div className={style.card_index}>
                                            <p>{fav_index + 1} of {user.favs.length}</p>
                                        </div> */}
                                        <div className={style.card_index_breakpoint}>
                                            <button id={style.left_arrow} className={style.card_btns_breakpoint} onClick={() => this.handleFavIndex("decr")}><Image src={ARROW} alt='Arrow Icon Left' /></button>
                                            <p>{fav_index + 1} of {user.favs.length}</p>
                                            <button className={style.card_btns_breakpoint} onClick={() => this.handleFavIndex("incr")}><Image src={ARROW} alt='Arrow Icon Right' /></button>
                                        </div>
                                    </div>
                                    : 
                                    ""
                                    }
                                </>
                            }
                        </div>
                        <div className={`${style.change_email} ${style.upper_breakpoint}`}>
                            <h3>{lang === "EN" ? "Change your e-mail" : "Άλλαξε το e-mail σου"}</h3>
                            <form id='email_form' onSubmit={this.handleEmailSubmition}>
                                <input type="email" placeholder={lang === "EN" ? "Current e-mail" : "Τρέχων e-mail"} name='old_email' id='old_email' onChange={this.handleOnChangeInput} />
                                <input type="email" placeholder={lang === "EN" ? "New e-mail" : "Καινούργιο e-mail"} name='new_email' id='new_email'  onChange={this.handleOnChangeInput} />
                                <input type="email" placeholder={lang === "EN" ? "Confirm new e-mail" : "Επιβεβέωση e-mail"} name='re_new_email' id='re_new_email' onChange={this.handleOnChangeInput} />
                            </form>
                            <div className={style.form_btn_div}>
                                {loader_email ? <Spinner radius={20} /> : ""}
                                <button form='email_form' type='submit' disabled={email_msg != "" ? true : false}>
                                    <span id={style.main_email_span}>{lang === "EN" ? "Change" : "Αλλαγή"}</span>
                                    <span id={style.secondary_email_span}>Email</span>
                                </button>
                            </div>
                            {email_msg != "" ? 
                                <>
                                    {this.setTime("email_msg")}
                                    <MessageHandler message={email_msg} />
                                </>
                            : ""}
                        </div>
                        <div className={style.breakpoint_divs}>
                            <div className={`${style.change_email} ${style.down_breakpoint}`}>
                                <h3>{lang === "EN" ? "Change your e-mail" : "Άλλαξε το e-mail σου"}</h3>
                                <form id='email_form' onSubmit={this.handleEmailSubmition}>
                                    <input type="email" placeholder={lang === "EN" ? "Current e-mail" : "Τρέχων e-mail"} name='old_email' id='old_email' onChange={this.handleOnChangeInput} />
                                    <input type="email" placeholder={lang === "EN" ? "New e-mail" : "Καινούργιο e-mail"} name='new_email' id='new_email'  onChange={this.handleOnChangeInput} />
                                    <input type="email" placeholder={lang === "EN" ? "Confirm new e-mail" : "Επιβεβέωση e-mail"} name='re_new_email' id='re_new_email' onChange={this.handleOnChangeInput} />
                                </form>
                                <div className={style.form_btn_div}>
                                    {loader_email ? <Spinner radius={20} /> : ""}
                                    <button form='email_form' type='submit' disabled={email_msg != "" ? true : false}>
                                        <span id={style.main_email_span}>{lang === "EN" ? "Change" : "Αλλαγή"}</span>
                                        <span id={style.secondary_email_span}>Email</span>
                                    </button>
                                </div>
                                {email_msg != "" ? 
                                    <>
                                        {this.setTime("email_msg")}
                                        <MessageHandler message={email_msg} />
                                    </>
                                : ""}
                            </div>
                            <div className={`${style.change_pwd} ${style.down_breakpoint}`}>
                                <h3>{lang === "EN" ? "Change your password" : "Άλλαξε τον κωδικό προσβασής σου"}</h3>
                                <form id='pwd_form' onSubmit={this.handlePwdSubmition}>
                                    <input type="password" placeholder={lang === "EN" ? "Current password" : "Τρέχων κωδικός πρόσβασης"} name='old_pwd' id='old_pwd' onChange={this.handleOnChangeInput} />
                                    <input type="password" placeholder={lang === "EN" ? "New password" : "Καινούργιο κωδικός πρόσβασης"} name='new_pwd' id='new_pwd'  onChange={this.handleOnChangeInput} />
                                    <input type="password" placeholder={lang === "EN" ? "Confirm new password" : "Επιβεβέωση κωδικός πρόσβασης"} name='re_new_pwd' id='re_new_pwd' onChange={this.handleOnChangeInput} />
                                </form>
                                <div className={style.form_btn_div}>
                                    {loader_pwd ? <Spinner radius={20} /> : ""}
                                    <button form='pwd_form' type='submit' disabled={pwd_msg != "" ? true : false}>
                                        <span id={style.main_pwd_span}>{lang === "EN" ? "Change" : "Αλλαγή"}</span>
                                        <span id={style.secondary_pwd_span}>{lang === "EN" ? "Password" : "Κωδικού" }</span>
                                    </button>
                                </div>
                                {new_pwd !== "" ?
                                    <div className={style.pwd_errors_div}>
                                        {!pwd8Char ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 8 charachters and less than 30 charachters" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες και λιγότερους απο 30!"}</p> : "" }
                                        {!pwdUpperAndLowerCase ? <p className={style.pwd_errors}>{lang === "EN" ? "Pssword must contain at least 1 uppercase and 1 lowercase charachter" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 καιφαλέο και ένα πεζό χαρακτήρα!"}</p> : "" }
                                        {!pwd1Symbol ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 1 symbol" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 σύμβολο!"}</p> : "" }
                                        {!pwd1Number ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 1 number" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 αριθμό!"}</p> : "" }
                                    </div>
                                : 
                                    ""
                                }
                                {pwd_msg != "" ? 
                                    <>
                                        {this.setTime("pwd_msg")}
                                        <MessageHandler message={pwd_msg} />
                                    </>
                                : ""}
                        </div>
                        </div>
                        <div className={`${style.change_pwd} ${style.upper_breakpoint}`}>
                            <h3>{lang === "EN" ? "Change your password" : "Άλλαξε τον κωδικό προσβασής σου"}</h3>
                            <form id='pwd_form' onSubmit={this.handlePwdSubmition}>
                                <input type="password" placeholder={lang === "EN" ? "Current password" : "Τρέχων κωδικός πρόσβασης"} name='old_pwd' id='old_pwd' onChange={this.handleOnChangeInput} />
                                <input type="password" placeholder={lang === "EN" ? "New password" : "Καινούργιο κωδικός πρόσβασης"} name='new_pwd' id='new_pwd'  onChange={this.handleOnChangeInput} />
                                <input type="password" placeholder={lang === "EN" ? "Confirm new password" : "Επιβεβέωση κωδικός πρόσβασης"} name='re_new_pwd' id='re_new_pwd' onChange={this.handleOnChangeInput} />
                            </form>
                            <div className={style.form_btn_div}>
                                {loader_pwd ? <Spinner radius={20} /> : ""}
                                <button form='pwd_form' type='submit' disabled={pwd_msg != "" ? true : false}>
                                    <span id={style.main_pwd_span}>{lang === "EN" ? "Change" : "Αλλαγή"}</span>
                                    <span id={style.secondary_pwd_span}>{lang === "EN" ? "Password" : "Κωδικού" }</span>
                                </button>
                            </div>
                            {new_pwd !== "" ?
                                <div className={style.pwd_errors_div}>
                                    {!pwd8Char ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 8 charachters and less than 30 charachters" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες και λιγότερους απο 30!"}</p> : "" }
                                    {!pwdUpperAndLowerCase ? <p className={style.pwd_errors}>{lang === "EN" ? "Pssword must contain at least 1 uppercase and 1 lowercase charachter" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 καιφαλέο και ένα πεζό χαρακτήρα!"}</p> : "" }
                                    {!pwd1Symbol ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 1 symbol" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 σύμβολο!"}</p> : "" }
                                    {!pwd1Number ? <p className={style.pwd_errors}>{lang === "EN" ? "Password must contain at least 1 number" : "Ο κωδικός πρέπει να περιέχει τουλάχιστον 1 αριθμό!"}</p> : "" }
                                </div>
                            : 
                                ""
                            }
                            {pwd_msg != "" ? 
                                <>
                                    {this.setTime("pwd_msg")}
                                    <MessageHandler message={pwd_msg} />
                                </>
                            : ""}
                        </div>
                        <div className={style.suggestions}>
                            <h3>{lang === "EN" ? "Your Suggestions" : "Οι προτάσεις σου"}</h3>
                            {suggs.length > 0 ? 
                                <div className={style.suggestions_exist}>
                                    <SuggCont sugg={suggs[sugg_index]} handleDeletion={this.handleSuggestionDeletionConfirm} /> 
                                    <div>
                                        <button className={style.nav_btns} disabled={suggs.length >= 2 ? false : true} onClick={() => this.handleSuggestions("decr")}>
                                            <span id={style.str8_left}></span>
                                            <span id={style.up_left}></span>
                                            <span id={style.down_left}></span>
                                        </button>

                                        <button className={style.nav_btns} disabled={suggs.length >= 2 ? false : true} onClick={() => this.handleSuggestions("incr")}>
                                            <span id={style.str8_right}></span>
                                            <span id={style.up_right}></span>
                                            <span id={style.down_right}></span>
                                        </button>
                                    </div>
                                </div>
                            : 
                                <div className={style.suggestions_not_exist_wrap}>
                                    <p className={style.suggestions_not_exist}>
                                        {lang === "EN" ? 
                                            "Seems like you have no suggestions yet. You can make your first one " 
                                        : 
                                            "Φαίνεται ότι δεν έχεις ακόμη προτάσεις. Μπορείς να δημιουργείσεις την πρώτη σου πρώταση για ένα τραγούδι "} 
                                        <Link href={"/suggestions"}>{lang === "EN" ? "here" : "εδώ" }</Link>
                                    </p>
                                    {/* <div className={style.suggestions_not_exist_div}>
                                        <div aria-label={"Add Suggestion"} className={style.animation_div_letters}>
                                            <div>A</div>
                                            <div>D</div>
                                            <div>D</div>
                                            <div>&nbsp;</div>
                                            <div>S</div>
                                            <div>U</div>
                                            <div>G</div>
                                            <div>G</div>
                                            <div>E</div>
                                            <div>S</div>
                                            <div>T</div>
                                            <div>I</div>
                                            <div>O</div>
                                            <div>N</div>
                                        </div>
                                    </div> */}
                                </div>
                            }
                        </div>
                        <div className={style.recomendations}>
                            <h3>{lang === "EN" ? "Don't miss out!" : "Μην το χάσεις!"}</h3>
                            <div>
                                <Recomendations list={docs} />
                            </div>
                        </div>
                    </section>
                </main>
            )
        }
    }
}

export const getStaticProps = async (context) => {
    const [ res, res_suggs, res_views ] = await Promise.all([
        fetch(`${process.env.PROXY}api/user/users/${encodeURIComponent(context.params.profile)}`),
        fetch(`${process.env.PROXY}api/suggestions/retrieve/${encodeURIComponent(context.params.profile)}`),
        fetch(`${process.env.PROXY}api/lyrics/top/views/5`),
    ])

    const [ data, data_suggs, data_views ] = await Promise.all([
        res.json(),
        res_suggs.json(),
        res_views.json(),
    ])
    // data.user.favs = [];
    if (data.user.favs.length > 0) {
        const fav = data.user.favs[0];
    
        const res_2 = await fetch(`${process.env.PROXY}api/lyrics/lyrics/${fav}`);

        const data_2 = await res_2.json();

        return {
            props: {
                data: data, 
                message: 200,
                fav_post: data_2.post,
                context: context.params,
                suggestions: data_suggs,
                recomendations: data_views,
            }
        }
    }
  
    return {
      props: {
        data: data,
        message: 200,
        fav_post: null,
        context: context.params,
        suggestions: data_suggs,
        recomendations: data_views,
      }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${process.env.PROXY}api/user/users`);

    const data = await res.json();

    const paths = data.users.map((name) => ({ params: { profile: name.toString() } }));

    return {
        paths: paths,
        fallback: 'blocking'
    }
}