import React from 'react'

const Unauthorized = () => {
  return (
    <section className='flex flex-col items-center justify-center min-h-screen gap-2'>
        <h1 className='text-4xl font-extrabold text-red-700'>Access Denied !</h1>
        <p className='text-base'>You are not authorized to access this page</p>
    </section>
  )
}

export default Unauthorized