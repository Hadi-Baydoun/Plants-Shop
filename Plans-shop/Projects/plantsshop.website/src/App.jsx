import './App.css';
import { NavBar } from './components/NavBar';
import Footer from './components/Footer'; 
import Home from './pages/Home'; 
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className='app'>
      <NavBar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
