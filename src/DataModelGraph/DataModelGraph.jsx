import React from 'react';
import Button from '@gen3/ui-component/dist/components/Button';
import { createNodesAndEdges } from './utils';
import SvgGraph from './SvgGraph';
import './DataModelGraph.less';

/**
 * Wraps SVG graph in a toggle button that toggles between 'full' and 'compact' view
 * Properties are {dictionary, counts_search, links_search}
 */
class DataModelGraph extends React.Component {
  static buildGraphState(props) {
    return {
      full: createNodesAndEdges(props, true),
      compact: createNodesAndEdges(props, false),
    };
  }

  constructor(props) {
    super(props);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.state = { fullToggle: false, ...DataModelGraph.buildGraphState(props) };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...DataModelGraph.buildGraphState(nextProps) });
  }

  handleToggleClick() {
    this.setState(prevState => ({ fullToggle: !prevState.fullToggle }));
  }

  render() {
    const graph = this.state.fullToggle ? this.state.full : this.state.compact;

    if (graph.nodes.length !== 0 && 'count' in graph.nodes[graph.nodes.length - 1]) {
      return (
        <div className='data-model-graph'>
          <Button
            id='cd-dmg__toggle'
            label='Toggle View'
            buttonType='secondary'
            onClick={this.handleToggleClick}
          />
          <SvgGraph nodes={graph.nodes} edges={graph.edges} />
        </div>
      );
    }
    return null;
  }
}


export default DataModelGraph;
