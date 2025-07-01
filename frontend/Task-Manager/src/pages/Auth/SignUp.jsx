import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector"
import Input from "../../components/Inputs/input";
import { Link , useNavigate} from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContext.jsx";
import { uploadImage } from "../../utils/uploadImage.js";

const SignUp = () =>{
    const [profilePic, setProfilePic] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [adminInviteToken, setAdminInviteToken] = useState("")
    const [error, setError] = useState(null);

    const {updateUser}  = useContext(UserContext);
    const navigate = useNavigate();

        // Handle SignUp form submit
        const handleSignUp = async (e) => {
            e.preventDefault();
    
            if(!fullName){
                setError("Please enter your full name")
                return;
            }
            
            if(!validateEmail(email)){
                setError("Please enter a valid email address")
                return
            }
            if(!password){
                setError("Please enter the password");
                return;
            }
    
            setError("");
    
            // SignUp API call
            try {

                if(profilePic){
                    const imguploadRes = await uploadImage(profilePic);
                    profileImageUrl = imguploadRes.imageUrl || "";
                }
                const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                    name : fullName,
                    email,
                    password,
                    adminInviteToken
                });

                const { token, role } = response.data;
                if(token){
                    localStorage.setItem("token", token);
                    updateUser(response.data);

                    // Redirect based on role
                    if(role === "admin"){
                        navigate("/admin/dashboard");
                    }
                    else{
                        navigate("/user/dashboard");
                    }
                }
            } catch (error) {
                if(error.response && error.response.data.message){
                    setError(error.response.data.message);
                }else{
                    setError("SOmething went wrong. Please try again.")
                }
            }
        };

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex-col justify-center">
                <h3 className="text-xl" font-semibold= "true" text-black= "true">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below.

                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image= {profilePic} setImage = {setProfilePic}></ProfilePhotoSelector>
                    <div className="grid grid-cols-1 md:grid:cols-2 gap-4">
                        <Input 
                        value = {fullName}
                        onChange = { ({target}) => setFullName(target.value)}
                        label= "Full Name"
                        placeholder = "John"
                        type="text"
                        />
                         <Input 
                        value = {email} 
                        onChange = {( {target}) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="john@example.com"
                        type="text"
                        />
                        </div>
                    <div className="grid grid-cols-1 md:grid:cols-2 gap-4">
                        <Input 
                        value = {password} 
                        onChange = {( {target}) => setPassword(target.value)}
                        label="Password"
                        placeholder="Min 8 Characters"
                        type="password"
                        />
                        <Input 
                        value = {adminInviteToken} 
                        onChange = {( {target}) => setAdminInviteToken(target.value)}
                        label="Admin Invite Token"
                        placeholder="6 Digit code"
                        type="text"
                        />
                    </div>  
                        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                        <button type = "submit" className="btn-primary">
                            SIGN UP
                        </button>

                        <p className="text-[13px] text-slate-800 mt-3">
                            Already an account?{" "}
                            <Link className = "font-medium text-orange-500 underline" to= "/login">
                            Login
                            </Link>
                        </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp;