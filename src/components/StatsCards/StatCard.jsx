import React from 'react'

const StatCard = ({ label, value, icon, accent }) => {
  return (
    <div className="items-center justify-between p-5 bg-white rounded-2xl border border-[#44464B80]">

      <div className='font-["Montserrat"] flex w-full justify-between items-center'>
        <p className="text-[16px] text-gray-500 ">{label}</p>
         <div className={`p-2 rounded-md ${accent}`}>
        {icon}
      </div>
      </div>

        <h3 className="text-[16px] font-semibold">{value}</h3>
     

    </div>
  )
}

export default StatCard