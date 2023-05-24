import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RowChip } from "../RowChip/RowChip";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Avatar, Box, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import { isMobile } from "../../platform/platform";
import { useGetMyOwnedAssetsByAssetType } from "../../ledgerHooks/ledgerHooks";
import { numberWithCommas } from "../../utils/numberWithCommas";
import { getAssetSum } from "../../utils/getAssetSum";
import { useCustomAdminParty } from "../../hooks/useCustomAdminParty";
import { createParams } from "../../utils/createParams";
import PodcastsIcon from '@mui/icons-material/Podcasts';
import SendIcon from '@mui/icons-material/Send';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ReceiptIcon from '@mui/icons-material/Receipt';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  quantity: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  buttonText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  textContainer: {
    overflow: 'hidden', 
    whiteSpace: 'nowrap',
    maxWidth: '200px'
  }
}));

interface AssetAccountRowProps {
  symbol: string;
  quantity?: number;
  isIssuer?: boolean;
  issuer: string;
  owner: string;
  isShareable?: boolean;
  isFungible?: boolean;
  isAirdroppable?: boolean;
  contractId: string;
  reference: string | null;
}

export const AssetAccountRow: React.FC<AssetAccountRowProps> = React.memo(({
  reference, contractId, isFungible, issuer, symbol, owner, isShareable, isAirdroppable,
}) => {
  const classes = useStyles();
  const admin = useCustomAdminParty();
  const { loading, contracts } = useGetMyOwnedAssetsByAssetType({
    issuer,
    symbol,
    isFungible: !!isFungible,
    owner,
    reference,
  });
  const params = {issuer, symbol, isFungible, isShareable, isAirdroppable, owner, contractId, reference}
  const paramsString = createParams(params)
  const assetProfilePath = `/asset${paramsString}`;
  const sendPath = `/send${paramsString}`;
  const swapPath = `/swap${paramsString}`;
  const airdropRequestPath = `/airdrop-request${paramsString}`;
  const assetInvitePath = `/invite${paramsString}`;
  const issueAirdropPath = `/issue${paramsString}`;
  const transactionPath= `/transactionstoken${paramsString}`;
  const assetSum = getAssetSum(contracts);
  const formattedSum = numberWithCommas(assetSum);
  return (
    <>
      <Card sx={{ marginBottom: 1 }}>
        <CardActionArea component={Link} to={assetProfilePath} sx={{backgroundColor: "#EFE6FD"}}>
          <CardContent className={classes.root}>
            <Avatar sx={{ marginRight: 1}}>{symbol[0]}</Avatar>
            <div className={classes.textContainer}>
              <Typography 
                sx={{ fontSize: 14, 
                      marginRight: 1, 
                      fontWeight: "500", 
                      textOverflow: 'ellipsis' }} 
                      color="text.primary"
              >
                {symbol}

              </Typography>
              {!loading && (
                <Typography
                  className={classes.quantity}
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                >
                  {formattedSum}

                </Typography>
              )}
            </div>
              <Box marginLeft={"auto"} display="flex" alignItems="center">
              {issuer === owner && (
                <RowChip requestType={"issuer"} label="Issuer"/>
              )}

              {!isMobile() && issuer === owner && (
                <Button
                  sx={{ marginRight: 1 , color: "white", backgroundColor:"#5900D9"}}
                  size="small"
                  component={Link}
                  to={issueAirdropPath}
                >
                  <PodcastsIcon/>
                </Button>
              )}

              {!isMobile() && issuer === admin && symbol === "ET" && (
                <Button
                  sx={{ marginRight: 1,color: "white", backgroundColor:"#5900D9" }}
                  size="small"
                  component={Link}
                  to={airdropRequestPath}
                >
                  <PodcastsIcon/>
                </Button>
              )}

              {!isMobile() && (
                <Button
                  sx={{ marginRight: 1, color: "white", backgroundColor:"#5900D9" }}
                  component={Link}
                  to={sendPath}       
                  size="small"
                >
                  <SendIcon/>
                </Button>
              )}

              {!isMobile() && (
                <Button
                  sx={{ marginRight: 1, color: "white", backgroundColor:"#5900D9" }}
                  component={Link}
                  to={swapPath}
                  size="small"
                >
                  <SwapHorizIcon/>
                </Button>
              )}

              {!isMobile() && (
                <Button
                  className={classes.buttonText}
                  sx={{ marginRight: 1, color: "white", backgroundColor:"#5900D9" }}
                  component={Link}
                  to={assetInvitePath}
                  size="small"
                >
                  <PersonAddAlt1Icon/>
                </Button>
              )}

              {!isMobile() && (
                <Button
                  className={classes.buttonText}
                  sx={{ marginRight: 1, color: "white", backgroundColor:"#5900D9" }}
                  component={Link}
                  to={transactionPath}
                  size="small"
                >
                  <ReceiptIcon/>
                </Button>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
})