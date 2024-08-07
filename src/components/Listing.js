import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Listing = ({ member, provider, account, main, togglePop, mint }) => {
    const [hasBought, setHasBought] = useState(false)
    const [hasSold, setHasSold] = useState(false)

    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)

    const [owner, setOwner] = useState(null)

    const fetchDetails = async () => {


    }

    const fetchOwner = async () => {
        if (await main.isListed(member.id)) return

        const owner = await main.buyer(member.id)
        setOwner(owner)
    }

    const buyHandler = async () => {
        //console.log(member.id)
        const depositAmount = await main.depositAmount(member.id)
        
        
        const signer = await provider.getSigner()
        
        // Buyer deposit depositEarnest
        let transaction = await main.connect(signer).depositEarnest(member.id, { value: depositAmount })
        await transaction.wait()

        // Buyer approves...
        transaction = await main.connect(signer).approveSale(member.id)
        await transaction.wait()

        setHasBought(true)
    }



    const sellHandler = async () => {
        const signer = await provider.getSigner()

        // Seller approves...
        let transaction = await main.connect(signer).approveSale(member.id)
        await transaction.wait()

        // Seller finalize...
        transaction = await main.connect(signer).finalizeSale(member.id)
        await transaction.wait()

        setHasSold(true)
    }
    const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }

    const listHandler = async () => {
        const signer = await provider.getSigner()
        let transaction = await mint.connect(signer).approve(main.address, member.id)
        await transaction.wait()

        transaction = await main.connect(signer).list(member.id, tokens(0.01), tokens(0.01))
        await transaction.wait()
        //let transaction = await main.connect(signer).list(member.id, tokens(0.01), tokens(0.01))
        //await transaction.wait()
    }

    useEffect(() => {
        fetchDetails()
        fetchOwner()
    }, [hasSold])

    return (
        <div className="member">
            <div className='home__details'>
                <div className="home__image">
                    <img src={member.image} alt="member" />
                </div>
                <div className="home__overview">
                    <h1>{member.name}</h1>
                    <p>
                        <strong>{member.attributes[1].value}</strong> 
                        <strong>{member.attributes[2].value}</strong> 
                        <strong>{member.attributes[3].value}</strong> 
                    </p>
                    <p>{member.address}</p>

                    <h2>{member.attributes[0].value} ETH</h2>
                    <div>
                        <button className='home__buy' onClick={listHandler} disabled={hasSold}>
                            List
                        </button>
                    </div>

                    <hr />

                    <h2>Overview</h2>

                    <p>
                        {member.description}
                    </p>

                    <hr />

                    <h2>Facts and features</h2>

                    <ul>
                        {member.attributes.map((attribute, index) => (
                            <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                        ))}
                    </ul>
                </div>


                <button onClick={togglePop} className="home__close">
                    <img src={close} alt="Close" />
                </button>
            </div>
        </div >
    );
}

export default Listing;