import { Component } from 'react';
import style from '../styles/SuggestPage.module.scss';
import AuthContext from '../Components/Context';
import Meta from '../Components/Meta';
import Image from 'next/image';
import Spinner from '../Components/Spinner';
import Sugg from '../Components/Sugg';

// SVG
import MIC from '../SVG/mic_24_black.png';
import WAVE from '../SVG/sound_wave_24_black.png';
import STAR from '../SVG/start_24_black.png';
import LIKE from '../SVG/like_white_24.png';

export default class suggestions extends Component {
    static contextType = AuthContext;

    state = {
        author: "",
        title: "",
        fts: "",
        randomID: 0,
        isLoading: false,
        resMessage: "",
    }

    componentDidMount() {
        // Initialize Form To Display None
        const form = document.getElementById('suggestions_form');
        form.style.display = 'none';
    }

    async postData(data) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/suggestions/upload`;
            let result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const res = await result.json();

            this.setState({
                isLoading: false
            })

            if (result.status == 201) {
                this.setState({
                    resMessage: res.message,
                    author: "",
                    title: "",
                    fts: "",
                })    
            } else {
                this.setState({
                    resMessage: res.message
                })  
            }

            return 0;
        }catch (e) {
            console.warn(e)
        }

        return 1;

    }

    handleSubmition = (e) => {
        e.preventDefault();

        // Reset State
        this.setState({
            isLoading: false,
            resMessage: "",
        })

        // Context Objects
        const { userData, isAuth } = this.context;

        if (isAuth) {

            // State Objects
            const { author, title, fts } = this.state;
    
            if ( author != "" && title != "" ) {
                // Set Loading
                this.setState({
                    isLoading: true,
                })

                // Initialize Object
                const date = this.dateHandler();
                const sender = {
                    email: userData.email,
                    uid: userData.uid,
                    date: date,
                    title: title,
                    author: author,
                    fts: fts
                }

                // API Call
                this.postData(sender);
            }

        } else {
            return null;
        }
    }

    // Display Date In Readable Format and Convert it in a <String> type variable
    dateHandler = () => {
        const date = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dateNow = `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        return dateNow;
    }

    // Handle Animation
    handleAnimations = (origin) => {
        const { isAuth } = this.context;
        if (isAuth) {
            const form = document.getElementById('suggestions_form');
            const div = document.getElementById('suggestions_main');
            if (origin == "form") {
        
                form.classList.toggle(style.animation_form);
                div.classList.remove(style.animation_form);
        
                setTimeout(() => {
                    form.style.display = "none ";
                    div.style.display = "block ";
                }, 350);
    
            } else {
    
                div.classList.toggle(style.animation_form);
                form.classList.remove(style.animation_form);
    
                setTimeout(() => {
                    div.style.display = "none ";
                    form.style.display = "block ";
                }, 350);
    
            }
        }
    }

    // HANDLE ON CHANGE EVENTS FROM INPUTS
    handleOnChangeInput = (event) => {
        this.setState({
            [`${event.target.name}`]: event.target.value
        });
    }


    render() {
        const { userData, isAuth, lang } = this.context;
        const { author, title, fts, randomID, isLoading } = this.state;
        const { data, message } = this.props;
        return (
            <main className={style.sugg}>
                <Meta 
                    title={"Suggestions"}
                    keywords={"suggestion, sugg, suggest, lyrics, upvote"}
                    description={"Suggest us songs to write lyrics for you! You can also see the suggestions of other users and upvote for them."}
                    page_topic={"Suggestions"}
                />
                <section className={style.box_sugg} id='suggestions_main'>
                    <h1 className={style.main_h1}><span>{lang == "EN" ? "Current Suggestions" : "Τρέχουσες Προτάσεις"}</span></h1>
                    <h1 className={style.breakpoint_h1}>{lang == "EN" ? "Current Suggestions" : "Τρέχουσες Προτάσεις"}</h1>
                    <div className={style.info_sugg}>
                        {lang === "EN" ?
                        <p>
                            Here members from our community can suggest songs they like and want to see the lyrics of. We will make anything we can to provide lyrics for this song as soon as possible. 
                            <br />
                            Members can also upvote a suggestion they might like and want to see, to make the admins review it faster. 
                        </p>
                        : 
                        <p>
                            Εδώ μπορείς να προτείνεις τραγούδια που θα ήθελες να δείες τους στίχους τους. Θα κάνουμε ό,τι μπορούμε για να φέρουμε στην σελίδα τους στίχους απ' το αγαπημένο σου τραγούδι.
                            <br />
                            Τα μέλη της σελίδας μπορούν επίσης να κάνουν λάικ σε Τρέχουσες Προτάσεις άλλων χρηστών, έτσι ώστε οι διαχειριστές να το δούν γρηγορότερα.
                        </p>
                        }
                    </div>
                    {message != 200 || data.length < 1 ? 
                        <div className={style.no_active_suggestions}>
                            <p className={style.par}>
                                {lang == "EN" ? 
                                    "Currenty there are no active suggestions!"
                                    :
                                    "Δεν υπάρχουν ενεργές προτάσεις προς το παρόν"
                                }
                            </p>
                            <button type='button' className={style.btn} onClick={() => this.handleAnimations("div")} disabled={isAuth ? false : true}>{lang == "EN" ? "Make A Suggestion" : "Κάνε Μια Πρόταση"}</button>
                        </div>
                    : 
                        <>
                            {data.map((item, key) => {
                                return (
                                    <Sugg id={key} key={key} post={item} />
                                )
                            })}
                            {isAuth ?
                                <button type='button' className={style.change_btn} onClick={() => this.handleAnimations("div")} disabled={isAuth ? false : true}>{lang == "EN" ? "Make A Suggestion" : "Κάνε Μια Πρόταση"}</button>
                            : "" }
                        </> 
                    }
                </section>
                <form id='suggestions_form' onSubmit={this.handleSubmition}>
                    <h1><span>{lang == "EN" ? "Make A Suggestion" : "Κάνε Μια Πρόταση" }</span></h1>
                    <button type='button' className={style.preview_btn} onClick={() => this.handleAnimations("form")} disabled={isAuth ? false : true}>{lang == "EN" ? "Suggestions" : "Προτάσεις"}</button>
                    <div className={style.form_inputs}>
                        <div className={style.input_wrap}>
                            <input type="text" placeholder={lang === "EN" ? 'Author' : 'Τραγουδιστής'} id='author' name='author' onChange={this.handleOnChangeInput} />
                            <span className={style.img_wrap}><Image src={MIC} alt='Microphone Icon' /></span>
                        </div>
                        <div className={style.input_wrap}>
                            <input type="text" placeholder={lang === "EN" ? 'Title' : 'Τίτλος'} id='title' name='title' onChange={this.handleOnChangeInput} />
                            <span className={style.img_wrap}><Image src={WAVE} alt='Microphone Icon' /></span>
                        </div>
                        <div className={style.input_wrap}>
                            <input type="text" placeholder={lang === "EN" ? 'Fts' : 'Συμμετοχές'} id='fts' name='fts' onChange={this.handleOnChangeInput} />
                            <span className={style.img_wrap}><Image src={STAR} alt='Microphone Icon' /></span>
                        </div>
                    </div>
                    <div className={style.preview_sugg}>
                        <h4>{lang == "EN" ? "Preview" : "Προεπισκόπηση"}:</h4>
                        <div id={style.preview}>
                            <span id={style.ranID}>{randomID}</span> 
                            <span>-- </span>
                            <span> {lang == "EN" ? " By" : " Από"} <b>{userData.uid}</b></span>
                            <span className={style.vertical}></span>
                            <span>{author} {author != "" && title != "" ? "-" : ""} {title} {fts != "" ? `ft. ${fts}` : "" } (DD/MM/YY H:M)</span>
                            <span className={style.vertical} id={style.vertical_right}></span>
                            <button disabled={isLoading ? true : false}>
                                {isLoading ?
                                    <Spinner/>
                                :
                                    <Image src={LIKE} alt='Like Icon' />
                                }
                            </button>
                        </div>
                    </div>
                    <button type='submit' disabled={isAuth ? false : true}>{lang == "EN" ? "Upload" : "Δημοσίευση"}</button>
                </form>
            </main>
        )
    }
}

export async function getStaticProps(context) {
    const res = await fetch(`${process.env.PROXY}api/suggestions/retrieve`);
  
    const data = await res.json();
  
    return {
      props: {
        data: data.posts,
        message: res.status
      }
    }
}


