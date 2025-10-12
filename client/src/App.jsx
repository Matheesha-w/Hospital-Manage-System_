import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex gap-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 h-20" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 h-20" alt="React logo" />
        </a>
      </div>

      <h1 className="text-3xl font-bold mt-4">Vite + React</h1>

      <div className="card mt-4 p-4 border rounded">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          count is {count}
        </button>
        <p className="mt-2">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="text-blue-800 font-bold mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App
