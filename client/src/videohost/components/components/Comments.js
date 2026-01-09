import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../../auth/api/auth'
import CommentItem from './components/CommentItem'
import CommentField from './CommentField'
import { AuthContext } from '../../../context/AuthContext'
import Loader from '../../../common_components/Loader'

const Comments = () => {
  const auth = useContext(AuthContext)
  const params = useParams()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getComments = async () => {
      const response = await api.get(`/api/videohost/videos/comments/${params.id}`, {headers: {
        Authorization: `Bearer ${auth.token}`
      }})
      setComments(response.data.comments)
      setLoading(false)
    }
    getComments()
  }, [params, auth])

  return (
    <div className='videohost-video-comments'>
      <CommentField comments={comments} setComments={setComments} />
        {
          !loading ? comments.reverse().map(item => <CommentItem item={item} />)
          : <Loader ml={'50%'} />
        }
    </div>
  )
}

export default Comments
