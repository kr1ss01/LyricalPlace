import React, { Component } from 'react';
import style from '../../styles/PlaylistsGlobal.module.scss';
import AuthContext from '../../Components/Context';
import Playlist from '../../Components/Playlist';
import Router from 'next/router';
import Link from 'next/link';
import Meta from '../../Components/Meta';
import LyricalPlaceAnimationSVG from '../../Components/LyricalPlaceAnimationSVG';
import PlaylistSVG from '../../Components/PlaylistSVG';

export default class Playlists extends Component {
    static contextType = AuthContext;

    // Redirect
    handleInsideURL = (url) => {
        Router.push(url);
    }

    render() {
        const { lang, isAuth } = this.context;
        const { trendings, featured, genres, singles, albums } = this.props;
        return (
            <main className={style.playlists}>
                <Meta 
                    title={"Playlists"}
                    description={"Find and explore some playlists we created for you, or create your own!"}
                    page_topic={"playlists"}
                    keywords={"playlist, top, featured, create, yours, find, explore"}
                />
                <h1><span>Playlists</span></h1>
                <section className={style.playlist_grid_main}>
                    <div className={style.global_playlists}>
                        <h2>{lang === "EN" ? "General Playlists" : "Γενικές Playlists"}</h2>
                        {lang === "EN" ?
                            <p>
                                Global Playlists include the top 20 trending songs and the most feautered. Here you can explore them.
                            </p>
                        : 
                            <p>
                                Οι Γενικές Playlists αφορούν τα 20 κορυφαία σε τάσης τραγούδια και τα ποιό αναγνωρισμένα. Εδώ μπορείς να τα εξερευνήσεις.
                            </p>
                        }
                        <hr />
                        <div className={style.playlist_wrapper}>
                            <a href={trendings.url} target={"_blank"} className={style.a_wrapp} onClick={() => this.handleInsideURL(`/songs/${trendings.docs[0].singer}/${trendings.docs[0].title}`)} rel={"noreferrer"}>
                                <Playlist playlist_name={"Trending Playlist"} info={"Top 20 Trending Songs"} />
                            </a>
                            <a href={featured.url} target={"_blank"} className={style.a_wrapp} onClick={() => this.handleInsideURL(`/songs/${featured.docs[0].singer}/${featured.docs[0].title}`)} rel={"noreferrer"}>
                                <Playlist playlist_name={"Featured Playlist"} info={"Featured Songs"} />
                            </a>
                        </div>
                    </div>
                    <div className={style.playlists_for_you}>
                        <h2>{lang === "EN" ? "Playlists For You" : "Playlists Για Εσένα"}</h2>
                        {lang === "EN" ?
                            <p>
                                Here you can explore some playlist specificly made for you. Try them out!
                            </p>
                        : 
                            <p>
                                Εδώ μπορείς να δείς κάποιες playlists που φτιάχτηκαν μόνο για εσένα. Δοκίμασέ τες!
                            </p>
                        }
                        <hr />
                        <div className={style.playlist_wrapper}>
                            <a href={genres.url} target={"_blank"} className={style.a_wrapp} onClick={() => this.handleInsideURL(`/songs/${genres.docs[0].singer}/${genres.docs[0].title}`)} rel={"noreferrer"}>
                                <Playlist playlist_name={`${genres.category} Playlist`} info={`${genres.category} Hits`} />
                            </a>
                            <a href={genres.url_2} target={"_blank"} className={style.a_wrapp} onClick={() => this.handleInsideURL(`/songs/${genres.docs_2[0].singer}/${genres.docs_2[0].title}`)} rel={"noreferrer"}>
                                <Playlist playlist_name={`${genres.category_2} Playlist`} info={`${genres.category_2} Hits`} />
                            </a>
                            <a href={singles.url} target={"_blank"} className={style.a_wrapp} onClick={() => this.handleInsideURL(`/songs/${singles.docs[0].singer}/${singles.docs[0].title}`)} rel={"noreferrer"}>
                                <Playlist playlist_name={"Singles Playlist"} info={"Single Hits"} />
                            </a>
                        </div>
                    </div>
                    <div className={style.album_playlists}>
                        <h2>Album Playlists</h2>
                        {lang === "EN" ?
                            <p>
                                Here we have the top 3 albums as playlists. Discover and find new albums you might like!
                            </p>
                        : 
                            <p>
                                Εδώ θα βρείς τα 3 καλύτερα άλμουμ σαν playlists. Ανακάλυψε και βρές καινούργια άλμουμ τα οποία μπορεί να σου αρέσουν!
                            </p>
                        }
                        <hr />
                        <div className={style.playlist_wrapper}>
                            {albums.docs.map((item, key) => {
                                if (key >= 3) { return; }
                                return (
                                    <Link href={`/albums/${item[0].album}`} key={key}>
                                        <div className={style.a_wrapp}>
                                            <Playlist playlist_name={`${item[0].album} Playlist`} info={`${item[0].album} Album`} url={item[0].thumbnailURL} alt={`${item[0].singer} ${item[0].album}`} />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <div className={style.animation_1}>
                        <LyricalPlaceAnimationSVG />
                    </div>
                    <div className={style.animation_2}>
                            {lang === "EN" ?
                                <p>
                                    Discover new albums and hear new music to your taste!
                                </p>
                            : 
                                <p>
                                    Ανακάλυψε νέα άλμουμ και άκουσε καινούργια μουσική στο γούστο σου!
                                </p>
                            }
                    </div>
                    <div className={style.animation_3}>
                        <PlaylistSVG ratio={350} haveEffects={true} />
                    </div>
                </section>
            </main>
        );
    }
}

export async function getStaticProps(context) {
    const [res_trendings, res_featured, res_genres, res_signles, res_albums] = await Promise.all([
      fetch(`${process.env.PROXY}api/lyrics/playlists/trendings`), // Fetch Trendings
      fetch(`${process.env.PROXY}api/lyrics/playlists/featured`), // Fetch Featured
      fetch(`${process.env.PROXY}api/lyrics/playlists/genres`), // Fetch Genre Playlist Random
      fetch(`${process.env.PROXY}api/lyrics/playlists/singles`), // Fetch Singles Playlist
      fetch(`${process.env.PROXY}api/lyrics/playlists/albums`), // Fetch Albums Playlists
    ])
  
    const [data_trendings, data_featured, data_genres, data_singles, data_albums] = await Promise.all([
       res_trendings.json(),
       res_featured.json(),
       res_genres.json(),
       res_signles.json(),
       res_albums.json(),
    ])
  
  
    return {
      props: {
        trendings: data_trendings,
        featured: data_featured,
        genres: data_genres,
        singles: data_singles,
        albums: data_albums,
        message: 200
      }
    }
}