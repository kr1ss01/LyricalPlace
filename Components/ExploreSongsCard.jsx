import style from '../styles/ExploreSongsCard.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function LatestCard({ item, redirect, redirect_value, isAlbum }) {
    return (
        <article className={style.card_outer}>
            <div className={style.card_perspective}>
                <Link href={redirect? `/songs/${item.singer}/${item.title}` : `${redirect_value}`}>
                    <div className={style.song_card} >
                        <Image src={`https://img.youtube.com/vi/${item.thumbnailURL}/mqdefault.jpg`} alt={`${item.title}`} width={320} height={180} className={style.img} layout='fixed' /> 
                        <div className={style.card_info}>
                            {!isAlbum ? 
                                <>
                                    <p>[{item.lang} - {item.genre} / {item.album}]</p>
                                    <p>
                                        <span id={style.title_main}>{item.title}</span>
                                        <span> - </span>
                                        <span id={style.author_main}>{item.singer} {item.fts != "" ? `ft. ${item.fts}` : "" }</span>
                                    </p>
                                </>
                                : 
                                <>
                                    <p className={style.is_album}>
                                        <h3>{item.singer} - {item.album}</h3>
                                    </p>
                                </>
                            }
                            
                            {/* <p id={style.album_main}>({item.album})</p> */}
                            {!isAlbum ? <p>{item.published.split("-")[0]}</p> : "" }
                        </div>
                    </div>
                </Link>
            </div>
        </article>
    )
}


LatestCard.defaultProps = {
    redirect: true,
    redirect_value: "#",
    isAlbum: false,
}