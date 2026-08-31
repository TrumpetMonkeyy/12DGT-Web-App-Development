import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import './Login.css'

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState ('')
  const [isLogin, setIsLogin] = useState ('true')

  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    window.scrollTo(0,0);
  }, []);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save the user data to the browser
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.name}!`);
        
        // Redirect to the dashboard
        navigate('/#hero'); 
      } else {
        alert(data.message); // Show error if login fails
      }
      
    } else {
      // Your existing sign-up fetch code goes here
      const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      console.log(data.message); 
    }
  }

  return (
    <div className="logumbrella">

      <div className="lognav">
        <Navbar/>
      </div>

      <main className="logcontentmain">

        <h1 className="logtitle">Welcome back!</h1>

        <form className="login-form" onSubmit={handleSubmit}>

          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
                  
          <input 
            type="password" 
            placeholder="Password" 
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
                  
          <button type="submit" className="login-button">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="signup" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up!" : "Already have an account? Log in!"}
        </p>
      </main>
    </div>
  )
}

export default Login