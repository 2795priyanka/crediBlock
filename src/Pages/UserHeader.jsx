import React from 'react'
import { Container, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap'

import { FaBell, FaChevronDown } from 'react-icons/fa';
function UserHeader() {


    return (
        <div>
            <Container fluid>
                <Row>
                    <Col lg={12} className="px-0">
                        <div className="Userheader">
                            
                            <Navbar collapseOnSelect expand="lg" >
                            <Container fluid>
                            <Navbar.Brand href="#">Credi<b>Block</b></Navbar.Brand>
                                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <Nav className="justify-content-end w-100">
                                        <Nav.Link href="#features">View All Brokers</Nav.Link>
                                        <Nav.Link href="#pricing">View on Frabrik</Nav.Link>
                                       
                                    </Nav>
                                 
                                    <Nav.Link href="#"><span className='notification'><FaBell /></span></Nav.Link>
                                        <Nav.Link eventKey={2} href="#memes" className='d-flex'>
                                            <div className="user_img">
                                                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" />
                                            </div>
                                            <NavDropdown title="Username" id="basic-nav-dropdown">
                                            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>

                                            <NavDropdown.Divider />
                                            <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                                        </NavDropdown>
                                        </Nav.Link>
                                
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        </div>
                  
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserHeader