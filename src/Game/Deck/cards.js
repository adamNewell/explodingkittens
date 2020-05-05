import {number} from "prop-types";

export const CardTypes = {
    Cats:       'Cats',
    Attack:     'Attack',
    Favor:      'Favor',
    Nope:       'Nope',
    STF:        'See The Future',
    Shuffle:    'Shuffle',
    Skip:       'Skip',
    Defuse:     'Defuse',
    Explode:    'Explode'
}

export function CardTypesAsArray() {
    let arr = []
    for (let key in CardTypes) {
        if (CardTypes.hasOwnProperty(key)) {
            arr.push(CardTypes[key]);
        }
    };

    return arr;
}

export function CardIsOneOfType(card, types) {
    return Array.isArray(types) ? types.indexOf(card.type) != -1 : types == card.type;
}

// export function CardsEachOfType(cards, count) {
//     return (cards.length === count && (cards.every((val, idx, arr) => (val.type === CardTypes.Cats && val.name === arr[0].name) ||
//                     (val.type !== CardTypes.Cats && cards.every((c, idx, arr) => c.type === arr[0].type)))));
//
//     return (new Set(cards.map(c => c.type === CardTypes.Cats ? c.name : c.type))).size === 1;
// }

export function CardsOfTypes(cards, numberOfTypes) {
    return (new Set(cards.map(c => c.type === CardTypes.Cats ? c.name : c.type))).size === numberOfTypes;
}

// Cards can be any cat card or any action card, without duplicate actions
// export function CardsEachOfDifferentType(cards) {
//     return (new Set(cards.map(c => c.type === CardTypes.Cats ? c.name : c.type))).size === count;
// }

export const Card = (name, type, count, imageURL) => ({
    name,
    type,
    count,
    imageURL,

})

// TODO: Change names so they aren't exactly the same as the real game
export const cards = [
    Card('Bearded Cat',                 CardTypes.Cats, 4, "cards/Cats-BeardCat.png"),
    Card('Catermelon',                  CardTypes.Cats, 4, "cards/Cats-Catermelon.png"),
    Card('Hairy Potato Cat',            CardTypes.Cats, 4, "cards/Cats-HairyPotatoCat.png"),
    Card('Rainbow-Ralphing Cat',        CardTypes.Cats, 4, "cards/Cats-RainbowRalphingCat.png"),
    Card('Tacocat',                     CardTypes.Cats, 4, "cards/Cats-TacoCat.png"),
    Card('Back Hair',                   CardTypes.Attack, 1, "cards/Attack-BackHair.png"),
    Card('Bear-O-Dactyl',               CardTypes.Attack, 1, "cards/Attack-Bearodactyl.png"),
    Card('Catterwocky',                 CardTypes.Attack, 1, "cards/Attack-Catterwocky.png"),
    Card('Crab-A-Pult',                 CardTypes.Attack, 1, "cards/Attack-Crabapult.png"),
    Card('Earth',                       CardTypes.Explode, 1, "cards/Explode-Earth.png"),
    Card('Ship',                        CardTypes.Explode, 1, "cards/Explode-Ship.png"),
    Card('Boat',                        CardTypes.Explode, 1, "cards/Explode-Boat.png"),
    Card('House',                       CardTypes.Explode, 1, "cards/Explode-House.png"),
    Card('Back Hair Shampoo',           CardTypes.Favor, 1, "cards/Favor-Shampoo.png"),
    Card('Beard Sailing',               CardTypes.Favor, 1, "cards/Favor-Beard.png"),
    Card('Party Squirrels',             CardTypes.Favor, 1, "cards/Favor-Squirrels.png"),
    Card('Peanut Butter Belly Button',  CardTypes.Favor, 1, "cards/Favor-PeanutButter.png"),
    Card('Jackanope',                   CardTypes.Nope, 1, "cards/Nope-Jackanope.png"),
    Card('Ninja',                       CardTypes.Nope, 1, "cards/Nope-Ninja.png"),
    Card('Nopebell',                    CardTypes.Nope, 1, "cards/Nope-Nopebell.png"),
    Card('Nopestradamus',               CardTypes.Nope, 1, "cards/Nope-Nopestradamus.png"),
    Card('Sandwich',                    CardTypes.Nope, 1, "cards/Nope-Sandwich.png"),
    Card('All Seeing Goat',             CardTypes.STF, 1, "cards/STF-Goat.png"),
    Card('Mantis Shrimp',               CardTypes.STF, 1, "cards/STF-Mantis.png"),
    Card('Pig-A-Corn',                  CardTypes.STF, 1, "cards/STF-Pigacorn.png"),
    Card('Special Ops Bunnies',         CardTypes.STF, 1, "cards/STF-Bunnies.png"),
    Card('Unicorn Enchilada',           CardTypes.STF, 1, "cards/STF-Enchilada.png"),
    Card('Abracrab Lincoln',            CardTypes.Shuffle, 1, "cards/Shuffle-AbracrabLincoln.png"),
    Card('Bat Farts',                   CardTypes.Shuffle, 1, "cards/Shuffle-BatFart.png"),
    Card('Pomeranian Storm',            CardTypes.Shuffle, 1, "cards/Shuffle-Pomeranian.png"),
    Card('Transdimensional Litter Box', CardTypes.Shuffle, 1, "cards/Shuffle-Litterbox.png"),
    Card('Bunnyraptor',                 CardTypes.Skip, 1, "cards/Skip-Bunnyraptor.png"),
    Card('Cheetah Butt',                CardTypes.Skip, 1, "cards/Skip-Cheetah.png"),
    Card('Crab Walk',                   CardTypes.Skip, 1, "cards/Skip-Crabwalk.png"),
    Card('Hypergoat',                   CardTypes.Skip, 1, "cards/Skip-Hypergoat.png"),
    Card('Laser Pointer',               CardTypes.Defuse, 1, "cards/Defuse-Laser.png"),
    Card('Therapy',                     CardTypes.Defuse, 1, "cards/Defuse-Therapy.png"),
    Card('Catnip Sandwich',             CardTypes.Defuse, 1, "cards/Defuse-Catnip.png"),
    Card('Belly Rub',                   CardTypes.Defuse, 1, "cards/Defuse-Belly.png"),
    Card('Yoga',                        CardTypes.Defuse, 1, "cards/Defuse-Yoga.png"),
    Card('3AM Flatulence',              CardTypes.Defuse, 1, "cards/Defuse-Flatulence.png")
];
