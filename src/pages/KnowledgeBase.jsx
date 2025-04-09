import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// API base URL - update this to your actual backend address
const API_BASE_URL = "http://localhost:5001";

export default function KnowledgeBase() {
  console.log("KnowledgeBase component rendering");
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newSymptom, setNewSymptom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [addingDisease, setAddingDisease] = useState(false);
  const [newDisease, setNewDisease] = useState({
    name: "",
    symptoms: [""],
  });
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [expandedCards, setExpandedCards] = useState({}); // Track which cards have expanded symptoms
  const SYMPTOMS_LIMIT = 4; // Number of symptoms to show initially

  // Toggle symptom expansion for a card
  const toggleCardExpansion = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch all diseases and symptoms from the knowledge base
  const fetchKnowledgeBase = async () => {
    console.log("Fetching knowledge base data...");
    setIsLoading(true);
    try {
      console.log(`Making API request to: ${API_BASE_URL}/api/knowledge_base`);
      const response = await fetch(`${API_BASE_URL}/api/knowledge_base`);
      console.log("API response received:", response);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Knowledge base data received:", data);
      setKnowledgeBase(data);
    } catch (err) {
      console.error("Failed to fetch knowledge base:", err);
      setError(err.message || "Failed to fetch knowledge base");
    } finally {
      console.log("Fetch operation completed, setting loading to false");
      setIsLoading(false);
    }
  };

  // Handle adding a new symptom to a disease
  const handleAddSymptom = async (diseaseId, symptom) => {
    console.log(`Adding symptom "${symptom}" to disease ID: ${diseaseId}`);
    if (!symptom.trim()) {
      console.warn("Empty symptom, canceling add operation");
      return;
    }

    try {
      console.log("Sending add_symptom request to API");
      const response = await fetch(`${API_BASE_URL}/api/add_symptom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diseaseId, symptom }),
      });
      console.log("Add symptom API response:", response);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Add symptom success:", result);

      console.log("Refreshing knowledge base after adding symptom");
      await fetchKnowledgeBase();
      setNewSymptom("");
    } catch (err) {
      console.error("Failed to add symptom:", err);
      setError(err.message || "Failed to add symptom");
    }
  };

  // Handle removing a symptom from a disease
  const handleRemoveSymptom = async (diseaseId, symptom) => {
    console.log(`Removing symptom "${symptom}" from disease ID: ${diseaseId}`);
    try {
      console.log("Sending remove_symptom request to API");
      const response = await fetch(`${API_BASE_URL}/api/remove_symptom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diseaseId, symptom }),
      });
      console.log("Remove symptom API response:", response);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Remove symptom success:", result);

      console.log("Refreshing knowledge base after removing symptom");
      await fetchKnowledgeBase();
    } catch (err) {
      console.error("Failed to remove symptom:", err);
      setError(err.message || "Failed to remove symptom");
    }
  };

  // Handle adding a new disease
  const handleAddDisease = async () => {
    console.log("Adding new disease:", newDisease);
    if (!newDisease.name.trim() || !newDisease.symptoms[0].trim()) {
      console.warn(
        "Disease name or first symptom is empty, canceling add operation"
      );
      return;
    }

    try {
      console.log("Sending add_disease request to API");
      const response = await fetch(`${API_BASE_URL}/api/add_disease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDisease),
      });
      console.log("Add disease API response:", response);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Add disease success:", result);

      console.log("Refreshing knowledge base after adding disease");
      await fetchKnowledgeBase();
      setAddingDisease(false);
      setNewDisease({ name: "", symptoms: [""] });
    } catch (err) {
      console.error("Failed to add disease:", err);
      setError(err.message || "Failed to add disease");
    }
  };

  // Handle updating new disease form symptoms
  const handleNewDiseaseSymptomChange = (index, value) => {
    console.log(`Updating symptom at index ${index} to: ${value}`);
    const updatedSymptoms = [...newDisease.symptoms];
    updatedSymptoms[index] = value;
    setNewDisease({
      ...newDisease,
      symptoms: updatedSymptoms,
    });
  };

  // Add a new symptom field to the new disease form
  const addNewSymptomField = () => {
    console.log("Adding new symptom field to form");
    setNewDisease({
      ...newDisease,
      symptoms: [...newDisease.symptoms, ""],
    });
  };

  // Sort the knowledge base
  const sortKnowledgeBase = (items) => {
    return [...items].sort((a, b) => {
      const comparison = a.disease.localeCompare(b.disease);
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Filter and sort knowledge base
  const filteredKnowledgeBase = sortKnowledgeBase(
    knowledgeBase.filter((item) => {
      const matchesDisease = item.disease
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSymptom = item.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesDisease || matchesSymptom;
    })
  );

  console.log("Filtered knowledge base items:", filteredKnowledgeBase.length);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Load knowledge base on component mount
  useEffect(() => {
    console.log("KnowledgeBase component mounted");
    fetchKnowledgeBase();

    return () => {
      console.log("KnowledgeBase component unmounting");
    };
  }, []);

  // Filter knowledge base by search term
  useEffect(() => {
    console.log("Search term changed to:", searchTerm);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-darkBlue">
              Knowledge Base Editor
            </h1>
            <p className="text-gray-600 mt-2">
              View and modify diseases and symptoms in the expert system
            </p>
          </div>
          <Link
            to="/"
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search diseases or symptoms..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-codyBlue focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-4 py-2 flex items-center ${
                    viewMode === "cards"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 flex items-center ${
                    viewMode === "table"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Table
                </button>
              </div>

              {/* Sort Button */}
              <button
                onClick={toggleSortOrder}
                className="border border-gray-300 bg-white text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      sortOrder === "asc"
                        ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    }
                  />
                </svg>
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </button>

              {/* Add Disease Button */}
              <button
                onClick={() => setAddingDisease(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Disease
              </button>
            </div>
          </div>
        </div>

        {/* Loading, Error and Empty States */}
        {isLoading && (
          <div className="text-center py-16">
            <svg
              className="animate-spin h-10 w-10 text-codyBlue mx-auto mb-4"
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
            <p className="text-lg text-gray-600">Loading knowledge base...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Error Loading Knowledge Base
            </h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchKnowledgeBase}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && knowledgeBase.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No Diseases Found
            </h2>
            <p className="text-gray-600">
              The knowledge base is empty. Add your first disease to get
              started.
            </p>
            <button
              onClick={() => setAddingDisease(true)}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Add Disease
            </button>
          </div>
        )}

        {/* Knowledge Base List - Card View */}
        {!isLoading &&
          !error &&
          filteredKnowledgeBase.length > 0 &&
          viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKnowledgeBase.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col"
                >
                  <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                    <h2
                      className="text-xl font-bold text-darkBlue truncate"
                      title={item.disease}
                    >
                      {item.disease}
                    </h2>
                    <p className="text-sm text-blue-600 mt-1">
                      {item.symptoms.length} symptom
                      {item.symptoms.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="p-6 flex-grow">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                      Symptoms
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.symptoms
                        .slice(
                          0,
                          expandedCards[item.id]
                            ? item.symptoms.length
                            : SYMPTOMS_LIMIT
                        )
                        .map((symptom, sympIndex) => (
                          <div
                            key={sympIndex}
                            className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            <span
                              className="truncate max-w-[150px]"
                              title={symptom}
                            >
                              {symptom}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveSymptom(item.id, symptom)
                              }
                              className="ml-1.5 text-blue-400 hover:text-blue-700 rounded-full hover:bg-blue-100 p-1"
                              title="Remove symptom"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                    </div>

                    {/* Show more/less button with count of hidden symptoms */}
                    {item.symptoms.length > SYMPTOMS_LIMIT && (
                      <button
                        onClick={() => toggleCardExpansion(item.id)}
                        className="text-codyBlue hover:text-blue-600 text-sm font-medium flex items-center"
                      >
                        {expandedCards[item.id] ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            Show Less
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            Show {item.symptoms.length - SYMPTOMS_LIMIT} More
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {editingItem === item.id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newSymptom}
                          onChange={(e) => setNewSymptom(e.target.value)}
                          placeholder="Enter new symptom"
                          className="flex-grow px-3 py-1.5 text-sm rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-codyBlue focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            handleAddSymptom(item.id, newSymptom);
                            setEditingItem(null);
                          }}
                          className="bg-codyBlue text-white px-3 py-1.5 text-sm rounded-r-lg hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingItem(item.id)}
                        className="text-codyBlue hover:text-blue-600 text-sm font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Symptom
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Knowledge Base List - Table View */}
        {!isLoading &&
          !error &&
          filteredKnowledgeBase.length > 0 &&
          viewMode === "table" && (
            <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={toggleSortOrder}
                    >
                      <div className="flex items-center">
                        Disease Name
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              sortOrder === "asc"
                                ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                            }
                          />
                        </svg>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Symptoms
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredKnowledgeBase.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.disease}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {item.symptoms.map((symptom, sympIndex) => (
                            <div
                              key={sympIndex}
                              className="bg-blue-50 text-blue-700 rounded-full px-2.5 py-1 text-xs flex items-center"
                            >
                              <span
                                className="truncate max-w-[200px]"
                                title={symptom}
                              >
                                {symptom}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveSymptom(item.id, symptom)
                                }
                                className="ml-1 text-blue-400 hover:text-blue-700 rounded-full hover:bg-blue-100 p-0.5"
                                title="Remove symptom"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingItem === item.id ? (
                          <div className="flex items-center justify-end">
                            <input
                              type="text"
                              value={newSymptom}
                              onChange={(e) => setNewSymptom(e.target.value)}
                              placeholder="Enter new symptom"
                              className="px-3 py-1 text-sm rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-codyBlue focus:border-transparent w-40"
                            />
                            <button
                              onClick={() => {
                                handleAddSymptom(item.id, newSymptom);
                                setEditingItem(null);
                              }}
                              className="bg-codyBlue text-white px-3 py-1 text-sm rounded-r-lg hover:bg-blue-600"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingItem(item.id)}
                            className="text-codyBlue hover:text-blue-600 text-sm font-medium"
                          >
                            Add Symptom
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Add New Disease Modal */}
        {addingDisease && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-darkBlue">
                  Add New Disease
                </h2>
                <button
                  onClick={() => setAddingDisease(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Disease Name
                  </label>
                  <input
                    type="text"
                    value={newDisease.name}
                    onChange={(e) =>
                      setNewDisease({ ...newDisease, name: e.target.value })
                    }
                    placeholder="Enter disease name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-codyBlue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Symptoms</label>
                  <div className="space-y-2">
                    {newDisease.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={symptom}
                          onChange={(e) =>
                            handleNewDiseaseSymptomChange(index, e.target.value)
                          }
                          placeholder={`Symptom ${index + 1}`}
                          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-codyBlue focus:border-transparent"
                        />
                        {index > 0 && (
                          <button
                            onClick={() => {
                              const updatedSymptoms = [...newDisease.symptoms];
                              updatedSymptoms.splice(index, 1);
                              setNewDisease({
                                ...newDisease,
                                symptoms: updatedSymptoms,
                              });
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addNewSymptomField}
                    className="mt-2 text-codyBlue hover:text-blue-600 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Another Symptom
                  </button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setAddingDisease(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddDisease}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={
                      !newDisease.name.trim() || !newDisease.symptoms[0].trim()
                    }
                  >
                    Save Disease
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
