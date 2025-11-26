import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Password requirements
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        role === "student"
          ? "http://localhost:5000/student/register"
          : "http://localhost:5000/faculty/register";

      const response = await axios.post(endpoint, {
        name,
        email,
        password,
      });

      console.log(`${role} signup successful:`, response.data);
      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
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
        "Create your student account to track activities and build your portfolio",
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: <FaChalkboardTeacher className="text-xl" />,
      description:
        "Create your faculty account to review and approve student submissions",
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
          <h1 className="text-4xl font-bold mb-4">Join Learnavia</h1>
          <p className="text-indigo-100 text-lg">
            Start your journey with the premier platform for tracking
            educational progress and achievements.
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
              d="M100,150 C150,50 350,50 400,150"
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
            <circle cx="100" cy="150" r="15" fill="white" />
            <circle cx="250" cy="100" r="15" fill="white" />
            <circle cx="400" cy="150" r="15" fill="white" />
            <circle cx="100" cy="250" r="15" fill="white" />
            <circle cx="250" cy="200" r="15" fill="white" />
            <circle cx="400" cy="250" r="15" fill="white" />
            <path
              d="M150,300 L200,320 L250,300 L300,320 L350,300"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M180,100 L220,120 L260,100 L300,120 L340,100"
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
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheck className="text-xs" />
            </div>
            <span className="text-sm">Track academic progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheck className="text-xs" />
            </div>
            <span className="text-sm">Build your portfolio</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheck className="text-xs" />
            </div>
            <span className="text-sm">Connect with faculty</span>
          </div>
        </motion.div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
                <FaUserGraduate className="text-indigo-600 text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-500">
              Join Learnavia to manage your activities
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Register as
            </label>
            <div className="grid grid-cols-2 gap-3">
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
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Role Description */}
          <div className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-100">
            <p className="text-indigo-700 text-sm text-center font-medium">
              {roleOptions.find((opt) => opt.id === role)?.description}
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

              {/* Password requirements */}
              <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-3">
                  Password must contain:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-xs">
                    {hasMinLength ? (
                      <FaCheck className="text-green-500 mr-2" />
                    ) : (
                      <FaTimes className="text-red-500 mr-2" />
                    )}
                    <span
                      className={
                        hasMinLength ? "text-green-600" : "text-gray-600"
                      }
                    >
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {hasUpperCase ? (
                      <FaCheck className="text-green-500 mr-2" />
                    ) : (
                      <FaTimes className="text-red-500 mr-2" />
                    )}
                    <span
                      className={
                        hasUpperCase ? "text-green-600" : "text-gray-600"
                      }
                    >
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {hasNumber ? (
                      <FaCheck className="text-green-500 mr-2" />
                    ) : (
                      <FaTimes className="text-red-500 mr-2" />
                    )}
                    <span
                      className={hasNumber ? "text-green-600" : "text-gray-600"}
                    >
                      Number
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {hasSpecialChar ? (
                      <FaCheck className="text-green-500 mr-2" />
                    ) : (
                      <FaTimes className="text-red-500 mr-2" />
                    )}
                    <span
                      className={
                        hasSpecialChar ? "text-green-600" : "text-gray-600"
                      }
                    >
                      Special character
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {passwordsMatch ? (
                    <span className="text-green-600 flex items-center font-medium">
                      <FaCheck className="mr-2 bg-green-100 p-1 rounded-full" />
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center font-medium">
                      <FaTimes className="mr-2 bg-red-100 p-1 rounded-full" />
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                  Creating account...
                </div>
              ) : (
                `Create ${role} account`
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:underline font-medium"
              >
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
