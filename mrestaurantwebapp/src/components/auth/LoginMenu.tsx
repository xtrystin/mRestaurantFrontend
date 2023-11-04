import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from '../../router/AppRoutesConstants';

interface LoginMenuState {
    isAuthenticated: boolean;
    userEmail: string | null;
}

export class LoginMenu extends Component<{}, LoginMenuState> {
    private _subscription: number | null = null;

    constructor(props: {}) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userEmail: null
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        if (this._subscription !== null) {
            authService.unsubscribe(this._subscription);
        }
    }

    async populateState() {
        const userEmail = await authService.getUserEmail();
        const isAuthenticated = userEmail !== null;

        this.setState({
            isAuthenticated,
            userEmail
        });
    }

    authenticatedView(userName: string, profilePath: string, logoutPath: string) {
        return (
            <Fragment>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={profilePath}>
                        Hello {userName}
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" onClick={ async () => await authService.logout() }>
                        Logout
                    </NavLink>
                </NavItem>
            </Fragment>
        );
    }

    anonymousView(registerPath: string, loginPath: string) {
        return (
            <Fragment>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={registerPath}>
                        Register
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={loginPath}>
                        Login
                    </NavLink>
                </NavItem>
            </Fragment>
        );
    }

    render() {
        const { isAuthenticated, userEmail } = this.state;

        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        }
        else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = `${ApplicationPaths.LogOut}`;
            return this.authenticatedView(userEmail || '', profilePath, logoutPath);
        }
    }
}
