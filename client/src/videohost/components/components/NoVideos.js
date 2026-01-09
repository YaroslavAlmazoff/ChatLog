import useHighlight from "../../../common_hooks/highlight.hook"

const NoVideos = ({videos}) => {
    const {randomColor, randomShadow} = useHighlight()
    return (
        <>{ !videos.length &&
        <div>
            <p style={{color: 'white', fontSize: '14pt'}} className={`videohost-title ${randomColor()} ${randomShadow()}`}>Здесь пока нет видео</p>
        </div>}
        </>
    )
}

export default NoVideos