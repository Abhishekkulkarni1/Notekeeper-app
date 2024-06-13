import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosIns from '../../utils/axiosIns'

const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault()
        if(!name){
            setError("Please enter your name")
            return
        }
        if(!validateEmail(email)){
            setError("Please enter a valid email address")
            return;
        }
        if(!password){
            setError("Please enter a valid")
            return;
        }
        setError("")
        
        try{
            const response = await axiosIns.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            })
            if(response.data && response.data.error){
                setError(response.data.message)
                return
            }
            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken)
                navigate("/home")
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }else{
                setError("An error occured,Please try again later")
            }
        }
    }
  return (
    <>
        <Navbar />
        <div className='flex items-center justify-center mt-28'>
            <div className='w-96 border rounded px-7 py-10'>
                <form onSubmit={handleSignUp}>
                    <h4 className='text-2xl mb-7 items-center justify-center flex'>SignUp</h4>
                    <input type = "text" placeholder='Name' className='input-box' value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type = "text" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <PasswordInput type = "text" placeholder='Password' className='input-box' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit' className='btn-primary'>
                        SignUp
                    </button>
                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                    <p className='text-sm text-center mt-4'>
                        Already Registered, Click here {" "}
                        <Link to = "/login" className='font-medium text-primary underline'>
                            Login
                        </Link>
                    </p>
                </form>
                
            </div>
        </div>
    </>
  )
}

export default SignUp