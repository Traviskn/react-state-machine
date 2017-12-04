import React, { Component } from 'react'
import { Machine } from 'xstate'
import PropTypes from 'prop-types'

export class FiniteStateMachine extends Component {
  static propTypes = {
    log: PropTypes.bool,
    stateGraph: PropTypes.object,
    reducer: PropTypes.func,
  }

  machine = Machine(this.props.stateGraph)

  state = {
    data: this.props.reducer(undefined, { type: '@init' }),
    machineState: this.machine.getInitialState()
  }

  transition = (actionType, newData) => {
    const { log, stateGraph, reducer } = this.props
    const { data, machineState } = this.state

    const nextState = this.machine
      .transition(machineState, actionType)
      .toString()

    const action = {
      data: newData,
      nextState,
      type: `${machineState}.${actionType}`
    }

    if (log) {
      console.log(stateGraph.id, action.type, action.data)
    }

    this.setState(
      { data: reducer(data, action), machineState: nextState },
      () => {
        if (log) {
          console.log(stateGraph.id, this.state.machineState, this.state.data)
        }
      }
    )
  }

  render() {
    return this.props.render({
      state: this.state.machineState,
      data: this.state.data,
      transition: this.transition
    })
  }
}

export class Match extends Component {
  static propTypes = {
    machine: PropTypes.shape({
      state: PropTypes.string,
      transition: PropTypes.func
    }),
    state: PropTypes.string,
    partial: PropTypes.bool,
    conditional: PropTypes.bool
  }

  static defaultProps = {
    partial: false,
    conditional: true
  }

  render() {
    const {
      component: MatchComponent,
      render,
      partial,
      conditional,
      machine,
      state
    } = this.props

    const match = partial
      ? machine.state.startsWith(state)
      : machine.state === state

    if (conditional && !match) {
      return null
    }
    if (render) {
      return render(machine)
    }
    return <MatchComponent {...machine} />
  }
}

export class Switch extends Component {
  static propTypes = {
    machine: PropTypes.shape({
      state: PropTypes.string.isRequired,
      transition: PropTypes.func.isRequired
    }).isRequired
  }

  render() {
    const { children, machine } = this.props

    let match = null

    React.Children.forEach(children, child => {
      if (match) return

      if (child.props.state === machine.state) {
        match = child
      }
    })

    return React.cloneElement(match, { machine })
  }
}
