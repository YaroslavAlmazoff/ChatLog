import useHighlight from '../common_hooks/highlight.hook'

const Message = ({item}) => {
    const {randomShadow, randomBlockShadow, randomColor} = useHighlight()
    return (
        <div className={`admin-message ${randomBlockShadow()}`}>
            <p className={`admin-message-text ${randomColor()} ${randomShadow()}`}>{item.text}</p>
        </div>
    )
}

export default Message