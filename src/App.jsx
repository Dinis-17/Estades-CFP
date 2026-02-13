import { Routes, Route, Link } from "react-router-dom";

// Components
import Header from "./components/header/Header";

// Pagines
import Home from "./pages/home/Home";

function App() {
  return (
    <>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
