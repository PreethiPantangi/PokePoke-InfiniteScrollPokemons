import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Card from './components/Card';

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const infiniteScrollRef = useRef(null);

  const filterPokemons = () => {
    if(search !== '') {
      setIsSearching(true);
      let filteredList = filteredPokemons.filter(pokemon => (pokemon.name).toLowerCase().includes(search.toLowerCase()));
      setFilteredPokemons(filteredList);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setFilteredPokemons(pokemons);
    setIsSearching(false);
  };

  const fetchPokemons = async (url) => {
    const fetchPokemonData = await fetch(url);
    const jsonPokemonData = await fetchPokemonData.json();
    let pokemonData = jsonPokemonData.results.map((pokemon) => {
      let splitData = pokemon.url.split("/");
      pokemon['id'] = splitData[splitData.length - 2];
      return pokemon;
    });
    setPokemons([...pokemons, ...pokemonData]);
    setFilteredPokemons([...pokemons, ...pokemonData]);
  };

  useEffect(() => {
    fetchPokemons("https://pokeapi.co/api/v2/pokemon?limit=21");
  }, []);

  useEffect(() => {
    let isFetchCalled = false;

    const handleScroll = () => {
      if (infiniteScrollRef.current && infiniteScrollRef.current.getBoundingClientRect().top - 30 <= window.innerHeight) {
        if (infiniteScrollRef.current) {
          const rect = infiniteScrollRef.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
  
          if (isVisible && !isFetchCalled) {
            console.log("nfinite scroll");
            fetchPokemons(`https://pokeapi.co/api/v2/pokemon?limit=21&offset=${filteredPokemons.length}`);
            isFetchCalled = true;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredPokemons, pokemons]); 

  return (
    <div>
      {/* bg-[#0f172a] */}
      <div className='p-4 shadow-lg sticky top-0 z-10 bg-[#244855] text-white flex justify-center font-bold'>Poke Poke</div>
      <div className='flex justify-center'>
        <div className='m-4 max-w-6xl w-full'>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className='border border-black p-3 w-4/5' 
              placeholder='Pikachu'
            />
            <button onClick={filterPokemons} className='p-3 bg-[#244855] font-bold text-white'>Search</button>
            <button onClick={clearSearch} className='p-3 border'>Clear</button>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='m-4 overflow-y-auto max-w-6xl' style={{height: 'calc(100vh - 40%)'}}>
          {filteredPokemons.length > 0 ? (
            <div>
              <Card pokemons={filteredPokemons} />
              {!isSearching && <div ref={infiniteScrollRef}>Loading...</div>}
            </div>
          ) : (
            <div>No pokemons found!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
