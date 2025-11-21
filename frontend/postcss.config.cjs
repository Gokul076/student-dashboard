// frontend/postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // use the PostCSS wrapper that matches installed package
    require('autoprefixer')()
  ]
};
