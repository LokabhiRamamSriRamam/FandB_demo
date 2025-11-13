import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopNavbar from './components/TopNavbar';
import Home from './pages/Home';
import WAM from './pages/WAM';



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <TopNavbar />
        <div className="ml-16 pt-16">
          <Home />
        </div>
      </div>
    ),
  },
   {
    path: "/wam",
    element: (
      <div>
        <div >
          <WAM />
        </div>
      </div>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <h1>Jai Sri Ganesh</h1>
    </>
  );
}

export default App;
