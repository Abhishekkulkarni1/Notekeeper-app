import React, { useState }  from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosIns from '../../utils/axiosIns'


const Login = () => {

  const [email, setEmail] = useState("")  
  const [password, setPassword] = useState("")  
  const [error, setError] = useState(null)  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
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
        const response = await axiosIns.post("/login", {
            email: email,
            password: password,
        })
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
                <form onSubmit={handleLogin}>
                    <h4 className='text-2xl mb-7 items-center justify-center flex'>Login</h4>
                    <input type = "text" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit' className='btn-primary'>
                        Login
                    </button>
                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                    <p className='text-sm text-center mt-4'>
                        Not Registered, Click here {" "}
                        <Link to = "/signup" className='font-medium text-primary underline'>
                            Create Your Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login