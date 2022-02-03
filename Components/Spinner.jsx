import style from '../styles/Spinner.module.scss';

const Spinner = ({ radius }) => {
    return (
        <svg className={style.spinner} width={radius + "px"} height={radius + "px"} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle className={style.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r={radius}></circle>
        </svg>
    )
}

Spinner.defaultProps = {
    radius: "30"
}

export default Spinner;
