import ProductItem from "./ProductItem"

const Products = ({products}) => {

    return (
        <>
            {
                products.map(item => <ProductItem item={item} role={'product'} />)
            }
        </>
    )
}

export default Products