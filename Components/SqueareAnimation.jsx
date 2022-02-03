import style from '../styles/SquareAnimation.module.scss';

export default function SqueareAnimation({ text }) {
    return (
        <>
            <div id={style.circle}></div>
            <div id={style.text}>{text}</div>
        </>
)
}
