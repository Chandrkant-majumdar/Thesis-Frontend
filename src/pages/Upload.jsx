import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";

// API base URL - update this to your actual backend address
const API_BASE_URL = "http://localhost:5001";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    success: false,
    error: false,
    message: "",
  });
  const [backendStatus, setBackendStatus] = useState({
    isChecking: true,
    isAvailable: false,
    message: "Checking connection to server...",
  });

  const checkBackendStatus = async () => {
    setBackendStatus({
      isChecking: true,
      isAvailable: backendStatus.isAvailable,
      message: "Checking connection to server...",
    });

    try {
      // Try to ping the backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/api/healthcheck`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setBackendStatus({
          isChecking: false,
          isAvailable: true,
          message: "Connected to server",
        });
      } else {
        setBackendStatus({
          isChecking: false,
          isAvailable: false,
          message: "Server is not responding properly",
        });
      }
    } catch (error) {
      console.error("Backend check error:", error);
      setBackendStatus({
        isChecking: false,
        isAvailable: false,
        message: "Cannot connect to server",
      });
    }
  };

  // Check backend status when component mounts
  useEffect(() => {
    checkBackendStatus();
    // Check periodically
    const intervalId = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    // Only accept the first file if multiple are dropped
    if (acceptedFiles.length) {
      const selectedFile = acceptedFiles[0];
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        setUploadStatus({
          success: false,
          error: true,
          message: "Please select a CSV file",
        });
        return;
      }
      setFile(selectedFile);
      setUploadStatus({
        success: false,
        error: false,
        message: "",
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        success: false,
        error: true,
        message: "Please select a file to upload",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      // Use the API base URL for the request
      const response = await fetch(`${API_BASE_URL}/api/upload_csv`, {
        method: "POST",
        body: formData,
      });

      // Handle potential non-JSON responses
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = {
          message: (await response.text()) || "Unknown server response",
        };
      }

      if (response.ok) {
        setUploadStatus({
          success: true,
          error: false,
          message: data.message || "File uploaded successfully!",
        });
        setFile(null); // Reset the file after successful upload
      } else {
        setUploadStatus({
          success: false,
          error: true,
          message:
            data.message ||
            `Failed to upload file (${response.status}). Please try again.`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        success: false,
        error: true,
        message:
          "Connection error: Unable to reach the server. Please check your network connection or contact the administrator.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkBlue">Upload CSV Data</h1>
          <p className="text-gray-600 mt-2">
            Upload your CSV file to generate CLIPS rules for disease diagnosis
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-lightBlue">
          {/* Backend status indicator */}
          <div
            className={`mb-6 p-3 rounded-lg flex items-center ${
              backendStatus.isChecking
                ? "bg-gray-100"
                : backendStatus.isAvailable
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                backendStatus.isChecking
                  ? "bg-gray-400"
                  : backendStatus.isAvailable
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-sm ${
                backendStatus.isChecking
                  ? "text-gray-600"
                  : backendStatus.isAvailable
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {backendStatus.message}
            </span>
            {!backendStatus.isChecking && !backendStatus.isAvailable && (
              <button
                onClick={checkBackendStatus}
                className="ml-auto text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            )}
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-codyBlue bg-blue-50"
                : "border-gray-300 hover:border-codyBlue"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-4">📁</span>
              {isDragActive ? (
                <p className="text-lg text-codyBlue font-medium">
                  Drop the CSV file here ...
                </p>
              ) : (
                <p className="text-lg text-gray-600">
                  Drag and drop a CSV file here, or click to select a file
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Only CSV files are accepted
              </p>
            </div>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📄</span>
                  <div>
                    <p className="font-medium text-darkBlue">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {uploadStatus.message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                uploadStatus.error
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : uploadStatus.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : ""
              }`}
            >
              {uploadStatus.message}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Link
              to="/"
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Back to Home
            </Link>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading || !backendStatus.isAvailable}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !file || isUploading || !backendStatus.isAvailable
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
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
                  Uploading...
                </span>
              ) : !backendStatus.isAvailable ? (
                "Server Offline"
              ) : (
                "Upload CSV"
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-semibold text-darkBlue mb-3">
            How It Works
          </h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Upload a CSV file with disease and symptom data</li>
            <li>The system will convert your CSV data into CLIPS rules</li>
            <li>These rules will be integrated with the expert system</li>
            <li>
              You can then use the Medical Diagnosis tool with your custom rules
            </li>
          </ol>
          <div className="mt-4 text-sm text-gray-500">
            <p>CSV format requirements:</p>
            <p className="mt-1">
              • First column should contain the disease name
              <br />
              • Following columns should contain related symptoms
              <br />• First row should be headers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
