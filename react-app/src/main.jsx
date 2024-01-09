import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import store from './store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ChakraProvider store={store} >
        <App />
      </ChakraProvider>

  </React.StrictMode>,
)