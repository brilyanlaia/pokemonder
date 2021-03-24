import React, {createRef, useState} from "react";

const ModalComponent = ({ title, show, message, click, alert, input }) => {

  const inputNick = createRef()

  if (input)
    return (
      <dialog className="nes-dialog" id="dialog-default" open={show}>
        <form method="dialog">
          <p className="title">{title}</p>
          <p>{message}</p>
          <div className="nes-field">
            <label htmlFor="name_field">Nickname</label>
            <input type="text" id="name_field" className="nes-input" ref={inputNick}></input>
          </div>
          <menu className="dialog-menu">
            <button className="nes-btn" onClick={() => click(inputNick.current.value)}>
              Ok
            </button>
          </menu>
        </form>
      </dialog>
    );

  if (alert)
    return (
      <dialog className="nes-dialog" id="dialog-default" open={show}>
        <form method="dialog">
          <p className="title">{title}</p>
          <p>{message}</p>
          <menu className="dialog-menu text-center">
            <button className="nes-btn" onClick={() => click("cancel")}>
              Ok
            </button>
          </menu>
        </form>
      </dialog>
    );

  return (
    <dialog className="nes-dialog" id="dialog-default" open={show}>
      <form method="dialog">
        <p className="title">{title}</p>
        <p>{message}</p>
        <menu className="dialog-menu">
          <button className="nes-btn" onClick={() => click("cancel")}>
            Cancel
          </button>
          <button className="nes-btn is-primary" onClick={() => click("save")}>
            Confirm
          </button>
        </menu>
      </form>
    </dialog>
  );
};

export default ModalComponent;
