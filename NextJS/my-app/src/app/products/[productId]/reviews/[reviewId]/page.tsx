
// NESTED DYNAMIC ROUTES

import { notFound } from "next/navigation"; 
// Triggering the not found with the logic . It will show the closet not-found component created 

export default async function ProductReview({params}:{
    params: Promise<{productId: string; reviewId: string}>;
}) {
    const {productId,reviewId} = await params

    if (parseInt(reviewId) > 1000){
     notFound();
    }

    return <h1>Review {reviewId} for Product {productId}</h1>
}