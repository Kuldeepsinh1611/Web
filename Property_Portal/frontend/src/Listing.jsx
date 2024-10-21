import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { MapPin, Search, BedDouble, Car, ChartArea } from "lucide-react";
import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from "axios";
import './CSS/Search.css'

const customicon=new L.icon({
    iconUrl:MapPin,
    iconSize:[24,24],
    iconAnchor:[12,24],
    popupAnchor:[0,-32],
})

function Listing() {

    const [filter, setFilter] = useState({ bed: '', price: '', parking: '', search: '', type: '' });
    const [homes, setHomes] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8000/property/details')
            .then((result) => {
                console.log(result);
                setHomes(result.data)
            }).catch((err) => {
                console.log(err);
            });
    }, [])

    // const home = [
    //     { img: img1, price: 2000000, address: '1234 Oak Street, Anytown, USA 12345', data: { bed: '4', parking: '2', sqft: '2500', type: 'mansion' } },
    //     { img: img2, price: 2750000, address: '5678 Maple avenue, Othertown,USA 67890', data: { bed: '3', parking: '1', sqft: '1800', type: 'simple' } },
    //     { img: img3, price: 2250000, address: '9012 Willow Drive,Thistown,USA 34567', data: { bed: '5', parking: '3', sqft: '3500', type: 'villa' } },
    //     { img: img4, price: 3400000, address: '1111 Pine Street, Anytown, USA 12345', data: { bed: '2', parking: '1', sqft: '1200', type: 'simple' } },
    //     { img: img5, price: 4150000, address: '2222 Cedar Avenue, Othertown, USA 67890', data: { bed: '4', parking: '2', sqft: '2800', type: 'mansion' } },
    //     { img: img6, price: 2500000, address: '3456 Laurel Drive, Thistown, USA 34567', data: { bed: '3', parking: '2', sqft: '2000', type: 'villa' } },
    //     { img: img7, price: 5000000, address: '7890 River Road, Anytown, USA 12344', data: { bed: '5', parking: '3', sqft: '3800', type: 'simple' } },
    //     { img: img8, price: 1500000, address: '4567 Sage Street, Othertown, USA 67890', data: { bed: '2', parking: '1', sqft: '1500', type: 'villa' } },
    // ];

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const filteredHomes = homes.filter(home => {
        return (
            (home.is_verified)&&(home.is_available)&&
            (filter.bed === '' || home.bedroom === parseInt(filter.bed)) &&
            (filter.price === '' || home.price <= parseInt(filter.price)) &&
            (filter.parking === '' || home.parking === parseInt(filter.parking)) &&
            (filter.type === '' || home.property_type === filter.type) &&
            (filter.search === '' || home.address.toLowerCase().includes(filter.search.toLowerCase())|| home.title.toLowerCase().includes(filter.search.toLowerCase()) )
        );
    });

    return (
        <>
            <div style={{ display: "flex", marginTop: '16px' }} className="listing">
                <div className="search">
                    <div className="searchbar">
                        <input type="text" placeholder="Search Property Address" name="search" value={filter.search} onChange={handleFilterChange} />
                        <div><Search /></div>
                    </div>

                    <div className="filter">
                        <select name="bed" value={filter.bed} onChange={handleFilterChange}>
                            <option value="">Bedroom</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>

                        <select name="price" value={filter.price} onChange={handleFilterChange}>
                            <option value="">Price</option>
                            <option value="12000000">12000000</option>
                            <option value="14000000">14000000</option>
                            <option value="16000000">16000000</option>
                            <option value="18000000">18000000</option>
                            <option value="20000000">20000000</option>
                        </select>

                        <select name="parking" value={filter.parking} onChange={handleFilterChange}>
                            <option value="">Parking</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>

                        <select name="type" value={filter.type} onChange={handleFilterChange}>
                            <option value="">Type</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                        </select>
                    </div>

                    <div className="list">
                        {
                            filteredHomes.map((home) => {
                                console.log(home.pk);
                                return (
                                    <Link to={`/property/${home.pk}`}>
                                        <div className="listitem">
                                            <div className="itempic">
                                                <img src={`http://localhost:8000${home.images[0].image}`} alt="" />
                                            </div>

                                            <div className="itempl">
                                                <h1>{home.title}</h1>
                                                <h2>₹{home.price}</h2>
                                                <p><MapPin size={16} />- {home.address}</p>
                                            </div>

                                            <div className="itemdata">
                                                <div><BedDouble size={16} />{home.bedroom}</div>
                                                <div><Car size={16} />{home.parking}</div>
                                                <div><ChartArea size={16} />{home.area}</div>
                                            </div>
                                        </div>
                                        </Link>
                                );
                            })
                        }
                    </div>
                </div>

                <div className="map">
                    <MapContainer center={[51.505,-0.09]} zoom={13} style={{height:'100%',width:'100%'}}>
                        <TileLayer url="https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy;<a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>contributors"/>
                            
                               {
                                filteredHomes.map((home) => (
                                    <Marker key={home.id} position={[home.lat,home.log]} icon={customicon}>
                                        <Popup>
                                            {home.title}<br></br>
                                            {home.price}
                                        </Popup>
                                    </Marker>
                                ))
                               }
                    </MapContainer>
                </div>
            </div>
        </>
    );
}

export default Listing;