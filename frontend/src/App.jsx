import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddActivity from "./pages/student/AddActivity";
import StudentProfile from "./pages/student/StudentProfile";
import Students from "./pages/faculty/Students";
import LeaderBoard from "./pages/faculty/LeaderBoard";
import AllStudents from "./pages/admin/AllStudents";
import AllFaculty from "./pages/admin/AllFaculty";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes */}
          <Route path="/student/addActivity" element={<AddActivity />} />
          <Route path="/student/profile" element={<StudentProfile />} />

          {/* Faculty Routes */}
          <Route path="/faculty/students" element={<Students />} />
          <Route path="/faculty/leaderBoard" element={<LeaderBoard />} />

          {/* Admin Routes */}
          <Route path="/admin/students" element={<AllStudents />} />
          <Route path="/admin/faculty" element={<AllFaculty />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
