import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cytoscape from 'cytoscape'
import registerCoseBilkent from 'cytoscape-cose-bilkent'
import './graph.css'

registerCoseBilkent(cytoscape)

export default class Graph extends Component {
  static propTypes = {
    stateGraph: PropTypes.object.isRequired
  }

  state = {
    nodes: [],
    edges: [],
    raw: JSON.stringify(this.props.stateGraph, null, 2),
    machine: this.props.stateGraph
  }

  initializeMachine() {
    const { machine } = this.state
    const nodes = []
    const edges = []

    function addNodesAndEdges(node, key, parent) {
      const id = parent ? parent + '.' + key : key

      if (parent) {
        nodes.push({
          data: {
            id,
            label: key,
            parent
          }
        })
      }

      if (node.states) {
        const states = Object.keys(node.states)
          .map(key => ({
            ...node.states[key],
            id: key
          }))
          .concat({
            id: '$initial',
            initial: 1,
            on: {'': node.initial}
          })

        states.forEach(state => {
          addNodesAndEdges(state, state.id, id)
        })
      }

      if (node.on) {
        const visited = {}
        Object.keys(node.on).forEach(event => {
          const target = node.on[event];

          (visited[target] || (visited[target] = [])).push(event)
        })

        Object.keys(visited).forEach(target => {
          edges.push({
            data: {
              id: key + ':' + target,
              source: id,
              target: parent ? parent + '.' + target : target,
              label: visited[target].join(',\n'),
            }
          })
        })
      }
    }
    addNodesAndEdges(machine, machine.id || 'machine')

    this.cy = cytoscape({
      container: this.cyNode,

      boxSelectionEnabled: true,
      autounselectify: true,

      style: `
        node[label != '$initial'] {
          content: data(label);
          text-valign: center;
          text-halign: center;
          shape: roundrectangle;
          width: label;
          height: label;
          padding-left: 5px;
          padding-right: 5px;
          padding-top: 5px;
          padding-bottom: 5px;
          background-color: white;
          border-width: 1px;
          border-color: black;
          font-size: 10px;
          font-family: Helvetica Neue;
        }
        node:active {
          overlay-color: black;
          overlay-padding: 0;
          overlay-opacity: 0.1;
        }
        .foo {
          background-color: blue;
        }
        node[label = '$initial'] {
          visibility: hidden;
        }
        $node > node {
          padding-top: 1px;
          padding-left: 10px;
          padding-bottom: 10px;
          padding-right: 10px;
          text-valign: top;
          text-halign: center;
          border-width: 1px;
          border-color: black;
          background-color: white;
        }
        edge {
          curve-style: bezier;
          width: 1px;
          target-arrow-shape: triangle;
          label: data(label);
          font-size: 5px;
          font-weight: bold;
          text-background-color: #fff;
          text-background-padding: 3px;
          line-color: black;
          target-arrow-color: black;
          z-index: 100;
          text-wrap: wrap;
          text-background-color: white;
          text-background-opacity: 1;
          target-distance-from-node: 2px;
        }
        edge[label = ''] {
          source-arrow-shape: circle;
          source-arrow-color: black;
        }
      `,

      elements: {
        nodes,
        edges
      },

      layout: {
        name: 'cose-bilkent',
        randomize: true,
        idealEdgeLength: 70,
        animate: false
      }
    })
  }

  componentDidMount() {
    this.initializeMachine()
  }

  render() {
    return <div className="container">
      <div id="cy" ref={n => this.cyNode = n} />
    </div>
  }
}
