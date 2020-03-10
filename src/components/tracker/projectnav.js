import React from 'react';
import { Drawer, Nav, Col, Whisper, IconButton, Icon, Popover } from 'rsuite';
import firebase from '../../firebase';

const PROJECT_NAV_STYLES = {
    main: {
        position: 'fixed',
        zIndex: 1,
        right: 10,
        top: '100px',
        fontSize: '10pt',
    },
    addProjectBtn: {
        position: 'fixed',
        top: '50px',
        right: '10px',
        zIndex: 1
    },
}

const addprojectspeaker = (
    <Popover title="Add Project" />
);


const SideNav = ({ active, onSelect, ...props }) => {

    const projectList = props.projects;

    return (
        <Nav {...props} 
            vertical 
            activeKey={active} 
            onSelect={onSelect}
            pullRight>
            {projectList.map((project) =>
                <Nav.Item
                key={project.id}>
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
      this.addProject = this.addProject.bind(this);
    }

    handleSelect(activeKey) {
      this.setState({ active: activeKey });
    }

    addProject() {
        console.log('clicked add project');
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
            return (
                <Whisper
                    placement="bottomEnd"
                    speaker={addprojectspeaker}
                    trigger='hover'>
                    <IconButton 
                        style={PROJECT_NAV_STYLES.addProjectBtn}
                        icon={<Icon icon="plus" />} 
                        onClick={this.addProject}
                        appearance='default'
                        size='xs'/>
                </Whisper>
            )
            
        }

        else {
            return (
                <div>
                    <Whisper
                        placement="bottomEnd"
                        speaker={addprojectspeaker}
                        trigger='hover'>
                        <IconButton 
                            style={PROJECT_NAV_STYLES.addProjectBtn}
                            icon={<Icon icon="plus" />} 
                            onClick={this.addProject}
                            appearance='default'
                            size='xs'/>
                    </Whisper>
                    <SideNav 
                    appearance="subtle" 
                    reversed 
                    active={active}
                    projects={this.state.projects} 
                    onSelect={this.handleSelect} 
                    style={PROJECT_NAV_STYLES.main}/>
                </div>
            );
        }
    }
  }

export default ProjectNav;