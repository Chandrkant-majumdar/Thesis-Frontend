import React, { useState, useEffect } from "react";

const DiagnosisFeedback = ({ onClose, disease }) => {
  const [isSatisfied, setIsSatisfied] = useState(null);
  const [missedSymptoms, setMissedSymptoms] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState(1);
  const [animateOut, setAnimateOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Log component initialization with disease prop
  console.log("DiagnosisFeedback initialized with disease:", disease);

  const handleFeedbackSubmit = async () => {
    console.log("handleFeedbackSubmit triggered");
    console.log("Current state:", {
      disease,
      isSatisfied,
      missedSymptoms,
    });

    // Only process missed symptoms if user was not satisfied
    if (!isSatisfied && !missedSymptoms.trim()) {
      console.log("Validation failed: Missing symptoms");
      alert("Please provide the symptoms we missed");
      return;
    }

    console.log("Validation passed, proceeding with submission");
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create payload for logging - simplified to just disease and symptoms
      const payload = {
        disease: disease, // The disease to associate symptoms with
        isSatisfied,
        missedSymptoms: isSatisfied ? "" : missedSymptoms.trim(),
        timestamp: new Date().toISOString(),
      };

      console.log("Sending feedback payload:", payload);

      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        console.error("API error response:", response.statusText);
        throw new Error("Failed to submit feedback");
      }

      // Log success
      console.log("✅ Feedback submitted successfully for disease:", disease);
      console.log("Symptoms added to disease:", missedSymptoms);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
      console.error("Error details:", error.message);
      setSubmitError("Failed to send feedback. Please try again.");
    } finally {
      console.log("Submission process completed, isSubmitting set to false");
      setIsSubmitting(false);
    }
  };

  const handleSatisfactionSelect = (satisfied) => {
    console.log("User selected satisfaction:", satisfied);
    setIsSatisfied(satisfied);
    // Animate transition to next step
    setAnimateOut(true);
    setTimeout(() => {
      setFeedbackStep(2);
      setAnimateOut(false);
      console.log("Advanced to feedback step 2");
    }, 300);
  };

  const handleBack = () => {
    console.log("User clicked back button");
    setAnimateOut(true);
    setTimeout(() => {
      setFeedbackStep(1);
      setAnimateOut(false);
      console.log("Returned to feedback step 1");
    }, 300);
  };

  useEffect(() => {
    if (feedbackSubmitted) {
      console.log("Feedback submitted, auto-close timer started");
      // Auto close after submission with delay
      const timer = setTimeout(() => {
        console.log("Auto-closing feedback dialog");
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackSubmitted, onClose]);

  // Log rendering state
  console.log("Rendering DiagnosisFeedback:", {
    feedbackStep,
    isSatisfied,
    feedbackSubmitted,
    missedSymptoms:
      missedSymptoms.length > 0
        ? `${missedSymptoms.substring(0, 20)}...`
        : "(empty)",
  });

  // Satisfaction step
  if (feedbackStep === 1) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          animateOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-sm">
              1
            </span>
            How satisfied are you with the diagnosis?
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSatisfactionSelect(true)}
            className="group relative bg-white overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg border-2 border-gray-100 hover:border-green-400 p-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-5 text-center">
              <div className="bg-green-100/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">👍</span>
              </div>
              <h4 className="text-base font-medium text-gray-800 mb-1">
                Helpful
              </h4>
              <p className="text-xs text-gray-500">
                I found this system helpful
              </p>
            </div>
          </button>

          <button
            onClick={() => handleSatisfactionSelect(false)}
            className="group relative bg-white overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg border-2 border-gray-100 hover:border-red-400 p-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-5 text-center">
              <div className="bg-red-100/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl">👎</span>
              </div>
              <h4 className="text-base font-medium text-gray-800 mb-1">
                Not Helpful
              </h4>
              <p className="text-xs text-gray-500">
                I did not find this system helpful
              </p>
            </div>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Your feedback helps us improve our diagnosis accuracy
          </p>
        </div>
      </div>
    );
  }

  // Details step
  if (feedbackStep === 2 && !feedbackSubmitted) {
    return (
      <div
        className={`transition-opacity duration-300 ${
          animateOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2 text-sm">
              2
            </span>
            Additional Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              isSatisfied
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <span className="text-xl">{isSatisfied ? "👍" : "👎"}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isSatisfied
                ? "You found this system helpful"
                : "You did not find this system helpful"}
            </p>
            <button
              onClick={handleBack}
              className="text-xs text-purple-600 hover:text-purple-800 underline mt-1"
            >
              Change my response
            </button>
          </div>
        </div>

        {!isSatisfied && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                What symptoms should we have asked about?
              </label>
              <textarea
                value={missedSymptoms}
                onChange={(e) => setMissedSymptoms(e.target.value)}
                placeholder="Please share symptoms we missed..."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:border-purple-400 focus:ring-1 focus:ring-purple-300 outline-none transition-colors"
                rows="2"
              ></textarea>
            </div>
          </>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleBack}
            className="px-5 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            onClick={handleFeedbackSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-300 focus:ring-offset-1 transition-all shadow-md hover:shadow-lg flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>

        {submitError && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {submitError}
          </div>
        )}
      </div>
    );
  }

  // Thank you step
  if (feedbackSubmitted) {
    return (
      <div className="text-center py-2 animate-fadeIn">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-1">
          Your feedback helps us improve our diagnosis accuracy.
        </p>
        <p className="text-sm text-gray-500">Closing automatically...</p>
      </div>
    );
  }

  return null;
};

export default DiagnosisFeedback;
