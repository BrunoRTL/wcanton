import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { InviteNewAssetOwnerForm } from "../components/InviteNewAssetOwnerForm/InviteNewAssetOwnerForm";
import { usePageStyles } from "./AssetProfilePage";
import { enableFabBack } from "./IssueAirdropPage";
import { FloatingBackButton } from "../components/FloatingBackButton/FloatingBackButton";
import { isMobile } from "../platform/platform";
import {
  useGetUrlParams,
} from "../hooks/useGetAllUrlParams";
export const AccountInvitePage: React.FC = () => {
  const nav = useNavigate();
  const classes = usePageStyles();
  const params = useGetUrlParams();
  const reference = params.reference as string | null; 
  const issuer = params.issuer as string;
  const symbol =  params.symbol as string;
  const owner = params.owner as string
  const isFungible = params.isFungible as boolean;

  const price = params.price as string;
  const amountIssued = params.amountIssued as string;
  const duration = params.duration as string;
  const bondIssuer = params.bondIssuer as string;
  const interestRate = params.interestRate as string;
  const onBack = () => {
    nav(-1);
  };

  return (
    <div className={classes.root}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          margin={1}
          width="100%"
          flexDirection="row"
          display="flex"
          alignItems="center"
          justifyContent="start"
        >
          <Box position="absolute">
            <IconButton color="primary" onClick={onBack}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
          <Box flexGrow="1" textAlign="center">
            <Typography
              color="primary"
              variant="h5"
              sx={{ flexGrow: 1, marginLeft: "auto" }}
            >
              Invite
            </Typography>
          </Box>
        </Box>
        <Card variant="outlined" className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Avatar className={classes.avatar}>
              {symbol?.[0] || "undefined"}
            </Avatar>
            <Typography>{symbol}</Typography>
            <InviteNewAssetOwnerForm
              owner={owner}
              issuer={issuer}
              symbol={symbol}
              fungible={isFungible}
              reference={reference}
               price ={price}
 amountIssued = {amountIssued}
  duration = {duration}
 bondIssuer = {bondIssuer}
 interestRate ={interestRate}
            />
          </CardContent>
        </Card>
      </Box>
      {enableFabBack && isMobile() && <FloatingBackButton />}
    </div>
  );
};
