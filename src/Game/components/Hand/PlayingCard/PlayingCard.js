import React from 'react';
import './PlayingCard.scss';
import {cardDetailModal} from "../../../Board/Modals/modals";


export default ({ card, isSelected, selectCallback = () => {} }) => {
    return (
        <div className='card-container'>
            <img alt={ card.name }
                 className={'playing-card' + (isSelected ? ' selected' : '')}
                 src={card.imageURL}
                 onClick={() => selectCallback(card)}
            />
            <a className={'card-info' + (isSelected ? ' hidden' : '')}
               onClick={() => cardDetailModal({card: card})}>&#9432;</a>
        </div>
    );
}
