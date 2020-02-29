import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper, Panel, PanelGroup } from 'rsuite';
import ModalAddForm from './modaladdform';
import firebase from '../../firebase';
 
const TRACKER_STYLES = {
    main: {
        width: '100% - 65px',
        height: '100vh',
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
    },
    listStyle: {
        marginTop: 10,
    }
}

/* Speaker for popover whisper (Contains title of popover) */

const speaker = (
    <Popover title="Add Ticket" />
);


/* PanelList is component to list all tickets in a category */

function PanelList(props) {
    const ticketList = props.tickets; 
    const listItems = ticketList.map((ticket) =>
        <Panel  key={ticket.id} header={ticket.name} bordered>
            <p>Description: {ticket.description}</p>
            <p>Priority: {ticket.priority}</p>
        </Panel>

    );
    return (
        <PanelGroup accordion>
            {listItems}
        </PanelGroup>
    )
}


/***** TRACKER VIEW component houses the view of the Ticket tracker app ******/

class TrackerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formOpen: false,
            todo: [],
            started: [],
            completed: []
        };
        this.addTicket = this.addTicket.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    // opens form after add button is pressed
    addTicket = () => {
        this.setState({
            formOpen: true,
        });
    }

    // function closes form after close button is pressed
    closeForm = () => {
        this.setState({
            formOpen: false
        });
    }

    // Takes all data from Firebase DB and puts into state arrays for retrieval on page
    componentWillMount = () => {
        const todoRef = firebase.database().ref('tickets/todo');
        const startedRef = firebase.database().ref('tickets/started');
        const completedRef = firebase.database().ref('tickets/completed');
        
        // This takes the value of each todo ticket in tickets fb db and puts values in array, then sets state after
        todoRef.on('value', (snapshot) => {
            let tickets = snapshot.val();
            let todoState = [];
            for (let ticket in tickets) {
                todoState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                todo: todoState
            });
        });

        startedRef.on('value', (snapshot) => {
            let tickets = snapshot.val();
            let startedState = [];
            for (let ticket in tickets) {
                startedState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                started: startedState
            });
        });

        completedRef.on('value', (snapshot) => {
            let tickets = snapshot.val();
            let completedState = [];
            for (let ticket in tickets) {
                completedState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                completed: completedState
            });
        });

        // old code, leaving in for ideas or possible implementation
        /*todoRef.on('value')
            .then(snapshot => {
                snapshot.forEach(childSnapshot => {
                    console.log(childSnapshot.val());
                });
            });*/
        
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
                        <PanelList tickets={this.state.todo} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Started</h4>
                        <Divider />
                        <PanelList tickets={this.state.started} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} lg={7} md={7} sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Completed</h4>
                        <Divider />
                        <PanelList tickets={this.state.completed} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}
 
export default TrackerView;