import React, { useEffect } from "react"
import api from './auth/api/auth'

const Main = ({isVerified}) => {
    useEffect(() => {
        const verify = async () => {
            try {
                const response = await api.get('/api/verify', {headers:{
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
                }})

                console.log(isVerified)
                
                if(!response.data.verified) {
                    if(localStorage.getItem('registered')) {
                        window.location = '/login'
                    } else {
                        window.location = '/greeting'
                    }
                } else {    
                    if(response.data.isActivated) {
                        window.location = '/home'
                    } else {
                        window.location = '/notactivated'
                    }
                }
            } catch (e) {
                console.log(e)
                window.location = '/login'
            }
        }
        verify()
    }, [isVerified])
    return (
        <div>
        </div>
    )
}

export default Main