import bcrypt from "bcryptjs";

export const comparePassword = async(enteredPassword, hashedPassword) =>{
   try {
    return await bcrypt.compare(enteredPassword,hashedPassword);
   } catch (error) {
    console.error(`Error while comparing password : ${error}`)
    return false;
   }
}

