import useRandom from "../../../common_hooks/random.hook"
import { useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import useHighlight from "../../../common_hooks/highlight.hook"

const Message = ({mess, showMessageActions}) => {
    const gotoFile = (link) => {
        console.log(link)
        window.location = link
    }
    const auth = useContext(AuthContext)
    const {randomKey} = useRandom()
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()
    return (
        <div style={{cursor: 'pointer'}} onClick={() => showMessageActions(mess)} key={randomKey()} className={mess.user === auth.userId ? 'my-message-wrapper  green-block-glow': 'message-wrapper blue-block-glow'}>
                    <div className={mess.user === auth.userId ? 'my-message': 'message'} key={Date.now() - Math.random() * 999}>
                            <img className={`message-avatar ${randomBlockShadow()}`} src={process.env.REACT_APP_API_URL + `/useravatars/` + mess.avatarUrl} alt="avatar" />
                            <p className={`${randomColor()} ${randomShadow()}`}>&nbsp;&nbsp;{mess.name}&nbsp;&nbsp;&nbsp;</p> <p className={`message-date ${randomColor()} ${randomShadow()}`}>{mess.date}</p>
                    </div>
                            <div className={`message-text ${randomColor()} ${randomShadow()}`}>
                                {
                                mess.isFile 
                                ? <p className="message-file-link" onClick={(e) => gotoFile(mess.message)}>Файл {mess.message}</p>
                                : 
                                <p className={`${randomColor()}`}>{mess.message ? mess.message : <></>}</p>
                                }
                            </div>
                            
                            <div className="message-image-container">
                            {mess.imageUrl 
                            ? <img className="message-image block" src={process.env.REACT_APP_API_URL + `/messagefotos/` + mess.imageUrl} alt="userimage" />
                            : <></>} 
                            {mess.videoUrl 
                            ? <video width="300" controls src={process.env.REACT_APP_API_URL + `/messagevideos/` + mess.videoUrl}>
                            </video> 
                            : <></>} 
                            {mess.audioUrl
                            ? <audio controls>
                                <source src={process.env.REACT_APP_API_URL + `/messageaudios/` + mess.audioUrl} type='audio/mpeg; codecs="mp3"'/>
                            </audio> 
                            : <></>}
                            </div>
                    </div>
    )
}

export default Message