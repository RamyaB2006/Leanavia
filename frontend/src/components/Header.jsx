import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaPlus,
  FaClipboardList,
  FaTrophy,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  // State for user role (you would typically get this from authentication context)
  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || "student"
  ); // 'student', 'faculty', or 'admin'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Change this function to switch between roles for demonstration
  const changeRole = (role) => {
    setUserRole(role);
    localStorage.setItem("role", role);
    setMobileMenuOpen(false);
  };

  // Navigation links based on role
  const getNavLinks = () => {
    switch (userRole) {
      case "faculty":
        return [
          {
            name: "Activities",
            icon: <FaClipboardList className="text-lg" />,
            href: "/faculty/students",
          },
          {
            name: "Leaderboard",
            icon: <FaTrophy className="text-lg" />,
            href: "/faculty/leaderboard",
          },
          {
            name: "Logout",
            icon: <FaSignOutAlt className="text-lg" />,
            href: "/login",
          },
        ];
      case "admin":
        return [
          {
            name: "All Students",
            icon: <FaUserGraduate className="text-lg" />,
            href: "/admin/students",
          },
          {
            name: "All Faculty",
            icon: <FaChalkboardTeacher className="text-lg" />,
            href: "/admin/faculty",
          },
          {
            name: "Logout",
            icon: <FaSignOutAlt className="text-lg" />,
            href: "/login",
          },
        ];
      default: // student
        return [
          {
            name: "Add Activity",
            icon: <FaPlus className="text-lg" />,
            href: "/student/addActivity",
          },
          {
            name: "Profile",
            icon: <FaUser className="text-lg" />,
            href: "/student/profile",
          },
          {
            name: "Logout",
            icon: <FaSignOutAlt className="text-lg" />,
            href: "/login",
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="p-2 rounded-lg bg-white bg-opacity-20">
                {userRole === "student" && (
                  <FaUserGraduate className="text-xl text-white" />
                )}
                {userRole === "faculty" && (
                  <FaChalkboardTeacher className="text-xl text-white" />
                )}
                {userRole === "admin" && (
                  <FaUserTie className="text-xl text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-white">
                Learnavia
                <span className="text-xs font-normal ml-2 opacity-80">
                  {userRole === "student" && "Student Portal"}
                  {userRole === "faculty" && "Faculty Portal"}
                  {userRole === "admin" && "Admin Portal"}
                </span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white"
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}

              
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-indigo-700"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  ))}

             
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
