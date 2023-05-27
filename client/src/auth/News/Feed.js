import { useEffect, useState } from "react"
import FriendsNews from "./components/FriendsNews"
import PublicNews from "./components/PublicNews"
import './feed.css'

const Feed = () => {
    const PUBLIC_NEWS = 'public'
    const FRIENDS_NEWS = 'friends'

    const [currentPosts, setCurrentPosts] = useState('friends')

    useEffect(() => {
        toPublicPosts()
    }, [])

    const toPublicPosts = () => {
        setCurrentPosts(PUBLIC_NEWS)
    }
    const toFriendsPosts = () => {
        setCurrentPosts(FRIENDS_NEWS)
    }

    return (
        <div className="feed block">
            <div className="feed-nav">
                <button onClick={toPublicPosts} className="feed-nav-button" style={currentPosts === PUBLIC_NEWS ? {borderBottom: '2px solid rgb(0, 140, 255)'} : {border: 'none'}}>Новости</button>
                <button onClick={toFriendsPosts} className="feed-nav-button" style={currentPosts === FRIENDS_NEWS ? {borderBottom: '2px solid rgb(0, 140, 255)'} : {border: 'none'}}>Записи друзей</button>
            </div>
            <div className="feed-content">
                {
                    currentPosts === PUBLIC_NEWS ? <PublicNews /> : <></>
                }
                {
                    currentPosts === FRIENDS_NEWS ? <FriendsNews /> : <></>
                }
            </div>
        </div>
    )
}

export default Feed