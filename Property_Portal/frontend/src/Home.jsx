import React, { useEffect, useState } from "react";
import i1 from "./image/h120.jpg"
import i2 from "./image/h140.jpg"
import i3 from "../public/user.jpg"
import './CSS/Home.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Instagram, Linkedin, Twitter } from "lucide-react";
function Home() {

    const [homes, setHomes] = useState([])
    const [agent, setAgent] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8000/property/details')
            .then((result) => {
                console.log(result.data);
                setHomes(result.data.slice(1,5))
            }).catch((err) => {
                console.log(err);
            });

        axios.get(`http://localhost:8000/auth/agents/`)
            .then((result) => {
                console.log(result.data)
                if (result.data) {
                    setAgent(result.data.slice(1,5));
                    console.log("Agent");
                    console.log(agent);
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    return (
        <>
            <div className="cont0">
                <img src={i1} alt="" />
                <div className="cont01">
                    <h4>Welcome to PP</h4>
                    <p>Discover Exceptional Properties with PP</p>
                </div>
            </div>

            <div className="cont2">
                <p><b>Your Future Home Awaits!</b></p>
                <h2>Find Your Dream Here</h2>

                <div className="cont21">
                    {
                        homes.map((home) => {
                            console.log(home.pk);
                            return (
                                <Link to={`/property/${home.pk}`}>
                                    <div className="item">
                                        <div>
                                            <img src={`http://localhost:8000${home.images[0].image}`} alt="" />
                                        </div>
                                        <div className="itemdata1">
                                            <p style={{ color: 'slategray' }}><b>{home.title}</b></p>
                                            <h3>{home.address}</h3>
                                            <div className="idetail"><span>{home.bedroom}</span>|<span>{home.parking}</span>|<span>{home.area}</span></div>
                                            <div className="itemfoot"><b>${home.price}</b></div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    }


                </div>

            </div>

            <div className="cont1">
                <div className="cont11">
                    <img src={i2} alt="" />
                </div>

                <div className="cont12">
                    <p>Unvelling our Journey</p>
                    <h2>Our Commitment Crafting Extraordinary Real Estate Experiences</h2>
                    <p style={{ marginTop: '24px' }}>Our Story began with a vision to bridge the gap between property seekers and owners with Property Portal, we've created a robust ecosystem that faciitates fosters long-term relationships.</p>
                    <div className="cont121">
                        <div>
                            <h4><b>10000+</b></h4>
                            <p><a href="/profile/1">Happy Clients</a></p>
                        </div>

                        <div>
                            <h4><b>500+</b></h4>
                            <p>Experienced Agent</p>
                        </div>

                        <div>
                            <h4><b>10+</b></h4>
                            <p>Cities Network</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cont3">
                <h2>Our Expert Agents</h2>
                <div className="cont30">
                    {agent.map((a) => {
                        return (<div className="cont31">
                            <div className="cont311">
                                <img src={i3} alt="" />
                                <div>
                                    <h1>{a.username}</h1>
                                    <h4>{a.email}</h4>
                                </div>
                            </div>
                        </div>)
                    })
                    }
                </div>
            </div>

            <div className="footer">
                <div>
                <div className="icons"><Instagram/><Twitter/><Linkedin/></div>
                <div>Term of Use - Privacy Policy</div>
                <div>&#169; 2024 Property Portal</div>
                </div>
            </div>
        </>
    );
}

export default Home;