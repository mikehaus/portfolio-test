import React from 'react';
import { FlexboxGrid, List, Col, Divider } from 'rsuite';
 
const TRACKER_STYLE = {
    main: {
        width: '90vw',
        height: '90vh',
        overflowY: 'auto',
        position: 'absolute',
        left: '105px',
        right: '50px',
        top: '50px',
        bottom: '50px',
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
                <FlexboxGrid justify='space-around' style={TRACKER_STYLE.main}>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h3 style={TRACKER_STYLE.header}>To Do</h3>
                        <Divider />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h3 style={TRACKER_STYLE.header}>Started</h3>
                        <Divider />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h3 style={TRACKER_STYLE.header}>Completed</h3>
                        <Divider />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}
 
export default TrackerView;