import style from '../styles/MessageHandler.module.scss';

export default function MessageHandler({ message }) {
    return (
        <div className={style.message}>
            {message}
        </div>
    )
}
