import MyChannel from '../components/MyChannel'
import Categories from '../components/Categories'
import RecommendedSide from '../components/RecommendedSide'
import '../../styles/main.css'
import '../../styles/form.css'
import Greeting from '../components/Greeting'
import Subscribes from '../components/Subscribes'
import Navigation from '../components/Navigation'
import SearchSide from '../components/SearchSide'
import useVerify from '../../../common_hooks/verify.hook'
import { useEffect } from 'react'

const VideohostMain = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const select = async (el) => {
        window.location = `/videohost/category/${el}`
    }
    const createChannel = () => {
        window.location = `/videohost/create/channel`
    }

    return (
        <div className="videohost-main block">
            <Navigation />
            <Greeting />
            <button onClick={createChannel} className="button">Создать канал</button>
            <SearchSide />
            <MyChannel />
            <Categories display={'flex'} select={select} />
            <RecommendedSide />
            <Subscribes />
        </div>
    )
}

export default VideohostMain