import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Jobs from "./pages/Jobs";
import HrVerify from "./pages/HrVerify";
import HrDashboard from "./pages/HrDashboard";
import HrApplications from "./pages/HrApplications";
import MyApplications from "./pages/MyApplications";
import InterviewSchedule from "./pages/InterviewSchedule";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/upload"            element={<Upload />} />
        <Route path="/jobs"              element={<Jobs />} />
        <Route path="/my-applications"   element={<MyApplications />} />
        <Route path="/hr-verify"         element={<HrVerify />} />
        <Route path="/hr-dashboard"      element={<HrDashboard />} />
        <Route path="/hr-applications"   element={<HrApplications />} />
        <Route path="/interview/:id"     element={<InterviewSchedule />} />
      </Routes>
    </BrowserRouter>
  );
}


      