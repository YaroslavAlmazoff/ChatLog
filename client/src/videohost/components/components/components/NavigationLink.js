import { Link } from "react-router-dom"

const NavigationLink = ({item}) => {
    return (
        <Link className="videohost-navigation-link" style={window.innerWidth < 500 ? {borderBottom: '1px solid rgb(83, 83, 83)'} : {textDecoration: 'none'}} to={item.url}>{item.name}</Link>
    )
}

export default NavigationLink