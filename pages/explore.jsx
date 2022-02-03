import { Component } from 'react';
import style from '../styles/Latest.module.scss';
import AuthContext from '../Components/Context';
import Image from 'next/image';
import Spinner from '../Components/Spinner';
import ExploreSongsCard from '../Components/ExploreSongsCard';
import Meta from '../Components/Meta';

import SEARCH from '../SVG/magnif_24_white.png';
// import FILTER from '../SVG/filter_16_purple.png';

export default class latest extends Component {
    static contextType = AuthContext;

    state = {
        loaded: 12,
        data: this.props.data,
        albums: this.props.albums,
        loader: false,
        reachMax: false,
        search_box: "",
        loader_search: false,
        data_search: [],
        viewSongs: true,
    }

    async handleSearch(querry) {

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/all/search/${querry}`);

            const data = await res.json();

            this.setState({
                loader_search: false,
            })

            if (res.status == 200) {
                this.setState({
                    data_search: data.matches,
                })
            }

        } catch (e) {
            console.warn(e);
        }
    }

    async getData(limit) {

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/latest/${limit}`);

            const data = await res.json();

            this.setState({
                loader: false,
            })

            if (res.status == 200) {
                this.setState({
                    data: data.post
                })
            }

        } catch (e) {
            console.warn(e);
        }
    }

    handleLoadMore = () => {
        const { docs } = this.props; // Get Total Number Of Documents
        const { loaded } = this.state; // Get Current Ammount Of Documents
        var setDocs;

        this.setState({
            loader: true,
        })
        console.log(loaded , docs)
        if (loaded < docs) {
            if (docs - loaded > 12) {
                // Make API Call +12
                this.setState({
                    loaded: loaded + 12,
                })
                setDocs = loaded + 12; // Initialize Sender Ammount
            } else {
                // Make A Last API Call of the remaining docs.
                this.setState({
                    loaded: docs,
                    reachMax: true,
                })
                setDocs = docs;
            }
            // API Call
            this.getData(setDocs);
        }
    }

    // HANDLE ON CHANGE EVENTS FROM INPUTS
    handleOnChangeInput = (event) => {
        this.setState({
            [`${event.target.name}`]: event.target.value,
            loader_search: true,
        });
        if (event.target.name == "search_box" && event.target.value != "") {
            this.handleSearch(event.target.value);
        } else if (event.target.name == "search_box" && event.target.value == "") {
            this.setState({
                loader_search: false, 
                data_search: [],
            })
        }
    }

    render() {
        const { lang, isAuth } = this.context;
        // const { data, docs } = this.props;
        const { data, loader, reachMax, data_search, loader_search, viewSongs, albums } = this.state;
        return (
            <main className={style.latest}>
                <Meta 
                    title={"Explore Songs"}
                    page_topic={"explore"}
                    description={"Explore new songs and lyrics from our wide collection!"}
                    keywords={"explore, lyrics, all, songs, find, new"}
                />
                <h1><span>{lang == "EN" ? "Latest Uploads" : "Πρόσφατα"}</span></h1>
                {/* <section className={style.filters}>
                    <form className={style.search_box_form}>
                        <label htmlFor="search_box">{lang == "EN" ? "Search among titles, artists and albums!" : "Ψάξε ανάμεσα σε τίτλους, καλλιτέχνες και άλμπουμς!"}</label>
                        <div>
                            <input type="text" placeholder={lang == "EN" ? "Explore songs..." : "Εξερέυνησε τραγούδια..."} name='search_box' id='search_box' onChange={this.handleOnChangeInput} className={style.input_search} />
                            <button disabled={true} type='button'><Image src={SEARCH} alt='Lens Icon' /></button>
                        </div>
                    </form>
                    <button type='button' className={style.collapse_btn}><Image src={FILTER} alt='Filter Icon' /></button>
                </section> */}
                <form className={style.input_div}>
                    <div className={style.inputs}>
                        <input type="text" placeholder={lang == "EN" ? "Explore songs..." : "Εξερέυνησε τραγούδια..."} name='search_box' id='search_box' onChange={this.handleOnChangeInput} className={style.input_search} role={"search"} />
                        <button disabled={true} type='button' className={style.input_btn}><Image src={SEARCH} alt='Lens Icon' /></button>
                    </div>
                    <div className={style.toggle_albums}>
                        <small role={"note"}>Toggle Albums</small>
                        <label className={style.switch} aria-label={"Toggle Albums On And Off"}>
                            <input type="checkbox" onClick={() => { this.setState({ viewSongs: !this.state.viewSongs }) }} role={"checkbox"} />
                            <span className={`${style.slider} ${style.round}`}></span>
                        </label>
                    </div>
                </form>
                {viewSongs ?
                <>
                    {data_search.length != 0 ? 
                        <>
                            {loader_search ?
                                <Spinner radius={30} />
                            :
                                <section className={style.card_wrapper}>
                                    {data_search.map((item, key) => {
                                        return (
                                            <ExploreSongsCard item={item} key={key} />
                                        )
                                    })}
                                </section>
                            }
                        </>
                    :
                        <>
                            <section className={style.card_wrapper}>
                                {data.map((item, key) => {
                                    return (
                                        <ExploreSongsCard item={item} key={key} />
                                    )
                                })}
                            </section>
                            <section className={style.pagination}>
                                {loader ? 
                                    <Spinner radius={30} />
                                :
                                    <>
                                    {reachMax ?
                                        <button disabled={true}>{lang == "EN" ? "All songs are listed..." : "Βλέπεις όλα τα τραγούδια..."}</button>
                                    :
                                        <button onClick={this.handleLoadMore}>{lang == "EN" ? "Load More..." : "Περισσότερα..."}</button>
                                    }
                                    </>
                                }
                            </section>
                        </>
                    }
                </>
                : 
                <section className={style.card_wrapper}>
                    {albums.map((item, key) => {
                        return (
                            <ExploreSongsCard item={item[0]} key={key} redirect={false} redirect_value={`/albums/${item[0].album}`} isAlbum={true} />
                        )
                    })}
                </section>
                }
            </main>
        )
    }
}


export async function getStaticProps(context) {
    const [res_latest, res_docs, res_albums] = await Promise.all([
        fetch(`${process.env.PROXY}api/lyrics/latest/12`),
        fetch(`${process.env.PROXY}api/lyrics/docs`),
        fetch(`${process.env.PROXY}api/lyrics/playlists/albums`), 
    ])

    const [data_latest, data_docs, data_album] = await Promise.all([
        res_latest.json(),
        res_docs.json(),
        res_albums.json(),
    ])

    return {
      props: {
        data: data_latest.post,
        docs: data_docs.total,
        albums: data_album.docs,
        message: res_latest.status
      }
    }
  }
