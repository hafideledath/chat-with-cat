import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  text-align: center;
  padding: 20px;
  background-color: #6f4e37;
  color: #fff;
  border-top: 3px dashed #000;
  position: relative;
  z-index: 1;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>© 2025 Language Cafe - Learn languages with a playful scribble style!</p>
    </FooterContainer>
  );
};

export default Footer;
