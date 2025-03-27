import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Loader from "./components/loader.jsx";
import { useSelector } from "react-redux";
import Profile from "./pages/profile/Profile.jsx";
import VerifyAccount from "./pages/signup/VerifyAccount.jsx";
import FriendList from "./pages/profile/FriendList.jsx";
import NotificationList from "./pages/profile/NotificationList.jsx";
import PreferenceList from "./pages/profile/PreferenceList.jsx";
import ProfileSecurity from "./pages/profile/ProfileSecurity.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import GlobalSearch from "./pages/home/components/SearchUser/GlobalSearch.jsx";
import { io } from 'socket.io-client';


const socket = io('wss://breakfast-louisiana-attorneys-work.trycloudflare.com');

function App() {
  const {loader} = useSelector(state=> state.loaderReducer)
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader  />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <Home socket={socket} /> </ProtectedRoute> }></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/verify-account" element={<VerifyAccount/>}></Route>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
          <Route path="/friends" element={ <ProtectedRoute><FriendList/></ProtectedRoute>}></Route>
          <Route path="/notifications" element={<ProtectedRoute><NotificationList/></ProtectedRoute>}></Route>
          <Route path="/preferences" element={<ProtectedRoute><PreferenceList/></ProtectedRoute>}></Route>
          <Route path="/security" element={<ProtectedRoute><ProfileSecurity/></ProtectedRoute>}></Route>
          <Route path="/search" element={<ProtectedRoute><GlobalSearch socket={socket} /></ProtectedRoute>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
