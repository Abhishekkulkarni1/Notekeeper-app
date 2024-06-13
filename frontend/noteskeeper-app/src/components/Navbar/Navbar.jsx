import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import ProfileInfo from '../Cards/ProfileInfo'
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({userInfo, searchNote, handleClearSearch}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  }
  const handleSearch = () => {
    if(searchQuery){
      searchNote(searchQuery)
    }
  }
  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <div className='bg-black flex items-center justify-between px-6 py-3 drop-shadow'>
      <h2 className='text-xl font-medium text-white py-2'> Notes </h2>
      <SearchBar 
        value={searchQuery}
        onChange={({target})=> {
          setSearchQuery(target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar