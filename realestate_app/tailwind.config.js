module.exports = {
  content: [
    './realestate_app/views/home.handlebars',       // Home template
    './realestate_app/views/layouts/main.handlebars', // Main layout
    './realestate_app/views/login.handlebars',       // Login template
    './realestate_app/views/partials/dashboard.handlebars', // Dashboard partial
    './realestate_app/routes/**/*.js',              // All your JS files in routes folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
