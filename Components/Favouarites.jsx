import { Component } from 'react';
import style from '../styles/Favouarites.module.scss';
import Link from 'next/link';
import Image from 'next/image';

import ARROW from '../SVG/arrow_black_24.png';

export default class Favouarites extends Component {

    state = {
        data: "",
        index: 0,
    }

    async componentDidMount() {
        await this.getFavSong(0);
        this.handleCircles(0, 0);
    }

    async getFavSong(index) {
        const { favUser } = this.props;
        const length = favUser.length;

        const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/lyrics/${favUser[index]}`);

        const data = await res.json();

        this.setState({
            data: data
        })

    }

    handleCircles = (prev, now) => {
        const circle = document.getElementById(prev);
        const circle_now = document.getElementById(now);

        const circle_main = document.getElementById(`${prev}_main`);
        const circle_now_main = document.getElementById(`${now}_main`);

        circle.style.background = "#000";
        circle_now.style.background = "#6600CC";

        circle_main.style.background = "#000";
        circle_now_main.style.background = "#6600CC";
    }

    handleIndex = (type) => {
        const { index } = this.state;
        const { favUser } = this.props;
        if (type == "decrement") {
            if (index == 0) {
                this.setState({
                    index: favUser.length - 1
                })
                this.handleCircles(0, favUser.length - 1);
                this.getFavSong(favUser.length - 1);
            } else {
                this.setState({
                    index: this.state.index - 1
                })
                this.handleCircles(this.state.index, this.state.index - 1);
                this.getFavSong(this.state.index - 1);
            }
        } else {
            if (index == favUser.length - 1) {
                this.setState({
                    index: 0
                })
                this.handleCircles(favUser.length - 1, 0);
                this.getFavSong(0);
            } else {
                this.setState({
                    index: this.state.index + 1
                })
                this.handleCircles(this.state.index, this.state.index + 1);
                this.getFavSong(this.state.index + 1);
            }
        }
    }

    render() {
        const { data } = this.state;
        if (!data) {
            return null;
        } else {
            const { post } = this.state.data;
            const { index } = this.state;
            const { favUser } = this.props;
            return (
                <div className={style.fav_wrapp}>
                    <div className={style.fav_cont}>
                        <button onClick={() => { this.handleIndex("decrement") }} >
                            <Image src={ARROW} alt='Arrow Left' id={style.arrow_left} />
                        </button>
                        <Link href={`/songs/${post[0].singer}/${post[0].title}`}> 
                            <div className={style.favouarites}>
                                <Image src={`https://img.youtube.com/vi/${post[0].thumbnailURL}/mqdefault.jpg`} alt={`${post[0].title}`} width={320} height={180} className={style.img} layout='fixed' /> 
                                <h4 className={style.song_title}>{post[0].title}</h4>
                                <h4 className={style.song_artist}>{post[0].singer} {post[0].fts != "" ? `ft. ${post[0].fts}` : ""}</h4>
                            </div>
                        </Link>
                        <button onClick={() => { this.handleIndex("increment") }}>
                            <Image src={ARROW} alt='Arrow Right' id={style.arrow_right} />
                        </button>
                    </div>
                    <div className={style.btn_breakpoint}>
                        <button onClick={() => { this.handleIndex("decrement") }} >
                            <Image src={ARROW} alt='Arrow Left' id={style.arrow_left} />
                        </button>
                        <div className={style.circles_breakpoint}>
                            {favUser.map((element, key) => {
                                return (
                                    <button className={style.circle} key={key} id={`${key}`} onClick={() => { 
                                        this.setState({ index: key });
                                        this.handleCircles(index, key);
                                    }}>
                                    </button>
                                )
                            })}
                        </div>
                        <button onClick={() => { this.handleIndex("increment") }}>
                            <Image src={ARROW} alt='Arrow Right' id={style.arrow_right} />
                        </button>
                    </div>
                    <div className={style.circles}>
                        {favUser.map((element, key) => {
                            return (
                                <button className={style.circle} key={key} id={`${key}_main`} onClick={() => { 
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
}
