import React, { useRef, useState } from "react";
import ModalComponent from "./ModalComponent";
import { useHistory } from "react-router-dom";

const MyPokemon = () => {
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState();
  const history = useHistory();

  function goBack(){
    history.push('/')
  }

  if (
    !localStorage.getItem("my-pokemon") ||
    localStorage.getItem("my-pokemon") === "[]"
  )
    return (
      <div>
           <div className="nes-container is-rounded bg-white">
        <p>You haven't catch any pokemon yet :(</p>
      </div>
      <div className="text-center mt-3">
      <button type="button" className="nes-btn is-error" onClick={()=> {goBack()}}> &lt; Go back</button>
      </div>
       
      </div>
 
      
    );

  const data = JSON.parse(localStorage.getItem("my-pokemon"));

  function show(name) {
    setSelected(name);
    if (showModal) {
      setShowModal(false);
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    } else {
      setShowModal(true);
    }
  }

  function releasePokemon() {
    setShowModal(false);
    let temp = JSON.parse(localStorage.getItem("my-pokemon"));
    console.log("before removed,", temp);
    temp = temp.filter((el) => el.name !== selected);
    console.log("temp removed", temp);
    console.log("saving -->", temp);
    localStorage.setItem("my-pokemon", JSON.stringify(temp));
  }

  const displayList = () => {
    return data.map((data, index) => (
      <div className="card mb-2 mx-2" key={index}>
        <div className="card-header">
          <div className="inside-border">
            <h3>{data.name}</h3>
          </div>
        </div>
        <div className="cardContent">
          <img className="card-image" src={data.image} alt="" />

          <i
            className="nes-icon close delete-icon nes-pointer"
            onClick={() => show(data.name)}
          ></i>
        </div>
      </div>
    ));
  };

  return (
    <>
    <div className="col-12 text-center">
    <button type="button" className="nes-btn is-error mb-3" onClick={()=> goBack()}>&lt;Go Back</button>
    </div>
    
      {displayList()}
      <ModalComponent
        title="Release Pokemon?"
        message="Do you want to release your pokemon?"
        show={showModal}
        click={(btn) => {
          if (btn === "cancel") setShowModal(false);
          if (btn === "save") releasePokemon();
        }}
      ></ModalComponent>
    </>
  );
};

export default MyPokemon;
