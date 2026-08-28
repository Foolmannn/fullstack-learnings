"use client"

import { useRouter } from "next/navigation" // not next/router it is for the page router 


export default function OrderProduct(){
    const router = useRouter();
    const handleClick = () =>{
        console.log("Placing your order")
        router.push('/');
        // router.replace('/');
        // router.back();
        
    }
    return (

        <>
        <h1>Order Product</h1>
        <button onClick={handleClick}>Place Order</button>
            </>
    )
}