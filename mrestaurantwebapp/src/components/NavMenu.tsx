import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { LoginMenu } from './auth/LoginMenu'

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3 bg-primary text-white" light>
                    <NavbarBrand tag={Link} to="/" className='text-white'>mRestaurant</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2"/>
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/counter">Counter</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/fetch-data">Fetch data</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/products">Products</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/polproducts">Semi Products</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/storages">Storages</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/pracownicy">Pracownicy</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/dostawa">Dostawa</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/straty">Straty</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/sales">Sales</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-white" to="/inwentarz">Inwentarz</NavLink>
                            </NavItem>
                            <LoginMenu />
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
