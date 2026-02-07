import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}", // in case any left, but we migrated most
  ],
  theme: {
    extend: {
      colors: {
        // Fuego - brasas vivas, no rojo digital
        ember: {
          600: "#E63946", // Brasa brillante
          700: "#D62828", // Fuego profundo
          800: "#9D0208", // Carbón ardiente
          900: "#6A040F", // Brasa apagándose
        },
        // Tierra - noche cálida con humo
        earth: {
          950: "#0D0A08", // Noche con humo
          900: "#1A1512", // Madera quemada
          800: "#2B2520", // Arcilla oscura
          700: "#3D332E", // Tierra tostada
        },
        // Accentos naturales
        sage: "#52796F", // Hierbas frescas
        honey: "#CA9D5F", // Miel/dorado
        cream: "#F8F1E8", // Porcelana

        // Aliases para compatibilidad (mapean a nuevos colores)
        primary: {
          DEFAULT: "#E63946",
          dark: "#D62828",
        },
        background: {
          light: "#0D0A08",
          dark: "#0D0A08",
        },
        surface: {
          light: "#1A1512",
          dark: "#1A1512",
          hover: "#2B2520",
        },
        text: {
          primary: {
            light: "#F8F1E8",
            dark: "#F8F1E8",
          },
          secondary: {
            light: "#CA9D5F",
            dark: "#CA9D5F",
          },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "bounce-slow": "bounce 3s infinite",
        "glow-ember": "glowEmber 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowEmber: {
          "0%, 100%": { opacity: "0", transform: "translateY(20%)" },
          "50%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
