import React, {Component} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


export default class GateWaySocket extends Component {
    constructor() {
        super();
        this.state = {message: []};
        this.stompClient = null;
        this.messages = [];
    }

    connection = () => {
        var socket = new SockJS("http://localhost:9010/websocket");
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
        if (this.stompClient != null) {
            this.stompClient.disconnect();
        }
    }


    render() {

        return (
            <div>
                <div>发送人:<input type="text" ref={val => this.fromUser = val}/></div>
                <div>
                    <button onClick={this.connection}>连接</button>
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
