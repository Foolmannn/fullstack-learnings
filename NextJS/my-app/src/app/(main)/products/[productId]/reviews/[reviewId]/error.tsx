'use client'

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

import React from 'react'

function ErrorBoundary({error,reset}:{error:Error,
    reset: ()=> void;
}) { // this gets the error object which can be used to receive the reset and message
// better approach is to use the router to reload or transition
    const router = useRouter();
    const reload = () =>{
        startTransition(()=>{
            router.refresh();
            reset();
        })
    }
  return (
    <div> 
        {/* Error in review Id  */}
        <p>
         {error.message}
        </p>
        {/* <button onClick={reset}>Try Again</button> */}
        <button onClick={reload}>Try Again</button>
    </div>
  )
}

export default ErrorBoundary