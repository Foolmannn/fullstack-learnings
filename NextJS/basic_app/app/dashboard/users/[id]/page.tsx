import React from 'react'

const UserDetail = async ({params}: {params : Promise<{id: string}>}) => {

    const {id} = await params;
  return (
    <div>Showing Detail of {id}</div>
  )
}

export default UserDetail