import { Link } from "react-router-dom"
import '../../styles/photo-list.css'

const Title = () => {
    return (
        <p className="photo-page-title">ChatLog 
            {window.innerWidth > 500 
            ? 
            <>
                <span style={{color: 'rgb(0, 140, 255)'}}>Photographer</span> 
                <Link className="photos-link" to="/photo/create">Опубликовать фотографию</Link> / Популярные фотографии 
                <Link className="photos-link" to="/photos/new">Новые фотографии</Link>
            </>
            : <>
                <span style={{color: 'rgb(0, 140, 255)', display: 'block', marginBottom: '20px'}}>Photographer</span> 
                <Link className="photos-link" to="/photo/create" style={{display: 'block', marginBottom: '20px', width: '80%'}}>Опубликовать фотографию</Link> / Популярные фотографии 
                <Link className="photos-link" to="/photos/new" style={{display: 'block', marginBottom: '20px', width: '80%'}}>Новые фотографии</Link>
            </>
            }
        </p>
    )
}

export default Title