import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./components/context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Workspace from "./pages/Workspace";
import WorkspaceNav from "./components/navbar/WorkspaceNav";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
           path="/profile" 
           element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                <Workspace />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />  
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
