// src/Member.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './style/MyNFT.css';
import Listing from "./Listing"

const MyNFT = ({myNFT, members, provider, account, main, mint}) => {
  const [toggle, setToggle] = useState(false);
  const [member, setMember] = useState({})
  //console.log(members)
  
  const togglePop = (member) => {
    setMember(member)
    console.log("pop")
    toggle ? setToggle(false) : setToggle(true)
  }
  return (
    <div className="container">
      <h1 className="MyNFT_Title">This is your member</h1>
      <div>
        {(myNFT.length < 1) ? (
          <p className="MyNFT_P">You don't have a membership</p>
        ) : (myNFT.length === 1) ? (
          <p className="MyNFT_P">You have a basic membership</p>
        ) : (myNFT.length === 2) ? (
          <p className="MyNFT_P">You have a standard membership</p>
        ) : (
          <p className="MyNFT_P">You have a premium membership</p>
        )}
      </div>
      <div className='cards'>
          {myNFT.map((member, index)=>(
            <div className='card' key={index} onClick={()=> togglePop(member)}>
              <div className='card__image'>
                <img src={member.image} alt ="Home" />
              </div>
              <div className='card__info'>
                <h4>{member.attributes[0].value} ETH</h4>
                <p>
                  <strong>{member.attributes[1].value} </strong>
                  <strong>{member.attributes[2].value} </strong> 
                  <strong>{member.attributes[3].value} </strong> <br></br>

                </p>
                <p>Member: {member.address}</p>
              </div>
            </div>
          ))}
        </div>
        {toggle && (
          <Listing member={member} provider={provider} account={account} main={main} togglePop={togglePop} mint={mint} />
      )}
    </div>
    

  );
};

export default MyNFT;
