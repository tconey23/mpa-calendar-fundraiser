import { useEffect, useState, useLayoutEffect } from 'react';
import { Stack } from '@mui/material';
import logoImg from '../assets/TC192.png'
import TCLogo from './TCLogo';
import { motion } from 'framer-motion';

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
  
    useLayoutEffect(() => {
      const updateWidth = () => setWidth(window.innerWidth);
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, []);
  
    return width;
  };

const TcDevLogo = () => {
    const[isHover, setIsHover] = useState(false)

    const width = useWindowWidth()

    console.log(width)

  return (
    <Stack             
    onMouseOver={() => setIsHover(true)} 
    onMouseOut={() => setIsHover(false)}  
    direction={'row'}
    >
        <motion.a
            target='_blank' href={'https://tomconey.dev/'}
            initial={{position: 'absolute', left: width-120}}
            animate={{left: isHover ? width-260 : width-120}}
            transition={{
                duration: 1,
                ease: 'easeInOut'
            }}
            >
            <img style={{height: '40px'}} src={logoImg}/>
        </motion.a>
        <a target='_blank' href={'https://tomconey.dev/'}>
            <TCLogo isHover={isHover}/>
        </a>
    </Stack>
  );
};

export default TcDevLogo;