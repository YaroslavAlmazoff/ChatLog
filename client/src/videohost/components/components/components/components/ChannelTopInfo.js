import { useContext } from "react"
import useHighlight from "../../../../../common_hooks/highlight.hook"
import { ChannelContext } from "../../../context/ChannelContext"

const ChannelTopInfo = () => {
    const {description, avatarUrl} = useContext(ChannelContext)
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()
    return (
        <div className="videohost-channel-top-info">
            <img className={`videohost-channel-avatar ${randomBlockShadow()}`} src={process.env.REACT_APP_API_URL + '/channelavatars/' + avatarUrl} alt="" />
            <p className={`videohost-channel-description ${randomColor()} ${randomShadow()}`}>{description}</p>
        </div>
    )
}

export default ChannelTopInfo