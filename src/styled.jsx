import styled, { keyframes } from 'styled-components';

export const Select = styled.select`
  text-align-last: center;
  text-align: center;
  color: black;
  border: none;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  -webkit-appearance: button;
  appearance: button;
  width: 253px;
`;
export const BorderItem = styled.div`
  border: 3px solid #fff;
  border-radius: 5%;
`;
export const LayoutItem = styled.div`
  display: flex;
  justify-content: center;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;
export const Header = styled.header`
  background-color: rgba(21, 0, 155, 0.75);
  color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Footer = styled.footer`
  background-color: rgba(21, 0, 155, 0.75);
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
export const ButtonKeyframes = keyframes`
  0% {
    background-color: red;
    left: 0px;
    top: 0px;
  }
  25% {
    background-color: yellow;
    left: 200px;
    top: 0px;
  }
  50% {
    background-color: blue;
    left: 200px;
    top: 200px;
  }
  75% {
    background-color: green;
    left: 0px;
    top: 200px;
  }
  100% {
    background-color: red;
    left: 0px;
    top: 0px;
  }
`;

export const Button = styled.button`
  color: black;
  background: white;
  outline: none;
  width: 253px;
  animation: ${ButtonKeyframes} 10s linear infinite;
  ${({ active }) => active
    && `
  color: black;
  background: black;
  animation: unset;
  `}
`;

export const Input = styled.input`
  text-align: center;
  margin-top: 5%;
  width: 250px;
`;
