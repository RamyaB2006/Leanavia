import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Admin login (hardcoded credentials)
      if (role === "admin") {
        if (email === "admin@gmail.com" && password === "admin@123") {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          localStorage.setItem("role", "admin");
          console.log("Admin login successful");
          // Here you would typically set authentication state or redirect
          alert("Admin login successful!");
          navigate("/admin/students");
        } else {
          throw new Error("Invalid admin credentials");
        }
      } else {
        // Student and Faculty login (API call)
        const endpoint =
          role === "student"
            ? "http://localhost:5000/student/login"
            : "http://localhost:5000/faculty/login";

        const to =
          role === "student" ? "/student/addActivity" : "/faculty/students";

        const response = await axios.post(endpoint, {
          email,
          password,
        });

        console.log(`${role} login successful:`, response.data);
        // Here you would typically set authentication state or redirect
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(response?.data));
        navigate(to);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      id: "student",
      label: "Student",
      icon: <FaUserGraduate className="text-xl" />,
      description:
        "Access your activities, track progress, and build your portfolio",
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: <FaChalkboardTeacher className="text-xl" />,
      description: "Review and approve student activity submissions",
    },
    {
      id: "admin",
      label: "Administrator",
      icon: <FaUserTie className="text-xl" />,
      description: "Manage users, categories, and generate reports",
    },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-md"
        >
          <h1 className="text-4xl font-bold mb-4">Learnavia</h1>
          <p className="text-indigo-100 text-lg">
            The premier platform for tracking educational progress and
            achievements.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex justify-center items-center"
        >
          <svg
            viewBox="0 0 500 400"
            className="w-full h-64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100,200 C150,100 350,100 400,200"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M100,250 C150,150 350,150 400,250"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle cx="100" cy="200" r="15" fill="white" />
            <circle cx="250" cy="150" r="15" fill="white" />
            <circle cx="400" cy="200" r="15" fill="white" />
            <circle cx="100" cy="250" r="15" fill="white" />
            <circle cx="250" cy="200" r="15" fill="white" />
            <circle cx="400" cy="250" r="15" fill="white" />
            <path
              d="M150,300 L200,320 L250,300 L300,320 L350,300"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="flex space-x-4"
        >
          <div className="bg-white bg-opacity-10 p-4 rounded-xl">
            <div className="text-sm font-semibold">5000+</div>
            <div className="text-xs text-indigo-200">Active Students</div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-xl">
            <div className="text-sm font-semibold">200+</div>
            <div className="text-xs text-indigo-200">Faculty Members</div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-xl">
            <div className="text-sm font-semibold">98%</div>
            <div className="text-xs text-indigo-200">Satisfaction Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
                <FaUserGraduate className="text-indigo-600 text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Learnavia
            </h1>
            <p className="text-gray-500">Sign in to continue to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Login Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((option) => (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                    role === option.id
                      ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-md"
                      : "bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`mb-2 ${
                      role === option.id ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {option.icon}
                  </span>
                  <span className="text-xs font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Role Description */}
          <div className="bg-indigo-50 p-4 rounded-xl mb-8 border border-indigo-100">
            <p className="text-indigo-700 text-sm text-center font-medium">
              {roleOptions.find((opt) => opt.id === role)?.description}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {role === "admin" ? (
                <>Use admin@gmail.com / admin@123 to sign in</>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Sign up now
                  </Link>
                </>
              )}
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Learnavia. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
