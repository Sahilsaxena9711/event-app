import React from 'react'
import Modal from '../components/Modal/modal';
import Backdrop from '../components/Backdrop/backdrop';
import AuthContext from  '../context';
import EventList from '../components/EventList/eventList';
import Loader from '../components/Loader/loader'
export default class Events extends React.Component{
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }
    constructor(props){
        super(props);
        this.priceEl = React.createRef();
        this.titleEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.dateEl = React.createRef();
    }

    componentDidMount(){
        this.fetchEvents();
    }

    static contextType = AuthContext;

    cancelEvent = () => {
        this.setState({creating: false, selectedEvent: null})
    }

    createEvent = () => {
        const title = this.titleEl.current.value;
        const date = new Date(this.dateEl.current.value).toISOString();
        const price = +this.priceEl.current.value;
        const description = this.descriptionEl.current.value;
        let requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", date: "${date}", price: ${price}}) {
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                            username
                        }
                    }
                }
            `
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Auth': this.context.token
            }
        }).then((res) => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error ('Failed!')
            }
            return res.json();
            }).then((resp) => {
                this.setState(prevState => {
                    const updateEvents = [...prevState.events]
                    updateEvents.push({
                        _id: resp.data.createEvent._id,
                        title: resp.data.createEvent.title,
                        description: resp.data.createEvent.description,
                        date: resp.data.createEvent.date,
                        price: resp.data.createEvent.price,
                        creator: {
                            _id: this.context.userId
                        }
                    })
                    return {events: updateEvents}   
                })
            }).catch((e) => {
                console.log(e)
            })
        this.setState({creating: false})
    }

    fetchEvents = () => {
        this.setState({isLoading: true})
        let requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator{
                            _id
                            email
                            username
                        }
                    }
                }
            `
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error ('Failed!')
            }
            return res.json();
            }).then((resp) => {
                this.setState({events: resp.data.events, isLoading: false})
            }).catch((e) => {
                console.log(e)
                this.setState({isLoading: false})
            })
    }

    onViewDetails = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {selectedEvent}
        })
    }

    bookEvent = () => {
        if(!this.context.token){
            this.setState({selectedEvent: null})
            return
        }
        let requestBody = {
            query: `
                mutation {
                    bookingEvent(eventId: "${this.state.selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                        event{
                            title
                            price
                            description
                            date
                        }
                        user{
                            username
                            email
                        }
                    }
                }
            `
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Auth': this.context.token
            }
        }).then((res) => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error ('Failed!')
            }
            return res.json();
            }).then((resp) => {
                this.setState({selectedEvent: null})
            }).catch((e) => {
                console.log(e)
                this.setState({isLoading: false})
            })
    }

    render(){
        const {creating, events, isLoading, selectedEvent} = this.state;
        return(
            <React.Fragment>
                {(creating || selectedEvent) && (<Backdrop/>)}
                {creating && (<React.Fragment>
                    <Modal confirmText="Confirm" title="Add Event" onCancel={this.cancelEvent} onConfirm={this.createEvent} canCancel canConfirm>
                        <form>
                            <div className="event-form">
                                <label htmlFor="title">Title</label>
                                <input type="text" ref={this.titleEl} />
                            </div>
                            <div className="event-form">
                                <label htmlFor="price">Price</label>
                                <input type="number" ref={this.priceEl} />
                            </div>
                            <div className="event-form">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" ref={this.dateEl} />
                            </div>
                            <div className="event-form">
                                <label htmlFor="description">Description</label>
                                <textarea ref={this.descriptionEl} />
                            </div>
                        </form>
                    </Modal>
                </React.Fragment>)}
                {selectedEvent && (
                    <Modal confirmText={this.context.token ? "Book" : "Confirm"} title="Event Details" onCancel={this.cancelEvent} onConfirm={this.bookEvent} canCancel canConfirm>
                        <h1>{selectedEvent.title}</h1>
                        <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toDateString()}</h2>
                        <p>{selectedEvent.description}</p>
                    </Modal>)}
                {this.context.token && <div className="event-container">
                    <p>Share your Events!</p>
                    <button onClick={() => this.setState({creating: true})}>Create Event</button>
                </div>}
                {isLoading ? 
                    <Loader/>
                    : <EventList onViewDetails={this.onViewDetails} events={events} userId={this.context.userId}/>
                }
            </React.Fragment>
        )
    }
}