import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './auth/AuthorizeService';
import { ApplicationPaths } from '../../router/AppRoutesConstants';


export class Profile extends Component {
    private _subscription: number | null = null;

    constructor(props: {}) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userEmail: null,
            role: null,
            id: null
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
        const role = await authService.getUserRole();
        const id = await authService.getUserId();

        this.setState({
            isAuthenticated,
            userEmail,
            role,
            id
        });
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <label for="Province" class="col-sm-2 col-form-label">User Email</label>
                    <div className="col-sm-10">
                        <p className="form-control-plaintext" id="Province">{ this.state.userEmail }</p>
                    </div>
                </div>
                <div className="row">
                    <label for="Province" class="col-sm-2 col-form-label">User Role</label>
                    <div className="col-sm-10">
                        <p className="form-control-plaintext" id="Province">{ this.state.role }</p>
                    </div>
                </div>
                <div className="row">
                    <label for="Province" class="col-sm-2 col-form-label">User Id</label>
                    <div className="col-sm-10">
                        <p className="form-control-plaintext" id="Province">{ this.state.id }</p>
                    </div>
                </div>
            </div>
        );
    }
}
