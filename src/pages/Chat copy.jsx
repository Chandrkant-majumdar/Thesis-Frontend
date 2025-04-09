import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FinalDiagnosisCard from "../pages//FinalDiagnosisCard";
import SymptomCard from "../pages/SymptomCard";
import SymptomCategories from "../pages/SymptomCategories";
import MessagesContainer from "../pages/MessagesContainer";

// Define the available services
const services = [
  { icon: "🩺", name: "Diagnose" },
  { icon: "❤️‍🩹", name: "Treat" },
  { icon: "🔬", name: "Specialists", isNew: true },
  { icon: "❓", name: "Ask" },
  { icon: "���", name: "Talk", isNew: true },
  { icon: "🧰", name: "Interpret", isNew: true },
  { icon: "📊", name: "Health Score", isNew: true },
];

// Initial system message
const initialMessages = [
  {
    sender: "system",
    text: "Welcome to the Medical Expert System Assistant. This system represents a thesis implementation of an AI-driven diagnostic tool utilizing CLIPS rule-based reasoning. Please begin by selecting your symptoms from the categorized list below. The system will analyze symptom patterns to suggest potential diagnoses based on its knowledge base. Note: This is an academic prototype for research purposes.",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

function Chat() {
  // State variables
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [remainingSymptoms, setRemainingSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [possibleDiseases, setPossibleDiseases] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalDiagnosis, setIsFinalDiagnosis] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [activeCategory, setActiveCategory] = useState("common"); // Add new state for active category

  // Refs for scrolling
  const messagesEndRef = useRef(null);
  const symptomsContainerRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = (ref = messagesEndRef, offset = 100) => {
    if (!ref.current) return;

    const scrollContainer = document.getElementById("chat-container");
    if (scrollContainer) {
      const targetPosition = ref.current.offsetTop - offset;
      scrollContainer.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll to the symptoms section
  const scrollToSymptoms = () => {
    if (!symptomsContainerRef.current) return;

    const container = document.getElementById("chat-container");
    if (!container) return;

    const currentScroll = container.scrollTop;
    const targetScroll = symptomsContainerRef.current.offsetTop - 150; // Add offset

    // Only scroll if we need to move more than 200px
    if (Math.abs(targetScroll - currentScroll) > 200) {
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial symptoms when the component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/get_initial_symptoms")
      .then((response) => {
        setAllSymptoms(response.data.all_symptoms);
        setRemainingSymptoms(response.data.all_symptoms); // Initialize remaining symptoms
      })
      .catch((err) => {
        console.error("Error fetching initial symptoms:", err);
        addSystemMessage(
          "Sorry, there was an error fetching the symptoms. Please try again later."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Function to add a user message
  const addUserMessage = (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // Function to add a system message
  const addSystemMessage = (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "system",
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // Handle symptom selection
  const handleSelectSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      addSystemMessage(
        `I noted that you've already mentioned experiencing ${symptom}. Are you experiencing any other symptoms?`
      );
      scrollToBottom();
      return;
    }

    const updatedSymptoms = [...selectedSymptoms, symptom];
    setSelectedSymptoms(updatedSymptoms);
    addUserMessage(`I'm having ${symptom}.`);
    setIsTyping(true);
    processSymptoms(updatedSymptoms);
  };

  // Process selected symptoms and get possible diseases
  const processSymptoms = (symptoms) => {
    setIsTyping(true);
    axios
      .post("http://localhost:5000/api/diagnose", { symptoms })
      .then((response) => {
        const data = response.data;
        setPossibleDiseases(data.possible_diseases);

        console.log("---- Processing Details ----");
        console.log("Current Symptoms:", symptoms);
        console.log("Possible Diseases:", data.possible_diseases);

        if (data.possible_diseases.length === 1) {
          setIsFinalDiagnosis(true);
          addSystemMessage(
            `Based on the combination of symptoms you've described (${symptoms.join(
              ", "
            )}), I can now provide a likely diagnosis.`
          );
          addSystemMessage(
            `My analysis suggests you may have: ${data.possible_diseases[0]}`
          );
          addSystemMessage(
            "While this is a preliminary AI-based assessment, it's important to consult with a healthcare provider for proper evaluation and treatment."
          );
        } else if (data.possible_diseases.length > 1) {
          const suggestedSymptoms = data.remaining_symptoms
            .slice(0, 3)
            .join(", ");
          const response =
            symptoms.length === 1
              ? `Based on your symptom of ${symptoms[0]}, here's what I found:

🔍 Possible Conditions:
${data.possible_diseases.map((disease) => `• ${disease}`).join("\n")}

To help narrow down the diagnosis, please indicate if you have any of these additional symptoms:
• ${data.remaining_symptoms.slice(0, 3).join("\n• ")}`
              : `Based on your symptoms (${symptoms.join(
                  ", "
                )}), here's what I found:

🔍 Possible Conditions:
${data.possible_diseases.map((disease) => `• ${disease}`).join("\n")}

To refine the diagnosis, please indicate if you have any of these additional symptoms:
• ${data.remaining_symptoms.slice(0, 3).join("\n• ")}`;

          addSystemMessage(response);
        } else {
          addSystemMessage(
            "I need more information to make an accurate assessment. Could you please select any other symptoms you're experiencing?"
          );
        }

        setRemainingSymptoms(data.remaining_symptoms);
        scrollToBottom();
        if (response.data.possible_diseases.length > 1) {
          setTimeout(scrollToSymptoms, 800);
        }
      })
      .catch((err) => {
        console.error("Error processing diagnosis:", err);
        addSystemMessage(
          "Sorry, there was an error processing your diagnosis. Please try again."
        );
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  // Handle final diagnosis
  const handleDiagnose = () => {
    if (possibleDiseases.length === 1) {
      addSystemMessage(`Final Diagnosis: ${possibleDiseases[0]}`);
    } else if (possibleDiseases.length > 1) {
      addSystemMessage(
        `Multiple possible diseases found: ${possibleDiseases.join(
          ", "
        )}. Please select more symptoms to narrow down.`
      );
    } else {
      addSystemMessage(
        "No matching diseases found based on the provided symptoms."
      );
    }
  };

  // Reset the diagnosis process
  const resetDiagnosis = () => {
    setMessages([
      {
        sender: "system",
        text: "Conversation has been reset. Please select your symptoms one by one.",
      },
    ]);
    setPossibleDiseases([]);
    setSelectedSymptoms([]);
    setRemainingSymptoms(allSymptoms); // Reset remaining symptoms
    setIsFinalDiagnosis(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle key press (Enter key)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Handle send button click
  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // You can add custom message handling here if needed
  };

  // Symptom categories for better organization
  const symptomCategories = {
    common: "Common Symptoms",
    pain: "Pain Related",
    digestive: "Digestive",
    respiratory: "Respiratory",
    other: "Other Symptoms",
  };

  // Helper function to categorize symptoms
  const categorizeSymptoms = (symptoms) => {
    // Simple categorization logic - you can enhance this based on your needs
    return symptoms.reduce(
      (acc, symptom) => {
        if (symptom.toLowerCase().includes("pain")) {
          acc.pain.push(symptom);
        } else if (
          ["nausea", "vomiting", "diarrhea", "indigestion"].some((s) =>
            symptom.toLowerCase().includes(s)
          )
        ) {
          acc.digestive.push(symptom);
        } else if (
          ["cough", "breath", "chest"].some((s) =>
            symptom.toLowerCase().includes(s)
          )
        ) {
          acc.respiratory.push(symptom);
        } else if (
          ["fever", "headache", "fatigue"].some((s) =>
            symptom.toLowerCase().includes(s)
          )
        ) {
          acc.common.push(symptom);
        } else {
          acc.other.push(symptom);
        }
        return acc;
      },
      { common: [], pain: [], digestive: [], respiratory: [], other: [] }
    );
  };

  // Main return statement
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Main scrollable container */}
      <div className="flex-1 overflow-hidden relative">
        {/* Add padding-top to move content down */}
        <div
          className="h-full overflow-y-auto px-4 py-6"
          id="chat-container"
          style={{
            height: "calc(100vh - 140px)", // Adjust for bottom panel
            paddingBottom: "160px", // Extra padding for bottom content
          }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Messages Container with margin-top */}
            <MessagesContainer
              messages={messages}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
            />

            {/* Symptoms Selection */}
            <div ref={symptomsContainerRef} className="mb-20 max-w-5xl mx-auto">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Category Tabs */}
                  <SymptomCategories
                    symptomCategories={symptomCategories}
                    categorizeSymptoms={categorizeSymptoms}
                    remainingSymptoms={remainingSymptoms}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />

                  {/* Symptoms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                    {categorizeSymptoms(remainingSymptoms)[activeCategory].map(
                      (symptom) => (
                        <SymptomCard
                          key={symptom}
                          symptom={symptom}
                          category={activeCategory}
                          onClick={() => handleSelectSymptom(symptom)}
                          isSelected={selectedSymptoms.includes(symptom)}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add the FinalDiagnosisCard when there's a final diagnosis */}
      {isFinalDiagnosis && possibleDiseases.length === 1 && (
        <FinalDiagnosisCard
          disease={possibleDiseases[0]}
          resetDiagnosis={resetDiagnosis}
        />
      )}

      {/* Bottom panel - adjust height if needed */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-10"
        style={{ height: "140px" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Status Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Selected Symptoms Panel */}
            <div className="col-span-1">
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3 h-full transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">🔍</span>
                  <h3 className="font-semibold text-blue-800 text-xs sm:text-sm">
                    Selected Symptoms
                  </h3>
                  <span className="ml-auto bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {selectedSymptoms.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-white/80 text-blue-700 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    >
                      {symptom}
                    </span>
                  ))}
                  {selectedSymptoms.length === 0 && (
                    <span className="text-blue-600/60 text-xs italic">
                      No symptoms selected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Possible Conditions Panel */}
            <div className="col-span-1">
              <div className="bg-green-50 rounded-lg p-2 sm:p-3 h-full transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">🎯</span>
                  <h3 className="font-semibold text-green-800 text-xs sm:text-sm">
                    Possible Conditions
                  </h3>
                  <span className="ml-auto bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">
                    {possibleDiseases.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {possibleDiseases.map((disease, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-white/80 text-green-700 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    >
                      {disease}
                    </span>
                  ))}
                  {possibleDiseases.length === 0 && (
                    <span className="text-green-600/60 text-xs italic">
                      No conditions identified yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comment out Input Area 
          <div className="flex items-end gap-2">
            <div className="flex-1 border-2 border-blue-500 rounded-3xl p-2">
              <textarea
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full resize-none focus:outline-none"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

export default Chat;
