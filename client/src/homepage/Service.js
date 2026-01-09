import './services.css'

const Service = ({item}) => {
    const gotoService = () => {
        console.log(item.link)
        window.location = item.link
    }
    return (
        <div onClick={gotoService} className="service">
            <img className="service-img" src={require(`./img/services-icons/${item.imageUrl}`)} alt="" />
            <p className="service-title">{item.title}</p>
        </div>
    )
}

export default Service