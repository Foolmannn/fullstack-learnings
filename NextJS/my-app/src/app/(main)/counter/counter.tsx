'use client'


// So we need to export metadata from the server client and keep the client component separate

// You are attempting to export "metadata" from a component marked with "use client", which is disallowed. "metadata" must be resolved on the server before the page component is rendered. Keep your page as a Server Component and move Client Component logic to a separate file. Read more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#why-generatemetadata-is-server-component-only

import { useState } from "react";

export default function CounterPage(){
    const [count,setcount] = useState(0)
    return (
        <>
        <p>Count: {count}</p>
        <button onClick={()=>setcount(count+1)}>Increase</button>
        </>
    )
}