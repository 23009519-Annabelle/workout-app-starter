import { useState } from "react"
import useSignup from "../hooks/useSignup"  // Default import (since useSignup is exported as default)

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signup, error, isLoading } = useSignup()

  console.log("useSignup hook imported:", { signup, error, isLoading }); // Log the imported values

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Form submitted with email:", email, "password:", password); // Log the form submission details

    await signup(email, password)
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
      />
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} 
      />

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup
