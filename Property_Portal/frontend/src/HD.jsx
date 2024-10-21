import React, { useState, useEffect } from "react";
import i1 from "../public/home1.jpeg";
import { useParams } from "react-router-dom";
import axios from 'axios';
import './CSS/HD.css';

function HD() {
    const { id } = useParams();
    const [home, setHome] = useState([]);
    const [agent, setAgent] = useState([]);
    const [show, setShow] = useState(false);
    const userid=localStorage.getItem('id');
    const usertype=localStorage.getItem('type');
    const [verifyAgent,setVerifyAgent]=useState(false);
    const [data, setData] = useState({ 'property': id, 'applicant':userid, 'description': 'Enter Description' });
    const handleConfirm = () => {
        console.log(data);
        axios.post("http://localhost:8000/appointment/book/", data)
            .then((response) => {
                alert('Appointment Booked')
                console.log(response.data.message);
            })
            .catch((error) => {
                alert('Appointment Not Booked')
                console.log(error);
            });
        setShow(false);
    };

    const addFavourite=()=>{

        axios.post("http://localhost:8000/auth/add_favourite/", {'id':localStorage.getItem('id'),'property_id':id})
            .then((response) => {
                alert('Property Saved')
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const verifyProperty=()=>{

        axios.post("http://localhost:8000/auth/add_verify/", {'id':localStorage.getItem('id'),'property_id':id})
            .then((response) => {
                alert('Property Verified')
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const soldProperty=()=>{
        axios.post("http://localhost:8000/auth/sold/", {'id':localStorage.getItem('id'),'property_id':id})
            .then((response) => {
                alert('Property Remove')
            })
            .catch((error) => {
                console.log(error);
            });
    };


    useEffect(() => {
        axios.get(`http://localhost:8000/property/details/${id}`)
            .then((result) => {
                console.log(result.data);
                setHome(result.data);
                if (result.data.agent) {
                    if(result.data.agent==userid){
                        setVerifyAgent(true)
                    }
                    axios.get(`http://localhost:8000/auth/user/${result.data.agent}`)
                        .then((result) => {
                            setAgent(result.data);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    return (
        <>
            <div className="hd">
                <div className="hd1">
                    <div className="pic">
                        <div className="mainpic">
                            {home.images && <img src={`http://localhost:8000${home.images[0].image}`} alt="" />}
                        </div>
                        <div className="subpic">
                            {home.images && home.images.slice(1, 4).map((image, index) => (
                                <img key={index} src={`http://localhost:8000${image.image}`} alt="" />
                            ))}
                        </div>
                    </div>

                    <div className="nlp">
                        <div>
                            <h1>{home.title}</h1>
                            <p>{home.address}</p>
                            <p>₹{home.price}</p>
                        </div>

                        <div className="agent">
                            <h1>{agent.username}</h1>
                            <p>{agent.email}</p>
                        </div>
                    </div>

                    <div className="description">
                        <p>{home.description}</p>
                    </div>
                </div>

                <div className="hd2">
                    <h2>Nearby Places</h2>
                    <div className="genral">
                        {home.nearby_places && 
                            home.nearby_places.map((place, index) => (
                                <div key={index}>
                                    <h3>{place.name} {place.place_type}</h3>
                                    <p>{place.distance} meters away</p>
                                </div>
                            ))
                        }
                    </div>

                    <h2>Sizes</h2>
                    <div className="size">
                        <div>{home.area} sqft</div>
                        <div>{home.bedroom} beds</div>
                        <div>{home.parking} parking</div>
                    </div>

                    <div className="location">
                        {/* <div>
                            <img src={i1} alt="" />
                        </div> */}
                    </div>

                    <div className="button">
                        {userid && show && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close" onClick={() => setShow(false)}>&times;</span>
                                    <h2>Book a Date</h2>
                                    <label htmlFor="date">Select Date:</label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={data.date}
                                        onChange={(e) => setData({ ...data, date: e.target.value })}
                                    />
                                    <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
                                </div>
                            </div>
                        )}
                        </div>
                        {usertype && usertype=='client' && userid!=home.owner?(
                            <div className="btns">
                                <button onClick={() => setShow(true)}>Book Now</button>
                                <button onClick={addFavourite}>Save the place</button>
                            </div>
                        ):usertype=='agent' && verifyAgent && (
                            <div className="btns">
                                <button onClick={verifyProperty}>Approve</button>
                                <button onClick={soldProperty}>Sold</button>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}

export default HD;
