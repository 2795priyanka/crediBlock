import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, InputGroup, ListGroup, Offcanvas } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import { ChatState } from '../context/ChatProvider';
import $ from 'jquery';
import axios from 'axios';
// import Avatar from 'react-avatar';

function UserList() {
  const { chats, setChats, setSelectedUserChat, setUserChat, setChatUserName } = ChatState();
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [searchData, setSearchData] = useState([])
  const [show, setShow] = useState(false);
  const [userError, setUserError] = useState(null);

  const loggedInUser = JSON.parse(sessionStorage.getItem("userInfo"));
  console.log("user token of user list component", loggedInUser)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let History = useNavigate()


  // =========function for serach all user=======
  const handleSearch = async () => {

    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      const { data } = await axios.get(`http://3.138.38.80:3113/userslist?search=${search}`, config);
      setLoading(false)
      console.log("get all users data", data)

      setSearchData(data.data);

      if (data.statusCode === 400) {
        setUserError(data.statusMsj);
      }
      if (data.statusCode === 200) {
        setUserError(null);
      }

    } catch (error) {
      console.log("Search errror", error)
     
    }
    setSearch("")
  };
  const onKeyUp = (event) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      handleSearch();
    }
  }

  // =========function for create chat of all user=========
  const createChat = async (userId) => {
    console.log("useridddddd", userId)

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      await axios.post("http://3.138.38.80:3113/chat/createChat", { userId }, config).then(res => {

        console.log("Selected User Chat idddddd", res.data.Chat)

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
  const fetchUsers = ()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      axios.get("http://3.138.38.80:3113/chat/fetchchat", config)
        .then(res => {
          console.log("res", res.data)
          console.log("fetch users for chat:", res.data.statusMsg)
          setLoading(false)
          if (res.data.statusCode === 400) {
            History('/chat');
          } else {
            console.log("123");
            setChats(res.data.statusMsg);

          }

        })
        .catch(error => {
          console.log("error", error)
        })

    }
    catch (error) {
      console.log("fecth api", error)
    }
  }

  useEffect(() => {
    setTimeout(()=>{
      fetchUsers();
    },500)
   }, [show])

  // console.log("fetch users for chat", chats)

  //=============function for fetch  all users chat messages============
  const fetchMessage = async (chatId, username) => {
    console.log("Chat Id selected user ----", chatId, username)
    setSelectedUserChat(chatId);
    username.map((e, i) => {

      if (loggedInUser.data._id !== e._id) {
        setChatUserName(e.first_name + ' ' + e.last_name)
      }

    });
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      console.log("config for fetching user chat", config)

      await axios.get(`http://3.138.38.80:3113/message/allMessages/${chatId}`, config).then(xyz => {
        console.log("chat msg res", xyz)
        setUserChat(xyz.data.message)
      }).catch(err => {
        console.log("chat msg err", err)
      })

    }
    catch (error) {
      console.log("error while fetching user chat ", error)
    }


  }

  useEffect(() => {
    fetchMessage();
  }, [])

  return (
    <>

      <div className="search_text">
        <p className='text-center' onClick={handleShow}>Search New Users Here <BsArrowLeft/></p>
        
        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row>
              <Col lg={12} md={12}>
                <h6 className='title_head'>Search users for create chat</h6>
              </Col>
              <Col lg={12} md={12}>
                <InputGroup className="p-3 searchDiv">
                  <Form.Control type="text" placeholder="Search..." className='search_bar validate' value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={onKeyUp} />
                  <Button variant="primary" size="md" active onClick={handleSearch}>
                    <FaSearch />
                  </Button>
                </InputGroup><br></br>
              {userError && <h5 className='error text-center'>User not found</h5>}
              </Col>


              <Col lg={12} md={12}>

                {loading ?
                  <div>
                    <h4 className='text-center text-primary'>Loading.....</h4>
                  </div>
                  :
                  <>
                  <div className="user_list p-2 ">
                    {searchData && searchData.map((e, i) => {
                      return (
                        <ListGroup variant="" key={i}>
                          <ListGroup.Item >
                            <div className="users" onClick={() => createChat(e._id)}>
                              <div className="user_img">
                                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" width="45px" /><span>{e.first_name} {e.last_name}</span>
                              </div>
                              
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      )
                    })}

                  </div>
                   
                    </>
                }</Col>
            </Row>

          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <div className="search">
        {/* <InputGroup className="p-3 searchDiv">
          <Form.Control type="text" placeholder="Search..." className='search_bar validate'  />
          <Button variant="primary" size="md" active >
            <FaSearch />
          </Button>

        </InputGroup> */}
    </div>




      {
        loading ? <div>
          <h3 className='text-center text-info'>Loading.....</h3>
        </div> :
          <div className="user_list px-2">
            {chats && chats.map((chatData, index) => {
              return (
                <ListGroup variant="" onClick={() => fetchMessage(chatData._id, chatData.users)} key={index}>
                  <ListGroup.Item key={index}>
                    <div>{chatData.users.map((e, i) => {
                      if (loggedInUser.data._id !== e._id) {
                        return (
                          <div className="users" key={i}>
                            <div className='active_user_icon' style={{display:"none"}}></div>
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