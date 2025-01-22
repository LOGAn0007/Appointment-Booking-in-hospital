// tailwind.config.js
module.exports = {
  content: [
    "./index.html",               // Vite uses this HTML file at the root level
    "./src/**/*.{html,js,jsx,ts,tsx}", // Scan all files in the src directory
  ],
  theme: {
    extend: {
      colors:{
        'primary' :"#5f6FFF"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill,minmax(200px,1fr))'
      }
    },
  },
  plugins: [],
};
