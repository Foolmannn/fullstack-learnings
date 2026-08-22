import React from 'react'

async function Page() {

    const response = await fetch('http://127.0.0.1:3000/api/books');
    const books = await response.json();
    
    return(
        <>
        <code>
            {JSON.stringify(books,null,2)}
        </code>
        </>
    )
}

export default Page