import React, { useState } from 'react';
import './style/Event.css';

const Register = ({ onClose, onRegister, myNFT , membership}) => {
    var isValid = false
    console.log(membership)
    
    if(myNFT[0].attributes[2].value === membership){
        isValid = true
    }
    else{
        isValid = false
    }
    return (
        <div className="popup">
        <div className="popup-content">
            <h2>Join Event</h2>
            <h4>You Have</h4>
            <div >
            {myNFT.map((member, index)=>(
                <div className='card_BOX' key={index} >
                <div className='card__BOXinfo'>
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
                {isValid ? (
                    <div>
                        <p>Would you like to register for this event?</p>
                        <div className="popup-buttons">
                            <button className="popup-button" onClick={onRegister}>Register</button>
                            <button className="popup-button" onClick={onClose}>Close</button>
                        </div>
                        <p className="valid-message">You are valid to join</p>
                    </div>  
                ) : (
                    <div>
                        <p className="invalid-message">You don't have the required membership</p>
                        <button className="popup-button" onClick={onClose}>Close</button>
                    </div>
                )}
            
        </div>
        </div>
    );
    };

export default Register;
