import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Box, IconButton } from "@mui/material";
import { isMobile } from "../../platform/platform";
import { DamlLogoDark } from "../DamlLogoDark/DamlLogoDark";
import { PartyIdChip } from "../PartyIdChip/PartyIdChip";
import { SideMenuMobile } from "../SideMenuMobile.tsx/SideMenuMobile";
import { SideMenu } from "../SideMenu/SideMenu";
import { SideDrawerWrapper } from "../../SideDrawerWrapper/SideDrawerWrapper";
import { GettingStartedMessage } from "../GettingStartedMessage/GettingStarted";
import { Fab } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { WelcomeMessage } from "../WelcomeMessage/WelcomeMessage";
import { useLocation } from "react-router-dom";
export const demoPartyId =
  "DEMO-ledger-party-03568cfb-dc57-4c54-90d6-7db79f0e3dc2";
interface TopAppBarProps {
  onLogout: () => void;
  party?: string;
  alias?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ party, onLogout, alias }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isRightOpen, setRightOpen] = React.useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!isOpen);
  };

  const toggleRightDrawer = () => {
    setRightOpen(!isRightOpen);
  };
  const location = useLocation();
  console.log(location.pathname);
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 , backgroundColor:"white"}}
      >
        <Toolbar>
          {!isMobile() && <DamlLogoDark />}
          {party && isMobile() && (
            <IconButton onClick={toggleDrawer}>
              {isOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          )}
          {isMobile() && <DamlLogoDark />}
          {!isMobile() && (
           <Box sx={{display:"flex"}}>
          

          
            {location.pathname == "/" ? 
            <Typography variant="h6" noWrap component="div" sx={{ mt: 0.5, color:"black",marginLeft:"25px", float:"right"}}>
             My Asset Accounts
            </Typography>
              :location.pathname =="/pending"?
            <Typography variant="h6" noWrap component="div" sx={{ mt: 0.5, color:"black",marginLeft:"25px", float:"right"}}>
             Pending Activities
            </Typography>

            :location.pathname =="/create"?
            <Typography variant="h6" noWrap component="div" sx={{ mt: 0.5, color:"black",marginLeft:"25px", float:"right"}}>
             Create
            </Typography>

            :location.pathname == "/transactions"?
            <Typography variant="h6" noWrap component="div" sx={{ mt: 0.5, color:"black",marginLeft:"25px", float:"right"}}>
             Transaction History
            </Typography>
            :null
          }

          
    
            </Box>
              )}

          {party && <PartyIdChip party={party} onLogout={onLogout} alias = {alias}/>}
        </Toolbar>
      </AppBar>
      {party &&
        (isMobile() ? (
          <SideMenuMobile
            isOpen={isOpen}
            handleDrawerClose={toggleDrawer}
            handleDrawerOpen={toggleDrawer}
          />
        ) : (
          <SideMenu isRightOpen={true} toggleRightOpen={() => {}} />
        ))}
      {isMobile() && (
        <SideDrawerWrapper
          isOpen={!!party && isRightOpen}
          anchor="right"
          handleDrawerClose={toggleRightDrawer}
        >
          {party && (
            <div>
              <WelcomeMessage />
              <GettingStartedMessage />
            </div>
          )}
        </SideDrawerWrapper>
      )}
      {isMobile() && party && (
        <Fab
          onClick={toggleRightDrawer}
          sx={{ zIndex: 999, position: "fixed", bottom: 20, right: 30 }}
        >
          <QuestionMarkIcon color="info" />
        </Fab>
      )}
    </>
  );
};
