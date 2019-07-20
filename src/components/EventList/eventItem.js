import React from 'react'

const eventItem = props => (
    <li key={props.eventId} className="event-list-item">
        <div>
            <h1>{props.eventTitle}</h1>
            <h2>${props.eventPrice } - { new Date(props.eventDate).toLocaleDateString()}  {new Date(props.eventDate).toLocaleTimeString()}</h2>
        </div>
        <div>
            {props.userId === props.creatorId ?
                <p>You are the owner of this event!</p>
                : <button onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>}
        </div>
    </li>
)

export default eventItem;