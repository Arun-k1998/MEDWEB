/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-signup': "url('https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61802.jpg?w=826&t=st=1688541057~exp=1688541657~hmac=3396a9fe23367241d1f9dc14039add2ee5519356d9039de49a2840c97ef97bb1')",
        
      }
    },
  },
  plugins: [],
}