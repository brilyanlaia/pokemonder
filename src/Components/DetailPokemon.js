import React, {useState} from 'react';
import {useQuery, gql} from '@apollo/client';
import pokeball from '../pokeball.png'
import {useHistory} from 'react-router-dom'
import backButton from '../back.png'
import PokemonList, {capitalizeFirstLetter} from './ListPokemon';

export const POKEMON_DETAIL = gql`
 query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    abilities {
      ability {
        name
      }
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        name
      }
    }
    message
    status
  }
}
`

// let refetch = window.doRefetch();

const Detail = (props) => {
    const history = useHistory()
    console.log("detail", props)

    function goBack(){
       // refetch()
        history.goBack()
    }

    const [animation, setAnimation] = useState()

    const  name  = props.match.params.name;
    const image = props.location.state.detail;
    const gqlVar = {
        name
    }

    const { loading, error, data } = useQuery(POKEMON_DETAIL, {
        variables: gqlVar,
    });


    function catchPokemon(){
        let gacha = Math.random()
        console.log('animation end')
        setAnimation(false)
        if (gacha <= 0.1) {
            alert('failed bro')
        }else{
            alert('success')
            console.log('set item',data?.pokemon)
            if(localStorage.getItem('my-pokemon')){
                let a = localStorage.getItem('my-pokemon')
                let b = JSON.parse(a)
                b.push(data.pokemon)
                console.log('current arr', b)
                localStorage.setItem('my-pokemon',JSON.stringify(b))
            }else{
                let arr = new Array()
                arr.push(data.pokemon)
                localStorage.setItem('my-pokemon',JSON.stringify(arr))
            }


        }

    }

    function getMine() {
        return  Promise.resolve().then(()=> {
          localStorage.getItem('my-pokemon')
        })
    }

    function startCatching(){
        setAnimation(true)
        console.log('asd')
    }

    const displayDetail = () => {
        if (loading) return <h3>Getting data from Pokedex ..</h3>;
        if (error) console.log("error", error);

        const { name, moves, types } = data?.pokemon;

        console.log('data', data.pokemon)

        return  (
            <div className='card'>
                <div className="card-header">

                    <div className="inside-border">

                        <h3>{capitalizeFirstLetter(name)}</h3>
                    </div>
                </div>
                <div className="cardContent">
                    <div className="row">
                        <div className="col-6 mt-3">
                            <h3>Type: </h3>
                            <ul>
                            {types.map((res,index) =>
                                <li key={index}>{res.type.name}</li>
                            )}
                            </ul>

                        </div>
                        <div className="col-6">
                            <img src={image} alt=""/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <h3>Moves List: </h3>
                        </div>
                        <div className="col-8">
                            <ul>


                        {moves.slice(0,4).map((res,index) =>

                                <li key={index}>{res.move.name}</li>

                        )}
                            </ul>
                        </div>
                    </div>
                    <img src={backButton} className="back-button" onClick={()=> goBack()} alt=""/>
                    <img src={pokeball} className={animation ? 'detail-icon catch' : 'detail-icon'} onClick={()=> startCatching()} onAnimationEnd={()=> catchPokemon()} alt=""/>
                </div>
            </div>
        )

    }



    return (
        <>
            {displayDetail()}

        </>
    );
};

export default Detail;
