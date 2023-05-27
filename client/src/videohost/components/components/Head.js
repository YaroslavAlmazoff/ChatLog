import { useContext } from "react"
import { ChannelContext } from "../context/ChannelContext"
import ChannelActions from "./components/ChannelActions"
import ChannelInfo from "./components/ChannelInfo"

const Head = () => {
    const {bannerUrl} = useContext(ChannelContext)
    return (
        <div className="videohost-channel-head" style={{backgroundImage: `url(${process.env.REACT_APP_API_URL + '/channelbanners/' + bannerUrl})`, backgroundSize: 'cover'}}>
            <ChannelInfo />
            <ChannelActions />
        </div>
    )
}

export default Head