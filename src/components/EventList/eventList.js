import React from 'react'
import EventItem from './eventItem';

const eventList = (props) => {
    const events = props.events.map(event => {
        return (
            <EventItem 
                userId={props.userId}
                key={event._id}
                eventId={event._id}
                creatorId={event.creator._id}
                eventTitle={event.title}
                eventDate={event.date}
                onDetail={props.onViewDetails}
                eventPrice={event.price}
            />
        )
    })
    return(
        <ul className="event-list">
            {events}
        </ul>
    )
}

export default eventList