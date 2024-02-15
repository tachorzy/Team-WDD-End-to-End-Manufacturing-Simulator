module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname // <-- this did the trick for me
 }
};
