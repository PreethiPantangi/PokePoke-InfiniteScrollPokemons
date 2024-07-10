import React from 'react'

const Card = ({ pokemons }) => {
  return (
    <div className='flex flex-wrap'>
        {
            pokemons.map(pokemon => (
            <div className='border border-black cursor-pointer hover:shadow-md m-2 p-2 w-52 flex justify-center' key={pokemon.id}>
                <div>
                <img alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}/>
                <div className='pokemon-name font-bold'>{pokemon.name}</div>
                </div>
            </div>
            ))
        }
    </div>
  )
}

export default Card