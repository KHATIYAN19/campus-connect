import React from "react"
import { useState,useEffect } from "react";
import { GrCaretNext } from "react-icons/gr";
import axios from "../LoginSignUp/axios.js";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const Blocked = (props) => {
   const navigate=useNavigate();
    const [user,SetUser]=useState([]);
    const [email,setEmail]=useState('');
    useEffect(()=>{
      axios.get("http://localhost:8080/blocked/allUser").then((res)=>{
        console.log("data",res.data.data);
        SetUser(res.data.data);
      })
     },[]);
    const addHandler = async (e) => {
      e.preventDefault();    
      try {
          const response = await axios.post('http://localhost:8080/blocked/addUser', email);
          const signup = response.data.success;
          if (signup) {
              toast.warning(response.data.Data.name.toUpperCase() + " Verify your Account");
              navigate("/login");
          } else {
              toast.error(response.data.message);
          }
      } catch (error) {
         
          toast.error(error.response.data.message);
      }
  };
  async function  deleteHandler(email) {
    try {
      const response = await axios.delete(`http://localhost:8080/blocked/deleteUser/${email}`);
      const res = response.data.success;
      if (res) {
          toast.warning("User Unblocked");
          SetUser(user.filter((user) => user.email !== email));
      } else {
          toast.error(response.data.message);
      }
  } catch (error) {
      toast.error(error.response.data.message);
  }
  }
  return (
    
    <div className="my-10  w-full  mx-auto">
          <div>
          <p>Enter Mail For Blocked A User</p>
          </div>
          <div className="flex items-center gap-6">
             <form action="" onSubmit={addHandler}>
              <input  className=" border-2 px-2 py-2 w-[300px] pl-4 rounded-xl "type="text" name="email" id="" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="w-[40px] h-[40px] flex items-center bg-slate-200 justify-center rounded-full cursor-pointer">
                <button type="submit" ><GrCaretNext className="" /></button>
              </div>
             </form>
          </div>
          <div className="">
               <h3>All Blocked User</h3>
                {user.length==0?(<h4>No Blocked User</h4>):(
                  <div>
                       
                   {
                     user.map((item, idx) =>
                    
                       <div className="flex gap-5 items-center">
                            <p>{idx+1}</p>
                            <p>{item.email}</p>
                            <><MdDelete className=" cursor-pointer "  onClick={()=>{deleteHandler(item.email)}}/></>

                       </div>
                    
                    ) 
                   }


                  </div>
                 


                )}
          </div>
    </div>
  )
};
export default Blocked;
