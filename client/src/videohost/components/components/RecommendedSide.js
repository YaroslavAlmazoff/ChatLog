import useHighlight from "../../../common_hooks/highlight.hook"
import RecommendedChannelsMain from "./components/RecommendedChannelsMain"
import RecommendedVideosMain from "./RecommendedVideosMain"

const RecommendedSide = () => {
    const {randomColor, randomShadow} = useHighlight()
    return (
        <>
        <p className={`videohost-title ${randomColor()} ${randomShadow()}`}>Рекомендованное</p>
        <div className="videohost-main-recommended-side">
            <RecommendedVideosMain />
            <RecommendedChannelsMain />
        </div>
        </>
        
    )
}

export default RecommendedSide