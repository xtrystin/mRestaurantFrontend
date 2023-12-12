import React, { Component } from 'react';
import Products from './products/Products';
import PolProducts from './polproducts/PolProducts';
import Pracownicy from './Pracownicy/Pracownicy';
import Storages from './Storages/Storages';
import authService from './auth/AuthorizeService';


export class Home extends Component {
    static displayName = Home.name;
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

    render() {
        const { isAuthenticated, userEmail } = this.state;

        if (isAuthenticated) {
            return (
                <div>
                    <h2>Hello {isAuthenticated ? userEmail : ""}</h2>
                    <p>Today is {new Date().toLocaleString() + ""}</p>
                    <h4>Products</h4>
                    <Products /><br />
                    <h4>Semi Products</h4>
                    <PolProducts /><br />
                </div>
            );
        }
        else {
            return (
                <div>
                    <h2>Hello</h2>
                    <p>Today is {new Date().toLocaleString() + ""}</p>
                    <p>Please log in to access sensitive data</p>
                </div>
            );
        }

    }
}
