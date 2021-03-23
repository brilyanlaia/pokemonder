import React, {useMemo, useState, useEffect} from 'react';
import {useQuery, gql} from '@apollo/client';
import TinderCard from 'react-tinder-card';
import DetailLogo from '../detail-icon.png';
import RefreshIcon from '../refresh-icon.png';
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

function getRandom(){
    return Math.floor(Math.random() * 1000) + 1;
}






const PokemonList = () => {
    const history = useHistory();
    function goToDetail(name, image){
      // refetchData();
       // swipe('right')
        let abc = clicked;
        console.log('clicked->',abc)
        abc = !abc;
        console.log('abc ->',abc)
        setClicked(abc)
        
        setTimeout(() => {
            history.push({
                pathname: `/pokemon/${name}`,
                state: {detail: image},
    
            });
        }, 500);
           
        
 
    }

    function myPokemon(){
        history.push('/my-pokemon')
    }

    // const rand = Math.floor(Math.random() * 1000) + 1;
    //const rand = getRandom();
    const { loading, error, data, refetch } = useQuery(GET_POKEMONS, {
        variables: gqlVariables,
        options: {
            awaitRefetchQueries: true
        }
    }, );
   //
    let resData = data?.pokemons?.results
    let charactersState = resData
    const childRefs = useMemo(() => Array(gqlVariables.limit).fill(0).map(i => React.createRef()), [])
    const [clicked, setClicked] = useState(false)
    const [characters, setCharacters] = useState(resData)
    const [initState, setInitState] = useState(data)
    const [lastDirection, setLastDirection] = useState()

    useEffect(()=>{
        if(localStorage.getItem('encounter-poke')){
            const prevEncounter = JSON.parse(localStorage.getItem('encounter-poke'))
            setCharacters(prevEncounter)
            console.log('getitem?',prevEncounter)
        }
        if(data){
            if(JSON.stringify(data) === JSON.stringify(initState)){
                console.log('same')
                refetchData()
            }else{
                localStorage.setItem('encounter-poke', JSON.stringify(data.pokemons.results))
                console.log('save data', data.pokemons.results)
                setCharacters(data.pokemons.results)
            }

           
        }
       
    },[clicked])

/* 
    useEffect(()=>{
        if(data && !localStorage.getItem('encounter-poke')){
            localStorage.setItem('encounter-poke', JSON.stringify(data.pokemons.results))
            console.log('save data', data.pokemons.results)
            setCharacters(data.pokemons.results)
        }
       
    },[clicked]); */

    
    if (loading) return (<div className="nes-container is-rounded bg-white">
    <p>Keep walking, you will encounter some pokemon ...</p>
  </div>)
    if (error) console.log('err', error)


    function refetchData(){
        
        let a = Math.floor(Math.random() * 1000) + 1;
        let newVar = {
            limit: 10,
            offset: a,
        };
        console.log("random val", newVar)
        refetch(newVar)

        let abc = clicked;
        console.log('clickedrefetch->',abc)
        abc = !abc;
        console.log('abcrefetch ->',abc)
     //    setClicked(abc)
        console.log('refetch',data)
      //  setCharacters(data.pokemons.results);
    }

    function getNew(){
        let a = Math.floor(Math.random() * 1000) + 1;
        let newVar = {
            limit: 10,
            offset: a,
        };
        console.log("random val", newVar)
        refetch(newVar)

        let abc = clicked;
        console.log('clickedrefetch->',abc)
        abc = !abc;
        console.log('abcrefetch ->',abc)
        setClicked(abc)
        console.log('refetch',data)
      //  setCharacters(data.pokemons.results);
    }

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

    const displayToolbar = () => {
        return (
            <div>

            <button type="button" onClick={()=> getNew()} className=" nes-pointer nes-btn is-warning mt-3">Refresh</button>
            <button type="button" onClick={()=> myPokemon()} className="nes-pointer nes-btn is-error mt-3 ">My Bag</button>
            <p className="nes-balloon from-right nes-pointer">
                Swipe card to see more monster.
            </p>
            </div>
        )
    }


    const displayPokemon = () => {
        return(

                <div className="cardContainer">
                    {characters?.map((res, index) =>
                                <TinderCard ref={childRefs[index]}  className='swipe' key={res.name} preventSwipe={['down']} onSwipe={(dir) => swiped(dir, res.name)} onCardLeftScreen={() => outOfFrame(res.name)}>
                                    <div className='card'>
                                        <div className="card-header">

                                            <div className="inside-border">

                                                <h3>{capitalizeFirstLetter(res.name)}</h3>
                                            </div>
                                        </div>
                                        <div className="cardContent">


                                            <img className="card-image" src={res.image} alt=""/>

                                            <img src={DetailLogo} className="detail-icon nes-pointer" alt=""  onTouchStart={(e)=> {e.stopPropagation();goToDetail(res.name, res.image)}} onClick={(e)=> {e.preventDefault();goToDetail(res.name, res.image)}} />
                                            
                                           

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
           <div className="col-10 text-center">

           {displayToolbar()}
           </div>

        </React.Fragment>
    );
};

export default PokemonList;
export {
    capitalizeFirstLetter,


};
