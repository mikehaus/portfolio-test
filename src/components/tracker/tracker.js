import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper, Panel, PanelGroup, ButtonToolbar } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
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
        position: 'fixed',
        top: 10,
        right: 10,
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
                            props.editTicket(ticket.id, props.listName)}} 
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
            todocount: 0,
            startedcount: 0,
            completedcount: 0,
            edit: false,
            formData: {}, 
        };
        this.addTicket = this.addTicket.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.moveTicket = this.moveTicket.bind(this);
        this.editTicket = this.editTicket.bind(this);
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

    moveTicket = (direction, ticket, listname) => {
        let list = [];
        let listMoveTo = [];
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

        let index = list.indexOf(ticket);
        let entry = ticket;

        //let listMoveLength = listMoveTo.length;
        //entry.id = listMoveLength.toString(10);
        let entryId = entry.id;

        list.splice(index, 1);

        listMoveTo.push(entry);

        console.table(list);
        console.table(listMoveTo);

        console.log(ticket.name, ticket.description, ticket.priority);

        let db = firebase.database();

        if (listname === 'todo') {
            let todoCount = this.state.todocount - 1;
            let startedCount = this.state.startedcount + 1;
            this.setState({
                todo: list,
                started: listMoveTo,
                todocount: todoCount,
                startedcount: startedCount,
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

        else if (listname === 'started') {
            let todoCount = this.state.todocount + 1;
            let startedCount = this.state.startedcount - 1;
            let completedCount = this.state.completedcount + 1;
            if (direction === 'left') {
                this.setState({
                    started: list,
                    todo: listMoveTo,
                    startedcount: startedCount,
                    todocount: todoCount,
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
                    startedcount: startedCount,
                    completedcount: completedCount
                });
                db.ref(`tickets/started/${entryId}`).remove();
                db.ref(`tickets/completed/${entryId}`).set({
                //db.ref(`tickets/completed/${listMoveLength}`).set({
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

        else if (listname === 'completed') {
            let completedCount = this.state.completedcount - 1;
            let startedCount = this.state.startedcount + 1;
            this.setState({
                completed: list,
                started: listMoveTo,
                completedcount: completedCount,
                startedcount: startedCount
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

        let entry = list[id];
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
        let todoCount = this.state.todocount;
        //formKey.id = todoCount.toString(10);
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
            todocount: todoCount
        });
        console.log(todoState);

        firebase.database().ref(`tickets/todo/${formKey.id}`).set({
            name: newTodo.name,
            priority: newTodo.priority,
            description: newTodo.description,
            id: formKey.id, 
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
            let todoCount = 0;
            for (let ticket in tickets) {
                todoState.push({
                    id: ticket,
                    name: tickets[ticket].name,
                    description: tickets[ticket].description,
                    priority: tickets[ticket].priority
                });
                todoCount++;
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
                    console.log(cildSnapshot.val());
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
                    formData={this.state.formData}
                    show={this.state.formOpen}
                    edit={this.state.edit} 
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