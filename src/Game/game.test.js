import React from 'react';
import {dealHands, defaultFavor, getInitialState} from './game'

test('checks default favor value', () => {
  expect(defaultFavor()).toStrictEqual({"active": false, "willGive": undefined, "willReceive": undefined});
});

test('checks the initial state', () => {
  let ctx = {};
  ctx.numPlayers = 4;
  ctx.random = {
    Shuffle(r) {return r;}
  };
  expect(getInitialState(ctx).turnCounter).toBe(1);
  expect(getInitialState(ctx).players[0].status).toBe("Alive");
  expect(getInitialState(ctx).players[1].status).toBe("Alive");
  expect(getInitialState(ctx).players[2].status).toBe("Alive");
  expect(getInitialState(ctx).players[3].status).toBe("Alive");
});

test('checks the initial player hands and deck', () => {
  let ctx = {};
  ctx.numPlayers = 4;
  ctx.random = {
    Shuffle(r) {return r;}
  };
  expect(dealHands(ctx).gameDeck).not.toBeNull();
  expect(dealHands(ctx).playerHands[0].length).toBe(8);
  expect(dealHands(ctx).playerHands[1].length).toBe(8);
  expect(dealHands(ctx).playerHands[2].length).toBe(8);
  expect(dealHands(ctx).playerHands[3].length).toBe(8);
});