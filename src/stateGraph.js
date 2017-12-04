export const STATE_ID = 'lights';

const GREEN = 'green'
const YELLOW = 'yellow'
const RED = 'red'

export const STATE_TYPES = {
  GREEN,
  YELLOW,
  RED,
}

export const INITIAL_STATE = GREEN;

const TIMER = 'timer'

export const TRANSITION_TYPES = {
  TIMER
}

export default {
  id: STATE_ID,
  initial: INITIAL_STATE,
  states: {
    [GREEN]: {
      on: {
        [TIMER]: YELLOW,
      }
    },
    [YELLOW]: {
      on: {
        [TIMER]: RED,
      }
    },
    [RED]: {
      on: {
        [TIMER]: GREEN,
      }
    }
  }
}

