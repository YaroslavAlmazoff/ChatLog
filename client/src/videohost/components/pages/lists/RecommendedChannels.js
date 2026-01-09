import { useContext, useEffect, useState, useMemo } from "react"
import ChannelItem from '../../components/components/ChannelItem'
import api from '../../../../auth/api/auth'
import {AuthContext} from '../../../../context/AuthContext'
import '../../../styles/list.css'
import Search from "../../components/components/components/components/Search"
import Navigation from "../../components/Navigation"
import Loader from "../../../../common_components/Loader"
import useVerify from "../../../../common_hooks/verify.hook"
import useHighlight from "../../../../common_hooks/highlight.hook"

const RecommendedChannels = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {randomColor, randomShadow} = useHighlight()
    const auth = useContext(AuthContext)
    const [channels, setChannels] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!auth.userId) return 
        const getChannels = async () => {
            const response = await api.get(`/api/videohost/channels/recommended/${auth.userId}`)
            setChannels(response.data.channels)
            setLoading(false)
        }
        getChannels()
    }, [auth])

    const searchedChannels = useMemo(() => {
        return [...channels].filter(el => {
            return el.name.toLowerCase().includes(searchValue.toLowerCase()) || 
            el.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            searchValue === ''
        })
    }, [channels, searchValue])

    return (
        <div className="videohost-list-page block">
            <Navigation />
            <span className={`videohost-title ${randomColor()} ${randomShadow()}`}>Рекомендованные каналы</span>
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />
            <div className="videohost-list">
            {
                searchedChannels.map(item => <ChannelItem item={item} width={'25%'} />)
            }
            </div>
        </div>
    )
}

export default RecommendedChannels