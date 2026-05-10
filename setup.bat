@echo off
REM Create src folder structure
mkdir src\components
mkdir src\scenes
mkdir src\models
mkdir src\textures
mkdir src\animations
mkdir src\shaders
mkdir src\ui
mkdir public

REM Create main src files
echo Creating src/main.jsx
echo ^import React from 'react' > src\main.jsx
echo ^import ReactDOM from 'react-dom/client' >> src\main.jsx
echo ^import App from './App' >> src\main.jsx
echo ^import './index.css' >> src\main.jsx
echo. >> src\main.jsx
echo ^ReactDOM.createRoot(document.getElementById('root')).render( >> src\main.jsx
echo   ^<React.StrictMode^> >> src\main.jsx
echo     ^<App /^> >> src\main.jsx
echo   ^</React.StrictMode^> >> src\main.jsx
echo ^) >> src\main.jsx

echo Project structure created! Run: npm install
