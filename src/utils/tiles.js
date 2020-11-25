const deepMerge = require('deepmerge')

const tiles = [
  // Flowers
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
  // Bamboo/Sticks
  'B1', 'B1', 'B1', 'B1',
  'B2', 'B2', 'B2', 'B2',
  'B3', 'B3', 'B3', 'B3',
  'B4', 'B4', 'B4', 'B4',
  'B5', 'B5', 'B5', 'B5',
  'B6', 'B6', 'B6', 'B6',
  'B7', 'B7', 'B7', 'B7',
  'B8', 'B8', 'B8', 'B8',
  'B9', 'B9', 'B9', 'B9',
  // Character/Wan
  'C1', 'C1', 'C1', 'C1',
  'C2', 'C2', 'C2', 'C2',
  'C3', 'C3', 'C3', 'C3',
  'C4', 'C4', 'C4', 'C4',
  'C5', 'C5', 'C5', 'C5',
  'C6', 'C6', 'C6', 'C6',
  'C7', 'C7', 'C7', 'C7',
  'C8', 'C8', 'C8', 'C8',
  'C9', 'C9', 'C9', 'C9',
  // Dots/Circles
  'D1', 'D1', 'D1', 'D1',
  'D2', 'D2', 'D2', 'D2',
  'D3', 'D3', 'D3', 'D3',
  'D4', 'D4', 'D4', 'D4',
  'D5', 'D5', 'D5', 'D5',
  'D6', 'D6', 'D6', 'D6',
  'D7', 'D7', 'D7', 'D7',
  'D8', 'D8', 'D8', 'D8',
  'D9', 'D9', 'D9', 'D9',
  // Honors, Red/Green/White
  'H1', 'H1', 'H1', 'H1',
  'H2', 'H2', 'H2', 'H2',
  'H3', 'H3', 'H3', 'H3',
  // Winds ESNW
  'W1', 'W1', 'W1', 'W1',
  'W2', 'W2', 'W2', 'W2',
  'W3', 'W3', 'W3', 'W3',
  'W4', 'W4', 'W4', 'W4',
];

const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const sortTiles = (tiles) => {
  let hash = {
    'F': [], 'B': [], 'C': [], 'D': [], 'H': [], 'W': []
  }
  tiles.forEach( tile => { hash[tile[0]].push(tile); });
  for(let arr in hash) {
    hash[arr] = hash[arr].sort((a, b) => Number(a[1]) < Number(b[1]) ? -1 : 1)
  }
  return [].concat(hash.F).concat(hash.B).concat(hash.C).concat(hash.D).concat(hash.H).concat(hash.W)
}

const resetDeck = () => {
  return tiles.slice(0);
}

const drawTiles = (num, hand, deck) => {
  for(let i = 0; i < num; i++) {
    hand.push(deck.pop());
  }
  return hand;
}

module.exports = {
  tiles,
  shuffle,
  sortTiles,
  resetDeck,
  drawTiles
};

const testData = {
  deck: resetDeck(),
  hand: [],
  discard: []
}