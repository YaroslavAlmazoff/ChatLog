import { useEffect } from "react"

const NotActivated = () => {
    useEffect(() => {
        console.log(document.getElementById("header"))
        if(document.getElementById("header")) {
            document.body.removeChild(document.getElementById("header"))
        }
    }, [])
    return (
        <div style={{marginTop: "20vh"}}>
            <h2 className="white-glow-text">Ваш профиль не активирован. На указанную почту должно прийти письмо с ссылкой на активацию.</h2>
        </div>
    )
}

export default NotActivated