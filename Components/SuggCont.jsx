import React from 'react';
import style from '../styles/SuggCont.module.scss';

export default function SuggCont({ sugg, handleDeletion }) {
    return (
        <div className={style.suggestion_cont}>
            <div className={style.suggestion_info}>
                <p>
                    {sugg.author} - {sugg.title} {sugg.fts != "" ? `ft. ${sugg.fts}` : ""}
                </p>
                <p id={style.p_info}>
                    <span>Upvotes: {sugg.upvotesNumber}</span> <br />
                    <span id={style.aside}>{sugg.dateActive.split("-")[0]}</span>
                </p>
            </div>
            <div className={style.suggestion_x}>
                {/* // ! Delete Button */}
                <button onClick={() => handleDeletion(sugg._id)}>
                    <span id={style.first}></span>
                    <span id={style.second}></span>
                </button>
            </div>
        </div>
    )
}
