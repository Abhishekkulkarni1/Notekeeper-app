import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom';
import axiosIns from '../../utils/axiosIns';
import moment from "moment"
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/Cards/EmptyCard';



const Home = () => {

  const [allNotes, setAllNotes] = useState([])
  const  [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  })

  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"})
  }

  const showToastMessage = (message, type) => {
    setShowToastMsg({isShown: true, message, type})
  }
  const handleCloseToast = () => {
    setShowToastMsg({isShown: false, message: ""})
  }
  
  const getUserInfo = async() => {
      try{
        const response = await axiosIns.get("/get-user")
        if(response.data && response.data.user){
            setUserInfo(response.data.user)
        }
    }catch(error){
      if(error.response.status === 401){
          localStorage.clear()
          navigate("/login")
      }
    }
  }

  const getAllNotes = async() => {
    try{
      const response = await axiosIns.get("/get-all-notes")
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    }catch(error){
      console.log("An error occured, Please try again later")
    }
  }

  const deleteNote = async(data) => {
    const noteId = data._id
      try{
        const response = await axiosIns.delete("/delete-note/" + noteId)
        if(response.data && !response.data.error){
            showToastMessage("Note Deleted succesfully", "delete")
            getAllNotes()
        }
    }catch(error){
        if(error.response && error.response.data && error.response.data.message){
          console.log("An error occured, Please try again later")
        }
    }
  }

  const pinNote = async(noteData) => {
    const noteId = noteData._id
      try{
        const response = await axiosIns.put("/update-pinned-note/" + noteId, {
          isPinned: !noteData.isPinned
        })
        if(response.data && !response.data.error){
            showToastMessage("Note Updated succesfully")
            getAllNotes()
        }
    }catch(error){
        
          console.log("An error occured, Please try again later")
        
    }
  }

  const searchNote = async(query) => {
      try{
        const response = await axiosIns.get("/search-notes" , {
          params: {query}
        })
        if(response.data && response.data.notes){
            setIsSearch(true)
            setAllNotes(response.data.notes)
        }
      }catch(error){
        
          console.log("An error occured, Please try again later")
        
      }
  }

  const handleClearSearch = async () => {
    setIsSearch(false)
    getAllNotes()
  }

  useEffect(() => {
    getAllNotes()
    getUserInfo()
    return () => {}
  }, [])
  
  return (
    <>
      <Navbar userInfo = {userInfo} searchNote = {searchNote} handleClearSearch = {handleClearSearch} /> 
      <div className='container mx-auto'>
        {allNotes.length > 0 ? (<div className='grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item, index) => (
            <NoteCard 
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format("DD/MM/YYYY")}
              // date = {item.reatedOn}
              content={item.content}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => pinNote(item)}
            />
          ))}
        </div>) :(
          <EmptyCard  />
        ) }
      </div>
      <button 
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
        onClick={() => {setOpenAddEditModal({isShown:true, type: "add", data: null})}}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen = {openAddEditModal.isShown}
        onRequestClose = {() => {}}
        style = {{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel = ""
        className = "w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >

      <AddEditNotes 
        type = {openAddEditModal.type}
        noteData={openAddEditModal.data}
        onClose={() => {
          setOpenAddEditModal({isShown: false, type: "add", data:null})
        }}
        getAllNotes={getAllNotes}
        showToastMessage = {showToastMessage}

      />
      </Modal>

      <Toast 
        isShown = {showToastMsg.isShown}
        message = {showToastMsg.message}
        type = {showToastMsg.type}
        onClose = {handleCloseToast}
      />

    </>
  );
};

export default Home;
