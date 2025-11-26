import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../../components/Header";
import {
  FaTrophy,
  FaMedal,
  FaCrown,
  FaUser,
  FaAward,
  FaChartLine,
  FaSpinner,
  FaSearch,
  FaFire,
  FaStar,
  FaChevronUp,
  FaChevronDown,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

const LeaderBoard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "approvedCount",
    direction: "desc",
  });
  const [filter, setFilter] = useState("all");

  const getALLStudents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/student/get-all-students"
      );

      // Process students to calculate approved activities count
      const processedStudents = data.map((student) => {
        const approvedActivities =
          student.activities?.filter(
            (activity) => activity.status === "Approved"
          ) || [];

        const successRate =
          student.activities?.length > 0
            ? Math.round(
                (approvedActivities.length / student.activities.length) * 100
              )
            : 0;

        return {
          ...student,
          approvedCount: approvedActivities.length,
          totalActivities: student.activities?.length || 0,
          successRate: successRate,
        };
      });

      // Sort by approved activities count (descending)
      processedStudents.sort((a, b) => b.approvedCount - a.approvedCount);

      setStudents(processedStudents);
    } catch (error) {
      console.log(error);
      setError("Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getALLStudents();
  }, []);

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
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

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return {
          component: (
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-yellow-100">
              <FaCrown className="text-white text-xl" />
            </div>
          ),
          bg: "bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500",
          text: "text-yellow-700",
          rank: "1st",
        };
      case 1:
        return {
          component: (
            <div className="w-11 h-11 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-gray-100">
              <FaMedal className="text-white text-lg" />
            </div>
          ),
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-400",
          text: "text-gray-700",
          rank: "2nd",
        };
      case 2:
        return {
          component: (
            <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center shadow-lg ring-4 ring-amber-100">
              <FaMedal className="text-white text-base" />
            </div>
          ),
          bg: "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-600",
          text: "text-amber-700",
          rank: "3rd",
        };
      default:
        return {
          component: (
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center shadow-sm ring-2 ring-indigo-50">
              <span className="text-indigo-700 font-bold text-sm">
                {index + 1}
              </span>
            </div>
          ),
          bg: "bg-white",
          border: "border-l-4 border-indigo-200",
          text: "text-gray-700",
          rank: `${index + 1}th`,
        };
    }
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    if (rate >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getPerformanceBg = (rate) => {
    if (rate >= 80) return "bg-green-100";
    if (rate >= 60) return "bg-yellow-100";
    if (rate >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  const filteredStudents = sortedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "top") return matchesSearch && student.approvedCount >= 5;
    if (filter === "rising")
      return (
        matchesSearch && student.successRate >= 70 && student.approvedCount > 0
      );

    return matchesSearch;
  });

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
            <p className="text-gray-600 font-medium">Loading leaderboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg mb-4">
              <FaTrophy className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Student Leaderboard
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Celebrating excellence and achievement. Students are ranked by
              their performance in extracurricular activities.
            </p>
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
                  <FaUser className="text-indigo-600 text-xl" />
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
                  <FaAward className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.reduce(
                      (total, student) => total + student.approvedCount,
                      0
                    )}
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
                  <p className="text-sm text-gray-500">Top Performer</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {students[0]?.name || "No data"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <FaFire className="text-yellow-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Avg. Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.length > 0
                      ? Math.round(
                          students.reduce(
                            (sum, student) => sum + student.successRate,
                            0
                          ) / students.length
                        )
                      : 0}
                    %
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
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
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
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  >
                    <option value="all">All Students</option>
                    <option value="top">Top Performers</option>
                    <option value="rising">Rising Stars</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaFilter className="text-sm" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredStudents.map((student, index) => {
              const rankBadge = getRankBadge(index);
              const performanceColor = getPerformanceColor(student.successRate);
              const performanceBg = getPerformanceBg(student.successRate);

              return (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${rankBadge.bg} rounded-2xl shadow-sm overflow-hidden border border-gray-100`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center">
                        {rankBadge.component}
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {rankBadge.rank}
                            </span>
                            {index < 3 && (
                              <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                {index === 0
                                  ? "Champion"
                                  : index === 1
                                  ? "Elite"
                                  : "Achiever"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {student.approvedCount}
                          </div>
                          <div className="text-xs text-gray-500">Approved</div>
                        </div>

                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {student.totalActivities}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>

                        <div className="text-center">
                          <div
                            className={`text-lg font-bold ${performanceColor}`}
                          >
                            {student.successRate}%
                          </div>
                          <div className="text-xs text-gray-500">Success</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Performance</span>
                        <span>{student.successRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${performanceBg}`}
                          style={{ width: `${student.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
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
                <FaTrophy className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500">
                {searchTerm || filter !== "all"
                  ? "No students match your search criteria"
                  : "No students found"}
              </p>
              {(searchTerm || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          )}

          {/* Performance Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white p-5 rounded-2xl shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <FaStar className="text-yellow-500 mr-2" /> Performance Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  Excellent (80-100%)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Good (60-79%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Average (40-59%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">
                  Needs Improvement (0-39%)
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
