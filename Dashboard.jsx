import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

<body style={{Height: '100vh', margin:'0'}}/>

function Dashboard({ urgencies, setUrgencies, blockedAppointments, setBlockedAppointments }) {
  const [bookings, setBookings] = useState([]);

  // Fetch bookings automatically when the Dashboard loads
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:3001/bookings');
        const data = await response.json();
        
        if (response.ok) {
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings:", data.message);
        }
      } catch (error) {
        console.error("Network error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []); // The empty array ensures this only runs once when opened
  
  const navigate = useNavigate();

  // Urgency Form State
  const [bloodType, setBloodType] = useState('');
  const [hospital, setHospital] = useState('');
  const [status, setStatus] = useState('Critical');
  const [note, setNote] = useState('');

  // Blocked Appointment Form State
  const [blockDate, setBlockDate] = useState('');
  const [blockTime, setBlockTime] = useState('');

  // Check login state
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Add Urgency Handler
  const handleAddUrgency = (e) => {
    e.preventDefault();
    const newUrgency = {
      id: Date.now(),
      bloodType,
      hospital,
      status,
      note
    };
    setUrgencies([...urgencies, newUrgency]);
    setBloodType('');
    setHospital('');
    setNote('');
  };

  // Remove Urgency Handler
  const handleDeleteUrgency = (idToRemove) => {
    setUrgencies(urgencies.filter(item => item.id !== idToRemove));
  };

  // Block Appointment Time Handler
  const handleBlockAppointment = (e) => {
    e.preventDefault();
    const newBlock = {
      id: Date.now(),
      date: blockDate,
      time: blockTime
    };
    setBlockedAppointments([...blockedAppointments, newBlock]);
    setBlockDate('');
    setBlockTime('');
  };

  // Unblock Time Handler
  const handleRemoveBlock = (idToRemove) => {
    setBlockedAppointments(blockedAppointments.filter(item => item.id !== idToRemove));
  };

  if (!user) {
    return (
      <div style={{ padding: '4rem', color: 'white', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Please log in using the admin box at the bottom of the home page.</p>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ec4f4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}
        >
          Return to Main Page
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="admin-bookings">
      <h2>Scheduled Donations</h2>
      {bookings.length === 0 ? (
        <p>No donations scheduled yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Location</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                {/* Date is sliced to remove the timestamp portion for cleaner display */}
                <td>{booking.appointment_date.slice(0, 10)}</td>
                <td>{booking.appointment_time}</td>
                <td>{booking.location}</td>
                <td>{booking.dob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    
    <div style={{ padding: '2rem', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '1rem' }}>
        <h1>Admin Control Panel</h1>
        <button 
          onClick={handleLogout} 
          style={{ padding: '0.5rem 1.2rem', backgroundColor: '#ec4f4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Exit
        </button>
      </div>
      

      {/* 1. MANAGE URGENCIES SECTION */}
      <section style={{ marginBottom: '3rem', backgroundColor: '#2b2b2b', padding: '1.5rem', borderRadius: '12px' }}>
        <h2>Manage Urgencies List</h2>
        <form onSubmit={handleAddUrgency} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Blood Type (e.g. O-)" 
              value={bloodType} 
              onChange={(e) => setBloodType(e.target.value)} 
              required 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
            />
            <input 
              type="text" 
              placeholder="Hospital Location" 
              value={hospital} 
              onChange={(e) => setHospital(e.target.value)} 
              required 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
            />
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
            </select>
          </div>
          <input 
            type="text" 
            placeholder="Additional Notes (Optional)" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <button 
            type="submit" 
            style={{ padding: '0.75rem', backgroundColor: '#ec4f4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '200px' }}
          >
            Add Urgency
          </button>
        </form>

        <h3>Active Urgencies ({urgencies.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {urgencies.map((urgency) => (
            <div key={urgency.id} style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
              <div>
                <strong>{urgency.bloodType}</strong> — {urgency.hospital} <em>({urgency.status})</em>
                {urgency.note && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>Note: {urgency.note}</p>}
              </div>
              <button 
                onClick={() => handleDeleteUrgency(urgency.id)} 
                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#d43d3d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. BLOCK APPOINTMENTS SECTION */}
      <section style={{ backgroundColor: '#2b2b2b', padding: '1.5rem', borderRadius: '12px' }}>
        <h2>Block Appointment Times</h2>
        <form onSubmit={handleBlockAppointment} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input 
            type="date" 
            value={blockDate} 
            onChange={(e) => setBlockDate(e.target.value)} 
            required 
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <input 
            type="time" 
            value={blockTime} 
            onChange={(e) => setBlockTime(e.target.value)} 
            required 
            style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <button 
            type="submit" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ec4f4f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Block Time Slot
          </button>
        </form>

        <h3>Blocked Times ({blockedAppointments.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {blockedAppointments.length === 0 ? (
            <p style={{ color: '#aaa' }}>No appointment slots blocked.</p>
          ) : (
            blockedAppointments.map((appt) => (
              <div key={appt.id} style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
                <div>
                  <strong>Date:</strong> {appt.date} | <strong>Time:</strong> {appt.time}
                </div>
                <button 
                  onClick={() => handleRemoveBlock(appt.id)} 
                  style={{ padding: '0.4rem 0.8rem', backgroundColor: '#d43d3d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
    </>
  );
}

export default Dashboard;