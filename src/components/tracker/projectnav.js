import React from 'react';
import { Drawer, Nav, Col, Whisper, IconButton, Icon, Popover, Button, Input, InputGroup } from 'rsuite';
import firebase from '../../firebase';

const PROJECT_NAV_STYLES = {
    main: {
        position: 'fixed',
        zIndex: 1,
        left: 70,
        top: '100px',
        fontSize: '10pt',
    },
    addProjectBtn: {
        position: 'fixed',
        top: '50px',
        left: '65px',
        zIndex: 1
    },
    projectNameInput: {
        width: 150,
        marginRight: 20
    }
}

const addprojectspeaker = (
    <Popover title="Add Project" />
);


const SideNav = ({ active, onSelect, submitNewProject, showInput, ...props }) => {

    const projectList = props.projects;

    let keyCount = '0';

    return (
        <Nav {...props} 
            vertical 
            activeKey={active} 
            onSelect={onSelect}
            pullRight>
            {showInput ?
                <div>
                    <InputGroup style={PROJECT_NAV_STYLES.projectNameInput}>
                        <Input />
                        <InputGroup.Button>
                            <Icon icon="send" />
                        </InputGroup.Button>
                    </InputGroup>
                </div> : null}
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
        showInput: false
      };
      this.handleSelect = this.handleSelect.bind(this);
      this.addProject = this.addProject.bind(this);
      this.submitNewProject = this.submitNewProject.bind(this);
    }

    handleSelect(activeKey) {
      this.setState({ active: activeKey });
    }

    addProject() {
        this.setState({
            showInput: !this.state.showInput
        })
        console.log('clicked add project');
    }

    submitNewProject = () => {
        console.log("submitted new project");
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
        }, function(error) {
            if (error) {
                console.log('Could not Load Project Data...');
            } else {
                console.log('Loaded Data');
            }
        });

    }


    render() {
        const { active } = this.state;
        
        if (!this.props.show) {
            return null;
        }

        else {
            return (
                <div>
                    <Whisper
                        placement='right'
                        speaker={addprojectspeaker}
                        trigger='hover'>
                        <IconButton 
                            style={PROJECT_NAV_STYLES.addProjectBtn}
                            icon={<Icon icon="plus" />} 
                            onClick={this.addProject}
                            appearance='primary'
                            size='xs'/>
                    </Whisper>
                    <SideNav 
                    appearance="subtle"  
                    active={active}
                    submitNewProject={this.submitNewProject}
                    showInput={this.state.showInput}
                    projects={this.state.projects} 
                    onSelect={this.handleSelect} 
                    style={PROJECT_NAV_STYLES.main}/>
                </div>
            );
        }
    }
  }

export default ProjectNav;