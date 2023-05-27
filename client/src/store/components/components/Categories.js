import Category from './Category'

const Categories = ({categories, select}) => {

    return (
        <>
        {
            categories.map(category => <Category category={category} select={select}/>)
        }
        </>
    )
}

export default Categories