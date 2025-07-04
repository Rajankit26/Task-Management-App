
import React, { useContext } from "react"
import {BrowserRouter as Router, 
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom"
import Login from "./pages/Auth/Login"
import {Dashboard} from "./pages/Admin/Dashboard.jsx"
import ManageTask from "./pages/Admin/ManageTasks"
import CreateTask from "./pages/Admin/CreateTask"
import ManageUsers from "./pages/Admin/ManageUsers"
import {UserDashboard} from "./pages/User/UserDashboard.jsx"
import MyTasks from "./pages/User/MyTasks"
import ViewTaskDetails from "./pages/User/ViewTaskDetails"
import PrivateRoute from "./routes/PrivateRoutes"
import SignUp from "./pages/Auth/SignUp"
import { UserContext, UserProvider } from "./context/userContext"
function App() {

  return (
    <UserProvider>
   <div>
    <Router>
      <Routes>
        <Route path="/login" element = {<Login />} />
        <Route path="/signup" element = {<SignUp />} />

        {/* Admin Routes */}
        <Route element = {<PrivateRoute allowedRoles= {["admin"]} />}>
        <Route path="/admin/dashboard" element = {<Dashboard />} />
        <Route path="/admin/tasks" element = {<ManageTask />} />
        <Route path="/admin/create-task" element = {<CreateTask />} />
        <Route path="/admin/users" element = {<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route element = {<PrivateRoute allowedRoles= {["admin"]} />}>
        <Route path="/user/dashboard" element = {<UserDashboard />} />
        <Route path="/user/my-tasks" element = {<MyTasks />} />
        <Route path="/user/task-details/:id" element = {<ViewTaskDetails />} />
        </Route>
        <Route path="/" element = {<Root />} />
      </Routes>
    </Router>
   </div>
   </UserProvider>
  )
};

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading)return <Outlet />
  if(!user){
    return <Navigate to={"/login"} />;
  }

  return user.role === "admin" ? <Navigate to={"/user/dashboard"} /> : <Navigate to={"/user/dashboard"} />
};

export default App
