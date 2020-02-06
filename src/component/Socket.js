import React ,{Component} from 'react';
import ReactDOM from 'react-dom';

export default class Socket extends Component{
    constructor(){
        super();
        this.websocket=null;
        this.state={message:""}
    }


    connection=()=>{

        let sid=this.sid.value;
        if("WebSocket" in window){
            this.websocket=new WebSocket("ws://localhost:9000/websocket/"+sid)
            this.websocket.onopen=()=>{
                this.setState({message:"创建连接"})
            }

            this.websocket.onmessage=(event)=>{
                this.setState({message:event.data})
            }

            this.websocket.onerror=()=>{
                this.setState({message:"连接异常"})
            }

            window.onbeforeunload=()=>{
                if(this.websocket!=null){

                    this.websocket.close();
                }
            }
        }else{
            console.log("浏览器不支持websocket")
        }

    }

    sendMessage=()=>{
        var message="{'to':'"+this.to.value+"','message':'"+this.message.value+"'}";
        this.websocket.send(message);

    }


    render() {
        console.log(this.props)
        return(
            <div>
                <div><input type="text" ref={val=>this.sid=val}/><button onClick={this.connection}>连接</button></div>
                <div>内容接受者:<input type="text" ref={val=>this.to=val}/></div>
                <div>发送内容:<input type="text" ref={val=>this.message=val}/><button onClick={this.sendMessage}>发送</button></div>
                <div>{this.state.message}</div>

            </div>
        )
    }
}
