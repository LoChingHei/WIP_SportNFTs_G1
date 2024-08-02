import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import RealEstate from '../abis/RealEstate.json';
import config from '../config.json';

const Mint = ({ provider, account }) => {
  const [image, setImage] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    number: '',
  });
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const loadNetwork = async () => {
      const network = await provider.getNetwork();
      setNetwork(network);
    };

    if (provider) {
      loadNetwork();
    }
  }, [provider]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [name]: value,
    }));
  };

  const uploadToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const res = await axios.post(url, data, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: '1a92dae90a80ec3aab0a',
        pinata_secret_api_key: '210432d783295b7514d910e47e93b9695fb48328943fa868ada4858b555d2321',
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const handleMint = async () => {
    try {
      const imageUrl = await uploadToPinata(image);

      const tokenMetadata = {
        ...metadata,
        image: imageUrl,
      };

      const metadataBlob = new Blob([JSON.stringify(tokenMetadata)], {
        type: 'application/json',
      });
      const metadataFile = new File([metadataBlob], 'metadata.json');

      const metadataUrl = await uploadToPinata(metadataFile);

      console.log(metadataUrl);

      if (!network) {
        throw new Error('Network not loaded');
      }

      const networkConfig = config[network.chainId];
      if (!networkConfig) {
        throw new Error(`No configuration found for network ${network.chainId}`);
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        networkConfig.realEstate.address,
        RealEstate.abi,
        signer
      );

      const transaction = await contract.mint(metadataUrl);
      await transaction.wait();
      alert('Minting successful!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Minting failed. Please try again.');
    }
  };

  return (
    <div className="mint">
      <h2>Mint Your NFT</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={metadata.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={metadata.description}
        onChange={handleChange}
      />
      <input
        type="text"
        name="number"
        placeholder="Number in Collection"
        value={metadata.number}
        onChange={handleChange}
      />
      <button onClick={handleMint}>Mint NFT</button>
    </div>
  );
};

export default Mint;
