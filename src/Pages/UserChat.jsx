import React, { useState, useEffect } from 'react'

import { Row, Col, Form, Button } from 'react-bootstrap'
import { FaPaperPlane } from 'react-icons/fa';
import { FaGrin } from 'react-icons/fa';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';

function UserChat() {
    const { selectedUserChat, setSelectedUserChat, userChat, setUserChat, chatUserName } = ChatState();
    const [newMessage, setNewMessage] = useState("")
    // const [message, setMessage] = useState([])

    const loggedInUser =  JSON.parse(sessionStorage.getItem("userInfo"));
  console.log("user token", loggedInUser)

    console.log("userChat of selected user", userChat)
    console.log("selectedUserChat._id", selectedUserChat)



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
            console.log("send Message data:", data.data.content)
            // message.push(data.data.content)
              await axios.get(`http://3.138.38.80:3113/message/allMessages/${selectedUserChat}`, config).then(xyz => {
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
            console.log("errror", error)
        }
        setNewMessage("")
    }

    const enterText = (event) => {
        if (event.key === 'Enter' || event.charCode === 13) {
            sendMessage()
        }
    }


    useEffect(() => {
        sendMessage()

    }, [])

    
    return (
        <div>
            <div className="frabic_btn">
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

            <div className="chat_room">
               
                <div className="chatMsg">
                    {
                        (() => {
                            if (userChat === undefined || userChat === null || userChat === " ") {
                                return (
                                    <h4 className='text-center text-warning mt-5'>Message not found</h4>
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



                    {/* {message && message.map((e, i) => {
                        if (e === undefined || e === null || e === '') {
                            return (
                               <div className='message' key={i}>
                                   <div className='odd-blurb' style={{display:"none"}}></div>
                               </div>
                            )
                        }else{
                            return (
                                <div className="message" key={i}>
                                    <div className="odd-blurb" >
                                        <p >{e}</p>
                                    </div>
                                </div>
                            ) 
                        }

                    })} */}

                </div>
                
            </div>

          
            <div className="chat-bar">
                <Row>
                    <Col lg={12} md={12} sm={12} xs={12} >
                        <div className="msg_ins d-flex">
                            <Form.Control className='' type="text" placeholder="Write new message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={enterText} />
                            <div className="send_msg d-flex">
                                <span className='grin-icon'>
                                    <FaGrin />
                                </span>
                                <Button onClick={sendMessage}><span><FaPaperPlane /></span></Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default UserChat