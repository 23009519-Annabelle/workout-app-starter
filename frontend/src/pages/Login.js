import { useState } from "react"

const Login = () => {
  // State variables to store email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault() // Prevents page reload on submit

    console.log(email, password) // Logs the email and password (for now, to test)
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
      
      <label>Email address:</label>
      <input 
        type="email" 
        onChange={(e) => setEmail(e.target.value)} // Updates email state
        value={email} // Sets the input value to the email state
      />
      
      <label>Password:</label>
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)} // Updates password state
        value={password} // Sets the input value to the password state
      />

      <button>Log in</button> {/* Submits the form */}
    </form>
  )
}

export default Login
