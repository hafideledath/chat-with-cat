import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #6f4e37; /* Coffee brown */
  color: #fff;
  border-bottom: 3px solid #000;
  border-style: dashed;
  z-index: 1;
  position: relative;
`;

const Logo = styled.h1`
  font-size: 1.8em;
  font-weight: bold;
  margin: 0;
  padding: 0;
  color: #fff;
  text-shadow: 2px 2px 0 #000;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.2em;
  padding: 5px 15px;
  border: 2px solid #fff;
  border-radius: 20px;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    background-color: #fff;
    color: #6f4e37;
    transform: scale(1.05);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>☕ Language Cafe</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/learn">Learn</NavLink>
        <NavLink to="/practice">Practice</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
