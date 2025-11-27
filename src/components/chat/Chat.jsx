import { useState } from 'react';
import './chat.css'
import EmojiPicker from 'emoji-picker-react';

export default function Chat() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmojiClick = (emoji) => {
        setMessage(message + emoji.emoji);
        setShowEmojiPicker(false);
    }

    return (
        <div className="chat">
            <div className='top'>
                <div className='userInfo'>
                    <img src="./avatar.png" alt="" />
                    <span>John Doe</span>
                </div>
                <div className='icons'>
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

            <div className='center'>
                <div className='messages'>
                    <img src="./avatar.png" alt="" />
                    <div className='text'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
                        </p>
                        <span>12:00</span>
                    </div>
                </div>
                <div className='messages'>
                    <img src="./avatar.png" alt="" />
                    <div className='text'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
                        </p>
                        <span>12:00</span>
                    </div>
                </div>
                <div className='messages own'>
                    <div className='text'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
                        </p>
                        <span>12:00</span>
                    </div>
                </div>
                <div className='messages own'>
                    <div className='text'>
                        <img src="./avatar.png" alt="" />
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                            quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam.
                        </p>
                        <span>12:00</span>
                    </div>
                </div>
            </div>

            <div className='bottom'>
                <div className='icons'>
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder='Type your message here...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className='emoji'>
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    <div className='emojiPicker'>
                        <EmojiPicker
                            open={showEmojiPicker}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
                <button className='sendButton'>Send</button>
            </div>
        </div>
    )
}