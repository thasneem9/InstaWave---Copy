import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//for the  themes: 
import { ChakraProvider } from '@chakra-ui/react'
import {mode} from '@chakra-ui/theme-tools'
import {extendTheme} from '@chakra-ui/theme-utils'
import { ColorModeScript } from '@chakra-ui/react'
import {BrowserRouter} from  'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'


//THEMES START

const styles={
  global:(props)=>({
    body:{
      color:mode('gray.800','whiteAlpha.900')(props),
      bg:mode('gray.100','#101010')(props),

    }
  })
};

const config={
  initialColorMode:"dark",
  useSystemColorMode:true
}

const colors={
  gray:{
    light:"#616161",
    dark:"#1e1e1e"
  }
}
const theme= extendTheme({config,styles,colors});


//THEMES END--also pass it before the app,along with mode


ReactDOM.createRoot(document.getElementById('root')).render(
 <RecoilRoot>
  <BrowserRouter> {/* To use all components tht comes with the react-roer-dom */}
   <ChakraProvider theme={theme}>    {/* pass theme */}
   <ColorModeScript initialColorMode={theme.config.initialColorMode} />
   <SocketContextProvider>
     <App />
     </SocketContextProvider>
   </ChakraProvider>
  </BrowserRouter>
  </RecoilRoot>




);
