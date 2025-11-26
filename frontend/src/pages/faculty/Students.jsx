import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaClipboardList,
  FaChartBar,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaPlus,
  FaComment,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

const Students = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const facultyId = user?.faculty?._id;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedStudents, setExpandedStudents] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const getALLStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/student/get-all-students"
      );
      setStudents(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getALLStudents();
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (activityId, status) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/faculty/change-status",
        {
          activityId,
          status,
          facultyId,
        }
      );

      if (response.status === 200) {
        const updatedStudents = students.map((student) => {
          if (student._id === selectedStudent._id) {
            const updatedActivities = student.activities.map((activity) => {
              if (activity._id === activityId) {
                return { ...activity, status };
              }
              return activity;
            });
            return { ...student, activities: updatedActivities };
          }
          return student;
        });

        setStudents(updatedStudents);
        setSelectedStudent((prev) => ({
          ...prev,
          activities: prev.activities.map((activity) =>
            activity._id === activityId ? { ...activity, status } : activity
          ),
        }));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update activity status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFeedback = async (activityId) => {
    if (!feedbackText.trim()) {
      setError("Feedback cannot be empty");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/faculty/add-feedback",
        {
          facultyId,
          studentId: selectedStudent._id,
          activityId,
          feedbackText: feedbackText.trim(),
        }
      );

      if (response.status === 200) {
        const updatedStudents = students.map((student) => {
          if (student._id === selectedStudent._id) {
            const updatedActivities = student.activities.map((activity) => {
              if (activity._id === activityId) {
                const newFeedback = {
                  _id: Date.now().toString(),
                  feedback: feedbackText.trim(),
                  faculty: facultyId,
                  student: selectedStudent._id,
                  activity: activityId,
                  createdAt: new Date().toISOString(),
                };

                return {
                  ...activity,
                  feedbacks: [...(activity.feedbacks || []), newFeedback],
                };
              }
              return activity;
            });
            return { ...student, activities: updatedActivities };
          }
          return student;
        });

        setStudents(updatedStudents);
        setSelectedStudent((prev) => ({
          ...prev,
          activities: prev.activities.map((activity) =>
            activity._id === activityId
              ? {
                  ...activity,
                  feedbacks: [
                    ...(activity.feedbacks || []),
                    {
                      _id: Date.now().toString(),
                      feedback: feedbackText.trim(),
                      faculty: facultyId,
                      student: selectedStudent._id,
                      activity: activityId,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : activity
          ),
        }));

        setFeedbackText("");
        setSelectedActivity(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error adding feedback:", error);
      setError("Failed to add feedback");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...students];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [students, sortConfig]);

    const getActivityStats = (activities) => {
      const total = activities.length;
      const approved = activities.filter((a) => a.status === "Approved").length;
      const pending = activities.filter((a) => a.status === "Pending").length;
      const rejected = activities.filter((a) => a.status === "Rejected").length;

      return { total, approved, pending, rejected };
    };

  const filteredStudents = sortedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const stats = getActivityStats(student.activities || []);
    if (statusFilter === "pending") return matchesSearch && stats.pending > 0;
    if (statusFilter === "approved")
      return matchesSearch && stats.approved > 0 && stats.pending === 0;
    if (statusFilter === "rejected") return matchesSearch && stats.rejected > 0;

    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };



  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaSpinner className="text-yellow-500 animate-spin" />;
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    if (sortConfig.direction === "asc")
      return <FaSortUp className="text-indigo-600" />;
    return <FaSortDown className="text-indigo-600" />;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
              <div className="absolute inset-0 bg-white bg-opacity-50 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-2 font-medium">
              Loading students...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Management
              </h1>
              <p className="text-gray-600 mt-2">
                Review and manage student activities
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-500">
                {filteredStudents.length}{" "}
                {filteredStudents.length === 1 ? "student" : "students"} found
              </span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">All Approved</option>
                    <option value="rejected">Has Rejections</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaFilter className="text-sm" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <FaTimes className="mr-1 text-sm" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center"
            >
              <div className="flex-1">{error}</div>
              <button
                onClick={() => setError("")}
                className="text-red-800 hover:text-red-900"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}

          {/* Students Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student) => {
              const stats = getActivityStats(student.activities || []);
              const isExpanded = expandedStudents[student._id];

              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1 text-xs" />
                            {student.email}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {stats.total}
                            </div>
                            <div className="text-xs text-gray-500">Total</div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">
                              {stats.approved}
                            </div>
                            <div className="text-xs text-gray-500">
                              Approved
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-semibold text-yellow-600">
                              {stats.pending}
                            </div>
                            <div className="text-xs text-gray-500">Pending</div>
                          </div>

                          <div className="text-center">
                            <div className="text-lg font-semibold text-red-600">
                              {stats.rejected}
                            </div>
                            <div className="text-xs text-gray-500">
                              Rejected
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              stats.pending > 0
                                ? "Pending"
                                : stats.rejected > 0
                                ? "Rejected"
                                : "Approved"
                            )}`}
                          >
                            {stats.pending > 0
                              ? "Pending Review"
                              : stats.rejected > 0
                              ? "Has Rejections"
                              : "All Approved"}
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleStudentExpansion(student._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile stats */}
                    <div className="mt-4 flex md:hidden justify-between border-t border-gray-100 pt-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {stats.total}
                        </div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-600">
                          {stats.approved}
                        </div>
                        <div className="text-xs text-gray-500">Approved</div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-semibold text-yellow-600">
                          {stats.pending}
                        </div>
                        <div className="text-xs text-gray-500">Pending</div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-semibold text-red-600">
                          {stats.rejected}
                        </div>
                        <div className="text-xs text-gray-500">Rejected</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Activities */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Activities
                          </h4>

                          {student.activities &&
                          student.activities.length > 0 ? (
                            <div className="space-y-3">
                              {student.activities
                                .slice(0, 3)
                                .map((activity) => (
                                  <div
                                    key={activity._id}
                                    className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center">
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                              activity.status
                                            )}`}
                                          >
                                            {getStatusIcon(activity.status)}{" "}
                                            <span className="ml-1">
                                              {activity.status}
                                            </span>
                                          </span>
                                          <span className="ml-2 text-xs text-gray-500">
                                            {new Date(
                                              activity.createdAt
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <h5 className="font-medium text-gray-900 mt-1">
                                          {activity.title}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                          {activity.type}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              {student.activities.length > 3 && (
                                <div className="text-center pt-2">
                                  <span className="text-xs text-gray-500">
                                    +{student.activities.length - 3} more
                                    activities
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-3 bg-white rounded-lg border border-gray-200">
                              <FaClipboardList className="text-gray-400 mx-auto text-lg" />
                              <p className="text-sm text-gray-500 mt-1">
                                No activities submitted yet
                              </p>
                            </div>
                          )}

                          <div className="mt-4 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewDetails(student)}
                              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              <FaEye className="mr-2 text-xs" />
                              View Details
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm mt-4"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No students match your search criteria"
                  : "No students found"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex backdrop-blur-sm items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              >
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {selectedStudent.name}'s Activities
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setSelectedStudent(null);
                        setSelectedActivity(null);
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 max-h-96 overflow-y-auto">
                  {/* Activities List */}
                  <div className="space-y-4">
                    {selectedStudent.activities &&
                    selectedStudent.activities.length > 0 ? (
                      selectedStudent.activities.map((activity) => (
                        <div
                          key={activity._id}
                          className="bg-gray-50 p-5 rounded-xl border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {activity.title}
                                </h4>
                                <span
                                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                    activity.status
                                  )}`}
                                >
                                  {getStatusIcon(activity.status)}{" "}
                                  <span className="ml-1">
                                    {activity.status}
                                  </span>
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.type}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Submitted on{" "}
                                {new Date(
                                  activity.createdAt
                                ).toLocaleDateString()}
                              </p>

                              {activity.uploadProof && (
                                <div className="mt-3">
                                  <a
                                    href={activity.uploadProof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                                  >
                                    View Proof{" "}
                                    <FaExternalLinkAlt className="ml-1 text-xs" />
                                  </a>
                                </div>
                              )}

                              {/* Feedback display */}
                              {activity.feedbacks &&
                                activity.feedbacks.length > 0 && (
                                  <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Feedback:
                                    </p>
                                    {activity.feedbacks.map(
                                      (feedbackObj, index) => (
                                        <div
                                          key={feedbackObj._id || index}
                                          className="bg-white p-3 rounded-lg border border-gray-200 mt-2"
                                        >
                                          <p className="text-sm text-gray-600">
                                            {feedbackObj.feedback}
                                          </p>
                                          <p className="text-xs text-gray-400 mt-1">
                                            {new Date(
                                              feedbackObj.createdAt
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>

                            <div className="ml-4 flex flex-col items-end space-y-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleStatusChange(activity._id, "Approved")
                                  }
                                  disabled={
                                    isProcessing ||
                                    activity.status === "Approved"
                                  }
                                  className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50 bg-green-50 rounded-lg"
                                  title="Approve"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedActivity(activity);
                                    setFeedbackText("");
                                  }}
                                  disabled={
                                    isProcessing ||
                                    activity.status === "Rejected"
                                  }
                                  className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 bg-red-50 rounded-lg"
                                  title="Reject"
                                >
                                  <FaTimesCircle />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Feedback Input (shown when activity is selected for rejection) */}
                          {selectedActivity &&
                            selectedActivity._id === activity._id && (
                              <div className="mt-5 pt-4 border-t border-gray-200">
                                <label
                                  htmlFor="feedback"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Add Feedback (required for rejection)
                                </label>
                                <textarea
                                  id="feedback"
                                  rows="3"
                                  value={feedbackText}
                                  onChange={(e) =>
                                    setFeedbackText(e.target.value)
                                  }
                                  className="mt-1 block w-full border border-gray-300 outline-none p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Provide constructive feedback for the student..."
                                ></textarea>
                                <div className="mt-3 flex justify-end space-x-3">
                                  <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusChange(
                                        activity._id,
                                        "Rejected"
                                      );
                                      handleAddFeedback(activity._id);
                                    }}
                                    disabled={
                                      isProcessing || !feedbackText.trim()
                                    }
                                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                                  >
                                    <FaComment className="mr-2" />
                                    Reject with Feedback
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaClipboardList className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500">
                          No activities submitted yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedStudent(null);
                      setSelectedActivity(null);
                    }}
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
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

export default Students;
