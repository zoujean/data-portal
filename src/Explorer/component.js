import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {CheckBoxGroup} from '../components/CheckBox';
import styled from 'styled-components';
import 'react-table/react-table.css';
import {Sidebar} from '../theme';
import ReactTable from 'react-table';
import Relay from 'react-relay/classic';
import { withAuthTimeout, withBoxAndNav} from '../utils';
import {getReduxStore} from '../reduxStore.js';
import {explorer} from "./reducers";

class TableExplorer extends Component{
  static propTypes = {
    filesList: PropTypes.array
  };

  render(){
    return(
      <div>
        <div>
          <ReactTable
            data= {this.props.filesList}
            columns={[
              {
                Header: 'Project',
                accessor: 'project_id'
              },
              {
                Header: 'File Name',
                accessor: 'name'
              },
              {
                Header: 'File Format',
                accessor: 'format'
              },
              {
                Header: 'File Size',
                accessor: 'size'
              },
              {
                Header: 'Category',
                accessor: 'category'
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />
        </div>
      </div>
    );
  }
}

class ExplorerSidebar extends Component {
  static propTypes = {
    projects: PropTypes.object,
    file_formats: PropTypes.array,
    selected_filters: PropTypes.object,
    onChange: PropTypes.func
  };

  state = {
    selected_filters: this.props.selected_filters
  };

  onChangeCheckbox = (group_name, selected_items) =>{
    this.setState({
      ...this.state,
      ...this.state.selected_filters,
      [group_name]: selected_items
    });
    this.props.onChange(this.state);
  };

  render(){
    return(
      <Sidebar>
      <CheckBoxGroup listItems={Object.values(this.props.projects)} title="Projects"
                     selected_items={this.state.selected_filters.projects}
                     group_name="projects"
                     onChange={this.onChangeCheckbox.bind(this)}/>
      <CheckBoxGroup listItems={this.props.file_formats}
                     selected_items={this.state.selected_filters.file_formats}
                     title="File Formats"
                     group_name="file_formats" onChange={this.onChangeCheckbox.bind(this)} />
      </Sidebar>
    );
  }
}

class ExplorerComponent extends Component {
  static propTypes = {
    submission: PropTypes.object,
    selected_filters: PropTypes.object,
    filesList: PropTypes.array,
    onChange: PropTypes.func
  };

  aggregateProperties = (dictionary, category, property) =>{
    let aggregateSet = new Set();
    if(dictionary === 'undefined'){
      return(aggregateSet);
    }
    for(let node in dictionary){
      if(dictionary[node].hasOwnProperty('category') && dictionary[node]['category'] === category){
        if(dictionary[node]['properties'][property].hasOwnProperty('enum')){
          for(let property_option of dictionary[node]['properties'][property]['enum']){
            if(!aggregateSet.has(property_option)){
              aggregateSet.add(property_option);
            }
          }
        }
      }
    }
    return(aggregateSet);
  };

  onChangeSelectedItems = (state) =>{
    this.setState({
      ...this.state,
      selected_filters: state.selected_filters,
    });
    this.props.onChange(this.state);
  };

  state = {
    projects: this.props.submission.projects,
    selected_filters: this.props.selected_filters,
    file_formats: this.aggregateProperties(this.props.submission.dictionary, 'data_file', 'data_type'),
    dictionary:this.props.submission.dictionary
  };

  render(){
    return(
      <div>
        <ExplorerSidebar projects={this.state.projects}
                         selected_filters={this.state.selected_filters}
                         file_formats={Array.from(this.state.file_formats.values())}
                         onChange={this.onChangeSelectedItems.bind(this)} />
        <TableExplorer filesList={this.props.filesList}/>
      </div>
    );
  }
}


export const RelayExplorerComponent = Relay.createContainer(
  function(props,context) {
    const viewer = props.viewer || {
      submitted_aligned_reads: [],
      submitted_unaligned_reads: [],
      submitted_somatic_mutation: [],
      submitted_methylation: [],
      submitted_copy_number: []
    };

    let files1 = viewer.submitted_aligned_reads.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    let files2 = viewer.submitted_unaligned_reads.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    let files3 = viewer.submitted_somatic_mutation.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    let files4 = viewer.submitted_methylation.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    let files5 = viewer.submitted_copy_number.map( function(file) {
      return { project_id: file.project_id, name: file.file_name, category: file.data_category, format: file.data_format, size: file.file_size };
    });
    let filesList = [...files1, ...files2, ...files3, ...files4, ...files5 ];

    // Update redux store if data is not already there
    getReduxStore().then(
      (store) => {
        let explorerState = store.getState().explorer;
        if (! explorerState.refetched )
          store.dispatch( { type: 'RECEIVE_FILE_LIST', data: filesList } );
      }
    );

    const resetVariables = (state) => {
      // console.log("reset variables: " + state.selected_filters.projects);
      props.relay.setVariables({
        selected_projects: state.selected_filters.projects,
        selected_file_formats: state.selected_filters.file_formats
      });
      getReduxStore().then(
        (store) => {
          store.dispatch( { type: 'SELECTED_LIST_CHANGED', data: state.selected_filters } );
        }
      );
    };

    const mapStateToProps = (state) => {
      return{
        'submission': state.submission,
        'filesList': state.explorer.filesList,
        'selected_filters': state.explorer.selected_filters || {projects: [], file_formats: []}
      }
    };


    const mapDispatchToProps = (dispatch) =>{
      return{
        onChange: (state) => dispatch(() => {resetVariables(state)})
      }
    };

    let Explorer = connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);

    return(
      <div>
        <Explorer />
      </div>
    );
  },
  {
    initialVariables: {
      selected_projects: [],
      selected_file_formats: [],
    },
    fragments: {
      viewer: () => Relay.QL`
          fragment on viewer {
              submitted_aligned_reads(first: 10000, project_id: $selected_projects) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_unaligned_reads(first: 10000, project_id: $selected_projects) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_somatic_mutation(first: 10000, project_id: $selected_projects) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_methylation(first: 10000, project_id: $selected_projects) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
              submitted_copy_number(first: 10000, project_id: $selected_projects) {
                  project_id
                  file_name
                  data_category
                  data_format
                  data_type
                  file_size
              }
          }
      `
    },
  },
);

const RelayExplorer = Relay.createContainer(
  withBoxAndNav(withAuthTimeout(RelayExplorerComponent)),
  {
    fragments: {
      viewer:(variables) => Relay.QL`
          fragment on viewer {
              ${RelayExplorerComponent.getFragment( 'viewer', {...variables} )}
          }
      `
    }
  }
);

export default RelayExplorer;