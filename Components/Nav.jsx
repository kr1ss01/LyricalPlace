import React, { Component } from 'react';
import style from '../styles/Nav.module.scss';
import Link from 'next/link';
import AuthContext from './Context';
import Image from 'next/image';

// SVG 
import GREEK from '../SVG/greece_24.png';
import ENGLISH from '../SVG/english_24.png';

export default class Nav extends Component {

    state = {
        search: "",
    }

    handleSubmition = (e) => {
        e.preventDefault();
    } 

    handleOnChange = (e) => {
        this.setState({
            [`${e.target.name}`]: e.target.value
        })
    }

    render() {
        const {userData, isAuth, logOut, lang, changeLang, dropDown, handleDropDown } = this.context;
        return (
            <>
                <nav className={style.nav} role="heading" aria-level={1}>
                    <div className={style.nav_top_stripe}>
                        <div className={style.nav_width}>
                            <div className={style.perspective}>
                                <div className={style.logo_cont} role={"banner"}>
                                    <Link href="/#">Lyrical Place</Link>
                                </div>
                            </div>
                            <div className={style.log_in_out_cont} role={"navigation"} aria-label={"Main Navigation On Navbar"}>
                                {isAuth ? 
                                    <Link href={`/${userData.uid}`} role={"link"}>
                                            <span id={style.welcome}>{lang === "EN" ? "Welcome" : "Καλώς ήρθατε"} {userData.uid}</span>
                                            {/* <span id={style.profile}>{lang === "EN" ? "Profile" : "Προφίλ"}</span> */}
                                    </Link> 
                                    
                                    : <Link href="/signup" role={"link"}>{lang === "EN" ? "Sign Up" : "Εγγραφή"}</Link>}
                                {isAuth? <button role={"button"} onClick={logOut} id={style.btn_log_out}>{lang === "EN" ? "Log Out" : "Αποσύνδεση"}</button> : <Link href="/signin" role={"link"}>{lang === "EN" ? "Sgin In" : "Σύνδεση"}</Link>}
                                {lang === "GR" ? 
                                    <button role={"button"} onClick={changeLang} className={style.flag}><Image src={GREEK} alt='Greek Flag Icon' /></button> 
                                : 
                                    <button role={"button"} onClick={changeLang} className={style.flag}><Image src={ENGLISH} alt='Englad Flag Icon' /></button>
                                }
                                {/* <button role={"button"} onClick={changeLang} className={lang === "GR" ? `${style.greek_flag}` : `${style.en_flag}`}>{lang}</button> */}
                                <button className={dropDown ? `${style.mobile_btn_nav} ${style.mobile_btn_nav_animation}` : `${style.mobile_btn_nav}`} onClick={handleDropDown} role={"checkbox"}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={style.nav_bot_stripe}>
                        <div className={style.nav_width}>
                            <ul className={style.nav_ul} role="navigation" aria-label={"Desktop Mobile Navigation"}>
                                <li>
                                    <Link href="/explore" role={"link"}>{lang === "EN" ? "Explore" : "Εξερεύνηση"}</Link>
                                </li>
                                <li>
                                    <Link href="/trendings" role={"link"}>{lang === "EN" ? "Trendings" : "Τάσεις"}</Link>
                                </li>
                                <li>
                                    <Link href="/playlists" role={"link"}>Playlists</Link>
                                </li>
                                <li>
                                    <Link href="/suggestions" role={"link"}>{lang === "EN" ? "Suggestions" : "Προτάσεις"}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                {dropDown ? 
                    <header className={style.mobile_drop_down} id="mobile">
                        <div className={!isAuth ? `${style.mobile_top} ${style.mobile_top_a}` : `${style.mobile_top}`}>
                            {isAuth ? <p>{lang === "EN" ? "Welcome" : "Καλώς ήρθατε"} {userData.uid}</p> : <Link href="/signup" >{lang === "EN" ? "Sign Up" : "Εγγραφή"}</Link>}
                            {!isAuth ? <Link href="/signin" >{lang === "EN" ? "Sgin In" : "Σύνδεση"}</Link> : ""}
                        </div>
                        <div className={style.hr}></div>
                        <ul className={style.nav_ul_mobile} role="navigation" aria-label={"Mobile Navigation Menu"}>
                            {isAuth ?
                                <li>
                                    <Link href={`/${userData.uid}`} role={"link"}>{lang === "EN" ? "Profile" : "Προφίλ"}</Link>
                                </li>
                                : 
                                ""
                            }
                            <li>
                                <Link href="/explore" role={"link"}>{lang === "EN" ? "Explore" : "Εξερεύνηση"}</Link>
                            </li>
                            <li>
                                <Link href="/trendings" role={"link"}>{lang === "EN" ? "Trendings" : "Τάσεις"}</Link>
                            </li>
                            <li> 
                                <Link href="/playlists" role={"link"}>Playlists</Link>
                            </li>
                            <li>
                                <Link href="/suggestions" role={"link"}>{lang === "EN" ? "Suggestions" : "Προτεινόμενα"}</Link>
                            </li>
                        </ul>
                        {isAuth ?
                            <div className={style.log_out_cont_mobile} role={"button"}>
                                <button onClick={logOut} id={style.btn_log_out} role={"button"}>{lang === "EN" ? "Log Out" : "Αποσύνδεση"}</button>
                            </div>
                        : ""}
                    </header>
                : "" }
            </>
        )
    }
}

Nav.contextType = AuthContext;
