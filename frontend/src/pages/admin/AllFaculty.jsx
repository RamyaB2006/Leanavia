import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../../components/Header";
import {
  FaUser,
  FaEnvelope,
  FaTrash,
  FaEye,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
  FaSearch,
  FaIdCard,
  FaCalendarAlt,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaChartLine,
  FaAward,
} from "react-icons/fa";

const AllFaculty = () => {
  const [allFaculty, setAllFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [expandedFaculty, setExpandedFaculty] = useState({});

  const getALLFaculty = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:5000/faculty/get-all");
      setAllFaculty(data);
    } catch (error) {
      console.log(error);
      setError("Failed to load faculty data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getALLFaculty();
  }, []);

  const handleDeleteFaculty = async (facultyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this faculty account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(facultyId);
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/delete-faculty",
        { facultyId }
      );

      if (response.status === 200) {
        // Remove faculty from local state
        setAllFaculty((prev) =>
          prev.filter((faculty) => faculty._id !== facultyId)
        );
        setError("Faculty account deleted successfully");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setError("Failed to delete faculty account");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
  };

  const toggleFacultyExpansion = (facultyId) => {
    setExpandedFaculty((prev) => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredFaculty = allFaculty.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
              <div className="absolute inset-0 bg-white bg-opacity-50 rounded-full"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading faculty data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Faculty Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all faculty accounts and permissions
              </p>
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
                  <FaUsers className="text-indigo-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Faculty</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allFaculty.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Active Faculty</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allFaculty.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FaAward className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Avg. Experience</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allFaculty.length > 0 ? "2.5" : "0"} years
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Recent Join</p>
                  <p className="text-lg font-bold text-gray-900">
                    {allFaculty[0]?.name?.split(" ")[0] || "None"}
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
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search faculty by name or email..."
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
                    <option value="all">All Faculty</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaTimes className="mr-2" />
              )}
              {error}
              <button
                onClick={() => setError("")}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}

          {/* Faculty Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredFaculty.map((faculty) => {
              const isExpanded = expandedFaculty[faculty._id];

              return (
                <motion.div
                  key={faculty._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-900">
                            {faculty.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {faculty.email}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            Joined:{" "}
                            {faculty.createdAt
                              ? formatDate(faculty.createdAt)
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleFacultyExpansion(faculty._id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2 border-t border-gray-100 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(faculty)}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteFaculty(faculty._id)}
                        disabled={isDeleting === faculty._id}
                        className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {isDeleting === faculty._id ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaTrash className="mr-2" />
                        )}
                        Delete
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded Details */}
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
                            Faculty Information
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center mb-2">
                                <FaIdCard className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  Faculty ID
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {faculty._id}
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center mb-2">
                                <FaCalendarAlt className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  Member Since
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {faculty.createdAt
                                  ? formatDate(faculty.createdAt)
                                  : "N/A"}
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center mb-2">
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  Email
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {faculty.email}
                              </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center mb-2">
                                <FaCheckCircle className="text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">
                                  Status
                                </span>
                              </div>
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredFaculty.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl shadow-sm mt-4"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "No faculty match your search criteria"
                  : "No faculty found"}
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

      {/* Faculty Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedFaculty && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center backdrop-blur-sm justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeModal}
              ></motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-indigo-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Faculty Details
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedFaculty.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500 p-1 rounded-lg hover:bg-gray-100"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <FaUser className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="text-gray-900 font-medium">
                            {selectedFaculty.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <FaEnvelope className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="text-gray-900 font-medium">
                            {selectedFaculty.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <FaIdCard className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Faculty ID</p>
                          <p className="text-gray-900 font-medium">
                            {selectedFaculty._id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <FaCalendarAlt className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="text-gray-900 font-medium">
                            {selectedFaculty.createdAt
                              ? formatDate(selectedFaculty.createdAt)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <FaCheckCircle className="text-gray-400 mr-3" />
                        <div>
                          <p className="text-getActivityStatssm text-gray-500">Status</p>
                          <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
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

export default AllFaculty;
