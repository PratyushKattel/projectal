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
import PageContainer from "./components/PageContainer";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import ProjectDetail from "./pages/ProjectDetail";
import InviteAccept from "./pages/InviteAccept";
import WorkspaceTasks from "./pages/WorkspaceTasks";
import WorkspaceCalendar from "./pages/WorkspaceCalendar";

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
          <Route path="/invite/:token" element={<InviteAccept />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                <PageContainer>
                  <Workspace />
                </PageContainer>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/workspace/:id"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                {/* <PageContainer> */}
                <WorkspaceDetail />
                {/* </PageContainer> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:id/tasks"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                <WorkspaceTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:id/calendar"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                <WorkspaceCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace/:id/project/:projId"
            element={
              <ProtectedRoute>
                <WorkspaceNav />
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
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
