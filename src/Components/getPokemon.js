import React, {useEffect, useState} from "react";
import {useQuery, gql} from '@apollo/client';
import {GET_POKEMONS} from '../GraphQL/Queries'
const gqlVariables = {
    limit: 10,
    offset: 1,
};
function GetPokemon(){
    const { loading, error, data } = useQuery(GET_POKEMONS, {
        variables: gqlVariables,
    });
    const [pokemons, setPokemons] = useState([])
    useEffect(()=>{
        if(data){

            console.log(data.pokemons)
            setPokemons(data.pokemons.results);
        }
    }, [data])

    return (
        <>
            {" "}
            {pokemons.map((res)=>{
                return (
                    <div>
                        <img src={res.image} alt=""/>
                        <p>{res.name}</p>
                    </div>
                )
            })}
        </>
    )
}

export default GetPokemon;
