# odin-repositoryTemplate

Template for our standard webpack configuration

Setup steps:

npm init -y
npm install webpack webpack-cli --save-dev
npm install html-webpack-plugin
-> create src folder with index.html and index.js
-> create dist folder, empty
-> create gitignore (set node_modules to ignore)
-> create webpack.config.js (plugin template set to src index.html; output set to main.js)

npm install --save-dev style-loader css-loader
-> create .css file, import into index.js

npx webpack to generate dist files

run npm install once copied

Jest (with Babel supporting)
Rough steps - 
Follow jest's documentation
install jest / jest-babel?
install babel?, babel loader (error message suggested babel loader was missing)
create babel.config.js, update it from its default
create .babelrc, update 
create jest.config.js, update it to enable CSS imported files to be ignored and not treated as JS
create mocks folder and stylemock.js to support CSS ignoring
package.json updated with "tests" = "jest"
webpack.config.js updated per Jest documentation, but path for js needed to be updated to be absolute
note: notations for module.exports for exports, and "require.." for imports, didn't seem to work, export function and import "abc *" from ... did
