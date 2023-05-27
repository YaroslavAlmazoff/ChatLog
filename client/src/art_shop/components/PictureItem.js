const PictureItem = ({item}) => {

    return (
        <div className="picture-item">
            <img className="picture-item-img" src={item.url} alt="" />
            <div className="picture-item-bottom">
                <span className="picture-item-title">{item.title}</span>
                <button onClick={document.querySelector('#art').scrollTop = document.querySelector('#art').scrollHeight} className="buy-button">Купить</button>
            </div>
        </div>
    )
}

export default PictureItem