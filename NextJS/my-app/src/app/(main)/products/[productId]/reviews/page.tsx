import React from 'react'

export default async function ReviewPage({params,}:{params:Promise<{productId:string}>}) 
{
  const productId = (await params).productId
  return (
    <h1>Review Page for product : {productId}</h1>
  )
}
