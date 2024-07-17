import { useState } from "react"
import "../../../auth/styles/user-item.css"

const MemberItem = ({name, surname, avatarUrl, id, f}) => {
    const [isSelected, setIsSelected] = useState(false)

    return (
        <div onClick={() => {f(id); setIsSelected(true)}} className={isSelected ? "user-item-selected" : "user-item"}>
            <div className="user-item-right-side">
                <div>
                    <img className="user-item-img" src={process.env.REACT_APP_API_URL + '/useravatars/' + avatarUrl} alt="user" />
                </div>
                <div className="user-item-info">
                    <h3 className="user-item-name">{name} {surname}</h3>
                </div>
            </div>
        </div>
    )
}

export default MemberItem