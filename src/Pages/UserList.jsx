import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, InputGroup, ListGroup, Offcanvas } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa';
import { ChatState } from '../context/ChatProvider';
import $ from 'jquery';
import axios from 'axios';
// import Avatar from 'react-avatar';

function UserList() {
  const { users, chats, setChats, setSelectedUserChat, setUserChat, setChatUserName } = ChatState();
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [searchData, setSearchData] = useState([])

  const [loggedUser, setLoggedUser] = useState();
  // const [arr, setArr] = useState([])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // console.log("users", users.accessToken);
  useEffect(() => {

    // $("#userError").hide()
  }, [])

  $(".validate").focus(function () {
    $("#userError").hide()


  })
  // =========function for serach all user=======
  const handleSearch = async () => {
    
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      };

      const { data } = await axios.get(`http://3.138.38.80:3113/userslist?search=${search}`, config);
      setLoading(false)
      console.log("get all users data", data)

      setSearchData(data.data);

      if (data.statusCode === 400) {
        $("#userError").show()
      }

    } catch (error) {
      console.log("errror", error)

    }

  };
  const onKeyUp = (event) => {
    if (event.key === 'Enter' || event.charCode === 13) { 
      handleSearch()
    }
} 

  // =========function for create chat of all user=========
  const createChat = async (userId) => {
    console.log("useridddddd", userId)

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${users.accessToken}`,
        },
      };

      await axios.post("http://3.138.38.80:3113/chat/createChat", { userId }, config).then(res => {
        console.log("res", res.data.Chat)

        // setSelectedUserChat(res.data.Chat);
        console.log("usersetSelectedUserChatidddddd", res.data.Chat)

      }).catch(err => {
        console.log("err", err)
      })
    }

    catch (error) {
      console.log("error", error)
    }
    setShow(false)
  }

  // ==========function for fetch all user=======

  useEffect(() => {
   
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // console.log("user info ", userInfo)
    setLoggedUser(userInfo);
    // console.log("logged user ", loggedUser)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      // console.log("headers ", config)

      axios.get("http://3.138.38.80:3113/chat/fetchchat", config)
        .then(res => {
          console.log("res", res.data)
          console.log("fetch users for chat:", res.data.statusMsg)
          setLoading(false)
          setChats(res.data.statusMsg);
        })
        .catch(error => {
          console.log("error", error)
        })

    }
    catch (error) {
      console.log("fecth api", error)
    }

  }, [show])

  // console.log("fetch users for chat", chats)

  //=============function for fetch  all users chat============
  const selectedUser = async (userId, username) => {
    console.log("Chat Id selected user ----", userId, username)
    setSelectedUserChat(userId);
    username.map((e, i) => {

      if (loggedUser.data._id !== e._id) {
        setChatUserName(e.first_name + ' ' + e.last_name)
      }

    });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${users.accessToken}`,
        },
      };

      console.log("config for fetching user chat", config)

    await  axios.get(`http://3.138.38.80:3113/message/allMessages/${userId}`, config).then(xyz => {
        console.log("resssssssss", xyz)
        if (xyz.data.message === 400) {
          alert('message not found')
        }
        setUserChat(xyz.data.message)
      }).catch(err => {
        console.log("err", err)
      })

    }
    catch (error) {
      console.log("error while fetching user chat ", error)
    }


  }

  useEffect(() => {
    selectedUser();
  }, [])


  return (
    <>
      {/* <p className='text-center'>Search New Users</p> */}
      <div className="search">
        <InputGroup className="p-3 searchDiv">
          <Form.Control type="text" placeholder="Search..." className='search_bar validate' onClick={handleShow} />
          <Button variant="primary" size="md" active onClick={handleSearch}>
            <FaSearch />
          </Button>

        </InputGroup>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Search users for create chat</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row>
              <Col lg={12} md={12}>
                <InputGroup className="p-3 searchDiv">
                  <Form.Control type="text" placeholder="Search..." className='search_bar validate' value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={onKeyUp} />
                  <Button variant="primary" size="md" active onClick={handleSearch}>
                    <FaSearch />
                  </Button>
                </InputGroup><br></br>
                <h5 className='error text-center' style={{ display: 'none' }} id="userError">User not found !</h5>
              </Col>


              <Col lg={12} md={12}>

                {loading ?
                  <div>
                    <h4 className='text-center text-primary'>Loading.....</h4>
                  </div>
                  :
                  <div className="user_list p-2">
                    {searchData && searchData.map((e, i) => {
                      return (
                        <ListGroup variant="" key={i}>
                          <ListGroup.Item >
                            <div className="users" onClick={() => createChat(e._id)}>
                              <div className="user_img">
                                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" width="45px" /><span>{e.first_name} {e.last_name}</span>
                              </div>
                              <div className="time">
                                <p>3 min </p>
                              </div>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      )
                    })}

                  </div>

                }</Col>
            </Row>

          </Offcanvas.Body>
        </Offcanvas>


      </div>




      {
        loading ? <div>
          <h3 className='text-center text-info'>Loading.....</h3>
        </div> :
          <div className="user_list px-2">
            {chats && chats.map((chatData, index) => {
              return (
                <ListGroup variant="" onClick={() => selectedUser(chatData._id, chatData.users)} key={index}>
                  <ListGroup.Item key={index}>
                    <div>{chatData.users.map((e, i) => {
                      if (loggedUser.data._id !== e._id) {
                        return (
                          <div className="users" key={i}>
                            <div className="user_img">
                              {/* <Avatar name={e.first_name+" "+e.last_name} maxInitials={2}/> */}
                              <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" width="45px" />
                              <span>{e.first_name} {e.last_name}</span>
                            </div>
                          </div>
                        )
                      }
                    })}</div>
                  </ListGroup.Item>
                </ListGroup>
              )
            })}
          </div>
      }






    </>
  )
}

export default UserList