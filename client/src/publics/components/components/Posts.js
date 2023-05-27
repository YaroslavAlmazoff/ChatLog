import { useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import Post from "./components/Post"
import '../../styles/posts.css'
import { useParams } from "react-router"

const Posts = ({pub, isAdmin}) => {
    const params = useParams()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const getPosts = async () => {
            const response = await api.get(`/api/public/posts/${params.id}`)
            setPosts(response.data.posts.reverse())
        }
        getPosts()
    }, [pub, params])
    
    const deletePost = async (id) => {
        await api.delete(`/api/public/deletepost/${id}`)
        setPosts([...posts].filter(el => el._id !== id))
    }

    return (
        <div className="public-posts">
            {posts.length ? posts.map(item => <Post item={item} isAdmin={isAdmin} deletePost={deletePost} />) : <p style={{color: 'white', margin: '10px'}}>Нет записей</p>}
        </div>
    )
}

export default Posts