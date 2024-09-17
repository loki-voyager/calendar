import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <button onClick={()=>{
        console.log(`click: ${true}`)
      }}>click</button>
    </div>
  );
}

export default App;
