import React from 'react';
import AuthContext from '../context';
import Loader from '../components/Loader/loader';
import BookingList from '../components/BookingList/bookingList';

export default class Bookings extends React.Component{
    state = {
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading: true})
        let requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event{
                            _id
                            title
                            description
                            date
                            price
                        }
                        user{
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
                this.setState({bookings: resp.data.bookings, isLoading: false})
            }).catch((e) => {
                console.log(e)
                this.setState({isLoading: false})
            })
    }

    cancelBooking = bookingId => {
        this.setState({isLoading: true})
        let requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
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
                    const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId)
                    return {bookings: updatedBookings, isLoading: false}
            })
            }).catch((e) => {
                console.log(e)
                this.setState({isLoading: false})
            })
    }

    render(){
        const { bookings, isLoading } = this.state;
        return(
            <React.Fragment>
                {isLoading ? 
                    <Loader/> 
                    :  
                    <BookingList onCancel={this.cancelBooking} bookings={bookings}/>
                }
            </React.Fragment>
        )
    }
}