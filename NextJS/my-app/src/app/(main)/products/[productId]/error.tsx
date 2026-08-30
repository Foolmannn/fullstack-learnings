'use client'
// THIS WILL NOT HANDLE THE ERROR ON THE LAYOUT OF THE SAME SEGMENT SO WE NEED TO MOVE ERRO .TSX TO THE PARENT DIRECTORY TO HANDLE THE CHILD LAYOUT ERRORS

// AND FOR THOSE WHO DOESNOT HAVE THE PARENT LEVEL IE THEY ARE AT THE HIGHEST LEVEL WE NEED THE GLOBAL ERROR. TSX FILE 


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