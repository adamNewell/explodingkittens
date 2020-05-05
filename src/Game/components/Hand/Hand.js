import React from 'react';
import './Hand.scss';
import PlayingCard from './PlayingCard/PlayingCard';

const Hand = (props) => {
    const {
        cards,
        selectedCards,
        onSelect,
    } = props;
    return (
        <div className='hand'> {
            cards.map(card => {
                const isSelected = selectedCards && selectedCards.some(c => c.id === card.id);
                return (
                    <PlayingCard
                        card={card}
                        selectCallback={onSelect}
                        isSelected={isSelected}
                        key={card.id}
                    />
                )
            })
        }</div>
    );
}

export default Hand;