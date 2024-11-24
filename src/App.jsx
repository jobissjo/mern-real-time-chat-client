import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Loader from "./components/loader.jsx";
import { useSelector } from "react-redux";

function App() {
  const {loader} = useSelector(state=> state.loaderReducer)
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader  />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
