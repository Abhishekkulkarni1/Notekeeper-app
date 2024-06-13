import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import axiosIns from '../../utils/axiosIns';

const AddEditNotes = ({noteData, type, getAllNotes, showToastMessage, onClose}) => {

  const [title, setTitle] = useState(noteData?.title || "")
  const [content, setContent] = useState(noteData?.content ||"")
  const [error, setError] = useState(null)

  const addNewNote = async() => {
    try{
        const response = await axiosIns.post("/add-note", {
            title, content
        })
        if(response.data && response.data.note){
            showToastMessage("Note added succesfully")
            getAllNotes()
            onClose()
        }
    }catch(error){
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
    }
  }

  const editNote = async() => {
    const noteId = noteData._id
    try{
        const response = await axiosIns.put("/edit-note/" + noteId, {
            title, content
        })
        if(response.data && response.data.note){
            showToastMessage("Note updated succesfully")
            getAllNotes()
            onClose()
        }
    }catch(error){
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
    }
  }

  const deleteNote = async() => {
    const noteId = noteData._id
    try{
        const response = await axiosIns.put("/delete-note/" + noteId, {
            title, content
        })
        if(response.data && response.data.note){
            showToastMessage("Note Deleted succesfully")
            getAllNotes()
            onClose()
        }
    }catch(error){
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
        }
    }
  }

  const handleAddNote = () => {
    if(!title){
        setError("Please enter the title")
        return;
    }
    if(!content){
        setError("Please enter your content")
        return;
    }
    setError("")
    if(type === "edit"){
        editNote()
    }else{
        addNewNote()
    }
  }

  return (
    
    <div className='relative'>
        <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
            <MdClose className='text-xl text-slate-400' />
        </button>
        <div className='flex flex-col gap-2'>
            <label className='input-label'> Title </label> 
            <input
                type='text'
                className='text-2xl text-slate-950 outline-none'
                placeholder='Add your title'
                value={title}
                onChange={({target}) => setTitle(target.value)}
            />
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'> Content </label> 
            <textarea
                type='text'
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Add your note'
                rows={10}
                value={content}
                onChange={({target}) => setContent(target.value)}
            />
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
            {type === "edit" ? "Update" : "Add"}
        </button>
    </div>
  )
}

export default AddEditNotes