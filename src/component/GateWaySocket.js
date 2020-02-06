import React, {Component} from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default class GateWaySocket extends Component {
    constructor() {
        super();
        this.state = {message: ""};
        this.stompClient=null;
    }

    connection = () => {
        var socket = new SockJS("http://localhost:9010/websocket");

        this.stompClient = Stomp.over(socket)
        console.log(this.stompClient)
        this.stompClient.connect({}, function (frame) {
            console.log("connected: " + frame);
            this.stompClient.subscribe('/topic', function (response) {
                this.setState({message: response.body})
            })
        });
    }

    sendMessage = () => {
        var message = "{'to':'" + this.to.value + "','message':'" + this.message.value + "'}";
        this.stompClient.send("/chat", {}, message);

    }


    render() {
        console.log(this.props)
        return (
            <div>
                <div><input type="text" ref={val => this.sid = val}/>
                    <button onClick={this.connection}>连接</button>
                </div>
                <div>内容接受者:<input type="text" ref={val => this.to = val}/></div>
                <div>发送内容:<input type="text" ref={val => this.message = val}/>
                    <button onClick={this.sendMessage}>发送</button>
                </div>
                <div>{this.state.message}</div>

            </div>
        )
    }
}
