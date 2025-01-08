import { Home } from "./components/home/Home";
import { Navigation } from "./components/navbar/navbar";
import {Route, Routes } from "react-router-dom";
import { News } from "./components/news/News";
import { Details } from "./components/detailsNews/DetailsNews";
function App() {
  return (
    <>

      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<Details />} />
      </Routes>
    </>
  );
}

export default App;
