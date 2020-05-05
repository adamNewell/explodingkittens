import React from 'react';
import {duplicateCards, generateDeck} from "./deck";
import {Card, CardTypes} from "./cards";

test('checks that the base deck is generated correctly', () => {
    expect(JSON.stringify(generateDeck().baseDeck)).toBe("[{\"name\":\"Bearded Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-BeardCat.png\"},{\"name\":\"Bearded Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-BeardCat.png\"},{\"name\":\"Bearded Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-BeardCat.png\"},{\"name\":\"Bearded Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-BeardCat.png\"},{\"name\":\"Catermelon\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-Catermelon.png\"},{\"name\":\"Catermelon\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-Catermelon.png\"},{\"name\":\"Catermelon\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-Catermelon.png\"},{\"name\":\"Catermelon\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-Catermelon.png\"},{\"name\":\"Hairy Potato Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-HairyPotatoCat.png\"},{\"name\":\"Hairy Potato Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-HairyPotatoCat.png\"},{\"name\":\"Hairy Potato Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-HairyPotatoCat.png\"},{\"name\":\"Hairy Potato Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-HairyPotatoCat.png\"},{\"name\":\"Rainbow-Ralphing Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-RainbowRalphingCat.png\"},{\"name\":\"Rainbow-Ralphing Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-RainbowRalphingCat.png\"},{\"name\":\"Rainbow-Ralphing Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-RainbowRalphingCat.png\"},{\"name\":\"Rainbow-Ralphing Cat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-RainbowRalphingCat.png\"},{\"name\":\"Tacocat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-TacoCat.png\"},{\"name\":\"Tacocat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-TacoCat.png\"},{\"name\":\"Tacocat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-TacoCat.png\"},{\"name\":\"Tacocat\",\"type\":\"Cats\",\"count\":4,\"imageURL\":\"cards/Cats-TacoCat.png\"},{\"name\":\"Back Hair\",\"type\":\"Attack\",\"count\":1,\"imageURL\":\"cards/Attack-BackHair.png\"},{\"name\":\"Bear-O-Dactyl\",\"type\":\"Attack\",\"count\":1,\"imageURL\":\"cards/Attack-Bearodactyl.png\"},{\"name\":\"Catterwocky\",\"type\":\"Attack\",\"count\":1,\"imageURL\":\"cards/Attack-Catterwocky.png\"},{\"name\":\"Crab-A-Pult\",\"type\":\"Attack\",\"count\":1,\"imageURL\":\"cards/Attack-Crabapult.png\"},{\"name\":\"Back Hair Shampoo\",\"type\":\"Favor\",\"count\":1,\"imageURL\":\"cards/Favor-Shampoo.png\"},{\"name\":\"Beard Sailing\",\"type\":\"Favor\",\"count\":1,\"imageURL\":\"cards/Favor-Beard.png\"},{\"name\":\"Party Squirrels\",\"type\":\"Favor\",\"count\":1,\"imageURL\":\"cards/Favor-Squirrels.png\"},{\"name\":\"Peanut Butter Belly Button\",\"type\":\"Favor\",\"count\":1,\"imageURL\":\"cards/Favor-PeanutButter.png\"},{\"name\":\"Jackanope\",\"type\":\"Nope\",\"count\":1,\"imageURL\":\"cards/Nope-Jackanope.png\"},{\"name\":\"Ninja\",\"type\":\"Nope\",\"count\":1,\"imageURL\":\"cards/Nope-Ninja.png\"},{\"name\":\"Nopebell\",\"type\":\"Nope\",\"count\":1,\"imageURL\":\"cards/Nope-Nopebell.png\"},{\"name\":\"Nopestradamus\",\"type\":\"Nope\",\"count\":1,\"imageURL\":\"cards/Nope-Nopestradamus.png\"},{\"name\":\"Sandwich\",\"type\":\"Nope\",\"count\":1,\"imageURL\":\"cards/Nope-Sandwich.png\"},{\"name\":\"All Seeing Goat\",\"type\":\"See The Future\",\"count\":1,\"imageURL\":\"cards/STF-Goat.png\"},{\"name\":\"Mantis Shrimp\",\"type\":\"See The Future\",\"count\":1,\"imageURL\":\"cards/STF-Mantis.png\"},{\"name\":\"Pig-A-Corn\",\"type\":\"See The Future\",\"count\":1,\"imageURL\":\"cards/STF-Pigacorn.png\"},{\"name\":\"Special Ops Bunnies\",\"type\":\"See The Future\",\"count\":1,\"imageURL\":\"cards/STF-Bunnies.png\"},{\"name\":\"Unicorn Enchilada\",\"type\":\"See The Future\",\"count\":1,\"imageURL\":\"cards/STF-Enchilada.png\"},{\"name\":\"Abracrab Lincoln\",\"type\":\"Shuffle\",\"count\":1,\"imageURL\":\"cards/Shuffle-AbracrabLincoln.png\"},{\"name\":\"Bat Farts\",\"type\":\"Shuffle\",\"count\":1,\"imageURL\":\"cards/Shuffle-BatFart.png\"},{\"name\":\"Pomeranian Storm\",\"type\":\"Shuffle\",\"count\":1,\"imageURL\":\"cards/Shuffle-Pomeranian.png\"},{\"name\":\"Transdimensional Litter Box\",\"type\":\"Shuffle\",\"count\":1,\"imageURL\":\"cards/Shuffle-Litterbox.png\"},{\"name\":\"Bunnyraptor\",\"type\":\"Skip\",\"count\":1,\"imageURL\":\"cards/Skip-Bunnyraptor.png\"},{\"name\":\"Cheetah Butt\",\"type\":\"Skip\",\"count\":1,\"imageURL\":\"cards/Skip-Cheetah.png\"},{\"name\":\"Crab Walk\",\"type\":\"Skip\",\"count\":1,\"imageURL\":\"cards/Skip-Crabwalk.png\"},{\"name\":\"Hypergoat\",\"type\":\"Skip\",\"count\":1,\"imageURL\":\"cards/Skip-Hypergoat.png\"}]");
    expect(JSON.stringify(generateDeck().defuseCards)).toBe("[{\"name\":\"Laser Pointer\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Laser.png\"},{\"name\":\"Therapy\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Therapy.png\"},{\"name\":\"Catnip Sandwich\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Catnip.png\"},{\"name\":\"Belly Rub\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Belly.png\"},{\"name\":\"Yoga\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Yoga.png\"},{\"name\":\"3AM Flatulence\",\"type\":\"Defuse\",\"count\":1,\"imageURL\":\"cards/Defuse-Flatulence.png\"}]");
});

test('checks that the correct number of cards are added to the deck', () => {
    let cards = [Card('Bearded Cat', CardTypes.Cats, 4, "cards/Cats-BeardCat.png")];
    cards = duplicateCards(cards);
    expect(cards.length).toBe(4);
    expect(cards[0].name).toBe('Bearded Cat');
    expect(cards[1].name).toBe('Bearded Cat');
    expect(cards[2].name).toBe('Bearded Cat');
    expect(cards[3].name).toBe('Bearded Cat');
});