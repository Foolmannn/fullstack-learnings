'use client'

import React from 'react'

function ErrorBoundary({error}:{error:Error}) { // this gets the error object which can be used 
  return (
    <div> 
        {/* Error in review Id  */}
        {error.message}

    </div>
  )
}

export default ErrorBoundary