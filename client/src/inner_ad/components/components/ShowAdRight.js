import { useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import Loader from "../../../common_components/Loader"
import Card from "./Card"

const ShowAdRight = ({width}) => {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAds = async () => {
            setLoading(true)
            const response = await api.get('/api/innerad/random')
            console.log(response)
            setAds(response.data.ads.reverse())
            setLoading(false)
        }
        getAds()
        setInterval(() => {
            getAds()
        }, 3000)
    
    }, [])


    return (
        <div style={{width}}>
            {!loading ? ads.map(item => <Card item={item} />) : <Loader ml={'50%'} />}
        </div>
    )
}

export default ShowAdRight