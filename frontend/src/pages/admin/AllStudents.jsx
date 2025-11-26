import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiBook,
  FiCalendar,
  FiActivity,
  FiTrash2,
  FiEye,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiAward,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBarChart2,
  FiUsers,
  FiPlus,
  FiEdit,
} from "react-icons/fi";
import Header from "../../components/Header";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [expandedStudents, setExpandedStudents] = useState({});

  const getALLStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        "http://localhost:5000/student/get-all-students"
      );
      setStudents(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load students. Please try again.");
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await axios.post(`http://localhost:5000/admin/delete-student`, {
        studentId,
      });

      // Remove the deleted student from the list
      setStudents(students.filter((student) => student._id !== studentId));

      // Show success message
      setError("Student account deleted successfully");
      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.log(error);
      setError("Failed to delete student account");
    } finally {
      setDeleteLoading(false);
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

  const filteredStudents = sortedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active")
      return matchesSearch && student.activities.length > 0;
    if (statusFilter === "inactive")
      return matchesSearch && student.activities.length === 0;

    return matchesSearch;
  });

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getActivityStats = (activities) => {
    const total = activities.length;
    const approved = activities.filter((a) => a.status === "Approved").length;
    const pending = activities.filter((a) => a.status === "Pending").length;
    const rejected = activities.filter((a) => a.status === "Rejected").length;

    return { total, approved, pending, rejected };
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-blue-500"
            >
              <FiLoader size={40} />
            </motion.div>
            <span className="ml-3 text-xl text-gray-600">
              Loading students...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all student accounts
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={getALLStudents}
              className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8"
        >
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <FiUsers className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl">
                <FiActivity className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s) => s.activities.length > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiAward className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.reduce(
                    (total, student) => total + student.activities.length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FiBarChart2 className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Avg. per Student</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length > 0
                    ? (
                        students.reduce(
                          (total, student) => total + student.activities.length,
                          0
                        ) / students.length
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiFilter className="text-sm" />
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error/Success Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center ${
              error.includes("deleted")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {error.includes("deleted") ? (
              <FiCheckCircle className="mr-2" />
            ) : (
              <FiAlertCircle className="mr-2" />
            )}
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </motion.div>
        )}

        {/* Students Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 gap-4"
        >
          {filteredStudents.map((student) => {
            const stats = getActivityStats(student.activities || []);
            const isExpanded = expandedStudents[student._id];

            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Joined: {formatDate(student.createdAt)}
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
                          <div className="text-xs text-gray-500">Approved</div>
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
                          <div className="text-xs text-gray-500">Rejected</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            stats.total > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {stats.total > 0 ? "Active" : "Inactive"}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleStudentExpansion(student._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
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

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2 border-t border-gray-100 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(student)}
                      className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <FiEye className="mr-2" />
                      View Details
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteStudent(student._id)}
                      disabled={deleteLoading}
                      className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {deleteLoading ? (
                        <FiLoader className="animate-spin mr-2" />
                      ) : (
                        <FiTrash2 className="mr-2" />
                      )}
                      Delete
                    </motion.button>
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
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiActivity className="mr-2" /> Recent Activities
                        </h4>

                        {student.activities && student.activities.length > 0 ? (
                          <div className="space-y-3">
                            {student.activities.slice(0, 3).map((activity) => (
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
                                        {activity.status}
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
                            <FiActivity className="text-gray-400 mx-auto text-lg" />
                            <p className="text-sm text-gray-500 mt-1">
                              No activities submitted yet
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm mt-4"
          >
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-gray-400 text-2xl" />
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

        {/* Student Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedStudent && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center backdrop-blur-sm justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
               

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                >
                  <div className="bg-white px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-indigo-600 text-xl" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Student Details
                          </h3>
                          <p className="text-sm text-gray-500">
                            {selectedStudent.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-500 p-1 rounded-lg hover:bg-gray-100"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FiUser className="mr-2" /> Personal Information
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="mb-3">
                            <span className="text-sm text-gray-500 block mb-1">
                              Name:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedStudent.name}
                            </p>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm text-gray-500 block mb-1">
                              Email:
                            </span>
                            <p className="font-medium text-gray-900">
                              {selectedStudent.email}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block mb-1">
                              Member Since:
                            </span>
                            <p className="font-medium text-gray-900">
                              {formatDate(selectedStudent.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                          <FiActivity className="mr-2" /> Activity Summary
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg shadow-xs">
                              <div className="text-2xl font-bold text-gray-900">
                                {selectedStudent.activities.length}
                              </div>
                              <div className="text-xs text-gray-500">
                                Total Activities
                              </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-xs">
                              <div className="text-2xl font-bold text-green-600">
                                {
                                  selectedStudent.activities.filter(
                                    (a) => a.status === "Approved"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                Approved
                              </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-xs">
                              <div className="text-2xl font-bold text-yellow-600">
                                {
                                  selectedStudent.activities.filter(
                                    (a) => a.status === "Pending"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                Pending
                              </div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-xs">
                              <div className="text-2xl font-bold text-red-600">
                                {
                                  selectedStudent.activities.filter(
                                    (a) => a.status === "Rejected"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                Rejected
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <FiActivity className="mr-2" /> Activities (
                        {selectedStudent.activities.length})
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-80 overflow-y-auto">
                        {selectedStudent.activities.length === 0 ? (
                          <div className="text-center py-4">
                            <FiActivity className="text-gray-400 mx-auto text-2xl mb-2" />
                            <p className="text-gray-500">
                              No activities submitted yet.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedStudent.activities.map((activity) => (
                              <div
                                key={activity._id}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {activity.type}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                      activity.status
                                    )}`}
                                  >
                                    {activity.status}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-3">
                                  <p>
                                    Submitted: {formatDate(activity.createdAt)}
                                  </p>
                                </div>
                                {activity.feedbacks &&
                                  activity.feedbacks.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                      <p className="text-sm font-medium text-gray-700 mb-2">
                                        Feedback:
                                      </p>
                                      {activity.feedbacks.map(
                                        (feedback, index) => (
                                          <div
                                            key={index}
                                            className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mt-2"
                                          >
                                            {feedback.feedback}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllStudents;
