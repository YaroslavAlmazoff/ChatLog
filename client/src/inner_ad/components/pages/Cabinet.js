import { useEffect, useState, useContext } from 'react'
import api from '../../../auth/api/auth'
import Loader from '../../../common_components/Loader'
import useVerify from '../../../common_hooks/verify.hook'
import { AuthContext } from '../../../context/AuthContext'
import '../../styles/cabinet.css'
import CabinetCard from '../components/CabinetCard'

const Cabinet = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const auth = useContext(AuthContext)
    const [ads, setAds] = useState([])
    const [statsDisplay, setStatsDisplay] = useState('none')
    const [selectedAd, setSelectedAd] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAds = async () => {
            if(!auth.userId) return
            const response = await api.get(`/api/innerad/userads/${auth.userId}`)
            setAds(response.data.ads)
            setLoading(false)
        }
        getAds()
    }, [auth])

    const createAd = () => {
        window.location = '/innerad/create'
    }

    const gotoAd = () => {
        window.location = `/innerad/${selectedAd._id}`
    }

    return (
        <div className='innerad-cabinet'>
            <div className='innerad-cabinet-top'>
                <p className='innerad-cabinet-title'>Личный кабинет</p>
                <button onClick={createAd} className='innerad-cabinet-button'>+ Разместить рекламу</button>
            </div>
            <div className='innerad-cabinet-stats' style={{display: statsDisplay}}>
                <p className='innerad-cabinet-stat' style={selectedAd.views > 0 ? {color: 'lightgreen'}: {color: 'red'}}>Просмотры: {selectedAd.views}</p>
                <p className='innerad-cabinet-stat' style={selectedAd.views > 0 ? {color: 'lightgreen'}: {color: 'red'}}>Клики: {selectedAd.views}</p>
                <button onclick={gotoAd} className='innerad-cabinet-button'>Перейти к рекламе</button>
            </div>
            {!loading ? <div className='innerad-cabinet-cards'>
                {ads.length ? ads.map(item => <CabinetCard item={item} selectedAd={selectedAd} setSelectedAd={setSelectedAd} setStatsDisplay={setStatsDisplay} />) : <p className="innerad-cabinet-title">У вас нет рекламы</p>}
            </div> : <Loader ml={'50%'} />}
        </div>
    )
}

export default Cabinet