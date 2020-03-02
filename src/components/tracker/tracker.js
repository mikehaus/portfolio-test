import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper, Panel, PanelGroup, ButtonToolbar } from 'rsuite';
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
    },
    buttonList: {
        marginTop: 5,
        textAlign: 'center'
    }
}

/* Speaker for popover whisper (Contains title of popover) */

const addticketspeaker = (
    <Popover title="Add Ticket" />
);

const moveleftspeaker = (
    <Popover title="Move Ticket to Previous Category" />
);

const moverightspeaker = (
    <Popover title="Move Ticket to Next Category" />
);

const editspeaker = (
    <Popover title="Edit Ticket" />
);

/* PanelList is component to list all tickets in a category 
    It has a listItems const which has a list of all the panels in the list that 
    populate info inside based on info received in props (usually called at componentDidMount in parent component)
*/

function PanelList(props) {
    const ticketList = props.tickets; 
    let left = props.left;
    let right = props.right;
    const listItems = ticketList.map((ticket) =>
        <Panel  
            key={ticket.id} 
            header={ticket.name} 
            bordered>
            <p>Description: {ticket.description}</p>
            <p>Priority: {ticket.priority}</p>
            <ButtonToolbar 
                style={TRACKER_STYLES.buttonList}>
                {left ? 
                    <Whisper
                        placement="bottom"
                        speaker={moveleftspeaker}
                        trigger='hover'>
                        <IconButton 
                            onClick={props.moveLeft} 
                            icon={<Icon icon="arrow-left" />} 
                            color="green"/> 
                    </Whisper>
                    : null }
                <Whisper
                    placement="bottom"
                    speaker={editspeaker}
                    trigger='hover'>
                    <Button 
                        onClick={props.editTicket} 
                        color="yellow">
                            Edit
                    </Button>
                </Whisper>
                {right ?
                    <Whisper
                        placement="bottom"
                        speaker={moverightspeaker}
                        trigger='hover'>
                        <IconButton 
                            onClick={props.moveRight} 
                            icon={<Icon icon="arrow-right" />} 
                            color="green"/> 
                    </Whisper>
                    : null }
            </ButtonToolbar>
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
            completed: [],
            todocount: 0,
            startedcount: 0,
            completedcount: 0
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

    processForm = (formValue) => {
        console.log(formValue);
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
            let todoCount = 0;
            for (let ticket in tickets) {
                todoState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                todoCount++;
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                todo: todoState,
                todocount: todoCount
            });
        });

        startedRef.on('value', (snapshot) => {
            let tickets = snapshot.val();
            let startedState = [];
            let startedCount = 0;
            for (let ticket in tickets) {
                startedState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                startedCount++;
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                started: startedState,
                startedCount: startedCount
            });
        });

        completedRef.on('value', (snapshot) => {
            let tickets = snapshot.val();
            let completedState = [];
            let completedCount = 0;
            for (let ticket in tickets) {
                completedState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                completedCount++;
                console.log(tickets[ticket].name, tickets[ticket].description);
            }
            this.setState({
                completed: completedState,
                completedcount: completedCount
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
                    speaker={addticketspeaker}
                    trigger='hover'>
                    <IconButton 
                        style={TRACKER_STYLES.btn}
                        icon={<Icon icon="plus" />} 
                        onClick={this.addTicket}
                        appearance='primary'
                        color='green'
                        size='lg'
                        onMouseEnter={this.handleAddBtnMouseover}
                        onMouseLeave={this.handleAddBtnMouseleave}/>
                </Whisper>
                <ModalAddForm 
                    show={this.state.formOpen} 
                    close={this.closeForm}
                    formSubmitted={this.processForm} />
                <FlexboxGrid 
                    justify='space-around' 
                    style={TRACKER_STYLES.main}>
                    <FlexboxGrid.Item 
                        componentClass={Col} 
                        colspan={24} 
                        lg={7} 
                        md={7} 
                        sm={23}>
                        <h4 style={TRACKER_STYLES.header}>To Do</h4>
                        <Divider />
                        <PanelList 
                            tickets={this.state.todo} 
                            left={false} 
                            right={true} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item 
                        componentClass={Col}
                        colspan={24} 
                        lg={7} 
                        md={7} 
                        sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Started</h4>
                        <Divider />
                        <PanelList 
                            tickets={this.state.started} 
                            left={true} 
                            right={true} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item 
                        componentClass={Col} 
                        colspan={24} 
                        lg={7} 
                        md={7} 
                        sm={23}>
                        <h4 style={TRACKER_STYLES.header}>Completed</h4>
                        <Divider />
                        <PanelList 
                            tickets={this.state.completed} 
                            left={true} 
                            right={false} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        );
    }
}
 
export default TrackerView;