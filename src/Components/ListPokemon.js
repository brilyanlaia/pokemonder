import React, {useMemo, useState, useEffect} from 'react';
import {useQuery, gql} from '@apollo/client';
import TinderCard from 'react-tinder-card';
import DetailLogo from '../detail-icon.png'
import {Link, useHistory} from "react-router-dom";

export const GET_POKEMONS = gql`
   query pokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      count
      next
      previous
      status
      message
      results {
        id
        url
        name
        image
      }
    }
  }
`

const a = Math.floor(Math.random() * 1000) + 1;

const gqlVariables = {
    limit: 10,
    offset: a,
};

console.log('random initial var', gqlVariables)
const alreadyRemoved = []

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}






const PokemonList = () => {
    const history = useHistory();
    function goToDetail(name, image){

        history.push({
            pathname: `/pokemon/${name}`,
            state: {detail: image}
        });
    }
    const { loading, error, data, refetch } = useQuery(GET_POKEMONS, {
        variables: gqlVariables,
    });
   //
    const resData = data?.pokemons?.results
    let charactersState = resData
    const childRefs = useMemo(() => Array(gqlVariables.limit).fill(0).map(i => React.createRef()), [])
    const [characters, setCharacters] = useState(resData)
    const [lastDirection, setLastDirection] = useState()

    useEffect(()=>{
        if(data){
            let a = Math.floor(Math.random() * 1000) + 1;
            let newVar = {
                limit: 10,
                offset: a,
            };
            console.log("random val", newVar)
            refetch([newVar])
            console.log('refetch',data.pokemons.results)
            setCharacters(data.pokemons.results);
        }
    },[data])

    if (loading) return <h3>Waiting for pokemon to arrive.</h3>
    if (error) console.log('err', error)

    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
        if (direction === 'right') console.log('swiped right')
        alreadyRemoved.push(nameToDelete)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
        charactersState = charactersState.filter(character => character.name !== name)
        setCharacters(charactersState)
    }

    const swipe = (dir) => {
        const cardsLeft = resData?.filter(person => !alreadyRemoved.includes(person.name))
        console.log('cardsleft', cardsLeft)
        if (cardsLeft.length) {
            const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
          //  let reverse = [...resData]
            // reverse.reverse()
            const index = resData.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
            alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
            console.log('index', index)
            console.log('refs', childRefs)
             childRefs[index].current.swipe(dir) // Swipe the card!
        }
    }






    console.log("asd", resData)
    /*setCharacters(resData[0].name)*/

    const displayPokemon = () => {
        return(

                <div className="cardContainer">
                    {data?.pokemons?.results.map((res, index) =>
                                <TinderCard ref={childRefs[index]}  className='swipe' key={res.name} preventSwipe={['down']} onSwipe={(dir) => swiped(dir, res.name)} onCardLeftScreen={() => outOfFrame(res.name)}>
                                    <div className='card'>
                                        <div className="card-header">

                                            <div className="inside-border">

                                                <h3>{capitalizeFirstLetter(res.name)}</h3>
                                            </div>
                                        </div>
                                        <div className="cardContent">


                                            <img className="card-image" src={res.image} alt=""/>

                                            <img src={DetailLogo} className="detail-icon" alt=""  onTouchStart={(e)=> {e.stopPropagation();goToDetail(res.name, res.image)}} onClick={(e)=> {e.preventDefault();goToDetail(res.name, res.image)}} />


                                        </div>

                                    </div>

                                </TinderCard>

                     )};
                    </div>


    )
    };



    return (
        <React.Fragment>
            {displayPokemon()}

        </React.Fragment>
    );
};

export default PokemonList;
export {
    capitalizeFirstLetter,
    PokemonList

};
