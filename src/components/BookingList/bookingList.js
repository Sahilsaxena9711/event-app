import React from 'react';

const bookingList = props => {
    return(
        <ul className="bookingsList">
            {props.bookings && props.bookings.map(booking => (
                <li className="bookingItem" key={booking._id}>
                    <div className="bookingDetail">
                        {booking.event.title} - {new Date(booking.createdAt).toDateString()}
                    </div>
                    <div className="bookingCancel">
                        <button onClick={props.onCancel.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default bookingList;