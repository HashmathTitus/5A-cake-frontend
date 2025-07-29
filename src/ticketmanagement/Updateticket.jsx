import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Updateticket = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Tickets, setTicket] = useState({
        title: '',
        description: '',
        category: '',
        priority: '',
        status: '',
        dateReported: '',
        expectedResolutionDate: ''
    });

    // Fetch the ticket details when the component mounts or the id changes
    useEffect(() => {
        axios.get(`http://localhost:4000/TicketController/getTicket/${id}`)
            .then((result) => {
                console.log("Fetched Ticket:", result.data);
                setTicket(result.data);
            })
            .catch((err) => {
                console.error('Error fetching:', err);
                // Better error handling
                if (err.response) {
                    // If the error is from the server response
                    alert(`Error: ${err.response.data.message || 'Unable to fetch ticket data.'}`);
                } else if (err.request) {
                    // If no response is received
                    alert('Error: No response received from the server.');
                } else {
                    // If something else goes wrong
                    alert('Error fetching ticket details. Please try again later.');
                }
            });
    }, [id]);

    // Handle form field changes
    const handleChange = (event) => {
        setTicket({ ...Tickets, [event.target.name]: event.target.value });
    };

    // Handle form submission to update the ticket
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:4000/TicketController/update/${id}`, Tickets)
            .then(() => {
                alert("Details updated successfully!");
                navigate('/tickets');  // Navigate to the homepage or other page after update
            })
            .catch((err) => {
                console.error("Error updating ticket:", err);
                // Better error handling for update
                if (err.response) {
                    alert(`Error: ${err.response.data.message || 'Unable to update ticket.'}`);
                } else {
                    alert("There was an error updating the ticket. Please try again.");
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 py-10">
            <div className="bg-[#e2f0d9] p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Edit Ticket</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={Tickets.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Description:</label>
                        <textarea
                            name="description"
                            value={Tickets.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Priority:</label>
                        <select
                            name="priority"
                            value={Tickets.priority}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Status:</label>
                        <select
                            name="status"
                            value={Tickets.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Date Reported:</label>
                        <input
                            type="date"
                            name="dateReported"
                            value={Tickets.dateReported}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black">Expected Resolution Date:</label>
                        <input
                            type="date"
                            name="expectedResolutionDate"
                            value={Tickets.expectedResolutionDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 py-2 text-white rounded-md hover:bg-green-600 transition"
                    >
                        Update Ticket
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Updateticket;
