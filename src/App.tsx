import React, {useState, useEffect} from 'react';
import { Home }    from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
 
function App() {
 
  return (
    <Router>
      <div>
        <section>                              
            <Routes>                                                                        
              <Route path="/home" element={<Home/>}/>
              <Route path="/" element={<Signup/>}/>
              <Route path="/login" element={<Login/>}/>
            </Routes>                    
        </section>
      </div>
    </Router>
  );
}
 
export default App;
