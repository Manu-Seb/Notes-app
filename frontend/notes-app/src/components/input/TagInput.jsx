import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({tags,setTags}) => {
    const [inputValue,setInputValue]=useState('');

    const handleInputChange=(e)=>{
        setInputValue(e.target.value);
    }

    const addNewTag=()=>{
        if(inputValue.trim()!==''){
            setTags([...tags,inputValue.trim()]);
            setInputValue('');
        }
    }

    const handleKeyDown=(e)=>{
        if(e.key==='Enter'){
            addNewTag();
        }
    }

    const handleRemoveTag=(tagtoremove)=>{
        setTags(tags.filter((tag)=>tag!==tagtoremove))
    }

  return (
    <div>
        {tags?.length>0 && (
            <div className='flex items-center gap-2 flex-wrap mt-2'>
                {tags.map((tag,index)=>(
                    <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 rounded mx-1 py-1 px-3 '>
                        #{tag}
                        <button className='' onClick={()=>{handleRemoveTag(tag)}}>
                            <MdClose />
                        </button>
                    </span>
                ))}
            </div>
        )}
        <div className='flex items-center gap-2 mt-2'>
            <input
                type='text'
                className=' outline-none text-sm border px-3 py-2 '
                placeholder='Add tags'
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={()=>{addNewTag()}} className='w-8 h-8 flex items-center justify-center rounded-full border border-blue-400 hover:bg-blue-700 hover:border-blue-700' >
                <MdAdd className='text-blue-600 text-2xl hover:text-white'/>
            </button>
        </div>
    </div>
  )
}

export default TagInput
