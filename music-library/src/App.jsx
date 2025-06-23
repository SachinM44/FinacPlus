import React, { useRef } from "react";
import MusicLibrary from "./components/MusicLibrary";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App({ userRole, authToken, onLikedChange }) {
  const musicLibraryRef = useRef();
  const [liked, setLiked] = React.useState([]);

  const handleAllAlbums = () => musicLibraryRef.current?.showAllAlbums();
  const handleAllArtists = () => musicLibraryRef.current?.showAllArtists();
  const handleSort = () => musicLibraryRef.current?.sortSongs();
  const handleAddSong = () => musicLibraryRef.current?.addSong();

  // Receive liked updates from MusicLibrary
  const handleLikedChange = (likedList) => {
    setLiked(likedList);
    if (onLikedChange) onLikedChange(likedList);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <main className="flex-1 flex min-h-0 overflow-hidden">
        <section className="flex-1 flex flex-col min-h-0 max-h-full">
          <MusicLibrary
            ref={musicLibraryRef}
            userRole={userRole}
            authToken={authToken}
            onLikedChange={handleLikedChange}
          />
        </section>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
