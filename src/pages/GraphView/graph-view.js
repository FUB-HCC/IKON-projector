import React from "react";
import { connect } from "react-redux";
import ClusterMap from "../../components/ClusterMap/cluster-map";
import GeoMap from "../../components/GeoMap/geo-map-view";
import TimeGraph from "../../components/TimeLine/time-line";
import classes from "./graph-view.module.css";
import {
  fetchClusterData,
  fetchInstitutionsData,
  fetchProjectsData,
  fetchKTAData,
  fetchKTAMappingData,
  fetchTargetGroupsData,
  fetchCollectionsData,
  fetchInfrastructureData
} from "../../store/actions/actions";
import { appMargin, menuBarHeight } from "../../App";

class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.margins = { top: 10, left: 10, bottom: 10, right: 10 };
    this.state = {
      activePopover: this.props.selectedProject ? 1 : -1
    };
    this.changeModalHandler = this.changeModalHandler.bind(this);
    this.changeGraphHandler = this.changeGraphHandler.bind(this);
    this.projectClickHandler = this.projectClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      height:
        window.innerHeight -
        menuBarHeight -
        appMargin * 2 -
        this.margins.top -
        this.margins.bottom,
      width:
        (window.innerWidth -
          appMargin * 2 -
          this.margins.left -
          this.margins.right) *
        0.75
    });
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.props.fetchClusterData();
    this.props.fetchProjectsData();
    this.props.fetchInstitutionsData();
    this.props.fetchKtaData();
    this.props.fetchKtaMappingData();
    this.props.fetchTargetGroupsData();
    this.props.fetchCollectionsData();
    this.props.fetchInfrastructureData();
  }

  resize() {
    this.setState({
      height:
        window.innerHeight -
        menuBarHeight -
        appMargin * 2 -
        this.margins.top -
        this.margins.bottom,
      width:
        (window.innerWidth -
          appMargin * 2 -
          this.margins.left -
          this.margins.right) *
        0.75
    });
  }

  changeModalHandler(filter) {
    const newState = filter === this.state.activePopover ? -1 : filter;
    this.setState({
      activePopover: newState
    });
    if (newState === -1) {
      this.props.deactivatePopover();
    }
  }

  projectClickHandler(project, vis) {
    this.props.activatePopover(project, vis);
    this.changeModalHandler(1);
  }

  changeGraphHandler(graph) {
    this.props.changeGraph(graph);
    this.setState({
      activePopover: -1
    });
  }

  render() {
    const geoMapProps = {
      width: this.state.width,
      height: this.state.height,
      onProjectClick: this.projectClickHandler,
      institutions: this.props.institutions,
      projects: this.props.filteredProjects
    };
    let Graph = <ClusterMap />; // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case "0":
        Graph = (
          <ClusterMap
            height={this.state.height}
            width={this.state.width}
            onProjectClick={this.projectClickHandler}
          />
        );
        break;
      case "1":
        Graph = (
          <TimeGraph
            height={this.state.height}
            width={this.state.width}
            onProjectClick={this.projectClickHandler}
          />
        );
        break;
      case "2":
        Graph = <GeoMap {...geoMapProps} />;
        break;
      default:
        break;
    }

    return <div className={classes.OuterDiv}>{Graph}</div>;
  }
}

const mapStateToProps = state => {
  return {
    graph: state.main.graph,
    selectedProject: state.main.selectedProject,
    filter: state.main.filters,
    filteredProjects: state.main.filteredProjects,
    institutions: state.main.institutions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchClusterData: () => dispatch(fetchClusterData()),
    fetchProjectsData: () => dispatch(fetchProjectsData()),
    fetchInstitutionsData: () => dispatch(fetchInstitutionsData()),
    fetchKtaData: () => dispatch(fetchKTAData()),
    fetchKtaMappingData: () => dispatch(fetchKTAMappingData()),
    fetchTargetGroupsData: () => dispatch(fetchTargetGroupsData()),
    fetchCollectionsData: () => dispatch(fetchCollectionsData()),
    fetchInfrastructureData: () => dispatch(fetchInfrastructureData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphView);
