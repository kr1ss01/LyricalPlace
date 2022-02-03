import style from '../styles/Recomendations.module.scss';
import React from 'react';
import LatestCard from './ExploreSongsCard';
import Image from 'next/image';

import ARROW from '../SVG/arrow_white_24.png';

export default class Recomendations extends React.Component {

    state = {
        index: 0,
    }

    handleIndex = (type) => {
        const { list } = this.props;
        const { index } = this.state;

        if (type == "incr") {
            if (index == list.length - 1) {
                this.setState({
                    index: 0,
                })
            } else {
                this.setState({
                    index: this.state.index + 1,
                })
            }
        } else if (type == "decr") {
            if (index == 0) {
                this.setState({
                    index: list.length - 1,
                })
            } else {
                this.setState({
                    index: this.state.index - 1,
                })
            }
        }
    }

    render() {
        const { list } = this.props;
        const { index } = this.state;
        return (
            <div className={style.recom}>
                <LatestCard item={list[index]} />
                <div className={style.recom_btns}>
                    <button id={style.flip} onClick={() => this.handleIndex("decr")}>
                        <Image src={ARROW} alt='Arrow Image' />
                    </button>
                    <button onClick={() => this.handleIndex("incr")}>
                        <Image src={ARROW} alt='Arrow Image' />
                    </button>
                </div>
                <div className={style.dots}>
                    {list.map((item, key) => {
                        return <button key={key} id={`${key}`} disabled={index == key ? true : false} onClick={() => { this.setState({ index: key }) }}></button>
                    })}
                </div>
            </div>
        )
    }
}

