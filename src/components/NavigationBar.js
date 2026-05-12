import { Container, Nav, Navbar, NavbarBrand } from "react-bootstrap"
const NavigationBar = () =>{
    return (
        <Navbar >
            <Container>
                <NavbarBrand>FURUSATO</NavbarBrand>
                <Nav>
                <Nav.Link>HOME</Nav.Link>
                <Nav.Link>TENTANG</Nav.Link>
                <Nav.Link>MAPS</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavigationBar