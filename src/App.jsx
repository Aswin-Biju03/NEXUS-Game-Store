import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./Pages/Home";
import Dock from "./Components/Dock";
import "./Components/Dock.css";
import TrendingGames from "./Pages/TrendingGames";
import GameLibrary from "./Pages/GameLibrary";
import Payment from "./Pages/Payment";
import GamePage from "./Pages/GamePage";

import { VscHome } from "react-icons/vsc";
import { IoGameControllerOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";

import { CiGrid41 } from "react-icons/ci";
import ViewCart from "./Pages/ViewCart";
import Pnf from "./Pages/Pnf";

function App() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <VscHome size={18} />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <IoGameControllerOutline size={18} />,
      label: "Games",
      onClick: () => navigate("/trendgames"),
    },
    {
      icon: <CiGrid41 size={18} />,
      label: "Library",
      onClick: () => navigate("/gamelibrary"),
    },
    {
      icon: <IoCartOutline size={18} />,
      label: "Cart",
      onClick: () => navigate("/cart"),
    },
  ];

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trendgames" element={<TrendingGames />} />
        <Route path="/gamelibrary" element={<GameLibrary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/cart" element={<ViewCart />} />
        <Route path="*" element={<Pnf />} />
      </Routes>

      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
    </>
  );
}

export default App;