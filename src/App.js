import React from 'react';
import StepForm from './components/StepForm'
import auth from './auth';
import Home from './components/home'

function App() {
	if (auth.isAuthenticated()) return <Home />;
	else return <StepForm />;
}

export default App;