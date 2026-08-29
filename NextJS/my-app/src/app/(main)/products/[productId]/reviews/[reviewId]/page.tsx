
// NESTED DYNAMIC ROUTES

import { notFound , redirect} from "next/navigation"; 
// Triggering the not found with the logic . It will show the closet not-found component created 

function getRandomInt(count:number){
    return Math.floor(Math.random()*count);
}

export default async function ProductReview({params}:{
    params: Promise<{productId: string; reviewId: string}>;
}) {
    const {productId,reviewId} = await params

    const random = getRandomInt(2);
    if (random==1){
        throw new Error("Error Loading review")
    }
    if (parseInt(reviewId) > 1000){
    //  notFound();
    redirect('/products')
    }

    return <h1>Review {reviewId} for Product {productId}</h1>
}