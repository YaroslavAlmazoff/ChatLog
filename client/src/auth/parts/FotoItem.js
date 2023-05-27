import React, { useEffect, useState } from "react"
import Loader from "../../common_components/Loader"

const FotoItem = ({imageUrl}) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log(imageUrl)
    }, [imageUrl])

    return (
        <div>
            {!loading ? <img className="user-foto-preview block" alt="" src={process.env.REACT_APP_API_URL + '/userfotos/' + imageUrl}/>
            : <Loader ml={'0%'} />  }
        </div>
    )
}

export default FotoItem