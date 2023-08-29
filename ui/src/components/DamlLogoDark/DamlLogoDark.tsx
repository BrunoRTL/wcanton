import { Icon } from '@mui/material';
import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import DarkDamlLogo from '../../daml-logo-dark.svg'
import rtlogo from '../../logoRT.png'
const useStyles = makeStyles((theme: Theme) => ({
  image: {
    height: "100%", 
    width: '100%', 
    marginRight: theme.spacing(1)
  }, 
  root: {
    marginRight: theme.spacing(-1),
    width: "200px",
    height: '60px',
    
  }
}))
export const DamlLogoDark: React.FC = () => {
  const classes = useStyles();
  return (
    <Icon className={classes.root}>
      <img alt='daml'  className={classes.image} src={rtlogo} />
    </Icon>

  )
}
