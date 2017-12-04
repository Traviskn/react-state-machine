import React, { Component } from 'react';
import { FiniteStateMachine, Match, Switch } from './FiniteStateMachine';
import Graph from './docs/Graph';
import stateGraph, { STATE_TYPES, TRANSITION_TYPES } from './stateGraph';
import dataReducer from './dataReducer';

const { GREEN, YELLOW, RED } = STATE_TYPES
const { TIMER } = TRANSITION_TYPES


export default class App extends Component {
  state = {
    showGraph: false
  }

  render() {
    return (
      <div>
        <button
          onClick={() =>
              this.setState(state => ({ showGraph: !state.showGraph }))
          }>
          Toggle Graph
        </button>

        {this.state.showGraph
          ? <Graph stateGraph={stateGraph} />
          : <FiniteStateMachine
              log
              stateGraph={stateGraph}
              reducer={dataReducer}
              render={machine => (
                <Switch machine={machine}>
                  <Match
                    state={GREEN}
                    render={({ transition }) => (
                      <button onClick={() => transition(TIMER)}>GREEN</button>
                    )}
                  />
                  <Match
                    state={YELLOW}
                    render={({ transition }) => (
                      <button onClick={() => transition(TIMER)}>YELLOW</button>
                    )}
                  />
                  <Match
                    state={RED}
                    render={({ transition }) => (
                      <button onClick={() => transition(TIMER)}>RED</button>
                    )}
                  />
                </Switch>
              )}
            />
        }
      </div>
    )
  }
}
