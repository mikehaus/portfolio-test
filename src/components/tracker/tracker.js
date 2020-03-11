import React from 'react';
import { FlexboxGrid, List, Col, Divider, Button, IconButton, Icon, Popover, Whisper, Panel, PanelGroup, ButtonToolbar } from 'rsuite';
import { v4 as uuidv4 } from 'uuid';
import ModalAddForm from './modaladdform';
import CategoryNav from './categorynav';
import ProjectNav from './projectnav';
import firebase from '../../firebase';
 
const TRACKER_STYLES = {
    mainNoSideNav: {
        width: '95vw - 65px',
        height: '90vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: '65px',
        right: '10px',
        top: '10px',
        bottom: '100px',
        padding: '10px',
    },
    mainSideNav: {
        width: '95vw - 100px',
        height: '90vh',
        overflowY: 'auto',
        overflowX: 'none',
        position: 'absolute',
        left: '165px',
        right: '10px',
        top: '10px',
        bottom: '100px',
        padding: '10px',
    },
    header: {
        textAlign: 'center',
        margin: '10px',
    },
    navBtn: {
        position: 'fixed',
        top: '5px',
        left: '65px',
        zIndex: 1
    },
    addTicketBtn: {
        position: 'fixed',
        top: '5px',
        right: '10px',
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

const archivespeaker = (
    <Popover title="Close and Archive Ticket" />
);

const projectnavspeaker = (
    <Popover title="Show Project Nav" />
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
                {!right ?
                    <Whisper
                        placement="bottom"
                        speaker={archivespeaker}
                        trigger='hover'>
                        <Button 
                            onClick={() => {
                                props.closeTicket(ticket, props.listName)}} 
                            color="violet"> 
                            Close
                        </Button>
                    </Whisper>
                    : null }
            </ButtonToolbar>
        </Panel>
    );
    return (
        <PanelGroup accordion>
            {listItems}
        </PanelGroup>
    );
}


/***** TRACKER VIEW component houses the view of the Ticket tracker app ******/

class TrackerView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formOpen: false,
            projectNav: true,
            todo: [],
            started: [],
            completed: [],
            edit: false,
            category: 'frontend'
        };
        this.addTicket = this.addTicket.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.moveTicket = this.moveTicket.bind(this);
        this.editTicket = this.editTicket.bind(this);
        this.processForm = this.processForm.bind(this);
        this.processFormEdit = this.processFormEdit.bind(this);
        this.changeTicketCategory = this.changeTicketCategory.bind(this);
        this.populateViewWithTickets = this.populateViewWithTickets.bind(this);
        this.closeTicketAndArchive = this.closeTicketAndArchive.bind(this);
        this.showProjectNav = this.showProjectNav.bind(this);
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
            db.ref(`tracker/tickets/${this.state.category}/todo/${entryId}`).remove();
            db.ref(`tracker/tickets/${this.state.category}/started/${entryId}`).set({
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
                db.ref(`tracker/tickets/${this.state.category}/started/${entryId}`).remove();
                db.ref(`tracker/tickets/${this.state.category}/todo/${entryId}`).set({
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
                db.ref(`tracker/tickets/${this.state.category}/started/${entryId}`).remove();
                db.ref(`tracker/tickets/${this.state.category}/completed/${entryId}`).set({
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
            db.ref(`tracker/tickets/${this.state.category}/completed/${entryId}`).remove();
            db.ref(`tracker/tickets/${this.state.category}/started/${entryId}`).set({
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


    // takes current ticket and moves to archived part of database
    closeTicketAndArchive = (ticket, listname) => {
        let list = this.state.completed;

        let index = list.indexOf(ticket);

        let entry = ticket;

        let entryId = entry.id;

        list.splice(index, 1);

        let db = firebase.database();

        // if list is todo, removes entry from todo db and moves it to started
        this.setState({
            completed: list,
        });
        db.ref(`tracker/tickets/${this.state.category}/completed/${entryId}`).remove();
        db.ref(`tracker/tickets/${this.state.category}/archived/${entryId}`).set({
            name: entry.name,
            description: entry.description,
            priority: entry.priority
        }, function(error) {
            if (error) {
                console.log('ticket failed to archive');
            } else {
                console.log('ticket archived successfully');
            }
        });
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


    // function gets info from form and submits into
    // selected category todo db
    // If category match, updates todolist
    processForm = (formKey) => {
        formKey.id = uuidv4();
        let newTodo = {
            name: formKey.name,
            description: formKey.description,
            priority: formKey.priority,
            id: formKey.id
        };

        if (this.state.category === formKey.category) {
            let todoState = this.state.todo;
            todoState.push(newTodo);
            this.setState({
                todo: todoState,
            });
            console.log(todoState);
        }

        let category = formKey.category;

        console.log(category);
        if (category === undefined) {
            category = this.state.category;
        }

        firebase.database().ref(`tracker/tickets/${category}/todo/${formKey.id}`).set({
            name: newTodo.name,
            priority: newTodo.priority,
            description: newTodo.description,
            id: formKey.id, 
        })
    }

    // to implement takes info from edited form and processes to edit correct entry
    processFormEdit = (formKey, formID) => {
        console.log(formID);
    }


    changeTicketCategory = (activeKey) => {
        console.log(activeKey);
        this.setState({
            category: activeKey
        });
        this.populateViewWithTickets(activeKey);

        
    }


    // populates view with all tickets from category submitted
    // tried breaking function that had call for each ref but slowed performance

    populateViewWithTickets = (activeKey) => {

        let todoRef = firebase.database().ref(`tracker/tickets/${activeKey}/todo`);
        let startedRef = firebase.database().ref(`tracker/tickets/${activeKey}/started`);
        let completedRef = firebase.database().ref(`tracker/tickets/${activeKey}/completed`);

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


    showProjectNav = () => {
        console.log('showing Project Nav');
        console.log(this.state.projectNav);
        this.setState({
            projectNav: !this.state.projectNav
        });
    }


    // Takes all data from Firebase DB and puts into state arrays for retrieval on page
    // only runs on startup
    componentDidMount = () => {
        this.populateViewWithTickets('frontend');
    }


    render() { 
        if (!this.props.displayed) {
            return null;
        }

        return (
            <div>
                <Whisper
                    placement="leftStart"
                    speaker={addticketspeaker}
                    trigger='hover'>
                    <IconButton 
                        style={TRACKER_STYLES.addTicketBtn}
                        icon={<Icon icon="plus" />} 
                        onClick={this.addTicket}
                        appearance='primary'
                        color='green'
                        size='md'/>
                </Whisper>
                <Whisper
                    placement="rightStart"
                    speaker={projectnavspeaker}
                    trigger='hover'>
                    <IconButton 
                        style={TRACKER_STYLES.navBtn}
                        icon={<Icon icon="bars" />} 
                        onClick={this.showProjectNav}
                        appearance='default'
                        size='md'/>
                </Whisper>
                <ModalAddForm 
                    show={this.state.formOpen}
                    edit={this.state.edit} 
                    close={this.closeForm}
                    formSubmitted={this.processForm}
                    formSubmitEdit={this.processFormEdit} />
                <CategoryNav 
                    activeKey={this.state.category}
                    style={TRACKER_STYLES.categoryNav}
                    changeTicketCategory={this.changeTicketCategory} />
                <ProjectNav
                    show={this.state.projectNav} />
                <FlexboxGrid 
                    justify='space-around' 
                    style={this.state.projectNav ? 
                        TRACKER_STYLES.mainSideNav : TRACKER_STYLES.mainNoSideNav}>
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
                            closeTicket={this.closeTicketAndArchive}
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