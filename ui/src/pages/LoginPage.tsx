// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from "react";
import Credentials, { PublicParty } from "../Credentials";
import Ledger from "@daml/ledger";
import {
  DamlHubLogin as DamlHubLoginBtn,
  usePublicParty,
} from "@daml/hub-react";
import { authConfig, Insecure } from "../config";
import { Avatar, Box, TextField, Button } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { isDesktop } from "../platform/platform";

export const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

type Props = {
  onLogin: (credentials: Credentials) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
    width: "100%",
    height: "70vh",
    "& #daml-hub-login": {
      display: "flex",
      flexDirection: "column",
    },
    "& #log-in-with-token": {
      display: "flex",
      flexDirection: "column",
    },
  },
  localLogin: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    marginBottom: theme.spacing(2),
  },
  usernameTextField: {
    marginBottom: theme.spacing(1),
  },
  avatar: {
    marginBottom: theme.spacing(1),
  },
}));

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const classes = useStyles();
  const [useToken, setUseToken] = React.useState(false);
  const toggleUseToken = () => {
    setUseToken(!useToken);
  };
  const login = useCallback(
    async (credentials: Credentials) => {
      onLogin(credentials);
    },
    [onLogin]
  );

  const wrap: (c: JSX.Element) => JSX.Element = (component) => (
    <div className={classes.root}>
      <div className={classes.localLogin}>
        <Avatar className={classes.avatar} />
        <Box sx={{ marginBottom: 1 }} />
        {component}
      </div>
    </div>
  );

  const InsecureLogin: React.FC<{ auth: Insecure }> = ({ auth }) => {
    const [username, setUsername] = React.useState("");

    const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      const token = auth.makeToken(username);
      const ledger = new Ledger({ token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2RhbWwuY29tL2p3dC9hdWQvcGFydGljaXBhbnQvbGlnaHQ6OjEyMjBhNjhlOWE3NjEyZTQ4NmYyNTgzZGQ4ZWI3YmJkOWUxZTg3YTQ1ZjgwMTY3MGYzYmZkMDhmMjU1OGFlNWI3NGQ5Iiwic3ViIjoiY3VzdG9kaWFuX3VzZXIifQ.n-MhdlSTnizRcY22W0jLR80nVAtbcBQPLbD7z6fZ87Ttdf5-j3u30Dcpj8MFByU2BKqlj_b5b1djtfBtG9X_U8f96CvtpsJ7gmrpRdRdahS8kEVL_KlUFP7B4QCuQmC8BRToKwZ2M0FD58sgK0HrW3WURIiRZQ44zUcZEI_VhaG50X27M6bS5hSqV2Qo8x68ZVAHaKLyQ3qvuE1p5Gf9PUEFb8T_mDAIBhp-RuV3ytdlZ7kaEP7DnIKSos3LIeu1vnjxaEjiI3aFxVOw88oxxde-yyD9W_mL8Nv4Ya9H09tJZeSQ4cm_xAv0IIcGslAm-dAk6P4t1pbOVrJjw3JzIA"});
      const primaryParty: string = await auth.userManagement
        .primaryParty(username, ledger)
        .catch((error) => {
          const errorMsg =
            error instanceof Error ? error.toString() : JSON.stringify(error);
          alert(`Failed to login as '${username}':\n${errorMsg}`);
          throw error;
        });

      const useGetPublicParty = (): PublicParty => {
        const [publicParty, setPublicParty] =
          React.useState<string | undefined>(undefined);
        const setup = () => {
          const fn = async () => {
            const publicParty = await auth.userManagement
              .publicParty(username, ledger)
              .catch((error) => {
                const errorMsg =
                  error instanceof Error
                    ? error.toString()
                    : JSON.stringify(error);
                alert(
                  `Failed to find primary party for user '${username}':\n${errorMsg}`
                );
                throw error;
              });
            // todo stop yolowing error handling
            setPublicParty(publicParty);
          };
          fn();
        };
        return { usePublicParty: () => publicParty, setup: setup };
      };
      await login({
        user: { userId: username, primaryParty: primaryParty },
        party: primaryParty,
        token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2RhbWwuY29tL2p3dC9hdWQvcGFydGljaXBhbnQvbGlnaHQ6OjEyMjBhNjhlOWE3NjEyZTQ4NmYyNTgzZGQ4ZWI3YmJkOWUxZTg3YTQ1ZjgwMTY3MGYzYmZkMDhmMjU1OGFlNWI3NGQ5Iiwic3ViIjoiY3VzdG9kaWFuX3VzZXIifQ.n-MhdlSTnizRcY22W0jLR80nVAtbcBQPLbD7z6fZ87Ttdf5-j3u30Dcpj8MFByU2BKqlj_b5b1djtfBtG9X_U8f96CvtpsJ7gmrpRdRdahS8kEVL_KlUFP7B4QCuQmC8BRToKwZ2M0FD58sgK0HrW3WURIiRZQ44zUcZEI_VhaG50X27M6bS5hSqV2Qo8x68ZVAHaKLyQ3qvuE1p5Gf9PUEFb8T_mDAIBhp-RuV3ytdlZ7kaEP7DnIKSos3LIeu1vnjxaEjiI3aFxVOw88oxxde-yyD9W_mL8Nv4Ya9H09tJZeSQ4cm_xAv0IIcGslAm-dAk6P4t1pbOVrJjw3JzIA",
        getPublicParty: useGetPublicParty,
      });
    };

    return wrap(
      <>
        {/* FORM_BEGIN */}
        <TextField
          fullWidth
          placeholder="Username"
          value={username}
          size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("etner");
              return handleLogin(e);
            }
          }}
          autoComplete="off"
          onChange={(e) => setUsername(e.currentTarget.value)}
          sx={{ marginBottom: 1 }}
        />
        <Button fullWidth variant="contained" onClick={handleLogin}>
          Log in to wallet
        </Button>
        <Button  onClick={() => openInNewTab('https://myinteractive.video/w/fgbRdGusDeoo')} sx={{ mt: 2 }} variant="outlined" size="small">
          Watch Walkthrough Video
        </Button>
        {/* FORM_END */}
      </>
    );
  };
  const DamlHubLogin: React.FC = () =>
    wrap(
      <>
        <DamlHubLoginBtn
          withButton
          withToken={useToken}
          onLogin={(creds) => {
            if (creds) {
              login({
                party: creds.party,
                user: { userId: creds.partyName, primaryParty: creds.party },
                token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2RhbWwuY29tL2p3dC9hdWQvcGFydGljaXBhbnQvbGlnaHQ6OjEyMjBhNjhlOWE3NjEyZTQ4NmYyNTgzZGQ4ZWI3YmJkOWUxZTg3YTQ1ZjgwMTY3MGYzYmZkMDhmMjU1OGFlNWI3NGQ5Iiwic3ViIjoiY3VzdG9kaWFuX3VzZXIifQ.n-MhdlSTnizRcY22W0jLR80nVAtbcBQPLbD7z6fZ87Ttdf5-j3u30Dcpj8MFByU2BKqlj_b5b1djtfBtG9X_U8f96CvtpsJ7gmrpRdRdahS8kEVL_KlUFP7B4QCuQmC8BRToKwZ2M0FD58sgK0HrW3WURIiRZQ44zUcZEI_VhaG50X27M6bS5hSqV2Qo8x68ZVAHaKLyQ3qvuE1p5Gf9PUEFb8T_mDAIBhp-RuV3ytdlZ7kaEP7DnIKSos3LIeu1vnjxaEjiI3aFxVOw88oxxde-yyD9W_mL8Nv4Ya9H09tJZeSQ4cm_xAv0IIcGslAm-dAk6P4t1pbOVrJjw3JzIA",
                getPublicParty: () => ({
                  usePublicParty: () => usePublicParty(),
                  setup: () => {},
                }),
              });
            }
          }}
          options={{
            method: {
              button: {
                text: "Log Into Wallet",
                render: () => (
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    // fullWidth={true}
                    size={isDesktop() ? "small" : "large"}
                  ></Button>
                ),
              },
            },
          }}
        />
        {isDesktop() && (
          <Button
            fullWidth
            sx={{ mt: 1 }}
            size="small"
            onClick={toggleUseToken}
          >
            {useToken ? "Hide" : "Login with Token"}
          </Button>
        )}
        <Button  onClick={() => openInNewTab('https://myinteractive.video/w/fgbRdGusDeoo')} sx={{ mt: 2 }} variant="outlined" size="small">
          Watch Walkthrough Video
        </Button>
      </>
    );

  return authConfig.provider === "none" ? (
    <Box>
      <InsecureLogin auth={authConfig} />
    </Box>
  ) : authConfig.provider === "daml-hub" ? (
    <Box>
      <DamlHubLogin />
    </Box>
  ) : (
    <div>Invalid configuation.</div>
  );
};
