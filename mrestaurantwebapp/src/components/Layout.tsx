import React, { ReactNode } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

interface LayoutProps {
    children?: ReactNode;
}

class Layout extends React.PureComponent<LayoutProps> {
    public render() {
        return (
            <React.Fragment>
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
            </React.Fragment>
        );
    }
}

export default Layout;
