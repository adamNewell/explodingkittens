import React, {Component} from 'react';
import './Hand.scss';
import PlayingCard from './PlayingCard/PlayingCard';

class Hand extends Component {

    selectCard(key) {
        this.props.onSelect(key);
    }

    render() {
        let index = 0;

        return (
            <div className='hand'> {
                this.props.cards.map((card) => {
                    let isSelected = this.props.selectedCards && this.props.selectedCards.includes(card);

                    return (
                        <PlayingCard
                            card={ card }
                            selectCallback={ this.selectCard.bind(this) }
                            isSelected={ isSelected }
                            key={ index }
                            index={ index++ }
                        />
                    )
                })
            }</div>
        )
    }
}

export default Hand;