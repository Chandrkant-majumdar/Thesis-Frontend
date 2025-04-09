import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ChatContainer from "./pages/Chat";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Upload from "./pages/Upload";
import KnowledgeBase from "./pages/KnowledgeBase"; // Import the new KnowledgeBase component

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatContainer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />{" "}
        {/* Add this route for the KnowledgeBase page */}
      </Routes>
    </Router>
  );
}

export default App;
