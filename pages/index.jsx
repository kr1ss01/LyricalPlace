import style from '../styles/Home.module.scss';
import React from 'react';
import AuthContext from '../Components/Context';
import Image from 'next/image';
import Link from 'next/link';
import SEARCH from '../SVG/magnif_24_white.png';
import Suggestions from '../Components/Suggestions';
import Uploads from '../Components/Uploads';
import Favouarites from '../Components/Favouarites';
import Spinner from '../Components/Spinner';
import Meta from '../Components/Meta';

export default class Home extends React.Component {
  static contextType = AuthContext;

  state = {
    search: "",
    search_data: [],
    search_loader: false,
  }

  // Handle Search Querry
  async searchQuerry(querry) {
    
    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/lyrics/search/${querry}`);

      const data = await res.json();

      if (res.status == 200) {
        this.setState({
          search_data: data.matches,
          search_loader: false,
        })
      } else {
        this.setState({
          search_data: [],
          search_loader: false,
        })
      }

    } catch (e) {
      console.warn(e);
    }

  }

  // Handle Pass Down Props Of Favouarite User
  handleUserFavouariteArray = (fav) => {
    if (fav.length <= 5) {
      return fav;
    } else {
      var arr = [];
      for (let i = 1; i < 6; i++) {
        arr.push(fav[fav.length - i]);
      }
      return arr;
    }
  }

  // HANDLE ON CHANGE EVENTS FROM INPUTS
  handleOnChangeInput = (event) => {
    this.setState({
        [`${event.target.name}`]: event.target.value
    });

    if (event.target.name == "search") {
      if (event.target.value !== "") {
        this.setState({
          search_loader: true,
        })
        this.searchQuerry(event.target.value);
      } else {
        this.setState({
          search_data: []
        })
      }
    }
}

  render() {
    const { userData, isAuth, lang } = this.context; // Context
    // console.log("Heelo", process.env.NEXT_PUBLIC_PROXY_GLOBAL)
    const { genres } = this.props.categories; // Genres For Drop Down Menu
    const { post } = this.props.mostViews; // Most Views Song
    const { search_data, search_loader } = this.state; // State
    const img = !`https://img.youtube.com/vi/${post.thumbnailURL}/maxresdefault.jpg` ? `https://img.youtube.com/vi/${post.thumbnailURL}/maxresdefault.jpg` : `https://img.youtube.com/vi/${post.thumbnailURL}/hqdefault.jpg`; // Most Viewd Song Image (Thumbnail)
    return (
      <main className={style.main_cont} role={"main"}>
        <Meta />
        <section className={style.title_main}>
          <h1 role={"img"} aria-label={"Lyrical Place"} >
            <div className={style.letter}>L</div>
            <div className={style.letter}>y</div>
            <div className={style.letter}>r</div>
            <div className={style.letter}>i</div>
            <div className={style.letter}>c</div>
            <div className={style.letter}>a</div>
            <div className={style.letter}>l</div>
            <div className={style.letter}>&nbsp;</div>
            <div className={style.letter}>P</div>
            <div className={style.letter}>l</div>
            <div className={style.letter}>a</div>
            <div className={style.letter}>c</div>
            <div className={style.letter}>e</div>
          </h1>
        </section>
        <section className={style.content_main_page} aria-owns={"post info page"} >
            <div className={style.post_main} id='post'>
              <Link href={`/songs/${post.singer}/${post.title}`}>
                <div className={style.link_div_main}>
                  <div className={style.img_main}>
                    <Image src={img} alt={`${post.title} ${post.singer} ${post.fts != "" ? `ft. ${post.fts}` : ""}`} width={480} height={360} className={style.img} layout='responsive' priority={true} /> 
                  </div>
                  <small>🔥 HOT NOW 🔥</small>
                  <p>
                    <span>[{post.lang} - {post.genre}]</span>
                  </p>
                  <p>
                    <span id={style.title_main}>{post.title}</span>
                    <span> - </span>
                    <span id={style.author_main}>{post.singer} {post.fts != "" ? `ft. ${post.fts}` : "" }</span>
                    <span> </span>
                    <span id={style.album_main}>({post.album})</span>
                  </p>
                </div>
              </Link>
            </div>
            <div className={style.info_setter} id='info'>
              <h1>Lyrical Place</h1>
              <h2>{lang == "EN" ? "Providing the best lyrics for (mostly) Greek songs." : "Παρέχουμε τους καλύτερους στίχους για (κυρίως) ελληνικά τραγούδια."}</h2>
              <form onSubmit={this.handleSubmition} autoComplete='off'>
                <div className={style.basic_input}>
                  <input type="text" name='search' id='search' placeholder={lang == "EN" ? 'Search among thousands of song titles...' : 'Ψάξε ανάμεσα σε χιλιάδες τίτλους τραγουδιών...'} onChange={this.handleOnChangeInput} role={"search"}/>
                  {search_data.length == 0 ? "" : 
                    <div className={style.querry_results}>
                      {search_data.map((data, key) => {
                        if (key >= 3) {
                          return null;
                        }
                        return (
                          <div className={style.querry_single_res} key={key}>
                            <Link href={`/songs/${data.singer}/${data.title}`}>
                              <div>
                                <Image src={`https://img.youtube.com/vi/${data.thumbnailURL}/default.jpg`} alt={`${data.title}`} width={120} height={90} layout='fixed' />
                                <p>
                                  [{data.genre} - {data.lang}]
                                  <br />
                                  {data.singer} {data.fts != "" ? `ft. ${data.fts}` : ""}
                                  <br /> 
                                  <span>{data.title}</span>
                                </p>
                              </div>
                            </Link>
                          </div>
                        )
                      })}
                      <small>
                        {lang == "EN" ? `Top ${search_data.length >= 3 ? "3" : `${search_data.length}`} results for your querry!` : `Τα ${search_data.length >= 3 ? "3" : `${search_data.length}`} καλύτερα αποτελέσματα για την αναζήτησή σου!` }
                      </small>
                    </div>
                  }
                  <button type='button' id={search_loader ? style.loading : ""}>
                    {search_loader ?
                      <Spinner radius={40} />
                    :
                      <Image src={SEARCH} alt='Search Icon Image' /> 
                    }
                  </button>
                </div>
              </form>
              <div className={style.hr}></div>
              {isAuth ? 
                <>
                  <div className={style.auth_fav}>
                    {userData.fav.length <= 0 ? 
                      <>
                        <h3 className={style.headings_helpers}>{lang == "EN" ? "Suggestions" : "Προτάσεις"}</h3>
                        <Suggestions categories={genres} hasGenres={true} />
                      </>
                    : 
                      <>
                        <h3 className={style.headings_helpers}>{lang == "EN" ? "Your favouarites" : "Τα αγαπημένα σου"}</h3>
                        {/* <Favouarites favUser={userData.fav} /> */}
                        <Favouarites favUser={this.handleUserFavouariteArray(userData.fav)} />
                        <small>{lang == "EN" ? "Total Favouarites" : "Συνολικά Αγαπημένα Τραγούδια"} {userData.fav.length}</small>
                      </>
                    }
                  </div>
                </>
              : 
                <>
                  <div className={style.auth_fav}>
                    <h3 className={style.headings_helpers}>{lang == "EN" ? "Suggestions" : "Προτάσεις"}</h3>
                    <Suggestions categories={genres} hasGenres={true} />
                  </div>
                </>
              }
            </div>
            <div className={style.page} id='page'>
                <h3><span>{lang == "EN" ? "Latest Uploads" : "Πρόσφατα"}</span></h3>
                {this.props.data.post.map((obj, key) => {
                  return (
                    <Uploads img_code={obj.thumbnailURL} title={obj.title} artists={obj.singer} fts={obj.fts} gen={obj.genre} to={`/songs/${obj.singer}/${obj.title}`} uploaded={obj.published} key={key} />
                  )
                })}
            </div>
        </section>
      </main>
    )
  }
}

export async function getServerSideProps(context) {
  const [res_latest, res_categ, res_most_views] = await Promise.all([
    fetch(`${process.env.PROXY}api/lyrics/latest/10`), // Fetch Latest 10 Songs
    fetch(`${process.env.PROXY}api/lyrics/all/genre/categories`), // Fetch All Genre Categories
    fetch(`${process.env.PROXY}api/lyrics/top/views`), // Fetch Most Viwed Song
  ])

  const [data_latest, data_categ, data_most_views] = await Promise.all([
     res_latest.json(),
     res_categ.json(),
     res_most_views.json(),
  ])


  return {
    props: {
      data: data_latest,
      categories: data_categ,
      mostViews: data_most_views,
      message: 200
    }
  }
}
