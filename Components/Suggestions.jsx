import React, { Component } from 'react';
import style from '../styles/Suggestions.module.scss';
import AuthContext from '../Components/Context';
import Image from 'next/image';
import Link from 'next/link';

import ARROW from '../SVG/arrow_black_24.png';


export default class Suggestions extends Component {
    static contextType = AuthContext;

    state = {
        roller: [
            {
                thumbnailURL: "H1cEtUzJdUU",
                title: "Mufasa",
                singer: "Skam",
                fts: null,
                to: "/"
            },
            {
                thumbnailURL: "q92DWs1MwRA",
                title: "КТО УБИЛ МАРКА?",
                singer: "OXXYMIRON",
                fts: null,
                to: "/"
            },
            {
                thumbnailURL: "W8AIDvaaOVM",
                title: "Копы",
                singer: "Грибы",
                fts: null,
                to: "/"
            },
            {
                thumbnailURL: "a0mrwqQcD0w",
                title: "Oplo",
                singer: "Trannos",
                fts: "Light",
                to: "/"
            },
            {
                thumbnailURL: "aNAGTWpDQ28",
                title: "CC",
                singer: "Light",
                fts: null,
                to: "/"
            }
        ],
        index: 0,
        gen_now: "",
        data: null,
        message: "",
    }

    async componentDidMount() {
        this.handleCircles(4, this.state.index);
        this.setState({
            gen_now: this.props.categories[0]
        })
        this.getSuggestions(this.props.categories[0]);
    }

    async getSuggestions (type) {
        try {
            
                const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/genre/${type}/5`);
              
                const data = await res.json();

                if (!data) {
                  this.setState({
                    message: 500,
                  })
                  return null;
                }   
                var prevIndex = this.state.index;

                this.handleCircles(prevIndex, 0);
                
                this.setState({
                    roller: data.post,
                    message: 200,
                    index: 0
                })

        } catch (e) {
            console.warn(e);
        }

    }

    handleGenres = (type) => {
        if (this.state.gen_now != type) {
            this.setState({
                gen_now: type
            })
            this.getSuggestions(type);
        } 
    }

    handleCircles = (prev, now) => {
        const circle = document.getElementById(prev);
        const circle_now = document.getElementById(now);

        circle.style.background = "#000";
        // circle.style.transform = "translate(0, 0)";
        circle_now.style.background = "#6600CC";
        // circle_now.style.transform = "translate(0, -5px)";
    }

    handleIndex = (type) => {
        const { index } = this.state;
        if (type == "decrement") {
            if (index == 0) {
                this.setState({
                    index: this.state.roller.length - 1
                })
                this.handleCircles(0, this.state.roller.length - 1);
            } else {
                this.setState({
                    index: this.state.index - 1
                })
                this.handleCircles(this.state.index, this.state.index - 1);
            }
        } else {
            if (index == this.state.roller.length - 1) {
                this.setState({
                    index: 0
                })
                this.handleCircles(this.state.roller.length - 1, 0);
            } else {
                this.setState({
                    index: this.state.index + 1
                })
                this.handleCircles(this.state.index, this.state.index + 1);
            }
        }
    }


    render() {
        const { roller, index, data } = this.state;
        const { lang } = this.context;
        const { categories, hasGenres } = this.props;
        return (
            <div className={style.sugg_wrapper}>
                {/* DropDown Menu */}
                {hasGenres ?
                    <div className={style.dropdown_menu}>
                        <button>{lang == "EN" ? "Genre" : "Είδος"}</button> 
                        <div className={style.dropdown_content}>
                            {categories.map((cat, key) => {
                                return (
                                    <button key={key} onClick={() => { this.handleGenres(cat) }}>{cat}</button>
                                )
                            })}
                        </div>
                    </div>
                : "" }
                {/* Content */}
                <div className={style.sugg_cont}>
                    <button onClick={() => { this.handleIndex("decrement") }}>
                        <Image src={ARROW} alt='Arrow Left' id={style.arrow_left} />
                    </button>
                    <Link href={`/songs/${roller[index].singer}/${roller[index].title}`}> 
                        <div className={style.suggestions}>
                            <Image src={`https://img.youtube.com/vi/${roller[index].thumbnailURL}/mqdefault.jpg`} alt={`${roller[index].title}`} width={320} height={180} className={style.img} layout='fixed' /> 
            
                            <h4 className={style.song_title}>{roller[index].title}</h4>
                            <h4 className={style.song_artist}>{roller[index].singer} {roller[index].fts != "" ? `ft. ${roller[index].fts}` : ""}</h4>
                        </div>
                    </Link>
                    <button onClick={() => { this.handleIndex("increment") }}>
                        <Image src={ARROW} alt='Arrow Right' id={style.arrow_right} />
                    </button>
                </div>
                <div className={style.circles}>
                    {roller.map((element, key) => {
                        return (
                            <button className={style.circle} key={key} id={`${key}`} onClick={() => { 
                                this.setState({ index: key });
                                this.handleCircles(index, key);
                             }} aria-label={`${element.title} song being displayed`}>
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }
}
