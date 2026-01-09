import { useEffect, useState } from "react"
import React from "react"
import { useParams } from "react-router"
import api from '../../../auth/api/auth'
import { ChannelContext } from "../context/ChannelContext"
import Head from "../components/Head"
import ChannelMiddleSide from "../components/ChannelMiddleSide"
import ChannelVideos from "../components/ChannelVideos"
import '../../styles/channel.css'
import Navigation from "../components/Navigation"
import Loader from "../../../common_components/Loader"
import useVerify from "../../../common_hooks/verify.hook"

const Channel = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const params = useParams()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    const [subscribers, setSubscribers] = useState('0')
    const [admin, setAdmin] = useState('')
    const [id, setId] = useState('')
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const getChannel = async () => {
            const response = await api.get(`/api/videohost/channels/channel/${params.id}`)
            setName(response.data.channel.name)
            setDescription(response.data.channel.description)
            setAvatarUrl(response.data.channel.avatarUrl)
            setBannerUrl(response.data.channel.bannerUrl)
            setSubscribers(response.data.channel.subscribers.length.toString())
            console.log(response.data.channel.subscribers.length.toString())
            setAdmin(response.data.channel.admin)
            setId(response.data.channel._id)
            setLoading(false)
        }
        getChannel()
    }, [params])

    return (
        <div className="videohost-channel block">
            <Navigation />
            {!loading ? <ChannelContext.Provider value={{
                name, description, avatarUrl, bannerUrl, subscribers, admin, id
            }}>
                <Head />
                <ChannelMiddleSide />
                <ChannelVideos />
            </ChannelContext.Provider> : <Loader ml={'50%'} />}
        </div>
    )
}

export default Channel