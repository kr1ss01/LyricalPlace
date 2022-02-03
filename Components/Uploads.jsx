import React from 'react';
import style from '../styles/Upload.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import ARROW from '../SVG/fat_arrow_white_24.png';
import LIKE from '../SVG/like_white_24.png';

export default function Uploads({ img_code, title, artists, fts, gen, to, uploaded }) {
    return (
        <Link href={to}>
            <div className={style.upload_wrap}>
                <div className={style.upload_basic}>
                    <div className={style.img_wrap}>
                        <Image src={`https://img.youtube.com/vi/${img_code}/default.jpg`} alt={title} width={120} height={90} className={style.img} layout='fixed' /> 
                    </div>
                    <div className={style.desc}>
                        <h4>{title} - {artists} {fts != null ? `ft. ${fts}` : ""} ({gen})</h4>
                        <h4 className={style.uploaded}>{uploaded}</h4>
                    </div>
                    <p className={style.breakpoint_info}>
                        {title} - {artists} {fts != null ? `ft. ${fts}` : ""} ({gen})
                    </p>
                </div>
                <div className={style.arrow}>
                    <Image src={ARROW} alt="Arrow right" className={style.image_arrow} />
                </div>
            </div>
        </Link>
    )
}

