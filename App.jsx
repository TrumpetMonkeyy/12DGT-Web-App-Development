import 'react'
import './App.css'
import Navbar from './Navbar.jsx'
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Dashboard from './Dashboard.jsx';

function App() {

  const [urgencies, setUrgencies] = useState([
    { id: 1, bloodType: 'Any', hospital: 'Waikato Hospital', status: 'Critical', note: 'Recent earthquakes and floods result in a mass of severe injuries' },
    { id: 2, bloodType: 'A+', hospital: 'Auckland City Hospital', status: 'Critical', note: 'Needed immediately due to multiple unexpected surgeries before standard resupply'},
    { id: 3, bloodType: 'B-', hospital: 'Wellington Regional', status: 'High', note: 'Supply running unexpectedly low, early restock necessary' }
  ]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 56}, (_, i) => currentYear - 71 + i).reverse(); // Ages 16 to 71
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [blockedAppointments, setBlockedAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('');

  const handleDonateSubmit = async (e) => {
  e.preventDefault();

  const isBlocked = blockedAppointments.some(
    (appt) => appt.date === aptDate && appt.time === aptTime
  );

  if (isBlocked) {
    alert("This appointment time is unavailable. Please select another time.");
    return;
  }

  // Extract the exact values from the form inputs
  const dob = `${e.target.querySelector('.day').value} ${e.target.querySelector('.month').value} ${e.target.querySelector('.year').value}`;
  const location = e.target.querySelector('.location').value;

  try {
    const response = await fetch('http://localhost:3001/book-donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dob, location, aptDate, aptTime })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      e.target.reset();
      setAptDate('');
      setAptTime('');
    } else {
      alert("Booking failed: " + data.message);
    }
  } catch (error) {
    alert("Cannot connect to the server.");
    console.error(error);
  }
};

  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();
  const handleAdminLogin = (e) => {
  e.preventDefault();
  
  if (adminPassword === 'admin123') { 
    localStorage.setItem('user', JSON.stringify({ name: 'Admin' }));
    navigate('/dashboard');
  } else {
    alert('Incorrect Admin Password');
  }
  };

  return (
    <Routes>

      <Route path="/dashboard" element={
        <Dashboard
          urgencies={urgencies} 
          setUrgencies={setUrgencies} 
          blockedAppointments={blockedAppointments} 
          setBlockedAppointments={setBlockedAppointments}
        />
      } />
        
          <Route path="/" element={

            <div className="umbrella">

              <Navbar/>
            
              <main className="content">

                <div id="hero" className="contenth">
                  <h1 className="hero-title">BLOOD BROTHERS</h1>
                  <h2 className="hero-subtitle">YOUR DONATION CAN SAVE THREE OF US</h2>
                </div>
                
                <div className="contentmain">
                  <div id="urgent" className="contentu">
                    <h2>Urgencies</h2>
                    <div className="urgency-list">
                      {urgencies.map((urgency) => (
                        <div key={urgency.id} className="urgency-card">
                          <h3><strong>{urgency.bloodType}</strong></h3>
                          <p>Location: {urgency.hospital}</p>
                          <p>Status: {urgency.status}</p>
                          <p>Note: {urgency.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div id="donate" className="contentd">
                    <h2>Book a Donation</h2>
                    <form className="donate-form" onSubmit={handleDonateSubmit}>
                      
                      {/* Age Selection */}
                      <div className="age">
                        <label>Date of Birth <i>(Ages 16-71)</i></label>
                        <div className="dob">
                          <select required className="day"><option value="">Day</option>{days.map(d => <option key={d}>{d}</option>)}</select>
                          <select required className="month"><option value="">Month</option>{months.map(m => <option key={m}>{m}</option>)}</select>
                          <select required className="year"><option value="">Year</option>{years.map(y => <option key={y}>{y}</option>)}</select>
                        </div>
                      </div>

                      {/* Location Selection */}
                      <select required className="location">
                        <option value="">Select Nearest Location</option>
                        <option value="Epsom">Epsom Donor Centre (Blood, plasma, platelets)</option>
                        <option value="North Shore">North Shore Donor Centre (Blood, plasma)</option>
                        <option value="Constellation">Constellation Drive Donor Centre (Blood, plasma)</option>
                        <option value="Manukau">Manukau Donor Centre (Blood, plasma)</option>
                      </select>

                      {/* Appointment Selection Trigger */}
                      <div className="apt">
                        <button type="button" onClick={() => setIsModalOpen(true)}>
                          {aptDate && aptTime ? `Selected: ${aptDate} at ${aptTime}` : "Select Appointment Time"}
                        </button>
                      </div>

                      <button type="submit" className="schedule">Schedule Appointment</button>
                    </form>

                    {/* Popup Modal for Appointment Selection */}
                    {isModalOpen && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <h3>Select Date & Time</h3>
                          <input type="date" required value={aptDate} onChange={(e) => setAptDate(e.target.value)} />
                          <input type="time" required value={aptTime} onChange={(e) => setAptTime(e.target.value)} />
                          <button onClick={() => setIsModalOpen(false)}>Confirm Time</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div id="about" className="contenta">
                    <h2>About us</h2>

                    <div className="atxt">
                      <h3>Who are we?</h3>
                      <p>Bloodbrothers is a webapp aimed at raising awareness to the rising need of blood in New Zealand. </p>

                      <h3>Our misson</h3>
                      <p>Less than 5% of eligible New Zealanders actively donate blood, plasma or platelets. This is simply insufficient as the weekly demand in New Zealand requires over 5,000 donations every week in order to keep afloat.</p>

                      <h3>Rising demands</h3>
                      <p>Over 30,000 New Zealanders rely on blood and plasma products to survive each year, this number is only growing more and more. Demand for plasma medicines is also predicted to jump significantly due to advancements in medical treatments.</p>

                      <h3>How you can help</h3>
                      <p>The NZBS (New Zealand Blood Service) is in desperate need of a consistent new flow of blood donors. One 45 minute donation can save up to three lives. Check if you're eligible, start saving lives now.</p>
                    </div>

                  </div>
                </div>

                <div className="admin-section">
                  <div className="admin-box">
                    <h3>Dashboard</h3>
                    <form onSubmit={handleAdminLogin}>
                      <input 
                        type="password" 
                        placeholder="Admin password" 
                        value={adminPassword} 
                        onChange={(e) => setAdminPassword(e.target.value)} 
                        required 
                      />
                      <button type="submit">Login</button>
                    </form>
                  </div>
                </div>

              </main>
            </div>
          } />

    </Routes>

  )
}
export default App