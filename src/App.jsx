import { Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

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
          <Route path="/empreses/:id" element={<DetallsEmpresa />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
