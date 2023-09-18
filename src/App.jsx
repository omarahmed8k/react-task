import { useEffect, useState } from 'react'
import { endPoint } from './endPoint'

function App() {
  const [departments, setDepartments] = useState([])
  const [status, setStatus] = useState([])
  const [tickets, setTickets] = useState([])
  const [ticket, setTicket] = useState({
    subject: '',
    from: "",
    to: "",
    status: "",
    description: "",
  })
  const [update, setUpdate] = useState(false)

  async function getStatus() {
    const response = await fetch(`${endPoint}/status`)
    const data = await response.json()
    setStatus(data)
  }

  async function getDepartments() {
    const response = await fetch(`${endPoint}/departments`)
    const data = await response.json()
    setDepartments(data)
  }

  async function getTickets() {
    const response = await fetch(`${endPoint}/tickets`)
    const data = await response.json()
    setTickets(data)
  }

  async function addTicket() {
    console.log(ticket)
    if (!ticket.subject || !ticket.from || !ticket.to || !ticket.status || !ticket.description) {
      alert('Please fill all fields')
      return
    }

    await fetch(`${endPoint}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    })
    handelEmpty();
    getTickets()
  }

  async function deleteTicket(id) {
    await fetch(`${endPoint}/tickets/${id}`, {
      method: 'DELETE',
    })
    getTickets()
  }

  function updateTicket(id) {
    if (!ticket.subject || !ticket.from || !ticket.to || !ticket.status || !ticket.description) {
      alert('Please fill all fields')
      return
    }

    fetch(`${endPoint}/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    })
    handelEmpty();
    getTickets()
  }

  function handelEmpty() {
    setTicket({
      subject: '',
      from: "",
      to: "",
      status: "",
      description: "",
    })
  }

  function handelChange(event) {
    setTicket({ ...ticket, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    getStatus()
    getDepartments()
    getTickets()
  }, [])

  return (
    <div>
      {/* add ticket */}
      <h1>Add Ticket</h1>
      <form onSubmit={(event) => { event.preventDefault(); addTicket() }}>
        <div className="grid">
          <div>
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" onChange={(event) => { handelChange(event) }} value={ticket.subject} />
          </div>
          <div>
            <label htmlFor="from">From</label>
            <select id="from" name="from" onChange={(event) => { handelChange(event) }} value={ticket.from}>
              <option disabled value="">Select</option>
              {departments.map((department) => { return (<option key={department.id} value={department.name}>{department.name}</option>) })}
            </select>
          </div>
          <div>
            <label htmlFor="to">To</label>
            <select id="to" name="to" onChange={(event) => { handelChange(event) }} value={ticket.to}>
              <option disabled value="">Select</option>
              {departments.map((department) => { return (<option key={department.id} value={department.name}>{department.name}</option>) })}
            </select>
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" onChange={(event) => { handelChange(event) }} value={ticket.status}>
              <option disabled value="">Select</option>
              {status.map((status) => { return (<option key={status.id} value={status.name}>{status.name}</option>) })}
            </select>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" name="description" onChange={(event) => { handelChange(event) }} value={ticket.description} />
          </div>
        </div>
        {update && (
          <>
            <button className='edit' onClick={() => { updateTicket(ticket.id); setUpdate(false) }}>Update Ticket</button>
            <button className='cancel' onClick={() => { setUpdate(false); handelEmpty(); }}>Cancel</button>
          </>
        )}
        {!update && <button>Add Ticket</button>}
      </form >

      {/* list tickets */}
      <h1>Tickets</h1>
      <ul>
        {tickets.length > 0 ? tickets?.map((ticket) => {
          return (
            <li key={ticket.id} >
              <div>
                <p>Subject: {ticket.subject}</p>
                <p>From: {ticket.from}</p>
                <p>To: {ticket.to}</p>
                <p>Status: {ticket.status}</p>
                <p>Description: {ticket.description}</p>
              </div>
              <div>
                <button onClick={() => { setTicket(ticket); setUpdate(true) }}>
                  Update
                </button>
                <button onClick={() => { deleteTicket(ticket.id); handelEmpty() }}>
                  Delete
                </button>
              </div>
            </li>
          )
        })
          : <p>No tickets</p>
        }
      </ul>
    </div >
  )
}

export default App
