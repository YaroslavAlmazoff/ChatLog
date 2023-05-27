import useVerify from "../../common_hooks/verify.hook"
import Head from "../components/Head"
import NewBlock from "../components/NewBlock"
import '../styles/main.css'
import { useEffect } from "react"

const AdMain = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    return (
        <div className="ads-main">
            <div className="ads-main-content">
                <Head />
                <NewBlock />
            </div>
        </div>
    )
}

export default AdMain