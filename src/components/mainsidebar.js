import React from 'react';
import { Sidenav, Nav, Icon, Divider } from 'rsuite';

const MAINSIDEBAR_STYLES = {
    main: {
        width: 65,
        position: 'fixed',
        height: '100vh',
        display: 'flex',
        left: 0,
        color: 'white'
    },
}

class MainSideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: '2',
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect = (eventKey) => {
        this.setState({
            activeKey: eventKey
        });

        this.props.changeView(eventKey);
    }

    render() {
        return (
            <div style={MAINSIDEBAR_STYLES.main}>
               <Sidenav
                expanded={false}
                activeKey={this.state.activeKey}
                onSelect={this.handleSelect}
                appearance="default"
                >
                    <Sidenav.Header>

                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Item eventKey="1" icon={<Icon icon="avatar"/>}>
                                About Me
                            </Nav.Item>
                            <Nav.Item eventKey="2" icon={<Icon icon="project" />}>
                                Project Tracker
                            </Nav.Item>
                            <Nav.Item eventKey="3" icon={<Icon icon="bolt" />}>
                                Weather Area Forecast
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav> 
            </div>
        )
    }
}

export default MainSideBar;
