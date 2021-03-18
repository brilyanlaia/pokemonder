import React from 'react';

const PokeCard = ({res: {id, name, image}}) => {

    return (
        <div className="card card-body mb-3">
            <div className="row">
                <div className="col-12 text-center">
                    <img src={image} alt=""/>
                </div>
                <div className="col-12 text-center">
                   <h3 className="text-primary">{name.toUpperCase()}</h3>
                </div>
            </div>
        </div>
    );
};

export default PokeCard;
