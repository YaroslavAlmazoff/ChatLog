import { useEffect, useState } from "react"
import api from '../../auth/api/auth'
import Loader from "../../common_components/Loader"
import useDate from "../../common_hooks/date.hook"
import AdItem from "../components/AdItem"
import '../styles/main.css'
import useVerify from "../../common_hooks/verify.hook"

const AdNew = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {getCurrentDate} = useDate()
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAds = async () => {
            const date = getCurrentDate()
            const response = await api.post('/api/ad/new', {date})
            setAds(response.data.ads)
            setLoading(false)
        }
        getAds()
    }, [])

    return (
        <div className="ads-new">
            <div className="ads-new-content">
                <p className="ads-new-title">Новые объявления</p>
                {!loading ? ads.map(item => <AdItem item={item} width={window.innerWidth > 500 ? '25%' : '90%'} />) : <Loader ml={'50%'} />}
            </div>
        </div>
    )
}

export default AdNew