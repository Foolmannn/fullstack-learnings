
import Link from "next/link"
export default function ProductList(){
    const productId=100;
    return (
        <>
        <Link href='/'>Home</Link>
        <h1>Product list </h1>
        <ul>
            <li><Link href='/products/1'>Product 1</Link></li>
            <li><Link href='/products/2'>Product 2</Link></li>
            <li><Link href='/products/3'>Product 3</Link></li>
            <li><Link href='/products/4' replace>Product 4</Link></li> 
            {/* this replace keyword will overwrite the history so when we back it will lead to home page instead of the product list page */}
            <li><Link href={`/products/${productId}`}>Product {productId}</Link></li>
       
        </ul>
        </>
    )
}