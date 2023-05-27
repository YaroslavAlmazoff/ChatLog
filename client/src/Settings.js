import useVerify from "./common_hooks/verify.hook"
import { useEffect } from "react"
import './settings.css'

const Settings = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    } ,[])
    const logout = () => {
        localStorage.removeItem("user")
        window.location = "/"
    }
    const deleteProfile = () => {
        window.location = "/deleteprofile"
    }

    return (
        <div className="settings-wrapper">
            <div className="settings">
                <div className="settings-item">
                    <button onClick={logout} className="button">Выйти</button>
                </div>
                <div className="settings-item">
                    <button onClick={deleteProfile} className="button">Удалить профиль</button>
                </div>
            </div>
        </div>
    )
}

export default Settings