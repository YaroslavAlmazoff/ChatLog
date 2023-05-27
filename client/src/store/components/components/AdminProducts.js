import ProductItem from "./ProductItem"

const AdminProducts = ({products}) => {
    return (
        <>
            {
                products.map(item => <ProductItem item={item} role={'admin'} />)
            }
        </>
    )
}

export default AdminProducts