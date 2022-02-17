import React, { Component } from 'react';
import style from '../../../../styles/Lyrics.module.scss';
import Image from 'next/image';
import Meta from '../../../../Components/Meta';
import AuthContext from '../../../../Components/Context';
import Spinner from '../../../../Components/Spinner';

import YouTube from '../../../../SVG/youtube.png';
import LIKE from '../../../../SVG/like_black_24.png';
import FAV from '../../../../SVG/heart_plus_black_24.png';
import FAV_MIN from '../../../../SVG/heart_minus_black_24.png';
import LIKE_WHITE from '../../../../SVG/like_white_24.png';
import FAV_WHITE from '../../../../SVG/heart_plus_white_24.png'

export default class index extends Component {
    static contextType = AuthContext;

    state = {
        loadingFav: false,
        loadingLike: false,
        loadingLikes_number: false,
        likes: this.props.data.likes.length,
        messageFav: "",
        messageLike: "",
    }

    async componentDidMount() {
        const { data } = this.props;

        const send = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/views/${data._id}`);

        console.log(send.status, data._id)
    }

    async handleFavouarites (id, uid) {

        try {

            this.setState({
                loadingFav: true
            })

            const obj = {
                songId: id
            }

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/user/values/favouarites/${uid}`;
            let res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(obj)
            })

            const data = await res.json();

            if (res.status == 500 || res.status == 400) {
                this.setState({
                    loadingFav: false,
                    messageFav: data.message
                })
                return null;
            } else {
                this.setState({
                    loadingFav: false,
                    messageFav: data.message
                })
                if (data.message == "Song succesfully added to favouarites!") {
                    this.context.setFavouarites(id, 1, this.context.userData);
                } else {
                    this.context.setFavouarites(id, 0, this.context.userData);
                }
            }



        } catch (e) {
            console.warn(e);
        }

    }

    async updateLikes (songId) {

        try {

            this.setState({
                loadingLikes_number: true
            })

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/values/likes/${songId}`;
            let res = await fetch(url);

            const data = await res.json();

            if (res.status == 500 || res.status == 404) {
                this.setState({
                    loadingLikes_number: false,
                    likes: data.likes
                })
                return null;
            } else {
                this.setState({
                    loadingLikes_number: false,
                    likes: data.likes
                })
            }



        } catch (e) {
            console.warn(e);
        }

    }

    async handleLikes (songId, uid) {

        try {

            this.setState({
                loadingLike: true,
                loadingLikes_number: true,
            })

            const obj = {
                username: uid
            }

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/likes/${songId}`;
            let res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(obj)
            })

            const data = await res.json();

            if (res.status == 500 || res.status == 400) {
                this.setState({
                    loadingLike: false,
                    messageLike: data.message,
                    loadingLikes_number: false,
                })
                return null;
            } else {
                this.updateLikes(songId);
                this.setState({
                    loadingLike: false,
                    messageLike: data.message
                })
            }



        } catch (e) {
            console.warn(e);
        }

    }

    setTime = (property, time) => {
        setTimeout(() => {this.setState({ [`${property}`]: "" })}, time);
    }

    render() {
        const { lang, isAuth, userData } = this.context;
        const { data } = this.props;
        const { messageLike, loadingFav, loadingLike, messageFav, likes, loadingLikes_number } = this.state;
        return (
            <main className={style.lyrics}>
                <Meta title={`${data.singer} - ${data.title} ${data.fts != "" ? `ft. ${data.fts}` : ""}`} 
                    keywords={`${data.singer}, ${data.title}, ${data.fts != "" ? `ft, ${data.fts}` : ""}, lyrics, σίχοι, ${data.lang}`}
                    description={`${data.singer} ${data.title} lyrics ${data.fts != "" ? `ft, ${data.fts}` : ""}. ${data.lyrics}`}
                    page_topic={`${data.title} lyrics || ${data.title} στίχοι`}
                />

                {messageFav != "" ?
                    <section className={style.display_logs}>
                        {messageFav}
                        {this.setTime("messageFav", 2500)}
                    </section>
                : "" }

                {messageLike != "" ?
                    <section className={style.display_logs}>
                        {messageLike}
                        {this.setTime("messageLike", 2500)}
                    </section>
                : "" }

                <h1 className={style.main_h1}><span>{data.singer} - {data.title} {lang == "EN" ? "Lyrics" : "Στίχοι"}</span></h1>
                <h1 className={style.breakpoint_h1}>{data.singer} - {data.title} {lang == "EN" ? "Lyrics" : "Στίχοι"}</h1>
                <div className={style.lyrics_display}>
                    <a target="_blank" href={data.ytURL} rel="noopener noreferrer" className={style.expand}>
                        <Image src={YouTube} alt={"You Tube Icon"} className={style.img} /> You Tube
                    </a>
                    
                    {isAuth ? 
                        <>
                            <button className={style.fav} onClick={() => this.handleFavouarites(data._id, userData.id)}>
                                {loadingFav ? 
                                    <Spinner radius={20} />
                                :
                                    <Image src={FAV} alt={"Heart Image"} className={style.img} />
                                }
                            </button>
                            
                            <button className={style.like} onClick={() => this.handleLikes(data._id, userData.uid)}>
                                {loadingLike ?
                                    <Spinner radius={20} />
                                :
                                    <Image src={LIKE} alt={"Like Image"} className={style.img} />
                                }
                            </button>
                        </>
                    : "" }

                    <div className={style.breakpoint_btns_media}>
                        <a target="_blank" href={data.ytURL} rel="noopener noreferrer" className={style.expand_breakpoint}>
                            <Image src={YouTube} alt={"You Tube Icon"} className={style.img} /> You Tube
                        </a>
                        {isAuth ? 
                        <div>
                            <button className={style.fav_breakpoint} onClick={() => this.handleFavouarites(data._id, userData.id)}>
                                {loadingFav ? 
                                    <Spinner radius={20} />
                                :
                                    <Image src={FAV_WHITE} alt={"Heart Image"} className={style.img} />
                                }
                            </button>
                
                            <button className={style.like_breakpoint} onClick={() => this.handleLikes(data._id, userData.uid)}>
                                {loadingLike ?
                                    <Spinner radius={20} />
                                :
                                    <Image src={LIKE_WHITE} alt={"Like Image"} className={style.img} />
                                }
                            </button>
                        </div>
                    : "" }
                    </div>

                    <div className={style.img_top}>
                        <Image src={`https://img.youtube.com/vi/${data.thumbnailURL}/hqdefault.jpg`} alt={`${data.title} ${data.singer}`} width={1280} height={720} layout='responsive' priority={true} />
                    </div>

                    <div>
                        <p id={style.info_song}>[{data.lang}] {data.title} - {data.singer} {data.fts != "" ? `ft. ${data.fts}` : ""} ({data.album})</p>
                        <p id={style.likes}>Likes: {loadingLikes_number ? <Spinner radius={20} /> : likes}</p>
                        <p className={style.lyrics_p}>
                            {data.lyrics}
                        </p>
                    </div>
                </div>
            </main>
        )
    }
}


export const getStaticProps = async (context) => {
    const res = await fetch(`${process.env.PROXY}api/lyrics/post/${encodeURIComponent(context.params.title)}`);

    const data = await res.json();

    // const send = await fetch(`${process.env.PROXY}api/lyrics/views/${data.post._id}`);
  
    return {
      props: {
        data: data.post,
        message: 200
      }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${process.env.PROXY}api/lyrics/getAll`);

    const data = await res.json();

    const paths = data.all.map((name) => ({ params: { singer: name.singer.toString(), title: name.title.toString() } }));

    return {
        paths: paths,
        fallback: 'blocking'
    }
}