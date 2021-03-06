import React from 'react';
import { Nav } from 'rsuite';

const TRACKER_NAV_STYLES = {
    main: {
        position: 'fixed',
        bottom: 0,
        left: '56px',
        right: '0px',
        maxWidth: '100vw - 155px',
        minWidth: '80vw',
        height: '50px',
        overflowX: 'auto',
        backgroundColor: '#111419',
        zIndex: 1,
    }
}


const BottomNav = ({ active, onSelect, ...props }) => {
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

class CategoryNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: 'frontend'
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount = () => {
        this.setState({
            active: this.props.activeKey
        });
    } 

    handleSelect(activeKey) {

        this.setState({
            active: activeKey
        })
        
        this.props.changeTicketCategory(activeKey);
    }

    render() { 
        const { active } = this.state;
        return(
            <div>
                <BottomNav
                    frontend={this.state.frontend}
                    active={active}
                    style={TRACKER_NAV_STYLES.main} 
                    onSelect={this.handleSelect} />
            </div>
        );
    }
}

export default CategoryNav;