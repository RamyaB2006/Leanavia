import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaRobot,
  FaLightbulb,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaBriefcase,
} from "react-icons/fa";
import axios from "axios";

const AddActivity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [studentData, setStudentData] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.student?._id;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    uploadProof: null,
    previewUrl: "",
  });

  const [aiFormData, setAiFormData] = useState({
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

  const activityTypes = [
    "Workshop",
    "Internship",
    "Sports",
    "Conference",
    "Seminar",
    "Hackathon",
    "Research",
    "Volunteering",
    "Other",
  ];

  // Get status badge color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "Approved":
        return {
          color: "bg-green-100 text-green-800",
          icon: <FaCheckCircle className="text-green-500" />,
          border: "border-green-200",
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <FaTimesCircle className="text-red-500" />,
          border: "border-red-200",
        };
      default:
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <FaClock className="text-yellow-500" />,
          border: "border-yellow-200",
        };
    }
  };

  // Get recommendation type icon
  const getRecommendationIcon = (type) => {
    switch (type) {
      case "internship":
        return <FaBriefcase className="text-blue-500" />;
      case "workshop":
        return <FaBook className="text-purple-500" />;
      case "course":
        return <FaGraduationCap className="text-green-500" />;
      case "project":
        return <FaLightbulb className="text-yellow-500" />;
      case "volunteer":
        return <FaHandsHelping className="text-red-500" />;
      default:
        return <FaLightbulb className="text-indigo-500" />;
    }
  };

  // Fetch student data
  const getStudent = async () => {
    try {
      setLoadingActivities(true);
      const { data } = await axios.post(
        "http://localhost:5000/student/get-student",
        { studentId }
      );
      setStudentData(data);
      setActivities(data.activities || []);

      // Pre-fill AI form data with student info
      if (data) {
        setAiFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            name: data.name || "",
            email: data.email || "",
            college: data.college || "",
            department: data.department || "",
            year: data.year || "",
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
      setError("Failed to load activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      getStudent();
    }
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAIInputChange = (e, section, field) => {
    const value = e.target.value;

    if (section === "profile") {
      setAiFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    } else {
      setAiFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setAiFormData((prev) => ({
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
    setAiFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const addInterest = () => {
    if (currentInterest.trim()) {
      setAiFormData((prev) => ({
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
    setAiFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        interests: prev.profile.interests.filter((_, i) => i !== index),
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        uploadProof: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const uploadPreset = "hg73yvrn";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      // Determine the endpoint based on file type
      const isPDF = file.type === "application/pdf";
      const endpoint = isPDF ? "raw" : "image";

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/didyxuyd5/${endpoint}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error(`Failed to upload ${file.type === "application/pdf" ? "PDF" : "image"}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!studentId) {
        throw new Error("Student ID not found. Please log in again.");
      }

      let imageUrl = "";
      if (formData.uploadProof) {
        imageUrl = await uploadToCloudinary(formData.uploadProof);
      }

      const response = await axios.post(
        "http://localhost:5000/activities/add",
        {
          studentId,
          title: formData.title,
          type: formData.type,
          uploadProof: imageUrl,
        }
      );

      if (response.status === 201) {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
        setFormData({
          title: "",
          type: "",
          uploadProof: null,
          previewUrl: "",
        });
        // Refresh activities
        getStudent();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error adding activity"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISubmit = async (e) => {
    e.preventDefault();
    setIsAILoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/recommendations",
        aiFormData
      );

      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error getting AI recommendations"
      );
    } finally {
      setIsAILoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    setIsDeleting(activityId);
    try {
      const response = await axios.post(
        `http://localhost:5000/activities/remove`,
        { activityId, studentId }
      );

      if (response.status === 200) {
        // Remove activity from local state
        setActivities((prev) =>
          prev.filter((activity) => activity._id !== activityId)
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error deleting activity"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
    setError("");
    setRecommendations([]);
  };

  // Activity card component
  const ActivityCard = ({ activity }) => {
    const statusInfo = getStatusInfo(activity.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${statusInfo.border} hover:shadow-md transition-shadow`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {activity.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{activity.type}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center`}
            >
              {statusInfo.icon}
              <span className="ml-1">{activity.status}</span>
            </span>
            <button
              onClick={() => handleDeleteActivity(activity._id)}
              disabled={isDeleting === activity._id}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isDeleting === activity._id ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTrash />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Submitted on {formatDate(activity.createdAt)}
          </div>

          {activity.uploadProof && (
            <a
              href={activity.uploadProof}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm"
            >
              <FaEye className="mr-1" />
              View Proof
            </a>
          )}
        </div>

        {activity.feedbacks && activity.feedbacks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Feedback:
            </h4>
            {activity.feedbacks.map((feedback, index) => (
              <div
                key={feedback._id || index}
                className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2"
              >
                <p className="font-medium">{feedback.feedback}</p>
                <p className="text-xs text-gray-500 mt-1">
                  By Faculty •{" "}
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  // Recommendation card component
  const RecommendationCard = ({ recommendation, index }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-400 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start mb-4">
          <div className="bg-indigo-100 p-3 rounded-lg mr-4">
            {getRecommendationIcon(recommendation.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {recommendation.title}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {recommendation.type}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{recommendation.description}</p>

        {recommendation.tags && recommendation.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {recommendation.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Why this matches:</span>{" "}
            {recommendation.reason}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Activities
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage your extracurricular activities
              </p>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaRobot className="text-sm" />
                <span>Match with AI</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaPlus className="text-sm" />
                <span>Add Activity</span>
              </motion.button>
            </div>
          </div>

          {/* Activities List */}
          {loadingActivities ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading your activities...</p>
              </div>
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {activities.map((activity) => (
                  <ActivityCard key={activity._id} activity={activity} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FaPlus className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first activity
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Add your first activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-sm">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Add New Activity
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Activity Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter activity title"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Activity Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select activity type</option>
                        {activityTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Proof
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          {formData.previewUrl ? (
                            <div className="mt-2">
                              <img
                                src={formData.previewUrl}
                                alt="Preview"
                                className="mx-auto h-32 object-contain"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    uploadProof: null,
                                    previewUrl: "",
                                  }))
                                }
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                  htmlFor="uploadProof"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="uploadProof"
                                    name="uploadProof"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf,.pdf"
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF, PDF up to 10MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                            Adding...
                          </div>
                        ) : (
                          "Add Activity"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Recommendations Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-sm">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FaRobot className="mr-2 text-purple-500" />
                      AI Activity Recommendations
                    </h3>
                    <button
                      onClick={closeAIModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {recommendations.length === 0 ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        Tell us about yourself to get personalized activity
                        recommendations powered by AI.
                      </p>

                      <form onSubmit={handleAISubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                              Personal Details
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  value={aiFormData.profile.phone}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "phone")
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
                                  value={aiFormData.profile.college}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "college")
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
                                  value={aiFormData.profile.department}
                                  onChange={(e) =>
                                    handleAIInputChange(
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
                                  value={aiFormData.profile.year}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "year")
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
                                  value={aiFormData.profile.gpa}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "gpa")
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  placeholder="Your GPA"
                                  min="0"
                                  max="10"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-md font-medium text-gray-900 mb-4">
                              Additional Information
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Professional Summary
                                </label>
                                <textarea
                                  value={aiFormData.profile.summary}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "summary")
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
                                  value={aiFormData.profile.linkedin}
                                  onChange={(e) =>
                                    handleAIInputChange(
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
                                  value={aiFormData.profile.github}
                                  onChange={(e) =>
                                    handleAIInputChange(e, "profile", "github")
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
                                    onChange={(e) =>
                                      setCurrentSkill(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      e.key === "Enter" && addSkill()
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Add a skill"
                                  />
                                  <button
                                    type="button"
                                    onClick={addSkill}
                                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="flex flex-wrap mt-2">
                                  {aiFormData.profile.skills.map(
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
                                    type="button"
                                    onClick={addInterest}
                                    className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="flex flex-wrap mt-2">
                                  {aiFormData.profile.interests.map(
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
                            checked={aiFormData.include_badges}
                            onChange={(e) =>
                              setAiFormData({
                                ...aiFormData,
                                include_badges: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="include_badges"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Include achievement badges
                          </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={closeAIModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAILoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 flex items-center disabled:opacity-50"
                          >
                            {isAILoading ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <FaRobot className="mr-2" />
                                Get Recommendations
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2" />
                          <p className="text-green-700">
                            We found {recommendations.length} personalized
                            recommendations for you!
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {recommendations.map((recommendation, index) => (
                          <RecommendationCard
                            key={index}
                            recommendation={recommendation}
                            index={index}
                          />
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setRecommendations([])}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          Back to Form
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-blur-sm">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Activity Added Successfully
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Your activity has been successfully submitted. It will
                          be reviewed by faculty.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={closeSuccessModal}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddActivity;
