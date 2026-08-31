  import 'react'
  import { HashLink } from 'react-router-hash-link';
  import './Navbar.css'

  function Navbar() {
    return (
      <>
        <div className="navbar">
          <HashLink smooth to="/#hero" className="scroll-link"> <section> <h1>Blood Brothers</h1> </section> </HashLink>
          <HashLink smooth to="/#urgent" className="scroll-link"> <section> <h2>Urgencies</h2> </section> </HashLink>
          <HashLink smooth to="/#donate" className="scroll-link"> <section> <h2>Donate</h2> </section> </HashLink>
          <HashLink smooth to="/#about" className="scroll-link"> <section> <h2>About us</h2> </section> </HashLink>

          <HashLink to="/login" className="log"> <section> <h2>Log in or Sign Up</h2> </section> </HashLink>
        </div>

      </>
    )
  }
  export default Navbar