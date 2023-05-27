const FormCategory = ({category, select}) => {

    return (
        <div classNmae="store-category" onClick={() => select(category.name)}>
            <span className="store-category-name">{category.name}</span>
        </div>
    )
}

export default FormCategory