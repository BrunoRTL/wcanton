import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import {
  useGetMyAssetAccountByKey,
  useGetAssetTransferByContractId,
  useLedgerHooks,
} from "../ledgerHooks/ledgerHooks";
import { AssetDetails } from "../components/AssetDetails/AssetDetails";
import { AssetTransfer } from "@daml.js/Asset-0.0.1/lib/Asset";
import { ContractId } from "@daml/types";

import { useGetUrlParams } from "../hooks/useGetAllUrlParams";
import { usePageStyles } from "./AssetProfilePage";
import { PageWrapper } from "../components/PageWrapper/PageWrapper";
import { AcceptRejectCancel } from "../components/AcceptRejectCancel/AcceptRejectCancel";

export const PendingSendDetailsPage: React.FC = () => {
  const params = useGetUrlParams();
  const contractId = params.contractId as string;
  const recipient = params.receiver as string;
  const symbol = params.symbol as string;
  
  const amount = params.amount as string;
  const issuer = params.issuer as string;
  const sender = params.sender as string;
  const isFungible = params.isFungible as boolean;
  const reference = params.reference as string | null;
  const owner = params.owner as string;
  const isInbound = params.isInbound as boolean;
  const price = params.price as string;
  const interestRate = params.interestRate as string;
  const amountIssued = params.amountIssued as string;
  const duration = params.duration as string;
  const bondIssuer = params.bondIssuer as string;
  const nav = useNavigate();

  //TODO: can we use something else besdies contract
  const assetTransferResponse = useGetAssetTransferByContractId({
    contractId: contractId as ContractId<AssetTransfer>,
  });
  
  const assetTransferCid = assetTransferResponse.contract?.contractId;
 // pending-transfer?//sender=custodian_party::122096768771da06e1f28014687c7bef2ff878cf4199f0731686d2992c17281f9940&receiver=investor_party::1220b89bcce068632c232a79075fbfe9487d8fdd05780dd4eae17b5048feb01f35e3&amount=50.0&symbol=Bond%20RTL&issuer=custodian_party::122096768771da06e1f28014687c7bef2ff878cf4199f0731686d2992c17281f9940&contractId=00c1cd37f4f64c1330691fcd1c4d5acd68a435c38617497f95a02b0ef81458234fca011220750b4627a6e28abd4fbe930940dff8748f8df1dba523ec7c602547f64680a75b&templateName=send&isFungible=true&reference=null&owner=custodian_party::122096768771da06e1f28014687c7bef2ff878cf4199f0731686d2992c17281f9940&isInbound=false&bondIssuer=issuer_party::12207f57d78832e9f8676e4b501fe40a04d97bfc6f07c7d139827f2a7cfb9b9237d2&interestRate=0.05&amountIssued=500.0&duration=1%20year&price=185.0
  const assetAccountResponse = useGetMyAssetAccountByKey({
    
   issuer,
    symbol,
    fungible: isFungible,
    reference,
    price, 
    interestRate, 
    amountIssued, 
    duration, 
    bondIssuer,
});

 console.log(issuer,
  symbol,
  isFungible,
  reference,
  price, 
  interestRate, 
  amountIssued, 
  duration, 
  bondIssuer,)

  const assetAccountCid = assetAccountResponse?.contract?.contractId;
  //const assetAccountCid = assetTransferResponse;
  console.log("TEST2 "+assetAccountResponse)

  const classes = usePageStyles();
  const ledgerHooks = useLedgerHooks();
 
  const onBack = () => {
    nav(-1);
  };

  if (!assetTransferCid) {
    return (
      <Card sx={{ width: "100%", margin: 1 }}>
        <CardContent>
          Contract doesn't exist anymore
          <Button
            onClick={onBack}
            size={"small"}
            sx={{ marginLeft: 1 }}
            variant="outlined"
          >
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const cancelChoice = () =>
    ledgerHooks.exerciseAssetTransferChoice(assetTransferCid, "cancel");
  const rejectChoice = () =>
    ledgerHooks.exerciseAssetTransferChoice(assetTransferCid, "reject");
  const acceptChoice = assetAccountCid ? () => 
    ledgerHooks.acceptAssetTransfer(assetAccountCid, assetTransferCid) : undefined

  return (
    <PageWrapper
      title={isInbound ? "Inbound Send Request" : "Outbound Send Request"}
    >
      <Card variant="outlined" className={classes.card}>
        <CardContent className={classes.cardContent}>
          <div className={classes.fromContainer}>
            <Typography className={classes.from} variant="caption">
              {isInbound ? "From:" : "To:"}
            </Typography>
            <Typography
              variant="caption"
              color="primary"
              sx={{ wordBreak: "break-all" }}
            >
              {isInbound ? sender : recipient}
            </Typography>
          </div>
          <Avatar className={classes.avatar}>{symbol?.[0] || "U"}</Avatar>
          <div className={classes.tickerAmount}>
            <Typography sx={{ marginRight: 1 }}>{amount || 0}</Typography>
            <Typography>{symbol || "[TickerName]"}</Typography>
          </div>
          <AssetDetails
            reference={reference}
            issuer={issuer}
            owner={owner}
            isFungible={isFungible}
            quantity={amount}
            symbol={symbol || "[Ticker]"}
            price = {price}
            interestRate = {interestRate}
            amountIssued = {amountIssued}
            duration = {duration} 
            bondIssuer= {bondIssuer}
          />
        </CardContent>

        {!assetAccountCid && (
          <Card sx={{ margin: 1, maxWidth: "500px" }}>
            <CardContent>
              You do not have an Asset Holding Account for this asset. Please
              ask the sender of this asset to invite you as an asset holder.
            </CardContent>
          </Card>
        )}
        {assetAccountCid && <AcceptRejectCancel
          rejectChoice={rejectChoice}
          acceptChoice={acceptChoice}
          cancelChoice={cancelChoice}
        />}
      </Card>
    </PageWrapper>
  );
};
