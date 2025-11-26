import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBook,
  FiAward,
  FiBell,
  FiUser,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiCalendar,
  FiUpload,
  FiStar,
  FiBookOpen,
  FiTarget,
  FiPieChart,
  FiClipboard,
  FiArrowRight,
  FiPlay,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserTie,
  FaMedal,
  FaTrophy,
  FaCertificate,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <FiBook className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Learnavia
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Login
          </Link>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transform -skew-y-6 -translate-y-32"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <FiStar className="mr-2 text-yellow-500" />
              Trusted by 100+ institutions worldwide
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Transform Student{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Activity Management
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A comprehensive platform for students, faculty, and administrators
              to track, approve, and manage extracurricular activities with
              unparalleled ease and efficiency.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center"
              >
                Get Started Free <FiArrowRight className="ml-2" />
              </button>

              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 border border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 transition-colors flex items-center"
              >
                <FiPlay className="mr-2" /> Explore Features
              </button>
            </div>

            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white"
                  ></div>
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                Join{" "}
                <span className="font-semibold text-indigo-600">10,000+</span>{" "}
                educators and students
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-12 md:col-span-8 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="h-4 bg-blue-200 rounded mb-2"></div>
                  <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                </div>
                <div className="col-span-12 md:col-span-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="h-4 bg-purple-200 rounded mb-2"></div>
                  <div className="h-4 bg-purple-200 rounded w-2/3"></div>
                </div>
                <div className="col-span-12 md:col-span-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="h-4 bg-green-200 rounded mb-2"></div>
                  <div className="h-4 bg-green-200 rounded w-1/2"></div>
                </div>
                <div className="col-span-12 md:col-span-8 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                  <div className="h-4 bg-yellow-200 rounded mb-2"></div>
                  <div className="h-4 bg-yellow-200 rounded w-5/6"></div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-40 w-40 rounded-full border-8 border-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-700">
                        85%
                      </div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-500 animate-spin"></div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FiAward className="text-yellow-600 text-xl" />
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <FiTrendingUp className="text-green-600 text-xl" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-6 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful Features for All Users
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Our platform offers tailored experiences for students, faculty,
              and administrators to streamline the activity management process.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-16">
            <div className="flex bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-8 py-4 rounded-2xl font-medium flex items-center space-x-3 transition-all ${
                  activeTab === "students"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                <FaUserGraduate className="text-xl" />
                <span>For Students</span>
              </button>

              <button
                onClick={() => setActiveTab("faculty")}
                className={`px-8 py-4 rounded-2xl font-medium flex items-center space-x-3 transition-all ${
                  activeTab === "faculty"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                <FaChalkboardTeacher className="text-xl" />
                <span>For Faculty</span>
              </button>

              <button
                onClick={() => setActiveTab("admin")}
                className={`px-8 py-4 rounded-2xl font-medium flex items-center space-x-3 transition-all ${
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-indigo-700"
                }`}
              >
                <FaUserTie className="text-xl" />
                <span>For Admin</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "students" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: FiUser,
                    title: "Secure Sign Up / Login",
                    desc: "Personal account access with robust security measures to protect your data.",
                    color: "blue",
                  },
                  {
                    icon: FiBarChart2,
                    title: "Dashboard Overview",
                    desc: "View your activity summary, recent achievements, and submission status at a glance.",
                    color: "purple",
                  },
                  {
                    icon: FiCalendar,
                    title: "Add Activities",
                    desc: "Simple form to submit new activities with type, title, date, and proof upload.",
                    color: "green",
                  },
                  {
                    icon: FiBookOpen,
                    title: "My Activities",
                    desc: "View all past submissions with status (Pending, Approved, Rejected).",
                    color: "yellow",
                  },
                  {
                    icon: FiFileText,
                    title: "Profile & Portfolio",
                    desc: "Auto-generate a professional PDF portfolio for placements or higher studies.",
                    color: "red",
                  },
                  {
                    icon: FaMedal,
                    title: "Progress Tracking & Badges",
                    desc: "Visual charts and digital badges for milestones like completing 5 workshops.",
                    color: "indigo",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className={`bg-${feature.color}-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`text-${feature.color}-600 text-2xl`}
                      />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "faculty" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: FiUser,
                    title: "Faculty Login",
                    desc: "Secure access to the approval panel with role-based permissions.",
                    color: "blue",
                  },
                  {
                    icon: FiClipboard,
                    title: "Approval Dashboard",
                    desc: "View all pending activity submissions in an organized interface.",
                    color: "purple",
                  },
                  {
                    icon: FiCheckCircle,
                    title: "Review Submissions",
                    desc: "Check student details and uploaded proof for verification.",
                    color: "green",
                  },
                  {
                    icon: FiXCircle,
                    title: "Approve or Reject",
                    desc: "One-click approval or rejection with optional comments.",
                    color: "yellow",
                  },
                  {
                    icon: FiBell,
                    title: "Feedback System",
                    desc: "Provide constructive feedback or request resubmission when needed.",
                    color: "red",
                  },
                  {
                    icon: FiPieChart,
                    title: "Analytics Dashboard",
                    desc: "Track participation trends and identify students needing mentoring.",
                    color: "indigo",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className={`bg-${feature.color}-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`text-${feature.color}-600 text-2xl`}
                      />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "admin" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: FiUsers,
                    title: "Manage Users",
                    desc: "View, add, edit, or deactivate student and faculty accounts with ease.",
                    color: "blue",
                  },
                  {
                    icon: FiSettings,
                    title: "Manage Categories",
                    desc: "Add or edit activity types like workshops, internships, sports, etc.",
                    color: "purple",
                  },
                  {
                    icon: FiFileText,
                    title: "Reports & Analytics",
                    desc: "Generate department-wise and year-wise activity reports.",
                    color: "green",
                  },
                  {
                    icon: FiTrendingUp,
                    title: "Export Capabilities",
                    desc: "Export data as Excel or PDF for accreditation (NAAC/NBA) purposes.",
                    color: "yellow",
                  },
                  {
                    icon: FiUser,
                    title: "Role-Based Access",
                    desc: "Admin, Faculty, and Student roles with appropriate permissions.",
                    color: "red",
                  },
                  {
                    icon: FaTrophy,
                    title: "Gamification",
                    desc: "Leaderboards, activity streaks, and engagement rewards.",
                    color: "indigo",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div
                      className={`bg-${feature.color}-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`text-${feature.color}-600 text-2xl`}
                      />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Students" },
              { number: "500+", label: "Faculty Members" },
              { number: "25K+", label: "Activities Logged" },
              { number: "95%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Hear from students, faculty, and administrators who are using our
              platform to transform their activity management processes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                icon: FaUserGraduate,
                text: "This platform made it so easy to track all my extracurricular activities. The portfolio generation feature helped me secure an internship!",
                color: "indigo",
              },
              {
                name: "Dr. Michael Chen",
                role: "Faculty Advisor",
                icon: FaChalkboardTeacher,
                text: "The approval dashboard saves me hours each week. I can quickly review submissions and provide feedback all in one place.",
                color: "purple",
              },
              {
                name: "Lisa Rodriguez",
                role: "Administrator",
                icon: FaUserTie,
                text: "Generating reports for accreditation has never been easier. The analytics help us identify areas for improvement across departments.",
                color: "pink",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-16 h-16 bg-${testimonial.color}-100 rounded-2xl flex items-center justify-center mr-5`}
                  >
                    <testimonial.icon
                      className={`text-${testimonial.color}-600 text-2xl`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex mt-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full translate-y-48 -translate-x-48"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Transform Activity Management?
            </h2>
            <p className="text-gray-600 mb-10 max-w-3xl mx-auto text-lg">
              Join thousands of educational institutions using our platform to
              streamline student activity tracking and approval processes.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                Request a Demo
              </button>
              <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-medium rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest updates and features.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <FiBook className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">Learnavia</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Streamlining student activity management for educational
              institutions worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Product</h4>
            <ul className="space-y-4">
              {["Features", "Pricing", "Case Studies", "Testimonials"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              {["Blog", "Help Center", "Documentation", "API"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center">
                <FiMail className="mr-3" /> support@learnavia.com
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <FiMapPin className="mr-3" /> 123 Education St, Learning City
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Learnavia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
