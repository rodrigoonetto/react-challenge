import React from 'react';
import './App.css';
import Header from './components/Header/Header'

import Main from './components/Main/Main'
import { Container } from 'reactstrap';


export default function App() {

  return (

    <Container id="main-container">

      <Header />

      <Main />

    </Container>

  )
}