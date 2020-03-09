import React from 'react';
import { Drawer, Nav, Col } from 'rsuite';
import firebase from '../../firebase';

const PROJECT_NAV_STYLES = {
    main: {
        position: 'fixed',
        right: '50px',
        zIndex: 1,
        top: '100px',
        backgroundColor: 'white',
    },
}

const SideNav = ({ active, onSelect, ...props }) => {

    const projectList = props.projects;

    return (
        <Nav {...props} 
            vertical 
            activeKey={active} 
            onSelect={onSelect}>
            {projectList.map((project) =>
                <Nav.Item
                eventKey={project.id}>
                    {project.name}
                </Nav.Item>
            )}
        </Nav>
    );
};


class ProjectNav extends React.Component {
    constructor() {
      super();
      this.state = {
        projects: [],
        active: '',
      };
      this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(activeKey) {
      this.setState({ active: activeKey });
    }

    componentDidMount = () => {
        let projectRef = firebase.database().ref(`tracker/projects`);

        projectRef.on('value', (snapshot) => {
            let projects = snapshot.val();
            let projectState = [];
            for (let project in projects) {
                projectState.push({
                    id: project,
                    name: projects[project].name,
                });
            }

            console.log(projectState);
            console.log(this.props.show);
            this.setState({
                projects: projectState,
            });
        });

    }

    render() {
        const { active } = this.state;
        
        if (!this.props.show) {
            return null;
        }

        else {
            return (
                    <SideNav 
                    appearance="subtle" 
                    reversed 
                    active={active}
                    projects={this.state.projects} 
                    onSelect={this.handleSelect} 
                    style={PROJECT_NAV_STYLES.main}/>
            );
        }
    }
  }

export default ProjectNav;