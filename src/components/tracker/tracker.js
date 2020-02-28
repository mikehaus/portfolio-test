import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper } from 'rsuite';
import ModalAddForm from './modaladdform';
import firebase from '../../firebase';
 
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
    btn: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
}

let ToDoData = [
    {
        key: "1",
        title: "Sample TODO title",
        description: "Sample Description",
        Priority: "Low"
    },
];

let StartedData = {

};

let CompletedData = {

};

/* Speaker for popover whisper (Contains title of popover) */

const speaker = (
    <Popover title="Add Ticket" />
  );

/***** TRACKER VIEW component houses the view of the Ticket tracker app ******/

class TrackerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formOpen: false,
            highRefObject: null,
            medRefObject: null,
            lowRefObject: null
        };
        this.addTicket = this.addTicket.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    addTicket = () => {
        this.setState({
            formOpen: true,
        });
    }

    closeForm = () => {
        this.setState({
            formOpen: false
        });
    }

    componentWillMount = () => {

        let mydb = firebase.database();

        let ref = mydb.ref('tickets/High');
        let medRefObject = mydb.ref('tickets/medium')
        let lowRefObject = mydb.ref().child('low');

        ref.once("value")
        .then(function(snapshot) {
            let key = snapshot.key;
            let childKey = snapshot.child("1").val();
            console.log(childKey);
        });

        medRefObject.once("value")
        .then(function(snapshot) {
            let key = snapshot.key;
            let childKey = snapshot.child('1').val();
            console.log(childKey);
        });
    }

    render() { 
        
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div>
                <Whisper
                placement="bottomEnd"
                speaker={speaker}
                trigger='hover'
                >
                    <IconButton 
                    style={TRACKER_STYLES.btn}
                    icon={<Icon icon="plus" />} 
                    onClick={this.addTicket}
                    appearance='primary'
                    color='green'
                    size='lg'
                    onMouseEnter={this.handleAddBtnMouseover}
                    onMouseLeave={this.handleAddBtnMouseleave}
                    />
                </Whisper>
                <ModalAddForm show={this.state.formOpen} close={this.closeForm} />
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