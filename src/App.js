import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import Mint from './abis/Mint.json' //RealEstate
import Main from './abis/Main.json' //Escrow

// Config
import config from './config.json';
import { toHaveErrorMessage } from '@testing-library/jest-dom/dist/matchers';





function App() {
  const [provider, setProvider] = useState(null)
  const [main, setMain] = useState(null)
  const [account, setAccount] = useState(null)
  const [members, setMembers] = useState([])
  const [member, setMember] = useState({})
  const [toggle, setToggle] = useState(false);

  //Connection to the ethereum
  const loadBlockchainData = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    //Different blockchain will have different network (For this application, check config.json)
    const network = await provider.getNetwork()
    
    
    //loading the two contracts
    const mint = new ethers.Contract(config[network.chainId].mint.address, Mint, provider)
    const totalSupply = await mint.totalSupply()
    //how many avaliable
    console.log(totalSupply.toString())
    const members = []

    for (var i = 1; i <= totalSupply; i++){
      const uri = await mint.tokenURI(i)
      const owner = await mint.ownerOf(i)
      console.log(owner)
      console.log(uri)
      const response = await fetch(uri)
      //console.log(response)
      const metadata = await response.json()
      members.push(metadata)
    }

    setMembers(members)
    

    const main = new ethers.Contract(config[network.chainId].main.address, Main, provider)
    setMain(main)

    

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const togglePop = (member) => {
    console.log(member)
    setMember(member)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      {/*  <Search />  */}
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
}

export default App;
