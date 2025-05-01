
import type { Config } from "tailwindcss";

export default {
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
        mono: ['Roboto Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        menstruation: {
          primary: "#D23D3D",
          secondary: "#6E59A5",
          light: "#FFEEEE",
          bg: "#F1F0FB",
        },
        follicular: {
          primary: "#4CAF50",
          secondary: "#81C784",
          light: "#F2FCE2",
          bg: "#E8F5E9",
        },
        ovulatory: {
          primary: "#FFB74D",
          secondary: "#FFA726",
          light: "#FEF7CD",
          bg: "#FFF8E1",
        },
        luteal: {
          primary: "#FF7043",
          secondary: "#FF5722",
          light: "#FEC6A1",
          bg: "#FBE9E7",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        sparkle: {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: "1"
          },
          "50%": {
            transform: "scale(1.2)",
            opacity: "0.8"
          },
        },
        "boost": {
          "0%": { transform: "scale(1) translateY(0)" },
          "50%": { transform: "scale(1.2) translateY(-10px)" },
          "100%": { transform: "scale(1) translateY(0)" }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" }
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        float: "float 3s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        "boost": "boost 0.5s ease-in-out",
        "pulse": "pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "wiggle": "wiggle 2s ease-in-out infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "shimmer": "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 60%, transparent 80%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
