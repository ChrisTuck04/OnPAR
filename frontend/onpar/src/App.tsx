import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CalendarPage from './pages/CalendarPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const App = () => {
  return (
    <div className="bg-onparBlue">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />}/>
        <Route path="/forgotPassword" element={<ForgotPasswordPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/resetPassword" element={<ResetPasswordPage/>}/>
      </Routes>
    </div>
  );
};

export default App;