import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-darkBlue mb-6">
            Medical & Homeopathy Diagnosis Expert System
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            An intelligent system using CLIPS for accurate disease diagnosis
            with both modern medicine and homeopathic recommendations
          </p>

          {/* Dual Button Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/chat"
              className="inline-block bg-codyBlue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <span className="mr-2">🏥</span>
              Medical Diagnosis
            </Link>

            <Link
              to="/upload"
              className="inline-block bg-yellow-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              <span className="mr-2">📁</span>
              Upload CSV
            </Link>

            <Link
              to="/knowledge-base"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-700 transition-colors"
            >
              <span className="mr-2">📚</span>
              Knowledge Base
            </Link>

            <a
              href="http://localhost:8000/"
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <span className="mr-2">🌿</span>
              Homeopathy Consultant
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Expert System
            </h3>
            <p className="text-gray-600">
              Powered by CLIPS rule-based system for intelligent diagnosis
            </p>
          </div>
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Symptom Analysis
            </h3>
            <p className="text-gray-600">
              Advanced pattern matching for accurate disease identification
            </p>
          </div>
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Treatment Suggestions
            </h3>
            <p className="text-gray-600">
              Evidence-based recommendations for diagnosed conditions
            </p>
          </div>

          {/* New Homeopathy Feature */}
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Homeopathic Care
            </h3>
            <p className="text-gray-600">
              Alternative medicine suggestions based on holistic healing
              principles
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-lightBlue pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Project Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">👨‍⚕️</span>
                <span className="text-darkBlue font-bold text-lg">
                  Medical Diagnosis Expert System
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                An intelligent medical diagnosis system powered by CLIPS
                rule-based engine. Built as part of academic research in expert
                systems.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-darkBlue mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/chat"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    Start Diagnosis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    About Project
                  </Link>
                </li>
                <li>
                  <Link
                    to="/documentation"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-darkBlue mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.clipsrules.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    CLIPS Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/yourusername/your-repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:your.email@example.com"
                    className="text-gray-600 hover:text-codyBlue"
                  >
                    Contact Developer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2024 Medical Diagnosis Expert System - Academic Project
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-codyBlue"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-codyBlue"
                >
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
