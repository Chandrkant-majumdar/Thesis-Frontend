import React, { useState } from "react";
import DiagnosisFeedback from "./DiagnosisFeedback.jsx";

const FinalDiagnosisCard = ({ disease, resetDiagnosis }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleToggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl animate-fadeIn">
        {!showFeedback ? (
          // Main diagnosis content
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏥</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Final Diagnosis
              </h2>
              <p className="text-gray-600">
                Based on your symptoms, we have identified:
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 text-center">
                {disease}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <h4 className="font-semibold text-yellow-800">
                    Important Notice
                  </h4>
                </div>
                <p className="text-sm text-yellow-700">
                  This is an AI-powered preliminary diagnosis. Please consult
                  with a healthcare professional for proper medical advice and
                  treatment.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">✅</span>
                  <h4 className="font-semibold text-green-800">Next Steps</h4>
                </div>
                <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                  <li>Schedule an appointment with your doctor</li>
                  <li>Keep track of your symptoms</li>
                  <li>Follow proper health precautions</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          // Feedback content
          <div className="bg-purple-50 rounded-lg p-5 animate-fadeIn">
            <DiagnosisFeedback
              disease={disease}
              onClose={handleToggleFeedback}
            />
          </div>
        )}

        {/* Action Buttons - Only show when not in feedback mode */}
        {!showFeedback && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={resetDiagnosis}
              className="py-3 px-4 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-2">🔄</span>
              <span>New Diagnosis</span>
            </button>

            <button
              onClick={handleToggleFeedback}
              className="py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center bg-purple-500 text-white hover:bg-purple-600"
            >
              <span className="mr-2">💬</span>
              <span>Give Feedback</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalDiagnosisCard;
