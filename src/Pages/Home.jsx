import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../Components/Aurora";
import axios from "axios";
import "./Home.css";

function Home() {
  const [search, setSearch] = useState("");
  const [allGames, setAllGames] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const featuredGames = [
    {
      id: "9",
      title: "Red Dead Redemption 2",
      img: "https://m.media-amazon.com/images/I/81k9mAngCkL.jpg",
    },
    {
      id: "2",
      title: "God Of War (2018)",
      img: "https://i.pinimg.com/736x/9d/91/6a/9d916a6be9b97874460a5a56cbd77cbd.jpg",
    },
    {
      id: "51",
      title: "Black Myth: Wukong",
      img: "https://m.media-amazon.com/images/M/MV5BNGVmZTVjZDMtMzkyZi00MTczLWE4OTUtY2Y1ODBlMGFlYTAxXkEyXkFqcGc@._V1_.jpg",
    },
    {
      id: "30",
      title: "The Last Of Us: Part 1",
      img: "https://m.media-amazon.com/images/I/91hu7emut-L._AC_UF894,1000_QL80_.jpg",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, cartRes] = await Promise.all([
          axios.get("https://nexus-server-0fku.onrender.com/allgames"),
          axios.get("https://nexus-server-0fku.onrender.com/cart"),
        ]);
        setAllGames(gamesRes.data);
        const ids = cartRes.data.map((item) => String(item.gameId));
        setCartIds(ids);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const results = allGames.filter(
      (game) =>
        game.title.toLowerCase().includes(value.toLowerCase()) &&
        !cartIds.includes(String(game.id)),
    );
    setSearchResults(results.slice(0, 6));
    setShowDropdown(true);
  };

  const handleSelectGame = (id) => {
    setSearch("");
    setShowDropdown(false);
    navigate(`/game/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length === 0) return;
    const exact = searchResults.find(
      (g) => g.title.toLowerCase() === search.toLowerCase(),
    );
    handleSelectGame(exact ? exact.id : searchResults[0].id);
  };

  // Filter out featured games already in cart
  const visibleFeaturedGames = featuredGames.filter(
    (game) => !cartIds.includes(String(game.id)),
  );

  return (
    <div>
      <Aurora
        colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
        blend={0.7}
        amplitude={1.0}
        speed={1}
      />

      <div className="top-search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search games..."
            className="top-search-bar"
            value={search}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => search && setShowDropdown(true)}
          />

          {showDropdown && searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((game) => (
                <li
                  key={game.id}
                  className="search-dropdown-item"
                  onMouseDown={() => handleSelectGame(game.id)}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="search-dropdown-img"
                  />
                  <div className="search-dropdown-info">
                    <span className="search-dropdown-title">{game.title}</span>
                    <span className="search-dropdown-price">${game.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && search && searchResults.length === 0 && (
            <ul className="search-dropdown">
              <li className="search-dropdown-empty">No games found 😢</li>
            </ul>
          )}
        </form>
      </div>

      <div id="home" className="hero-section">
        <h1 className="nexus-title">NEXUS</h1>
        <p className="nexus-subtitle">Built for Gamers</p>
        <a href="#expgames" className="nexus-btn">
          Explore Games 🎮
        </a>
      </div>

      <section id="expgames" className="games-section">
        <h2 className="games-heading">Featured Games</h2>
        <div className="games-grid">
          {visibleFeaturedGames.length > 0 ? (
            visibleFeaturedGames.map((game) => (
              <div
                className="nexus-card"
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={game.img} alt={game.title} className="game-img" />
                <p className="game-title">{game.title}</p>
              </div>
            ))
          ) : (
            <p className="no-results">All featured games are in your cart 🛒</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
