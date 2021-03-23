import React from "react";

const ModalComponent = ({ title, show, message, click}) => {



  return (
    <dialog className="nes-dialog" id="dialog-default" open={show}>
    <form method="dialog">
      <p className="title">{title}</p>
      <p>{message}</p>
      <menu className="dialog-menu">
        <button className="nes-btn" onClick={()=> click('cancel')}>Cancel</button>
        <button className="nes-btn is-primary" onClick={()=> click('save')}>Confirm</button>
      </menu>
    </form>
  </dialog>
  );
};

export default ModalComponent;
