import React from 'react';
import { Nav } from 'rsuite';

const TRACKER_NAV_STYLES = {
    main: {
        position: 'fixed',
        bottom: 0,
        left: '65px',
        right: '50px',
        maxWidth: '95vw',
        minWidth: '80vw',
        height: '50px',
        overflowX: 'auto',
        backgroundColor: '#111419',
        zIndex: 1,
    }
}


const TopNav = ({ active, onSelect, ...props }) => {
    return (
      <Nav 
        {...props} 
        activeKey={active} 
        onSelect={onSelect}
        appearance='subtle'
        reversed
        justified>
        <Nav.Item active eventKey="frontend">Frontend</Nav.Item>
        <Nav.Item eventKey="backend">Backend</Nav.Item>
        <Nav.Item eventKey="api">API</Nav.Item>
        <Nav.Item eventKey="testing">Testing</Nav.Item>
      </Nav>
    );
  };

class TrackerNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 'frontend'
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(activeKey) {
        this.setState({
            active: activeKey
        });
    }

    render() { 
        const { active } = this.state;
        return(
            <div>
                <TopNav active={active} style={TRACKER_NAV_STYLES.main} onSelect={this.handleSelect} />
            </div>
        );
    }
}

export default TrackerNav;