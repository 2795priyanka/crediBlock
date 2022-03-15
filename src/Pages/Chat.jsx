
import React, { useState, useEffect } from 'react'
import UserHeader from './UserHeader'
import { Container, Row, Col, Form, Button, InputGroup, ListGroup, Offcanvas, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import { FaPaperPlane } from 'react-icons/fa';
import { FiSmile } from 'react-icons/fi';
import $ from 'jquery';
import axios from 'axios';


function Chat() {

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [searchData, setSearchData] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [show, setShow] = useState(false);
  const [selectedUserChat, setSelectedUserChat] = useState("");
  const [chats, setChats] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const [chatUserName, setChatUserName] = useState("Username")
  const [userError, setUserError] = useState(null);
  const [response, setResponse] = useState(false);
  const [curTime, setCurTime] = useState("")
  const [timeType, setTimeType] = useState("AM")
  const [showPicker, setShowPicker] = useState(false);

  const loggedInUser = JSON.parse(sessionStorage.getItem("userInfo"));
  console.log("user token", loggedInUser)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let History = useNavigate()
  // const ENDPOINT = "http://3.138.38.80:3113/";

  // useEffect(() => {
  //   const socket = io(ENDPOINT);
  //   socket.on("connect", () => {
  //     setResponse(true);
  //     console.log("connection establish")
  //   });

  // }, []);





  //  ==============get current time function==============
  const getTime = () => {
    var today = new Date()
    var hour = today.getHours(),
      curTime = today.getHours() + ':' + today.getMinutes();
    if (hour > 12) {
      setTimeType("PM")
    }
    setCurTime(curTime);
  };
  // console.log("time", curTime, timeType)
  useEffect(() => {
    getTime();
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
    console.log("userid", userId)

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      await axios.post("http://3.138.38.80:3113/chat/createChat", { userId }, config).then(res => {

        console.log("Selected User Chat id", res.data.Chat)

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
  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };
      console.log("config for fetch users", config)
      await axios.get("http://3.138.38.80:3113/chat/fetchchat", config)
        .then(res => {
          console.log("config for fetch users within api", config)
          console.log("res", res.data)
          console.log("fetch users for chat:", res.data.statusMsg)
          setLoading(false)
          if (res.data.statusCode === 400) {
            History('/chat');
            setChats(null)
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
    fetchUsers();
  }, [show])


  //=============function for fetch  all users chat messages============
  const fetchMessage = async (chatId, username) => {
    console.log("Chat Id selected user ----", chatId, username)
    setSelectedUserChat(chatId);
    username.map((e) => {

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


  //=============function for  send messages============

  const sendMessage = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      };

      const data = await axios.post("http://3.138.38.80:3113/message/sendMessage", {
        content: newMessage,
        chatId: selectedUserChat
      }, config)

      console.log("send Message data:", data.data.content);

      axios.get(`http://3.138.38.80:3113/message/allMessages/${selectedUserChat}`, config).then(xyz => {
        console.log("resssssssss", xyz)
        setUserChat(xyz.data.message)
      }).catch(err => {
        console.log("err", err)
      })
    }
    catch (error) {
      console.log("errror", error)
    }
    setNewMessage("")
    setShowPicker(false);
  }
  const enterText = (event) => {
    if (event.key === 'Enter' || event.charCode === 13) {
      sendMessage()
      setShowPicker(false);
    }
  }

//=============function for emoji icons============
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
    
  };

  return (
    <div>
      <UserHeader />
      <div className="chat_box">
        <Container fluid>
          <Row>
            <Col lg={3} md={3} className="left_chat_box px-0">
              <div className="search_text">
                <p className='text-center' onClick={handleShow}>Search New Users Here <BsArrowLeft /></p>

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
                        {/* ========search data function========= */}
                        {loading ?
                          <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            {/* <h4 className='text-center text-primary'>Loading.....</h4> */}
                            <Spinner animation="border" role="status" variant="primary">
                              <span className="visually-hidden ">Loading...</span>
                            </Spinner>
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


              {/* ========selected user data function========= */}


              {
                loading ? <div>
                  <h3 className='text-center text-info'>Loading....</h3>
                </div> :
                  <div className="user_list px-2">

                    {chats ?
                      <div>
                       
                      {
                      chats.map((chatData, index) => {
                   
                        return (
                          <ListGroup variant="" onClick={() => fetchMessage(chatData._id, chatData.users)} key={index}>
                            <ListGroup.Item>
                              <div>{chatData.users.map((e, i) => {
                                if (loggedInUser.data._id !== e._id) {
                                  return (
                                    <div className="users" key={i}>
                                      <div className='active_user_icon' style={{ display: "none" }}></div>
                                      <div className="user_img">
                                        {/* <Avatar name={e.first_name+" "+e.last_name} maxInitials={2}/> */}
                                        <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" width="45px" />
                                        <span className='name_font'>{e.first_name} {e.last_name}</span>
                                      </div>
                                    </div>
                                  )
                                }
                              })}</div>
                            </ListGroup.Item>
                          </ListGroup>
                        )
                      })
                    }
                      </div>
                      :
                      <div className='row'>
                        <div className='col-md-12'>
                          <h4 className='no-user'>Start Chat on Credi Block</h4>
                        </div>
                      </div>
                    }

                  </div>
              }
            </Col>

            <Col lg={9} md={9} className="right_chat_box px-0">
              {/* ========show chat data function========= */}
              <div>
                {
                  selectedUserChat ?
                    <div className="chat_user_name">
                      <div className="active_user_img p-2">
                        <div className="user_img">
                          <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" width="45px" />
                        </div>
                      </div>
                      <div className="active_user">
                        <p className='chatwith'>Chat with</p>
                        <p className='username'>{chatUserName}</p>
                      </div>
                    </div>
                    :
                    <div className="chat_user_name" style={{ display: "none" }}></div>
                }


                <div className="chat_room">
                  {selectedUserChat ?
                    <div className="chatMsg">
                      {
                        (() => {
                          if (userChat === undefined || userChat === null || userChat === " ") {
                            return (
                              <h4 className='text-center text-warning mt-5'>No recent chat</h4>
                            )
                          } else {
                            return (
                              userChat.map(e => {

                                if (loggedInUser.data._id === e.sender_id) {

                                  return (
                                    <div className="message">
                                      <div className="odd-blurb">
                                        <p>{e.content}</p>

                                      </div>
                                    </div>
                                  )
                                }
                                else {
                                  return (
                                    <div className="message">
                                      <div className="blurb">
                                        <p>{e.content}</p>

                                      </div>
                                    </div>
                                  )
                                }
                              }
                              )
                            )
                          }
                        })()
                      }
                        {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                    </div>
                    :
                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className='chatting_title'> Click on a user to start chatting</div>
                      </div>
                    </div>
                  }

                </div>


                <div className="chat-bar">
                  <Row>
                    <Col lg={12} md={12} sm={12} xs={12} >
                      <div className="msg_ins d-flex">
                        <Form.Control className='' type="text" placeholder="Write new message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={enterText} />
                        <div className="send_msg d-flex">
                          <span className='grin-icon'>

                            <FiSmile onClick={() => setShowPicker(val => !val)} />
                          </span>
                          <Button onClick={sendMessage}><span><FaPaperPlane /></span></Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* <UserFooter /> */}
    </div>
  )
}

export default Chat