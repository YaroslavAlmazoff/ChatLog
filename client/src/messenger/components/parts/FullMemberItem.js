import "../../../auth/styles/user-item.css"

const FullMemberItem = ({name, surname, avatarUrl, id}) => {
    const gotoMember = () => {
        window.location = `/user/${id}`
    }

    return (
        <div onClick={gotoMember} className="user-item">
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

export default FullMemberItem