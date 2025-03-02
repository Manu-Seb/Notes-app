import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'; 
const Passwordinput = ({value, onChange, placeholder}) => {
  

    const [isShowPassword,setIsShowPassword] =useState(false);

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };
    return (
    <div className='outline-none flex text-sm items-center bg-transparent rounded border-[1.5px]  px-5 mb-2'>
        <input 
          value={value}
          onChange={onChange}
          type={isShowPassword ? "text":"password"}
          placeholder={placeholder|| "password"}
          className='w-full text-sm bg-transparent py-3  mr-3 rounded outline:none'
        />
    

        {isShowPassword?<FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => toggleShowPassword()}
          /> 
          :
           <FaRegEyeSlash
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={()=> toggleShowPassword()}
            /> 
          }
      </div>
  )
}

export default Passwordinput
