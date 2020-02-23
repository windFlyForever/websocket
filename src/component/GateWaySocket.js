import React, {Component} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


export default class GateWaySocket extends Component {
    constructor() {
        super();
        this.state = {
            message: [],
            connectInfo: ""
        };
        this.stompClient = null;
        this.messages = [];
    }

    connection = () => {
        //gateway地址+websocket服务地址http://localhost:9000/websocket+/websocket
        var socket = new SockJS("http://localhost:9000/websocket/websocket");
        this.stompClient = Stomp.over(socket)
        console.log(this.stompClient)

        var fromUser = this.fromUser.value;
        var thisComponent = this;
        this.stompClient.connect({}, function (frame) {//连接WebSocket服务端
            console.log('Connected:' + frame);
            thisComponent.stompClient.subscribe("/user/" + fromUser + "/message", function (response) {
                var data = JSON.parse(response.body);
                console.log(data.content);
                thisComponent.messages.push(data.fromUser + ":" + data.content);
                thisComponent.setState({message: thisComponent.messages})
            });
        });

    }

    sendMessage = () => {
        if (Object.keys(this.stompClient).length === 0 || !this.stompClient.connected) {
            this.setState({connectInfo: "socket未连接成功，请重新连接"});
            return;
        }

        var fromUser = this.fromUser.value
        var toUser = this.toUser.value
        var content = this.content.value
        this.stompClient.send("/message", {}, JSON.stringify({
            fromUser: fromUser,
            toUser: toUser,
            content: content
        }));
        this.messages.push(fromUser + ":" + content);
        this.content.value = "";
        this.setState({message: this.messages})
    }

    disconnect = () => {
        if (Object.keys(this.stompClient).length !== 0 && this.stompClient.connected) {
            this.stompClient.disconnect();
            console.log(this.stompClient)
            this.setState({connectInfo: "连接断开"})
        }
    }


    render() {

        return (
            <div>
                <div>发送人:<input type="text" ref={val => this.fromUser = val}/></div>
                <div>
                    <div>
                        <button onClick={this.connection}>连接</button>
                        <button onClick={this.disconnect}>断开连接</button>
                    </div>

                    <div>{this.state.connectInfo}</div>
                </div>

                <div>接收人:<input type="text" ref={val => this.toUser = val}/></div>
                <div>发送内容:<input type="text" ref={val => this.content = val}/>
                    <button onClick={this.sendMessage}>发送</button>
                </div>
                <div>{this.state.message.map((item, index) => (<p key={index}>{item}</p>)
                )}</div>

            </div>
        )
    }
}
