// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css'; // You can create and style this CSS file

const teamMembers = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    description: 'John is the mastermind behind the technical architecture.',
    image: 'path.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'Frontend Developer',
    description: 'Jane makes sure our UI/UX is top-notch.',
    image: 'path.jpg',
  },
  {
    name: 'Mike Johnson',
    role: 'Backend Developer',
    description: 'Mike ensures the server-side logic is robust.',
    image: 'path.jpg',
  },
  {
    name: 'Emily Davis',
    role: 'Smart Contract Developer',
    description: 'Emily writes the smart contracts that power our app.',
    image: 'path.jpg',
  },
];

const AboutUs = () => {
  return (
    <div className="about-us">
      <h2>About Us</h2>
      <p>We are a team of dedicated developers working together to build an innovative NFT marketplace.</p>
      <div className="team">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <img src={member.image} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
