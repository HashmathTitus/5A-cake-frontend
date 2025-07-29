import './App.css';
import { Route,Routes } from 'react-router-dom'
import AddTicket from './ticketmanagement/Addticket'
import TicketList from './ticketmanagement/Tickets'
import TicketDetails from './ticketmanagement/ticketKutty'
import Updateticket from './ticketmanagement/Updateticket'
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import 'sweetalert2/dist/sweetalert2.min.css';

function App() {
  return (
    <div>
      <Navbar/>
        <Routes>
        <Route path='/add' element={<AddTicket/>}/>
        <Route path='/tickets' element={<TicketList/>}/>
        <Route path='/update/:id' element={<Updateticket/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/ticketForAdminKutty' element={<TicketDetails/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
