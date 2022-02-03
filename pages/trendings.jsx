import React, { Component } from 'react';
import style from '../styles/Trendings.module.scss';
import Chart from '../Components/Chart';
import AuthContext from '../Components/Context';
import Meta from '../Components/Meta';
import LatestCard from '../Components/ExploreSongsCard';
import LyricalPlaceAnimationSVG from '../Components/LyricalPlaceAnimationSVG';
import Image from 'next/image';

// SVG
import ARROW from '../SVG/arrow_white_24.png';

export default class trendings extends Component {
  static contextType = AuthContext;

  state = {
    main_index: 0,
  }

  handleMainIndex = (type) => {
    const { data } = this.props;
    const { main_index } = this.state;

    if (data) {
      if (type == "incr") {
        if (main_index == data.length - 1) {
          this.setState({
            main_index: 0,
          })
        } else {
          this.setState({
            main_index: this.state.main_index + 1,
          })
        }
      } else {
        if (main_index == 0) {
          this.setState({
            main_index: data.length - 1,
          })
        } else {
          this.setState({
            main_index: this.state.main_index - 1,
          })
        }
      }
    } else {
      return null;
    }
  }

  handleGraphColors = () => {
    const { data } = this.props;
    const { main_index } = this.state;

    if (data) {
      var color_array = [];

      data.forEach((item, index) => {
        if (index == main_index) {
          color_array.push('#fff');
        } else {
          color_array.push('#6633CC')
        }
      })

      return color_array;
    } else {
      return '#000';
    }
  }

  render() {
    const { lang } = this.context;
    const { data } = this.props;
    const { main_index } = this.state;
    return (
      <main className={style.main_trendings}>
        <Meta 
          title={"Trendings"}
          description={"Top 5 songs on Lyrical Place at this moment. Explore them and see what is mostly being heard!"}
          keywords={"top, 5, heard, explore, new, now"}
          page_topic={"Trending Songs"}
        />
        <h1><span>{lang === "EN" ? "Trendings" : "Τάσεις"}</span></h1>
        <section className={style.trendings}>
          <div className={style.chart}>
            <div className={style.chart_big}>
              <Chart data={data} graph_line_colors={this.handleGraphColors()} />
            </div>
          </div>
          <div className={style.songs}>
            <h2>{lang === "EN" ? "Explore Trending Songs" : "Ανακάλυψε τις τάσεις"}</h2>
            <div id={style.now}>
              <button className={style.nav_btns_trending} onClick={() => this.handleMainIndex("decr")} id={style.incr_btn}>
                <Image src={ARROW} alt='Arrow Image' />
              </button>
              
              <LatestCard item={data[main_index]} />
              
              <button className={style.nav_btns_trending} onClick={() => this.handleMainIndex("incr")}>
                <Image src={ARROW} alt='Arrow Image' />
              </button>
            </div>
            <div className={style.breakpoint_btns}>
              <button className={style.nav_btns_trending_breakpoint} onClick={() => this.handleMainIndex("decr")} id={style.incr_btn_breakpoint}>
                <Image src={ARROW} alt='Arrow Image' />
              </button>
              <button className={style.nav_btns_trending_breakpoint} onClick={() => this.handleMainIndex("incr")}>
                <Image src={ARROW} alt='Arrow Image' />
              </button>
            </div>
          </div>
          <div className={style.animation}>
            <div className={style.animation_sect}>
              <LyricalPlaceAnimationSVG />
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export const getStaticProps = async (context) => {
  const res = await fetch(`${process.env.PROXY}api/lyrics/top/views/5`);

  const data = await res.json();

  return {
    props: {
      data: data.docs,
      message: 200,
    }
  }
}

