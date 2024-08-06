// src/Member.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './style/MyNFT.css';
import Listing from "./Listing"
import Home from "./Home"

const AppHome = ({members, owners, provider, account, main}) => {
    console.log(members)
    const [toggle, setToggle] = useState(false);
    const [member, setMember] = useState({})
    //console.log(members)
    
    const togglePop = (member) => {
        setMember(member)
        console.log("pop")
        toggle ? setToggle(false) : setToggle(true)
    }
    return (
        <div>
            <div className='cards__section'>
                <h3>Get your memberships</h3>
                <hr />
                <div className='cards'>
                {members.map((member, index)=>(
                    <div className='card' key={index} onClick={()=> togglePop(member)}>
                    <div className='card__image'>
                        <img src={member.image} alt ="Home" />
                    </div>
                    <div className='card__info'>
                        <h4>{member.attributes[0].value} ETH</h4>
                        <p>
                        <strong>{member.attributes[1].value}</strong> 
                        <strong>{member.attributes[2].value}</strong>
                        <strong>{member.attributes[3].value}</strong>
                        </p>
                        <p>Member: {member.address}</p>
                    </div>
                    </div>
                ))}
                
                </div>
            </div>

            {toggle && (
                <Home member={member} provider={provider} account={account} main={main} togglePop={togglePop} />
            )}

        </div>
        
        

    );
};

export default AppHome;
