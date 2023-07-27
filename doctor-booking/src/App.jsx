import { Routes,Route } from 'react-router-dom'


import './App.css'

import User from './routes/UserRoute'
import Admin from './routes/AdminRoute'
import DoctorRoute from './routes/DoctorRoute'

function App() {
  

  return (
    <div>
      <Routes>
       <Route element={<User />} path='/*' />
       <Route element={<Admin />} path='/admin/*' />
       <Route element={<DoctorRoute />} path='/doctor/*' />
      
      </Routes>
    </div>
  )
}

export default App
