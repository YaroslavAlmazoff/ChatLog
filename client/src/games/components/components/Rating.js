import { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import api from '../../../auth/api/auth'
import '../../styles/rating.css'

const Rating = ({id, rating}) => {
    const auth = useContext(AuthContext)
    const [currentRating, setCurrentRating] = useState(null)

    const stars = [
        {rating: 1, url: require('../../img/star.png'), hue: '10'},
        {rating: 2, url: require('../../img/star.png'), hue: '25'},
        {rating: 3, url: require('../../img/star.png'), hue: '40'},
        {rating: 4, url: require('../../img/star.png'), hue: '55'},
        {rating: 5, url: require('../../img/star.png'), hue: '70'},
    ]

    const rate = async (r) => {
        const res = await api.get(`/api/games/rate/${id}/${r}`)
        console.log(res)
        localStorage.setItem(id, auth.userId)
    }

    const noop = () => {}

    const check = (r) => {
        console.log(rating, r, r <= rating)
    }

    return (
        <div className="game-rating">
            {
                stars.map(star => <img 
                    //onClick={localStorage.getItem(id) === auth.userId ? noop : () => rate(star.rating) } 
                    onClick={() => rate(star.rating)}
                    onMouseOver={() => setCurrentRating(star.rating)} 
                    onMouseLeave={() => setCurrentRating(null)} 
                    className="game-star" 
                    onLoad={() => check(star.rating)}
                    src={star.url} alt="" 
                    style={currentRating ? 
                        {filter: star.rating <= currentRating && `hue-rotate(${star.hue}deg)`} :
                        {filter: star.rating <= rating ? 'hue-rotate(0deg)' : 'grayscale(100%)'}} />)
            }
        </div>
    )
}

export default Rating