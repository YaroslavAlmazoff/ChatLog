import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../../auth/api/auth'
import Loader from '../../../common_components/Loader'
import useVerify from '../../../common_hooks/verify.hook'
import '../../styles/inner-ad.css'

const InnerAd = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const params = useParams()
    const [ad, setAd] = useState({imageUrl: '', title: '', text: 'text'})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getAd = async () => {
            const response = await api.get(`/api/innerad/ad/${params.id}`)
            console.log(response)  
            setAd(response.data.ad)
            setLoading(false)
        }
        getAd()
    }, [params])


    return (
        <div className="inner-ad">
            {!loading ? <>
            <img className='inner-ad-img' src={process.env.REACT_APP_API_URL + `/inneradimages/${ad.imageUrl}`} alt="ad" />  
            <div className='inner-ad-info'>
                <p className='inner-ad-title'>{ad.title}</p>
                <p className='inner-ad-text'>{ad.text}</p>
            </div>
            </> : <Loader ml={'50%'} />}
        </div>
    )
}

export default InnerAd