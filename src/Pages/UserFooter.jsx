import React from 'react'
import { Container, Row, Col} from 'react-bootstrap'
function UserFooter() {
  return (
    <div>
        <Container fluid>
                <Row>
                    <Col lg={12} className="px-0">
                    <div className="Userfooter">
                    <p className='p-2 text-center'>CrediBlock Inc. | All Rights Reserved -  Designed and Developed by <a href="#ffgfd" target="_blank">JARBLY LLC</a></p>
                        </div>
                    </Col>
                </Row>
            </Container>
    </div>
  )
}

export default UserFooter