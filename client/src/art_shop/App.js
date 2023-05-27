import './App.css';
import About from './components/pages/About';
import MainCenter from './components/MainCenter';
import Contacts from './components/pages/Contacts';

function App() {
  return (
    <div className="art-shop" id="art-shop">
      <About />
      <MainCenter />
      <Contacts />
    </div>
  );
}

export default App;
