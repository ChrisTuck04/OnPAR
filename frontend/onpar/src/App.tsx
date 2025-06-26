import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import JournalPage from './pages/JournalPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import VerificationSuccessPage from './pages/VerificationSuccessPage';
import VerificationFailurePage from './pages/VerificationFailurePage';

const App = () => {
  return (
    <div className="bg-onparBlue">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register-success" element={<RegisterSuccessPage />} />
        <Route path="/verification-success" element={<VerificationSuccessPage />} />
        <Route path="/verification-failure" element={<VerificationFailurePage />} />
      </Routes>
    </div>
  );
};

export default App;