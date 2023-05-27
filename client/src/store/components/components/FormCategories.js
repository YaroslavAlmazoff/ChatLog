import Category from './Category'

const FormCategories = ({categories, select}) => {

    return (
        <>
        {
            categories.map(category => <Category category={category} select={select} />)
        }
        </>
    )
}

export default FormCategories