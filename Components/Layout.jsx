import { Component } from 'react';
import Meta from '../Components/Meta';
import Footer from './Footer';
import { AuthProvider } from './Context';
import Nav from './Nav';

export default class Layout extends Component {
    render() {
        return (
            <>
                <Meta />
                <AuthProvider>
                    <>
                        <Nav />
                        {this.props.children}
                        <Footer />
                    </>
                </AuthProvider>
            </>
        )
    }
}
