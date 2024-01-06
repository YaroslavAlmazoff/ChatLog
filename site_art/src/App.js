import { Route, Routes } from 'react-router';
import './App.css';
import Header from './Header';
import Contacts from './Contacts';
import Main from './Main';
import Buy from './Buy';
import AboutAuthor from './AboutAuthor';
import Reviews from './Reviews';
import Answer from './Answer';
import Footer from './Footer';
import Picture from './Picture';
import { useState } from 'react';
import Zakaz from './Zakaz';

function App() {
  const numberValue = localStorage.getItem("number") 
  const [number, setNumber] = useState(numberValue != null ? numberValue : 0)
  localStorage.setItem('basket', JSON.stringify([]))
  localStorage.setItem('visited', true)
  return (
    <div className="page-center">
      <Header number={number} /> 
      <Routes> {/* Маршруты */}
        <Route path="/" element={<Main number={number} setNumber={setNumber} />}/>
        <Route path="/contacts" element={<Contacts />}/>
        <Route path="/buy" element={<Buy />}/>
        <Route path="/about-author" element={<AboutAuthor />}/>
        <Route path="/reviews" element={<Reviews />}/>
        <Route path="/answer" element={<Answer />}/>
        <Route path="/picture/:id" element={<Picture number={number} setNumber={setNumber} />}/>
        <Route path="/zakaz/:id/:i" element={<Zakaz />}/></Routes>
      <Footer />
    </div>
  );
}

export default App;
