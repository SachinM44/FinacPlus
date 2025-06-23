import React, { 
  useState, 
  useEffect, 
  forwardRef, 
  useImperativeHandle 
} from "react";
import { 
  Music, 
  User, 
  Disc, 
  Heart, 
  Play, 
  Plus, 
  ArrowDownAZ,
  Clock,
  Calendar,
  Filter
} from "lucide-react";
import { initialSongs } from "./MockData";
import toast from "react-hot-toast";

const groupOptions = [
  { 
    label: "None", 
    value: "none", 
    icon: <Music size={16} /> 
  },
  { 
    label: "Album", 
    value: "album", 
    icon: <Disc size={16} /> 
  },
  { 
    label: "Artist", 
    value: "artist", 
    icon: <User size={16} /> 
  },
];

function SongCard({ 
  song, 
  liked = false, 
  onLike, 
  onDelete, 
  userRole = 'user' 
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-white rounded-xl shadow mb-4 hover:bg-green-50 transition-all group border border-green-100">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition">
          <Play size={16} />
        </button>
        
        <div>
          <div className="font-semibold text-green-900 text-lg">
            {song.title}
          </div>
          <div className="text-xs text-green-500">
            {song.artist}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm text-green-500 font-medium">
          {song.album}
        </div>
        
        <div className="text-sm text-green-700 font-semibold tabular-nums">
          {song.duration}
        </div>
        
        <button 
          className={`hover:text-green-600 ml-2 transition-colors ${
            liked ? 'text-red-500' : 'text-green-400'
          }`}
          onClick={onLike}
        >
          <Heart 
            size={16} 
            fill={liked ? 'currentColor' : 'none'} 
          />
        </button>
        
        {userRole === 'admin' && (
          <button
            className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold transition-colors"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const MusicLibrary = forwardRef(function MusicLibrary({
  userRole = 'user',
  onLikedChange,
  authToken,
}, ref) {
  
  const getSavedSongs = () => {
    try {
      const savedSongs = localStorage.getItem('yapple_songs');
      return savedSongs ? JSON.parse(savedSongs) : initialSongs;
    } catch (error) {
      console.error('Error loading songs from localStorage:', error);
      return initialSongs;
    }
  };

  const [songs, setSongs] = useState(getSavedSongs());
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [liked, setLiked] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ 
    title: '', 
    artist: '', 
    album: '', 
    duration: '' 
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  
  useEffect(() => {
    try {
      localStorage.setItem('yapple_songs', JSON.stringify(songs));
    } catch (error) {
      console.error('Error saving songs to localStorage:', error);
    }
  }, [songs]);

  const showAllAlbums = () => {
    setGroupBy("album");
  };
  
  const showAllArtists = () => {
    setGroupBy("artist");
  };
  
  const sortSongs = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    setSongs([...songs].sort((a, b) => {
      if (sortBy === "title") {
        return newOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === "artist") {
        return newOrder === "asc" 
          ? a.artist.localeCompare(b.artist)
          : b.artist.localeCompare(a.artist);
      } else if (sortBy === "album") {
        return newOrder === "asc" 
          ? a.album.localeCompare(b.album)
          : b.album.localeCompare(a.album);
      } else if (sortBy === "duration") {
        const getDurationInSeconds = (duration) => {
          const [minutes, seconds] = duration.split(":").map(Number);
          return minutes * 60 + seconds;
        };
        
        const aDuration = getDurationInSeconds(a.duration);
        const bDuration = getDurationInSeconds(b.duration);
        
        return newOrder === "asc" 
          ? aDuration - bDuration
          : bDuration - aDuration;
      }
      return 0;
    }));
  };
  
  const addSong = () => {
    setShowAddModal(true);
  };


  const handleAddFormChange = (event) => {
    const { name, value } = event.target;
    setAddForm(prevForm => ({ 
      ...prevForm, 
      [name]: value 
    }));
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    
    const { title, artist, album, duration } = addForm;
    
    if (title && artist && album && duration) {
      const newSong = {
        id: Date.now(),
        title,
        artist,
        album,
        duration,
      };
      
      setSongs(prevSongs => [...prevSongs, newSong]);
      setAddForm({ 
        title: '', 
        artist: '', 
        album: '', 
        duration: '' 
      });
      setShowAddModal(false);
      
      toast.success(
        `"${title}" has been added to your library!`,
        {
          className: 'bg-green-50 text-green-800 border border-green-500',
          duration: 3000,
        }
      );
    }
  };

  const handleDeleteSong = (id) => {
    const songToDelete = songs.find(song => song.id === id);
    setSongs(songs.filter(song => song.id !== id));
    
    if (liked.includes(id)) {
      toggleLike(id);
    }
    
    if (songToDelete) {
      toast.success(
        `"${songToDelete.title}" has been deleted`,
        {
          className: 'bg-red-50 text-red-800 border border-red-500',
          duration: 3000,
        }
      );
    }
  };

  const toggleLike = (id) => {
    setLiked(prevLiked => {
      const updated = prevLiked.includes(id) 
        ? prevLiked.filter(likedId => likedId !== id) 
        : [...prevLiked, id];
      
      if (onLikedChange) {
        const likedSongs = songs
          .filter(song => updated.includes(song.id))
          .map(song => song.title);
        onLikedChange(likedSongs);
      }
      
      return updated;
    });
  };

  useImperativeHandle(ref, () => ({
    showAllAlbums,
    showAllArtists,
    sortSongs,
    addSong,
    albums: songs.reduce((acc, song) => {
      if (!acc.includes(song.album)) {
        acc.push(song.album);
      }
      return acc;
    }, []),
  }));

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase()) ||
      song.album.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterBy === "all") return true;
    
    if (filterBy === "liked") {
      return liked.includes(song.id);
    }
    
    if (filterBy === "recent") {
      const recentThreshold = songs.length > 10 ? songs.length - 10 : 0;
      return song.id > recentThreshold;
    }
    
    if (filterBy === "longest" || filterBy === "shortest") {
      const getDurationInSeconds = (duration) => {
        const [minutes, seconds] = duration.split(":").map(Number);
        return minutes * 60 + seconds;
      };
      
      const songDuration = getDurationInSeconds(song.duration);
      
      const allDurations = songs.map(s => getDurationInSeconds(s.duration)).sort((a, b) => a - b);
      
      const shortThreshold = allDurations[Math.floor(allDurations.length * 0.25)];
      const longThreshold = allDurations[Math.floor(allDurations.length * 0.75)];
      
      if (filterBy === "longest") {
        return songDuration >= longThreshold;
      } else { 
        return songDuration <= shortThreshold;
      }
    }
    
    return true;
  });

  let grouped = {};
  if (groupBy === "album") {
    filteredSongs.forEach(song => {
      if (!grouped[song.album]) {
        grouped[song.album] = [];
      }
      grouped[song.album].push(song);
    });
  } else if (groupBy === "artist") {
    filteredSongs.forEach(song => {
      if (!grouped[song.artist]) {
        grouped[song.artist] = [];
      }
      grouped[song.artist].push(song);
    });
  }

  const renderSongs = (songsToRender) => (
    <div>
      {songsToRender.map(song => (
        <SongCard
          key={song.id}
          song={song}
          liked={liked.includes(song.id)}
          onLike={() => toggleLike(song.id)}
          onDelete={() => handleDeleteSong(song.id)}
          userRole={userRole}
        />
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-stretch w-full h-full flex-1 min-h-0 max-h-full overflow-hidden">
      <div className="flex-1 h-full rounded-r-3xl bg-white border border-green-200 shadow-xl p-10 flex flex-col justify-start min-h-0 max-h-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="flex items-center text-1xl font-extrabold tracking-tight text-green-700 gap-2">
            <Music className="text-green-500" size={36} /> 
            <h1 className="text-2xl font-bold text-green-700">Music Library</h1>
          </h1>
          
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-green-200 bg-green-50 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 shadow-sm w-full sm:w-72 transition"
          />
        </div>

        <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 mb-6 border border-green-100 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition border border-green-200 text-green-700 hover:bg-green-100 ${
                  groupBy !== "none" 
                    ? "bg-green-200 border-green-400 font-bold" 
                    : ""
                }`}
                onClick={() => setShowGroupDropdown(!showGroupDropdown)}
              >
                <Disc size={16} /> 
                Group By: {groupOptions.find(opt => opt.value === groupBy)?.label}
              </button>
              
              {showGroupDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-green-100 z-10 w-48">
                  {groupOptions.map(option => (
                    <button
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 ${
                        groupBy === option.value 
                          ? "bg-green-100 font-semibold" 
                          : ""
                      }`}
                      onClick={() => {
                        setGroupBy(option.value);
                        setShowGroupDropdown(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition border border-green-200 text-green-700 hover:bg-green-100 ${
                  filterBy !== "all" 
                    ? "bg-green-200 border-green-400 font-bold" 
                    : ""
                }`}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter size={16} /> 
                Filter: {filterOptions.find(opt => opt.value === filterBy)?.label}
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-green-100 z-10 w-48">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 ${
                        filterBy === option.value 
                          ? "bg-green-100 font-semibold" 
                          : ""
                      }`}
                      onClick={() => {
                        setFilterBy(option.value);
                        setShowFilterDropdown(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition border border-green-200 text-green-700 hover:bg-green-100`}
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <ArrowDownAZ size={16} /> 
                Sort By: {sortOptions.find(opt => opt.value === sortBy)?.label} ({sortOrder === "asc" ? "A-Z" : "Z-A"})
              </button>
              
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-green-100 z-10 w-48">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-green-50 ${
                        sortBy === option.value 
                          ? "bg-green-100 font-semibold" 
                          : ""
                      }`}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOrder("asc"); 
                        setShowSortDropdown(false);
                        setSongs([...songs].sort((a, b) => {
                          if (option.value === "title") {
                            return a.title.localeCompare(b.title);
                          } else if (option.value === "artist") {
                            return a.artist.localeCompare(b.artist);
                          } else if (option.value === "album") {
                            return a.album.localeCompare(b.album);
                          } else if (option.value === "duration") {
                            const getDurationInSeconds = (duration) => {
                              const [minutes, seconds] = duration.split(":").map(Number);
                              return minutes * 60 + seconds;
                            };
                            
                            const aDuration = getDurationInSeconds(a.duration);
                            const bDuration = getDurationInSeconds(b.duration);
                            
                            return aDuration - bDuration;
                          }
                          return 0;
                        }));
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'admin' && (
              <button 
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition border border-green-500 bg-green-500 text-white hover:bg-green-600"
                onClick={addSong}
              >
                <Plus size={16} /> 
                Add Song
              </button>
            )}
          </div>
        </div>

        <div 
          className="flex-1 min-h-0 max-h-full overflow-y-auto pr-2" 
          tabIndex={0} 
          aria-label="Song list"
        >
          {filteredSongs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No songs found.
            </div>
          ) : groupBy === "none" ? (
            renderSongs(filteredSongs)
          ) : (
            Object.entries(grouped).map(([group, groupSongs]) => (
              <div key={group} className="mb-8">
                <div className="mb-2 text-green-700 font-bold text-lg pl-1">
                  {group}
                </div>
                {renderSongs(groupSongs)}
              </div>
            ))
          )}
        </div>
      </div>

        {userRole === 'admin' && showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border-2 border-green-200"
            onSubmit={handleAddFormSubmit}
            style={{ zIndex: 100 }}
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Add New Song
            </h3>
            
            <input
              type="text"
              name="title"
              value={addForm.title}
              onChange={handleAddFormChange}
              placeholder="Song Title"
              required
              className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            
            <input
              type="text"
              name="artist"
              value={addForm.artist}
              onChange={handleAddFormChange}
              placeholder="Artist"
              required
              className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            
            <input
              type="text"
              name="album"
              value={addForm.album}
              onChange={handleAddFormChange}
              placeholder="Album"
              required
              className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            
            <input
              type="text"
              name="duration"
              value={addForm.duration}
              onChange={handleAddFormChange}
              placeholder="Duration (e.g. 3:45)"
              required
              className="border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-lg border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 font-semibold transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold shadow transition-colors"
              >
                Add Song
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
});

export default MusicLibrary;

const filterOptions = [
  { 
    label: "All", 
    value: "all", 
    icon: <Music size={16} /> 
  },
  { 
    label: "Liked Songs", 
    value: "liked", 
    icon: <Heart size={16} /> 
  },
  { 
    label: "Recently Added", 
    value: "recent", 
    icon: <Calendar size={16} /> 
  },
  { 
    label: "Longest", 
    value: "longest", 
    icon: <Clock size={16} /> 
  },
  { 
    label: "Shortest", 
    value: "shortest", 
    icon: <Clock size={16} /> 
  },
];

const sortOptions = [
  { 
    label: "Title", 
    value: "title", 
    icon: <ArrowDownAZ size={16} /> 
  },
  { 
    label: "Artist", 
    value: "artist", 
    icon: <User size={16} /> 
  },
  { 
    label: "Album", 
    value: "album", 
    icon: <Disc size={16} /> 
  },
  { 
    label: "Duration", 
    value: "duration", 
    icon: <Clock size={16} /> 
  },
];