// import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from './components/Create';
import Products from './components/Products';

  
function App() {
  return (
  
   <BrowserRouter>
     
      <Routes>

          <Route path='/' element={<Products/>}> </Route>
          <Route path='/products' element={<Products/>}> </Route>
          <Route path='/create' element={<Create/>}> </Route>

      </Routes>
   
   </BrowserRouter>
  );
}

export default App;
