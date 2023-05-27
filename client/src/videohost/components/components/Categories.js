import { useState } from "react"
import useHighlight from '../../../common_hooks/highlight.hook'
import '../../styles/categories.css'

const Categories = ({display, select}) => {
    const [categories] = useState([
        'Гайды', 'Прохождения', 'Обзоры', 'Новости', 'Юмор', 'Разработка'
    ])
    const {randomShadow, randomColor, randomBlockShadow} = useHighlight()


    return (
        <div className="videohost-categories" style={{display}}>
            {categories.map(el => <p onClick={() => select(el)} className={`videohost-category ${randomBlockShadow()} ${randomColor()} ${randomShadow()}`}>{el}</p>)}
        </div>
    )
}

export default Categories