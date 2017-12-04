# React Finite State Machine

Components to build UI with state machines

Inspired by:

David Khourshid's Talk: https://youtu.be/VU1NKX6Qkxc
Ryan Florence's proof of concept: https://youtu.be/MkdV2-U16tc

## Usage

### App State
- Defined as a plain JS Object
- Driven by [xstate](https://github.com/davidkpiano/xstate) Machine
- Define state keys as constant 'state types'
- Define transitions as constant 'transition types'

### App Data or Model
- Data lives outside the app state
- Can be gathered/modified/displayed at potentially any app state
- Data is managed by redux-style reducer
- Pass data into state transitions to be captured by reducer

### Side Effects
- Async side effects such as API Calls can be simply executed in componentDidMount lifecycle hooks
- Potential for redux-style middleware as well

### Living Documentation
- App state can be visualized in a graph form
- Serves as an always-up-to-date documentation of your app
