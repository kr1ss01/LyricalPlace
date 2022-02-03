import React from 'react';
import style from '../styles/LPA_SVG.module.scss';

export default function LyricalPlaceAnimationSVG() {
    return (
        <div className={style.svg}>
            <h3>Lyrical Place</h3>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id={style.triagnles}>
                    <rect width="200" height="200" fill="white"/>
                    <path id={style.light_left} opacity="0.5" d="M98.7833 100.575L77.3262 138.186L55.4826 100.798L98.7833 100.575Z" fill="#6633CC"/>
                    <path id={style.dark_right} d="M144.601 99.3033L101.301 99.7125L122.597 62.0096L144.601 99.3033Z" fill="#6633CC"/>
                    <path id={style.dark_left} d="M98.8041 99.7996L55.5029 99.8368L77.1213 62.3182L98.8041 99.7996Z" fill="#6633CC"/>
                    <path id={style.light_right} opacity="0.5" d="M101.417 100.688L144.718 100.521L123.211 138.104L101.417 100.688Z" fill="#6633CC"/>
                    <path id={style.dark_bottom} d="M100 100.989L121.651 138.489H78.3494L100 100.989Z" fill="#6633CC"/>
                    <path id={style.light_top} opacity="0.5" d="M100.006 99.0903L78.2192 61.669L121.52 61.5121L100.006 99.0903Z" fill="#6633CC"/>
                </g>
            </svg>
        </div>
    )
}
