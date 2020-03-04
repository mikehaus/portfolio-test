import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper, Panel, PanelGroup, ButtonToolbar } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import ModalAddForm from './modaladdform';
import TrackerNav from './trackernav';
import firebase from '../../firebase';
 
const TRACKER_STYLES = {
    main: {
        width: '100vw - 65px',
        height: '90vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: '65px',
        right: '20px',
        top: '10px',
        bottom: '100px',
        padding: '10px',
    },
    header: {
        textAlign: 'center',
        margin: '10px',
    },
    btn: {
        position: 'fixed',
        top: '2vh',
        right: '2vw',
        zIndex: 1
    },
    listStyle: {
        marginTop: 10,
    },
    buttonList: {
        marginTop: 10,
        textAlign: 'center',
        justify: 'space-around'
    },
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

    It also renders Move buttons according to which list the panel is positioned 
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
                            onClick={() => {
                                props.moveLeft('left', ticket, props.listName)}} 
                            icon={<Icon icon="arrow-left" />} 
                            color="green"
                            style={TRACKER_STYLES.moveLeft}/> 
                    </Whisper>
                    : null }
                <Whisper
                    placement="bottom"
                    speaker={editspeaker}
                    trigger='hover'>
                    <Button 
                        onClick={() => {
                            props.editTicket(ticket, props.listName)}} 
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
                            onClick={() => {
                                props.moveRight('right', ticket, props.listName)}} 
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
            edit: false
        };
        this.addTicket = this.addTicket.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.moveTicket = this.moveTicket.bind(this);
        this.editTicket = this.editTicket.bind(this);
        this.processForm = this.processForm.bind(this);
        this.processFormEdit = this.processFormEdit.bind(this);
    }

    // opens form after add button is pressed
    addTicket = () => {
        this.setState({
            formOpen: true,
        });
    }

    // function closes form after close button is pressed
    // Set into if else if because it prevents console error from showing\
    closeForm = () => {
        if (this.state.edit) {
            this.setState({
                edit: false,
                formOpen: false,
                formData: {
                    name: '',
                    priority: 'Low',
                    description: ''
                }
            });
        }

        else {
            this.setState({
                edit: false,
                formOpen: false,
            });
        }
    }


    // moveTicket takes array that ticket is located in and grabs the id,
    // then updates array and adds ticket to new array. Writes data to database to adjust according to movement
    moveTicket = (direction, ticket, listname) => {
        let list = [];
        let listMoveTo = [];

        // Decides which array to use
        if (listname === 'todo') {
            list = this.state.todo;
            listMoveTo = this.state.started;
        }
        else if (listname === 'started') {
            list = this.state.started;
            if (direction === 'left') {
                listMoveTo = this.state.todo;
            }
            else if (direction === 'right') {
                listMoveTo = this.state.completed;
            }
        }
        else if (listname === 'completed') {
            list = this.state.completed;
            listMoveTo = this.state.started;
        }

        // gets index of ticket id, splices array and moves ticket to other array
        let index = list.indexOf(ticket);
        let entry = ticket;

        let entryId = entry.id;

        list.splice(index, 1);

        listMoveTo.push(entry);

        let db = firebase.database();

        // if list is todo, removes entry from todo db and moves it to started
        if (listname === 'todo') {
            this.setState({
                todo: list,
                started: listMoveTo,
            });
            db.ref(`tickets/todo/${entryId}`).remove();
            db.ref(`tickets/started/${entryId}`).set({
                name: entry.name,
                description: entry.description,
                priority: entry.priority
            }, function(error) {
                if (error) {
                    console.log('write failed');
                } else {
                    console.log('write succeeded');
                }
            });
        }

        // if list is started, removes entry and moves depending on direction, left is todo, right is completed
        else if (listname === 'started') {
            if (direction === 'left') {
                this.setState({
                    started: list,
                    todo: listMoveTo,
                });
                db.ref(`tickets/started/${entryId}`).remove();
                db.ref(`tickets/todo/${entryId}`).set({
                    name: entry.name,
                    description: entry.description,
                    priority: entry.priority
                }, function(error) {
                    if (error) {
                        console.log('write failed');
                    } else {
                        console.log('write succeeded');
                    }
                });
            }
            else if (direction === 'right') {
                this.setState({
                    started: list,
                    completed: listMoveTo,
                });
                db.ref(`tickets/started/${entryId}`).remove();
                db.ref(`tickets/completed/${entryId}`).set({
                    name: entry.name,
                    description: entry.description,
                    priority: entry.priority
                }, function(error) {
                    if (error) {
                        console.log('write failed');
                    } else {
                        console.log('write succeeded');
                    }
                });
            }
        }

        // if list is completed, removes entry from completed db and moves it to started
        else if (listname === 'completed') {
            this.setState({
                completed: list,
                started: listMoveTo,
            });
            db.ref(`tickets/completed/${entryId}`).remove();
            db.ref(`tickets/started/${entryId}`).set({
                name: entry.name,
                description: entry.description,
                priority: entry.priority
            }, function(error) {
                if (error) {
                    console.log('write failed');
                } else {
                    console.log('write succeeded');
                }
            });
        }
    }

    // WILL DO LATER
    editTicket = (id, listname) => {
        let list = [];
        if (listname === 'todo') {
            list = this.state.todo;
        }
        else if (listname === 'started') {
            list = this.state.started;
        }
        else if (listname === 'completed') {
            list = this.state.completed
        }

        let index = list.indexOf(id)
        let entry = list[index];
        console.log(entry);

        this.setState({
            formData: entry,
            edit: true,
            formOpen: true,
        })
    }


    // function gets info from form and pushes that into state To Do
    // because it updates state, it rerenders the todo list
    // After it changes state, it pushes info into db
    processForm = (formKey) => {
        let todoState = this.state.todo;
        formKey.id = uuidv4();
        let newTodo = {
            name: formKey.name,
            description: formKey.description,
            priority: formKey.priority,
            id: formKey.id
        };
        todoState.push(newTodo);
        this.setState({
            todo: todoState,
        });
        console.log(todoState);

        firebase.database().ref(`tickets/todo/${formKey.id}`).set({
            name: newTodo.name,
            priority: newTodo.priority,
            description: newTodo.description,
            id: formKey.id, 
        });
    }

    // to implement takes info from edited form and processes to edit correct entry
    processFormEdit = (formKey, formID) => {
        console.log(formID);
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
            }
            this.setState({
                todo: todoState,
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
            }
            this.setState({
                started: startedState,
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
            }
            this.setState({
                completed: completedState,
            });
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
                    edit={this.state.edit} 
                    close={this.closeForm}
                    formSubmitted={this.processForm}
                    formSubmitEdit={this.processFormEdit} />
                <TrackerNav style={TRACKER_STYLES.trackerNav} />
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
                            listName={'todo'}
                            moveLeft={this.moveTicket} 
                            moveRight={this.moveTicket}
                            editTicket={this.editTicket}
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
                            listName={'started'}
                            moveLeft={this.moveTicket} 
                            moveRight={this.moveTicket}
                            editTicket={this.editTicket}
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
                            listName={'completed'}
                            moveLeft={this.moveTicket} 
                            moveRight={this.moveTicket}
                            editTicket={this.editTicket}
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