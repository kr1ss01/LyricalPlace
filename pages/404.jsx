import style from '../styles/404.module.scss';
import Link from 'next/link';
import Meta from '../Components/Meta';
import Image from 'next/image';

// SVG
import ROBOT from '../SVG/broken_robot_32.png';

export default function Custom404() {
    return (
        <main className={style._404}> 
            <Meta 
                title={"404 Error"}
                description={""}
                page_topic={"404 Page"}
                keywords={""}
            />
            <div>
                <h1>Error 404</h1>
                <h2>The page you are looking for seems to not be there :(</h2>
                <Link href={"/"}>Return To Main Page</Link>
            </div>
        </main>
    )
  }