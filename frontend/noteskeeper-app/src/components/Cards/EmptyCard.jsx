import React from 'react'

const EmptyCard = ({imgSrc, message }) => {
  return (
    // <div className='flex flex-col items-center justify-center mt-20'>
    //     <img src = {imgSrc} alt = "No notes" className='w-60' />
    //     <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
    //         {message}
    //     </p>
    // </div>
    <div>
        <h6 className='flex flex-col items-center justify-center mt-20'>
            Write your first note by clicking on the Add button
            <br></br>
            <h1>Let's get started</h1>
        </h6>
    </div>
  )
}

export default EmptyCard