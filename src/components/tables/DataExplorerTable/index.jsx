import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@arranger/components/dist/Arranger';
import './DataExplorerTable.less';
import { fetchData } from '../../../arrangerApi';

class DataExplorerTable extends React.Component {
  render() {
    return (
      <div className='data-explorer-table'>
        <div className='data-explorer-table__arranger-table'>
          <Table
            {...this.props}
            fetchData={fetchData}
            allowTSVExport={false}
            allowTogglingColumns={false}
            customActions={this.props.customActions}
          />
        </div>
      </div>
    );
  }
}

DataExplorerTable.propTypes = {
  arrangerConfig: PropTypes.object,
  arrangerData: PropTypes.object,
  customActions: PropTypes.object,
};

DataExplorerTable.defaultProps = {
  arrangerConfig: {},
  arrangerData: null,
  customActions: null,
};

export default DataExplorerTable;
