/** @type {import('tailwindcss').Config} */
export default {
  safelist: [
    "translate-x-0",
    "translate-x-full",
    "blur-sm",
    "opacity-0",
    "opacity-100",
    "pointer-events-none",
  ],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: "#E8FFC2",
        darkBlue: "#141E6D",
        codyBlue: "#2D72F5",
        lightBlue: "#EAEBF5",
        secondary: "#F8F9FA",
        turquoise: "#E0F7FA",
        blue: {
          50: "#f0f7ff",
          100: "#e6f1ff",
          500: "#2563eb",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        gray: {
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          700: "#374151",
          800: "#1f2937",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "system-ui", "sans-serif"],
        roboto_mono: ["Roboto Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        chat: ["0.9375rem", { lineHeight: "1.5rem" }], // 15px
        message: ["0.9375rem", { lineHeight: "1.75" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
      letterSpacing: {
        tight: "-0.01em",
        normal: "0",
        wide: "0.01em",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
