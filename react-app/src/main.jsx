import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.jsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux'; // Importez le Provider depuis react-redux
import store from './store.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <ChakraProvider>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </ChakraProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );