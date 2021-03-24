import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import pokeball from "../pokeball.png";
import { useHistory } from "react-router-dom";
import backButton from "../back.png";
import { capitalizeFirstLetter, } from "./ListPokemon";
import ModalComponent from "./ModalComponent";

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
`;

// let refetch = window.doRefetch();

const Detail = (props) => {
  const history = useHistory();
  console.log("detail", props);

  function goBack() {
    // refetch()
    
    history.push('/')
  }

  const [animation, setAnimation] = useState();
  const [showModal, setShowModal] = useState(false);
  const [titleMsg, setTitle] = useState();
  const [contentMsg, setContentMsg] = useState();
  const [alertType, setAlertType] = useState();
  const [inputModal, setInputModal] = useState();


  const name = props.match.params.name;
  const image = props.location.state.detail;
  const gqlVar = {
    name,
  };

  const { loading, error, data } = useQuery(POKEMON_DETAIL, {
    variables: gqlVar,
  });

  

  function catchPokemon() {
    let gacha = Math.random();
    console.log("animation end");
   // setModal(false)
    setAnimation(false);
    if (gacha <= 0.1) {
      // alert("You failed to catch the pokemon!");
      setAlertType(true)
      setTitle("Failed");
      setContentMsg("You failed to catch the pokemon!")
      setShowModal(true)
      console.log("failed")
    } else {
      console.log('success')
      setShowModal(false)
        savePokemon();
    }
  }

  function savePokemon(){
   // alert("Success catching the pokemon!");
   console.log('show modal save?', showModal);
    setInputModal(true)
    setTitle("Success");
    setContentMsg("Success catching the pokemon!, give nickname to your new pokemon")
    setShowModal(true)
   
  //  let nick = prompt("Enter nickname for your pokemon:", data.pokemon.name)
   // console.log("nickname", nick)
    // console.log("set item", data?.pokemon);

  }

  function isExisted(){
    setShowModal(false)
    setInputModal(false)
    savePokemon();
  
  }

  function continueSave(valueStr){
    setShowModal(false, ()=>{
      console.log('show modal?', showModal);
    })

    let body = JSON.parse(JSON.stringify(data.pokemon))
    body.name = valueStr ? valueStr : body.name
    if (localStorage.getItem("my-pokemon")) {
      let a = localStorage.getItem("my-pokemon");
      let b = JSON.parse(a);
      if(a.includes(body.name)) {
          console.log('already exist')
          setShowModal(false);
          alert("name already exist, please give nickname!")
          isExisted();
      
      }else{
        Object.assign(body, {image})
        b.push(body);
        console.log("current arr", b);
        localStorage.setItem("my-pokemon", JSON.stringify(b));
        myPokemon();
      }
    
    } else {
      let arr = [];
      Object.assign(body, {image})
      arr.push(body);
      localStorage.setItem("my-pokemon", JSON.stringify(arr));
      myPokemon();
      
    }
  }

  function myPokemon(){
    history.push('/my-pokemon')
}

  function startCatching() {
    setAnimation(true);
    console.log("asd");
  }

  const displayDetail = () => {
    if (loading) return  (<div className="nes-container is-rounded bg-white">
    <p>Loading data from pokedex</p>
  </div>
  )
    if (error) console.log("error", error);

    const { name, moves, types } = data?.pokemon;

    console.log("data", data.pokemon);

    return (
      <div className="card">
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
                {types.map((res, index) => (
                  <li key={index}>{res.type.name}</li>
                ))}
              </ul>
            </div>
            <div className="col-6">
              <img src={image} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <h3>Moves List: </h3>
            </div>
            <div className="col-8">
              <ul>
                {moves.slice(0, 4).map((res, index) => (
                  <li key={index}>{res.move.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <img
            src={backButton}
            className="back-button"
            onClick={() => goBack()}
            alt=""
          />
          <img
            src={pokeball}
            className={animation ? "detail-icon catch" : "detail-icon"}
            onClick={() => startCatching()}
            onAnimationEnd={() => catchPokemon()}
            alt=""
          />
        </div>
      </div>
    );
  };

  return <>
  {displayDetail()}
  <ModalComponent
        title={titleMsg}
        message={contentMsg}
        show={showModal}
        alert={alertType}
        input={inputModal}
        click={(btn) => {
          if (btn === "cancel") setShowModal(false);
          else setShowModal(false);continueSave(btn);
        }}
      ></ModalComponent>
  </>;
};

export default Detail;
