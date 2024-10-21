import React, { useState ,useEffect} from "react";
import axios from "axios";
import './CSS/Add.css';

function Add() {
    const [data, setData] = useState({});
    const [nearbyplaces, setNearbyplaces] = useState([]);
    const [images, setImages] = useState([]);
    const [agents,setAgents]=useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const userid=localStorage.getItem('id')
    const user_type=localStorage.getItem('type')
    useEffect(() => {
        axios.get(`http://localhost:8000/auth/agents/`)
            .then((result) => {
                console.log(result.data);
                setAgents(result.data)
            }).catch((err) => {
                console.log(err);
            });
    }, [])
    const formData = new FormData();

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleNearbyPlaceChange = (index, e) => {
        const newPlaces = [...nearbyplaces];
        newPlaces[index][e.target.name] = e.target.value;
        setNearbyplaces(newPlaces);
    };

    const addNearby = () => {
        setNearbyplaces([...nearbyplaces, { name: '', distance: 0, place_type: '' }]);
    };

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value);
    };

    const validateForm = () => {
        const requiredFields = [
            'title', 'description', 'property_type', 'price',
            'address', 'pincode',
            'area', 'bedroom', 'parking', 'lat', 'log'
        ];

        for (let field of requiredFields) {
            if (!data[field]) {
                return false;
            }
        }
        return selectedAgent !== '';
    };

    const handleSubmit = (e) => {
        if (!validateForm()){
            alert('All Fields Are Required!!!')
            return
        }
        e.preventDefault();
        data["is_available"] = true;
        data["is_varified"] = false;
        data['nearbyplace'] = JSON.stringify(nearbyplaces);
        data['owner'] = userid;
        data['agent'] = selectedAgent;

        for (let key in data) {
            formData.append(key, data[key]);
        }

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        axios.post("http://localhost:8000/property/save/", formData)
            .then((response) => {
                const opElement = document.getElementById('op');
                if (response.data.message === "unSuccessful") {
                    alert('Property Not Added')
                } else {
                    alert('Property Added')
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="form-container">

            {userid && user_type=='client' && <form>
                <h1>Add Property</h1>
                <input
                    type="text"
                    name="title"
                    value={data.title || ''}
                    placeholder="Enter Title"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    value={data.description || ''}
                    placeholder="Description"
                    cols={40}
                    rows={4}
                    onChange={handleChange}
                    required
                ></textarea>

                <select name="property_type" value={data.property_type || ''} onChange={handleChange} required>
                    <option value="">Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                </select>

                <input
                    type="number"
                    name="price"
                    value={data.price || ''}
                    placeholder="Enter Your Price"
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="address"
                    value={data.address || ''}
                    placeholder="Address"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="pincode"
                    value={data.pincode || ''}
                    placeholder="PIN"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="area"
                    value={data.area || ''}
                    placeholder="Area (sqft)"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="bedroom"
                    value={data.bedroom || ''}
                    placeholder="Bedrooms"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="parking"
                    value={data.parking || ''}
                    placeholder="Parking"
                    onChange={handleChange}
                    required
                />
                
                <input
                    type="number"
                    name="lat"
                    value={data.lat || ''}
                    placeholder="Latitude"
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="log"
                    value={data.log || ''}
                    placeholder="Logitude"
                    onChange={handleChange}
                    required
                />

                {nearbyplaces.map((place, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Place Name"
                            value={place.name}
                            onChange={(e) => handleNearbyPlaceChange(index, e) }
                            required
                        />
                        <input
                            type="number"
                            name="distance"
                            placeholder="Distance"
                            value={place.distance}
                            onChange={(e) => handleNearbyPlaceChange(index, e) }
                            required
                        />
                        <input
                            type="text"
                            name="place_type"
                            placeholder="Type"
                            value={place.place_type}
                            onChange={(e) => handleNearbyPlaceChange(index, e)}
                            required
                        />
                    </div>
                ))}

                <button type="button" onClick={addNearby}>Add Nearby Place</button>

                <select name="agent" value={selectedAgent} onChange={handleAgentChange} required>
                    <option value="">Select Agent</option>
                    {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                            {agent.username}
                        </option>
                    ))}
                </select>

                <input type="file" multiple onChange={handleImageChange} required/>
                <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>}
            {!userid && <h1>Login To Add Property</h1>}
            {user_type=='agent' && <h1>Only Register User Can List Property Not Agent</h1>}
        </div>
    );
}

export default Add;