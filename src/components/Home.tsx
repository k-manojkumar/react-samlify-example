import React, { useState, useEffect, ReactNode } from "react";
import { RouteComponentProps } from "react-router";
import { parse } from "query-string";
import axios from "axios";

import "./index.css";

type Props = RouteComponentProps & {};

type Profile = {
  email: string;
};

type SamlOption = {
  encrypted: boolean;
};

const Container = (props: { children: ReactNode }) => {
  return (
    <div className="vh-100 system-sans-serif flex flex-column items-center justify-center">
      {props.children}
    </div>
  );
};

const Button = (props: { children: ReactNode; onClick: Function }) => {
  return (
    <button
      style={{ border: "1px solid #aaa" }}
      className="pa3 bg-transparent ma2 br3 f6 silver-gray outline-0 pointer"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
};

export function Home(props: Props) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>({ email: null });
  const [samlOption, setSamlOption] = useState<SamlOption>({ encrypted: true });

  const parseQuery = () => {
    console.log("--------->>>", samlOption);
    const query = samlOption.encrypted ? "?encrypted=true" : "";
    return query;
  };

  const initRedirectRequest = () => {
    window.location.href = `/sso/redirect`;
  };

  const init = async () => {
    const params = parse(props.location.search);
    console.log(params);
    if (params.auth) {
      setAuthenticated(true);
      setProfile({ email: params.email });
      // remove the auth_token part in
      props.history.replace("/");
    }
    // initial state
  };

  useEffect(() => {
    init();
    return () => null;
  }, []);

  if (!authenticated) {
    return (
      <Container>
        <div className="">
          <Button onClick={() => initRedirectRequest()}>Login</Button>
        </div>
      </Container>
    );
  }
  {
    /** render screen after login in */
  }
  return (
    <Container>
      <div className="flex flex-column">
        <span className="mb3">
          Welcome <b>{profile.email}</b>
        </span>
      </div>
    </Container>
  );
}
