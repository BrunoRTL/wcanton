import React from "react";
import { PendingActivitiesPageProps } from "../PendingActivities/PendingActivities";
import { useGetAssetInviteRequests } from "../../ledgerHooks/ledgerHooks";
import { PendingAccountInviteRow } from "../PendingAccountInviteRow/PendingAccountInviteRow";
import { TransactionTypesTitles } from "../PendingTxPreview/PendingTxPreview";

export const PendingAccountInvites: React.FC<PendingActivitiesPageProps> = (
  props
) => {
  const { isInbound } = props;
  const {  contracts } = useGetAssetInviteRequests(isInbound);

  const accountInviteRows = contracts.map((contract) => {
    const { symbol, issuer, fungible, reference, 
      } = contract.payload.account.assetType;

     
    const { owner, airdroppable, resharable, bondData} = contract.payload.account;

    const receiver = contract.payload.recipient;
    const accountInviteCid = contract.contractId;
    const sender = contract.signatories[0];
    const pendingAccountInviteRowProps = {
      symbol,
      issuer,
      isFungible: fungible,
      reference: reference as string,
      isInbound,
      owner,
      isAirdroppable: airdroppable,
      isShareable: resharable,
      receiver,
      isNarrow: true,
      accountInviteCid,
      sender,
     price: contract.payload.account.bondData.price,
     interestRate: contract.payload.account.bondData.interestRate,
     amountIssued: contract.payload.account.bondData.amountIssued,
     duration: contract.payload.account.bondData.duration,
     bondIssuer: contract.payload.account.bondData.bondIssuer,
     //"interestRate", `${interestRate}`],
     // ["amountIssued", `${amountIssued}`],
     // ["duration", `${duration}`],
     // ["bondIssuer", `${bondIssuer}`]
      transactionType: 'accountInvite' as keyof TransactionTypesTitles
    };

    return (
      <PendingAccountInviteRow
        key={accountInviteCid}
        {...pendingAccountInviteRowProps}
      />
    );
  });

  if (contracts.length === 0) {
    return null;
  }

  return <>{accountInviteRows}</>;
};
