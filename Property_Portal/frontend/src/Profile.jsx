import React, { useEffect, useState } from "react";
import axios from 'axios';
import user_image from "../public/user.jpg"
import { useParams, Link } from "react-router-dom";
import './CSS/Profile.css';

function Profile() {
    const { id } = useParams();
    const userid = localStorage.getItem('id');
    const user_type = localStorage.getItem('type');
    const [profile, setProfile] = useState({});
    const [data, setData] = useState({ list1: [], list2: [] });

    const listPropertyDetail = async (list1, list2) => {
        try {
            const result = await axios.post('http://localhost:8000/property/sort-detail/', { 'list1': list1, 'list2': list2 });
            return result.data;
        } catch (err) {
            console.error(err);
            return { list1: [], list2: [] }; // return empty lists on error
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/auth/user/${id}`);
                setProfile(result.data);

                if (user_type === 'agent') {
                    if (result.data.agent_details) {
                        const properties = await listPropertyDetail(result.data.agent_details.active_property, result.data.agent_details.inquiry_property);
                        setData(properties);
                    }
                } else if (user_type === 'client') {
                    if (result.data.client_details) {
                        const properties = await listPropertyDetail(result.data.client_details.sell_property, result.data.client_details.favourite_property);
                        setData(properties);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [id, user_type]);

    return (
        <div className="profile">
            <div className="part-1">
                <div className="header">
                    <img src={user_image} alt="" className="profile_pic" />
                    <h1>{profile.username}</h1>
                </div>
            </div>

            <div className="part-2">
                <div className="contact">
                    <h1>Contact</h1>
                    <hr />
                    <p>Email: {profile.email}</p>
                </div>

                <div className="properties">
                    <h1>Properties</h1>
                    <hr />
                    <div className="prop">
                        <div className="properties-sale">
                            {localStorage.getItem('type') == 'client' ? <h2>For Sale</h2> : <h2>Active</h2>}

                            <div className="property-list">
                                {data.list1 && data.list1.map(property => (
                                    <Link to={`/property/${property.pk}`}>
                                        <div className="property" key={property.id}>
                                            <h2>{property.title}</h2>
                                            <p>{property.address}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="properties-favourite">
                            {localStorage.getItem('type') == 'client' ? <h2>Saved</h2> : <h2>Inquiry</h2>}

                            <div className="property-list">
                                {data.list2 && data.list2.map(property => (
                                    <Link to={`/property/${property.pk}`}>
                                        <div className="property" key={property.id}>
                                            <h2>{property.title}</h2>
                                            <p>{property.address}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


// import React,{useEffect, useState} from "react";
// import axios from 'axios'
// import i1 from "../public/home1.jpeg"
// import { useParams } from "react-router-dom";
// import './CSS/Profile.css'
// import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
// function Profile() {
//     const {id}=useParams();
//     const userid=localStorage.getItem('id');
//     const user_type=localStorage.getItem('type')
//     const [profile, setProfile] = useState([])
//     const [agent,setAgent]=useState({})
//     let data=new Array()
//     async function listPropertyDetail(list1,list2){
//         console.log(list1,list2);
//         axios.post('http://localhost:8000/property/sort-detail/',{'list1':list1,'list2':list2})
//         .then((result)=>{
//             console.log(result.data);
//             return result.data
//         }).catch((err) => {
//             console.log(err);
//         });
//     }
//     useEffect(() => {
//         axios.get(`http://localhost:8000/auth/user/${id}`)
//             .then((result) => {
//                 console.log(result);
//                 setProfile(result.data)
//                 if(profile){
//                     if(user_type=='agent'){
//                         setAgent(result.data.agent_details)
//                         if (agent){
//                             data=listPropertyDetail(agent.active_property,agent.inquiry_property)
//                         }
//                     }else if(user_type=='client'){
//                         setClient(result.data.client_details)
//                         if (client){
//                             data=listPropertyDetail(client.sell_property,client.favourite_property)
//                         }
//                     }
//                 }
//             }).catch((err) => {
//                 console.log(err);
//             });
//     }, [])

//     return (
//         <>
//             <div className="profile">
//                 <div className="part-1">
//                     <div className="header">
//                         <img src={i1} alt="" className="profile_pic" />
//                         <br />
//                         <h1>
//                             {profile.username}
//                         </h1>
//                     </div>
//                 </div>

//                 <div className="part-2">
//                     <div className="contact">
//                         <h1>Contact</h1>
//                         <hr />
//                         <p>Address : 123 Nehrunagar, Ahmedabad</p>
//                         <p>Email : {profile.email}</p>
//                         <p>Mobile Number : 1234567890</p>
//                     </div>

//                     <div className="properties">
//                         <h1>Properties</h1>
//                         <hr />
//                         <div className="prop">
//                             <div className="properties-sale">
//                                 {/* {localStorage.getItem('type')=='client'?<h2>For Sale</h2>:<h2>Active</h2>} */}
//                                 <div className="property-list">
//                                    {data['list1'] && data['list1'].map((property)=>{
//                                         return (<div className="property">
//                                         <h2>{property.title}</h2>
//                                         <p>{property.local_address}</p>
//                                         </div>)
//                                     })}
//                                 </div>
//                             </div>

//                             <div className="properties-favourite">
//                                 {/* {localStorage.getItem('type')=='client'?<h2>Saved</h2>:<h2>Inquiry</h2>} */}
//                                 <div className="property-list">
//                                 {data['list2'] && data['list2'].map((property)=>{
//                                         return (<div className="property">
//                                         <h2>{property.title}</h2>
//                                         <p>{property.local_address}</p>
//                                         </div>)
//                                     })}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="social">
//                         <h1>Social</h1>
//                         <hr />
//                         <div><Instagram /><Facebook /><Twitter /><Linkedin /></div>
//                     </div>
//                 </div>

//             </div>
//         </>
//     );
// }

// export default Profile;