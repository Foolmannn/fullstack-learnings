// not-found component doesnot take the props. 
// so for showing different meesages based on the different params in the url we will use the useParthname 


'use client'
import { usePathname } from 'next/navigation' // this must be client component as hooks can be only used in client component 

const NotFound = () => {
  const pathName = usePathname();
  const productId = pathName.split('/')[2];
  const reviewId = pathName.split('/')[4]; // split the pathname by / at index 4 
 
  return (
    <div>
<h1>Review {reviewId} not Found for Product {productId} </h1>

    </div>
  )
}

export default NotFound