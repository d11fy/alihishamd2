import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: "#265473",
          50: "#f0f7fb",
          100: "#dceef6",
          200: "#b4d8ea",
          300: "#7fbad9",
          400: "#4597c3",
          500: "#265473",
          600: "#1e4560",
          700: "#18374d",
          800: "#122a3b",
          900: "#0c1d29",
          foreground: "#ffffff",
        },
        gold: {
          DEFAULT: "#e3b63c",
          50: "#fefbf0",
          100: "#fdf5d9",
          200: "#fae8a8",
          300: "#f5d56d",
          400: "#efbf3a",
          500: "#e3b63c",
          600: "#c9941d",
          700: "#a87118",
          800: "#7d5213",
          900: "#56380d",
        },
        teal: {
          DEFAULT: "#5cbcc2",
          50: "#f0fafb",
          100: "#d9f1f3",
          200: "#a8e2e6",
          300: "#6ecdd3",
          400: "#5cbcc2",
          500: "#3da3aa",
          600: "#2f8289",
          700: "#276871",
          800: "#1e4f55",
          900: "#15363b",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(92, 188, 194, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(92, 188, 194, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #265473 0%, #1a3d54 50%, #0f2535 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #e3b63c 0%, #f0c85a 50%, #c9941d 100%)",
        "gradient-teal":
          "linear-gradient(135deg, #5cbcc2 0%, #3da3aa 50%, #2f8289 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #0c1d29 0%, #265473 40%, #1a3d54 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        "brand-sm": "0 2px 8px rgba(38, 84, 115, 0.15)",
        brand: "0 4px 20px rgba(38, 84, 115, 0.25)",
        "brand-lg": "0 8px 40px rgba(38, 84, 115, 0.35)",
        gold: "0 4px 20px rgba(227, 182, 60, 0.3)",
        teal: "0 4px 20px rgba(92, 188, 194, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
