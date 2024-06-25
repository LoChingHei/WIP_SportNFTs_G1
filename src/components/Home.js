import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ member, provider, account, main, togglePop }) => {
    const [hasBought, setHasBought] = useState(false)
    const [hasLended, setHasLended] = useState(false)
    const [hasInspected, setHasInspected] = useState(false)
    const [hasSold, setHasSold] = useState(false)

    const [buyer, setBuyer] = useState(null)
    const [lender, setLender] = useState(null)
    const [inspector, setInspector] = useState(null)
    const [seller, setSeller] = useState(null)

    const [owner, setOwner] = useState(null)

    const fetchDetails = async () => {
        // -- Buyer

        const buyer = await main.buyer(member.id)
        setBuyer(buyer)

        const hasBought = await main.approval(member.id, buyer)
        setHasBought(hasBought)

        // -- Seller

        const seller = await main.seller()
        setSeller(seller)

        const hasSold = await main.approval(member.id, seller)
        setHasSold(hasSold)


        // -- Inspector

        const inspector = await main.inspector()
        setInspector(inspector)

        const hasInspected = await main.inspectionPassed(member.id)
        setHasInspected(hasInspected)
    }

    const fetchOwner = async () => {
        if (await main.isListed(member.id)) return

        const owner = await main.buyer(member.id)
        setOwner(owner)
    }

    const buyHandler = async () => {
        console.log(member.id)
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

    const inspectHandler = async () => {
        const signer = await provider.getSigner()

        // Inspector updates status
        const transaction = await main.connect(signer).updateInspectionStatus(member.id, true)
        await transaction.wait()

        setHasInspected(true)
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

                    {owner ? (
                        <div className='home__owned'>
                            Owned by {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                        </div>
                    ) : (
                        <div>
                            {(account === inspector) ? (
                                <button className='home__buy' onClick={inspectHandler} disabled={hasInspected}>
                                    Approve Inspection
                                </button>
                            ) : (account === seller) ? (
                                <button className='home__buy' onClick={sellHandler} disabled={hasSold}>
                                    Approve & Sell
                                </button>
                            ) : (
                                <button className='home__buy' onClick={buyHandler} disabled={hasBought}>
                                    Buy
                                </button>
                            )}

                            <button className='home__contact'>
                                Contact agent
                            </button>
                        </div>
                    )}

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

export default Home;