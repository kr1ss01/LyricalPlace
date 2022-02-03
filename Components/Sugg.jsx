import { Component } from 'react';
import style from '../styles/Sugg.module.scss';
import AuthContext from '../Components/Context';
import LIKE from '../SVG/like_white_24.png';
import Spinner from '../Components/Spinner';
import Image from 'next/image';

export default class Sugg extends Component {
    static contextType = AuthContext;

    state = {
        post: this.props.post,
        postLikes: 0,
        loader: false,
        resMessage: "",
    }

    // Get (Initial) Upvotes For Post
    async componentDidMount() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/suggestions/upvotes/${this.props.post._id}`);

        const data = await res.json();

        this.setState({
            postLikes: data.upvotes
        })
    }

    // Handle Upvotes
    async postData(data, id) {

        try {

            const url = `${process.env.NEXT_PUBLIC_PROXY_GLOBAL}api/suggestions/upvotes/${id}`;
            let result = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const res = await result.json();

            this.setState({
                loader: false
            })

            if (result.status == 200) {
                this.setState({
                    resMessage: res.message,
                })    
                this.componentDidMount();
            } else {
                this.setState({
                    resMessage: res.message
                })  
            }

            return 0;
        }catch (e) {
            console.warn(e)
        }

        return 1;

    }

    // Build Data For The API Call.
    toPost = (id, uid) => {
        const { isAuth } = this.context;

        // Re-assure user is logged in
        if (isAuth) {
            this.setState({
                loader: true,
                resMessage: "",
            })
    
            const data = {
                uid: uid
            }
    
            this.postData(data, id);
        }
    }

    render() {
        const { id } = this.props;
        const { lang, isAuth, userData } = this.context;
        const { loader, post, postLikes } = this.state;
        return (
            <div id={style.preview}>
                <span id={style.ranID}>{postLikes}</span> 
                <span>-- </span>
                <span> {lang == "EN" ? " By" : " Από"} <b>{post.usernameUser}</b></span>
                <span className={style.vertical}></span>
                <span>{post.author} {post.author != "" && post.title != "" ? "-" : ""} {post.title} {post.fts != "" ? `ft. ${post.fts}` : "" } ({post.dateActive})</span>
                <span className={style.vertical} id={style.vertical_right}></span>
                <button disabled={!isAuth ? false : loader ? true : false} onClick={() => this.toPost(post._id, userData.uid)}>
                    {loader ?
                        <Spinner radius={20} />
                    :
                        <Image src={LIKE} alt='Like Icon' />
                    }
                </button>
            </div>
        )
    }
}

