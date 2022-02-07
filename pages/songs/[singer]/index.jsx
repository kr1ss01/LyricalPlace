import React, { Component } from 'react';
import style from '../../../styles/Singer.module.scss';
import Meta from '../../../Components/Meta';
import AuthContext from '../../../Components/Context';
import Image from 'next/image';
import Link from 'next/link';

export default class index extends Component {
    static contextType = AuthContext;

    displayData = (obj) => {
        return obj.map((post, key) => {
            return (
                <Link href={`/songs/${post.singer}/${post.title}`} key={key}>
                    <div className={style.song_from_singer_div}>
                        <div className={style.song_img}>
                            <Image src={`https://img.youtube.com/vi/${post.thumbnailURL}/hqdefault.jpg`} alt={`${post.title} ${post.singer}`} width={120} height={90} layout='fixed' />
                        </div>
                        <div className={style.song_info}>
                            <p>[{post.lang}] {post.title} - {post.singer} {post.fts != "" ? `ft. ${post.fts}` : ""} ({post.album})</p>
                        </div>
                    </div>
                </Link>
            )
        })
    }

    render() {
        const { lang } = this.context;
        const { posts, message } = this.props.data;
        const { singer } = this.props;
        return (
            <main className={style.singer}>
                <Meta 
                    title={`${singer} Artist`}
                    keywords={`${singer}, artist, singer`}
                    description={`${singer} page. Here you can find anything releated to this artist and explore his/hers lyrics!`}
                    page_topic={`${singer} info`}
                /> 

                <h1 className={style.main_h1}>
                    <span>
                        {`${singer}`} - {lang == "EN" ? "Explore Artist's Songs" : "Εξερεύνησε Τα Τραγούδια Του Καλλητέχνη"}
                    </span>
                </h1>
                <h1 className={style.breakpoint_h1}>
                {`${singer}`} - {lang == "EN" ? "Explore Artist's Songs" : "Εξερεύνησε Τα Τραγούδια Του Καλλητέχνη"}
                </h1>
                <div className={style.singer_cont}>
                    {message == "Artist Found" ? 
                        <>
                            <h3>{singer.substr(singer.length - 1).toLowerCase() == "s" ? `${singer}'` : `${singer}'s`} songs</h3>
                            {this.displayData(posts)}
                            {this.props.data_fts.message == "Features found!" ? 
                                // <button className={style.fts_btn}>{lang == "EN" ? "Check Features" : "Δές τις συνεργασίες"}</button>
                                <>
                                    <h3>{singer.substr(singer.length - 1).toLowerCase() == "s" ? `${singer}'` : `${singer}'s`} features</h3>
                                    {this.displayData(this.props.data_fts.posts)}
                                </>
                            : ""}
                        </> 
                    : 
                        <>
                            <h3>{singer.substr(singer.length - 1).toLowerCase() == "s" ? `${singer}'` : `${singer}'s`} features</h3>
                            {this.displayData(this.props.data_fts.posts)}
                        </>
                    }
                </div>
            </main>
        )
    }
}

export const getStaticProps = async (context) => {
    const [res_singer, res_fts] = await Promise.all ([
        fetch(`${process.env.PROXY}api/lyrics/artist/${encodeURIComponent(context.params.singer)}`),
        fetch(`${process.env.PROXY}api/lyrics/fts/${encodeURIComponent(context.params.singer)}`)
    ])

    const [data_singer, data_fts] = await Promise.all([
        res_singer.json(),
        res_fts.json()
    ])
  
    return {
      props: {
        data: data_singer,
        data_fts: data_fts,
        message: 200,
        singer: context.params.singer
      }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${process.env.PROXY}api/lyrics/artists`);

    const data = await res.json();

    const paths = data.artists.map((name) => ({ params: { singer: name.toString() } }));

    return {
        paths: paths,
        fallback: 'blocking'
    }
}
