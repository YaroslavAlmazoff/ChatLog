import { useEffect, useState, useContext } from "react"
import api from '../../../auth/api/auth'
import { useParams } from "react-router"
import FilePreview from "../parts/FilePreview"
import { AuthContext } from "../../../context/AuthContext"
import useVerify from "../../../common_hooks/verify.hook"

const File = () => {
    const auth = useContext(AuthContext)
    const params = useParams()
    const {verify} = useVerify()
    const [file, setFile] = useState({})
    const [ready, setReady] = useState(false)
    const [previewOpened, setPreviewOpened] = useState(false)
    useEffect(() => {
        verify()
        const getFile = async () => {
            const response = await api.get(`/api/cloud/file/${params.id}`)
            setFile(response.data.file)
            setReady(true)
            setPreviewOpened(true)
        }
        getFile()
    }, [params, auth])

    return (
        <div className="file-page" style={{padding: '10px'}}>
            {ready 
            ? <div className="file-wrapper">
                {file.public || file.owner === auth.userId
                ? <div className="file">
                    {previewOpened && <FilePreview file={file} fileOpened={true} ready={ready} />}
                </div>
                : <div>
                    <h2 style={{color: 'red'}}>ERROR 404: Page not found</h2>
                </div>
                }
            </div>
            : <></>
            }
        </div>
    )
}

export default File