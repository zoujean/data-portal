import React from 'react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
import DataExplorerFilters from './DataExplorerFilters';
import DataExplorerVisualizations from './DataExplorerVisualizations';
import { paramByApp } from '../../data/dictionaryHelper';
import { params } from '../../data/parameters';
import { api } from '../arrangerApi';
import './DataExplorer.less';

class DataExplorer extends React.Component {
  render() {
    const arrangerConfig = paramByApp(params, 'arrangerConfig') || {};
    const explorerTableConfig = arrangerConfig.table || {};
    return (
      <div className='data-explorer'>
        <ArrangerWrapper
          index={arrangerConfig.index}
          graphqlField={arrangerConfig.graphqlField}
          projectId={arrangerConfig.projectId}
          api={api}
        >
          <DataExplorerFilters arrangerConfig={arrangerConfig} api={api} />
          <DataExplorerVisualizations
            arrangerConfig={arrangerConfig}
            explorerTableConfig={explorerTableConfig}
            api={api}
          />
        </ArrangerWrapper>
      </div>
    );
  }
}

export default DataExplorer;
