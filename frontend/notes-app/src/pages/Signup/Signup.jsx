import React,{useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { validateEmail } from '../../utils/helper';
import Passwordinput from '../../components/input/passwordinput';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';


const Signup = () => {

  const [Name,setName]=useState("");
  const [Email,setEmail]=useState("");
  const [Password,setPassword]=useState("");
  const [Error,setError]=useState(null);

  const navigate=useNavigate();

  const handleSignup=async(e)=>{
    e.preventDefault();

    if(!Name){
      setError("Enter your name");
      return;
    }
    if(!validateEmail(Email)){
      setError("Enter a valid Email")
      return;
    }
    if(!Password){
      setError("Enter a password");
      return;
    }
    setError("")

    try{
      const response= await   axiosInstance.post("/create-account",{
        fullName:Name,
        email:Email,
        password:Password,
      });

      if(response.data && response.data.error){
        setError(response.data.message);
        return;
      }

      if(response.data && response.data.accessToken){
        
        localStorage.setItem("token",response.data.accessToken)
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response &&  error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("an unexpected error has occurred");
      }
    }
  }

  return (
    <>
      <Navbar/>

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 bornder rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignup}>
            <h4 className='text-2xl mb-7'>Signup</h4>

            <input type='text' placeholder='Name' className='input-box'
              value={Name}
              onChange={(e)=>setName(e.target.value)}
              />

              <input type='text' placeholder='Email' className='input-box'
              value={Email}
              onChange={(e)=>setEmail(e.target.value)}
              />

              <Passwordinput value={Password} onChange={(e)=>setPassword(e.target.value)}/>
               
              {Error && <p className='text-red-500 text-xs'>{Error}</p>}
              <button type='submit' className='btn-primary'>Signup</button>

              <p className='text-sm text-center mt-4'>
                Already have and account?{" "}
                <Link to="/login" className='text-blue-600 text-sm underline'>
                  Login to your account                
                </Link>
              </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup
