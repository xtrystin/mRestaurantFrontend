import React, { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ApplicationPaths, QueryParameterNames } from './AppRoutesConstants'
import authService from '../components/auth/AuthorizeService';

interface AuthorizeRouteProps {
    path: string;
    element: ReactNode;
    allowedRoles: string[];
}

interface AuthorizeRouteState {
    ready: boolean;
    authenticated: boolean;
    authorized: boolean;
}

export default class AuthorizeRoute extends Component<AuthorizeRouteProps, AuthorizeRouteState> {
    private _subscription: number | null = null;

    constructor(props: AuthorizeRouteProps) {
        super(props);

        this.state = {
            ready: false,
            authenticated: false,
            authorized: false,
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.authenticationChanged());
        this.populateAuthenticationState();
    }

    componentWillUnmount() {
        if (this._subscription !== null) {
            authService.unsubscribe(this._subscription);
        }
    }

    render() {
        const { ready, authenticated, authorized } = this.state;
        const link = document.createElement("a");
        link.href = this.props.path;
        const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
        const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
        if (!ready) {
            return <div></div>;
        } else {
            const { element } = this.props;
            return authenticated && authorized? element : <Navigate replace to={redirectUrl} />;
        }
    }

    private async populateAuthenticationState() {
        const authenticated = await authService.isAuthenticated();
        let isAuthorized = false;
        if (this.props.allowedRoles == null || this.props.allowedRoles == undefined)
            isAuthorized = true;
        else {
            for (const role of this.props.allowedRoles) {
                isAuthorized = isAuthorized || (await authService.isInRole(role));
                if (isAuthorized) {
                    break;
                }
            }
        }

        this.setState({ ready: true, authenticated, authorized: isAuthorized });
    }

    private async authenticationChanged() {
        this.setState({ ready: false, authenticated: false, authorized: false });
        await this.populateAuthenticationState();
    }
}