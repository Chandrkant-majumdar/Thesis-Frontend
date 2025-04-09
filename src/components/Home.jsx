import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-darkBlue mb-6">
            Your AI Doctor, trained by human doctors
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            Get instant medical guidance powered by AI and validated by real
            doctors
          </p>
          <Link
            to="/chat"
            className="inline-block bg-codyBlue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Start Chatting Now
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">🩺</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Instant Diagnosis
            </h3>
            <p className="text-gray-600">
              Get quick insights about your symptoms and potential conditions
            </p>
          </div>
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">❤️‍🩹</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Treatment Plans
            </h3>
            <p className="text-gray-600">
              Receive personalized treatment recommendations
            </p>
          </div>
          <div className="p-6 rounded-xl border border-lightBlue">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">
              Lab Interpretation
            </h3>
            <p className="text-gray-600">
              Understand your lab results with clear explanations
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl font-bold text-darkBlue mb-2">634,713</div>
          <p className="text-xl text-gray-600">Humans Served</p>
          <div className="mt-8">
            <div className="inline-flex items-center bg-white rounded-xl p-4 shadow-sm">
              <img src="/trustpilot.svg" alt="Trustpilot" className="h-6" />
              <div className="ml-4 text-sm text-gray-600">
                Rated 4.8/5 on Trustpilot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-lightBlue py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/avatar_0.svg" alt="CodyMD" className="h-8 w-8 mr-2" />
              <span className="text-darkBlue font-medium">CodyMD</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
              <a href="/terms" className="hover:underline">
                Terms
              </a>
              <a href="mailto:team@cody.md" className="hover:underline">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            © 2024 CodyMD
          </div>
        </div>
      </footer>
    </div>
  );
}
