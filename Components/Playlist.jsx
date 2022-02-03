import React from 'react';
import style from '../styles/Playlist.component.module.scss';
import Image from 'next/image';
import PlaylistSVG from './PlaylistSVG';

export default function Playlist({ playlist_name, info, url, alt }) {
  return (
      <article className={style.playlist_cont}>
          <div className={style.content}>
            {url == "" ? 
              <PlaylistSVG ratio={200} />
              : 
              <Image src={`https://img.youtube.com/vi/${url}/hqdefault.jpg`} alt={alt} width={200} height={200} layout='fixed' />
            }
            <div className={style.content_info}>
                <p>
                    {info}
                </p>
            </div>
          </div>
          <div className={style.title}>
            {playlist_name}
          </div>
      </article>
  );
}

Playlist.defaultProps = {
  url: "",
  alt: "",
}