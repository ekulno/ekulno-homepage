import React from 'react';
import { Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import './App.css';

const App = () => (
      <div className={`root darkMode`} id="root">
        <main className={"shell"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
);
export default App;