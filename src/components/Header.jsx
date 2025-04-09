import { Link } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Menu button clicked");
    onMenuClick();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white flex flex-col">
      {/* Top Banner */}
      {/* <div className="w-full bg-lime p-3 flex justify-center border-b border-darkBlue">
        <p className="text-center text-[11px] sm:text-sm text-darkBlue">
          <a href="/from-the-founders" className="underline">
            From the Doctors who brought you ZoomCare
          </a>
        </p>
      </div> */}

      {/* Main Header */}
      <div className="py-4 relative w-full flex justify-center items-center">
        {/* Menu Button */}
        <button
          onClick={handleMenuClick}
          className="absolute left-7 top-7 p-2 hover:bg-gray-100 rounded-full z-40"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Logo */}
        {/* <Link to="/" className="flex flex-col items-center">
          <img
            src="/avatar_0_tm.svg"
            alt="CodyMD"
            className="w-[50px] h-[50px] sm:w-[89px] sm:h-[89px]"
          />
          <span className="text-footer sm:text-sm leading-6">CodyMD</span>
        </Link> */}

        {/* Create Account Button */}
        <Link
          to="/register"
          className="absolute right-7 top-6 flex items-center gap-2 bg-lime px-2 sm:px-5 py-2 border border-darkBlue rounded-[50%] sm:rounded-[100px]"
        >
          <img src="/cody-user.svg" alt="" className="w-6 h-6 sm:hidden" />
          <span className="hidden sm:block text-darkBlue">Create account</span>
        </Link>
      </div>
    </header>
  );
}
