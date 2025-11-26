import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaChartBar,
  FaAward,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaDownload,
  FaTimes,
  FaGraduationCap,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaCog,
} from "react-icons/fa";
import Header from "../../components/Header";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    profile: {
      name: "",
      email: "",
      phone: "",
      college: "",
      department: "",
      year: "",
      gpa: "",
      skills: [],
      interests: [],
      summary: "",
      linkedin: "",
      github: "",
    },
    activities: [],
    include_badges: true,
    layout: "standard",
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentInterest, setCurrentInterest] = useState("");
  const [generatingPortfolio, setGeneratingPortfolio] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.student?._id;

  const getStudent = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://learnvia-backend.vercel.app/student/get-student",
        { studentId }
      );
      setStudentData(data);

      // Pre-fill portfolio data with available student info
      if (data) {
        setPortfolioData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: data.name || "",
            email: data.email || "",
            phone: data.portfolioDetails?.phone || "",
            college: data.portfolioDetails?.college || "",
            department: data.portfolioDetails?.department || "",
            year: data.portfolioDetails?.year || "",
            gpa: data.portfolioDetails?.gpa || "",
            summary: data.portfolioDetails?.summary || "",
            linkedin: data.portfolioDetails?.linkedin || "",
            github: data.portfolioDetails?.github || "",
            skills: data.portfolioDetails?.skills || [],
            interests: data.portfolioDetails?.interests || [],
          },
          activities: data.activities
            ? data.activities.map((activity) => ({
                type: activity.type || "activity",
                title: activity.title || "",
                date: activity.createdAt
                  ? new Date(activity.createdAt).toISOString().split("T")[0]
                  : "",
                tags: [],
                status: activity.status || "approved",
              }))
            : [],
        }));
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      getStudent();
    }
  }, [studentId]);

  // Calculate statistics
  const getStats = () => {
    if (!studentData || !studentData.activities) return {};

    const activities = studentData.activities;
    const totalActivities = activities.length;
    const approvedActivities = activities.filter(
      (a) => a.status === "Approved"
    ).length;
    const pendingActivities = activities.filter(
      (a) => a.status === "Pending"
    ).length;
    const rejectedActivities = activities.filter(
      (a) => a.status === "Rejected"
    ).length;

    return {
      totalActivities,
      approvedActivities,
      pendingActivities,
      rejectedActivities,
      approvalRate:
        totalActivities > 0
          ? Math.round((approvedActivities / totalActivities) * 100)
          : 0,
    };
  };

  const stats = getStats();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleGeneratePortfolio = () => {
    setShowPortfolioModal(true);
  };

  const handlePortfolioInputChange = (e, section, field) => {
    const value = e.target.value;

    if (section === "profile") {
      setPortfolioData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    } else {
      setPortfolioData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setPortfolioData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, currentSkill.trim()],
        },
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (index) => {
    setPortfolioData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const addInterest = () => {
    if (currentInterest.trim()) {
      setPortfolioData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          interests: [...prev.profile.interests, currentInterest.trim()],
        },
      }));
      setCurrentInterest("");
    }
  };

  const removeInterest = (index) => {
    setPortfolioData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        interests: prev.profile.interests.filter((_, i) => i !== index),
      },
    }));
  };

  const handleGenerate = async () => {
    setGeneratingPortfolio(true);
    try {
      // First, save portfolio details to database
      await axios.post("https://learnvia-backend.vercel.app/student/save-portfolio-details", {
        studentId,
        portfolioDetails: {
          phone: portfolioData.profile.phone,
          college: portfolioData.profile.college,
          department: portfolioData.profile.department,
          year: portfolioData.profile.year,
          gpa: portfolioData.profile.gpa,
          summary: portfolioData.profile.summary,
          linkedin: portfolioData.profile.linkedin,
          github: portfolioData.profile.github,
          skills: portfolioData.profile.skills,
          interests: portfolioData.profile.interests,
        },
      });

      // Make API request to generate portfolio
      const response = await axios.post(
        "https://leanavia-ml.onrender.com/generate_portfolio",
        portfolioData,
        {
          responseType: "blob", // Important for file download
        }
      );

      // Create a download URL for the file
      const fileURL = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(fileURL);
      setDownloadReady(true);
    } catch (error) {
      console.error("Error generating portfolio:", error);
      setError("Failed to generate portfolio. Please try again.");
    } finally {
      setGeneratingPortfolio(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `${portfolioData.profile.name.replace(/\s+/g, "_")}_Portfolio.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Close modal after download
      setShowPortfolioModal(false);
      setDownloadReady(false);
    }
  };

  const handleCloseModal = () => {
    setShowPortfolioModal(false);
    setDownloadReady(false);
    setGeneratingPortfolio(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
              <p>{error}</p>
              <button
                onClick={getStudent}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!studentData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No profile data found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden mb-8"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex items-end">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-indigo-600 text-4xl" />
                    </div>
                  </div>
                  <div className="ml-4 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {studentData.name}
                    </h1>
                    <p className="text-gray-600">Student Profile</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGeneratePortfolio}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaDownload className="text-sm" />
                    <span>Generate Portfolio</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FaChartBar className="text-indigo-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalActivities}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.approvedActivities}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingActivities}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaTimesCircle className="text-red-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.rejectedActivities}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm mb-8"
          >
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === "profile"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab("activities")}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === "activities"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Activities ({stats.totalActivities})
                </button>
                {/* <button
                  onClick={() => setActiveTab("achievements")}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === "achievements"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Achievements
                </button> */}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-900">{studentData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-900">{studentData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaIdCard className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Student ID</p>
                          <p className="text-gray-900">{studentData._id}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="text-gray-900">
                            {formatDate(studentData.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Activity Summary
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">
                          Approval Rate
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {stats.approvalRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${stats.approvalRate}%` }}
                        ></div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {stats.approvedActivities}
                          </div>
                          <div className="text-xs text-gray-500">Approved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {stats.pendingActivities}
                          </div>
                          <div className="text-xs text-gray-500">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {stats.rejectedActivities}
                          </div>
                          <div className="text-xs text-gray-500">Rejected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === "activities" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Your Activities
                  </h3>
                  {studentData.activities &&
                  studentData.activities.length > 0 ? (
                    <div className="space-y-4">
                      {studentData.activities.map((activity, index) => (
                        <div
                          key={activity._id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {activity.type}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Submitted on {formatDate(activity.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </div>

                          {activity.feedbacks &&
                            activity.feedbacks.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700">
                                  Feedback:
                                </p>
                                {activity.feedbacks.map((feedback, idx) => (
                                  <p
                                    key={idx}
                                    className="text-sm text-gray-600 mt-1"
                                  >
                                    {feedback.feedback}
                                  </p>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaAward className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-500">
                        No activities yet. Start by adding your first activity!
                      </p>
                    </div>
                  )}
                </div>
              )}

            
            </div>
          </motion.div>
        </div>
      </div>

      {/* Portfolio Generation Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl  shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Generate Portfolio
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {!downloadReady ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                        <FaUser className="mr-2 text-indigo-600" /> Personal Details
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={portfolioData.profile.phone}
                            onChange={(e) =>
                              handlePortfolioInputChange(e, "profile", "phone")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your phone number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            College
                          </label>
                          <input
                            type="text"
                            value={portfolioData.profile.college}
                            onChange={(e) =>
                              handlePortfolioInputChange(
                                e,
                                "profile",
                                "college"
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your college name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                          </label>
                          <input
                            type="text"
                            value={portfolioData.profile.department}
                            onChange={(e) =>
                              handlePortfolioInputChange(
                                e,
                                "profile",
                                "department"
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your department"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year
                          </label>
                          <input
                            type="number"
                            value={portfolioData.profile.year}
                            onChange={(e) =>
                              handlePortfolioInputChange(e, "profile", "year")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Current year"
                            min="1"
                            max="5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPA
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={portfolioData.profile.gpa}
                            onChange={(e) =>
                              handlePortfolioInputChange(e, "profile", "gpa")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your GPA"
                            min="0"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                        <FaCog className="mr-2 text-indigo-600" /> Additional Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Professional Summary
                          </label>
                          <textarea
                            value={portfolioData.profile.summary}
                            onChange={(e) =>
                              handlePortfolioInputChange(
                                e,
                                "profile",
                                "summary"
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            placeholder="Brief professional summary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={portfolioData.profile.linkedin}
                            onChange={(e) =>
                              handlePortfolioInputChange(
                                e,
                                "profile",
                                "linkedin"
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://linkedin.com/in/yourname"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            value={portfolioData.profile.github}
                            onChange={(e) =>
                              handlePortfolioInputChange(e, "profile", "github")
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://github.com/yourname"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Skills
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={currentSkill}
                              onChange={(e) => setCurrentSkill(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && addSkill()
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Add a skill"
                            />
                            <button
                              onClick={addSkill}
                              className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            {portfolioData.profile.skills.map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="ml-1 text-indigo-600 hover:text-indigo-900"
                                  >
                                    &times;
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Interests
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={currentInterest}
                              onChange={(e) =>
                                setCurrentInterest(e.target.value)
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" && addInterest()
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Add an interest"
                            />
                            <button
                              onClick={addInterest}
                              className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap mt-2">
                            {portfolioData.profile.interests.map(
                              (interest, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center"
                                >
                                  {interest}
                                  <button
                                    type="button"
                                    onClick={() => removeInterest(index)}
                                    className="ml-1 text-purple-600 hover:text-purple-900"
                                  >
                                    &times;
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="include_badges"
                      checked={portfolioData.include_badges}
                      onChange={(e) =>
                        setPortfolioData({
                          ...portfolioData,
                          include_badges: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="include_badges"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Include achievement badges in portfolio
                    </label>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Layout
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="standard"
                          checked={portfolioData.layout === "standard"}
                          onChange={(e) =>
                            setPortfolioData({
                              ...portfolioData,
                              layout: e.target.value,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 block text-sm text-gray-700">
                          Standard
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="modern"
                          checked={portfolioData.layout === "modern"}
                          onChange={(e) =>
                            setPortfolioData({
                              ...portfolioData,
                              layout: e.target.value,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 block text-sm text-gray-700">
                          Modern
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="layout"
                          value="creative"
                          checked={portfolioData.layout === "creative"}
                          onChange={(e) =>
                            setPortfolioData({
                              ...portfolioData,
                              layout: e.target.value,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 block text-sm text-gray-700">
                          Creative
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={generatingPortfolio}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center disabled:opacity-50"
                    >
                      {generatingPortfolio ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaDownload className="mr-2" />
                          Generate Portfolio
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-600 p-4 rounded-lg mb-6">
                    <FaCheckCircle className="text-4xl mx-auto mb-3" />
                    <h3 className="text-xl font-medium mb-2">
                      Portfolio Generated Successfully!
                    </h3>
                    <p>Your portfolio is ready to download.</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center mx-auto"
                  >
                    <FaDownload className="mr-2" />
                    Download Portfolio
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default StudentProfile;

