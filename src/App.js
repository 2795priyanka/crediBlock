import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './assets/css/style.css'
import Login from './auth/login/Login';
import SignUp from './auth/signup/SignUp';
import ForgotPwd from './auth/login/ForgotPwd';
import ResetPwd from './auth/login/ResetPwd';
import Chat from './Pages/Chat';
import LandingPage from './Pages/LandingPage';

// import Page from './Page'

function App() {
  return (
    <div className="App">

      {/* <Page/> */}
      <BrowserRouter basename='/credit_block/'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/forgot_pwd" element={<ForgotPwd />} />
          <Route path="/reset_pwd" element={<ResetPwd />} />
          <Route path="/login?role=1" element={<Login />} />
          <Route path="/login?role=2" element={<Login />} />
          <Route path="/login?role=3" element={<Login />} />
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
// basename='/credit_block/'