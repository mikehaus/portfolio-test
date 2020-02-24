import React from 'react';
import { FlexboxGrid, List, Col, Divider } from 'rsuite';
 
const TRACKER_STYLES = {
    main: {
        width: '95vw',
        height: '90vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: '65px',
        right: '50px',
        top: '10px',
        bottom: '10px',
        padding: '10px',
    },
    header: {
        textAlign: 'center',
        margin: '10px',
    },

}

class TrackerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() { 
        
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div>
                <FlexboxGrid justify='space-around' style={TRACKER_STYLES.main}>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h4 style={TRACKER_STYLES.header}>To Do</h4>
                        <Divider />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Started</h4>
                        <Divider />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Completed</h4>
                        <Divider />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}
 
export default TrackerView;