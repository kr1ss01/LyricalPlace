import React, { Component } from 'react';
import style from '../../../styles/Albums.module.scss';
import Image from 'next/image';
import Meta from '../../../Components/Meta';
import Error from '../../../pages/404';
import ExploreSongsCard from '../../../Components/ExploreSongsCard';

import YT from '../../../SVG/youtube.png';

export default class Albums extends Component {

    handleAlbumUrl = () => {
        const { album } = this.props.data;
        const urlBasis = "https://www.youtube.com/watch_videos?video_ids=";
        let endpoints = "";

        // Extract URLS
        album.forEach((item, key) => {
            if (key === 0) {
                endpoints = item.thumbnailURL;
            } else {
                endpoints = endpoints + "," + item.thumbnailURL;
            }
      
        })

        return urlBasis + endpoints;
    }

  render() {
    const { message } = this.props;
    const { album } = this.props.data;

    if (message === 200) {
        return (
            <main className={style.albums}>
                <Meta 
                    title={`${album[0].singer} - ${album[0].album}`}
                    description={`Find lyrics and listen to ${album[0].singer}'s album.`}
                    keywords={`${album[0].singer}, ${album[0].album}, album, lyrics`}
                    page_topic={`${album[0].singer} ${album[0].album}`}
                />
                <h1 className={style.main_h1}><span>{album[0].singer} - {album[0].album}</span></h1>
                <h1 className={style.breakpoint_h1}>{album[0].singer} - {album[0].album}</h1>
                <section className={style.album_cont}>
                    {album.map((post, key) => {
                        return (
                            <ExploreSongsCard  item={post} key={key} />
                        )
                    })}
                </section>

                <a href={this.handleAlbumUrl()} target={"_blank"} id={style.url_link} role={"link"} rel={"noreferrer"}>
                    <Image src={YT} alt='YouTube Logo' /> 
                </a>
            </main>
        );
    } else {
        <Error />
    }
  }
}

export const getStaticProps = async (context) => {
    const res = await fetch(`${process.env.PROXY}api/lyrics/album/songs/${encodeURIComponent(context.params.album)}`);

    const data = await res.json()
  
    return {
      props: {
        data: data,
        message: res.status,
      }
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${process.env.PROXY}api/lyrics/values/albums`);

    const data = await res.json();

    const paths = data.albums.map((name) => ({ params: { album: name.toString() } }));

    return {
        paths: paths,
        fallback: 'blocking'
    }
}