import { useState, useEffect, useCallback } from "react";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Archive from "./pages/Archive.jsx";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import About from "./pages/About.jsx";
import ProducerMap from "./pages/ProducerMap.jsx";
import Collection from "./pages/Collection.jsx";

function parseHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  if (h.startsWith("album/")) return { page: "album", id: h.slice(6) };
  return { page: h || "", id: null };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path ? `/${path}` : "/";
  }, []);

  const { page, id } = route;

  let content;
  if (page === "") content = <Home navigate={navigate} />;
  else if (page === "archive") content = <Archive navigate={navigate} />;
  else if (page === "album") content = <AlbumDetail id={id} navigate={navigate} />;
  else if (page === "producers") content = <ProducerMap navigate={navigate} />;
  else if (page === "collection") content = <Collection navigate={navigate} />;
  else if (page === "about") content = <About navigate={navigate} />;
  else content = <Home navigate={navigate} />;

  return (
    <>
      <Cursor />
      <Nav page={page} navigate={navigate} />
      {content}
      <Footer navigate={navigate} />
    </>
  );
}
