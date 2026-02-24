import { Routes, Route, Link } from "react-router-dom";

// Components
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

// Pagines
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import DetallsEmpresa from "./pages/detallsEmpresa/DetallsEmpresa";

function App() {
  return (
    <>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
