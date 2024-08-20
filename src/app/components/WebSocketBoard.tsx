'use client';

import React, {useEffect, useState} from "react";
import {Button, Divider, Input, Textarea} from "@nextui-org/react";

export interface WsAddress {
  ip1: string,
  ip2: string,
  ip3: string,
  ip4: string,
  port: number
}

const WebSocketBoard: React.FC = () => {
  const [getMessage, setGetMessage] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket>();
  const [isConnect, setIsConnect] = useState(false);
  const [wsAddress, setWsAddress] = useState<WsAddress>({
    ip1: '192',
    ip2: '168',
    ip3: '0',
    ip4: '1',
    port: 8000
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, []);

  const connectSocket = () => {
    try {
      if (wsAddress.ip1 === '' || wsAddress.ip2 === '' || wsAddress.ip3 === '' || wsAddress.ip4 === '') {
        setErrorMessage('未输入完整的Ip地址');
        return;
      }
      setErrorMessage('');
      setSocket(null);
      const ws = new WebSocket(`ws://${wsAddress.ip1}.${wsAddress.ip2}.${wsAddress.ip3}.${wsAddress.ip4}:${wsAddress.port}`);

      ws.onopen = () => {
        console.log('Connected to server');
        ws.send('Hello Server');
        setIsConnect(true);
        setErrorMessage('');
      };

      ws.onmessage = (event) => {
        console.log('Received: ', event.data);
        setGetMessage(getMessage + '>> ' + event.data + '\r');
      };

      ws.onclose = () => {
        console.log('Disconnected from server');
        setErrorMessage('WebSocket连接失败');
        setIsConnect(false);
      };

      setSocket(ws);
    }
    catch (e) {
      console.warn(e);
      setErrorMessage(`连接失败。错误信息：${e}`);
    }
  }

  const handleSendMessage = (message: string) => {
    if (sendMessage === '') {
      return;
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(sendMessage);
      console.log('Sent: ', sendMessage);
      socket.onmessage = (event) => {
        console.log('Received: ', event.data);
        setGetMessage(getMessage + '>> ' + event.data + '\r');
      };
    } else {
      console.log('Socket is not open');
      setErrorMessage('WebSocket连接断开，发送失败');
      setIsConnect(false);
    }
  }

  return (
    <div className={'w-full h-full flex flex-col items-center gap-5'}>
      <div className={'w-full flex flex-row items-center justify-center border-4 rounded-xl border-gray-400 p-5'}>
        {isConnect ?
          <p className={'text-green-400 font-bold'}>WebSocket已连接</p> :
          <p className={'text-red-400 font-bold'}>WebSocket未连接</p>
        }
      </div>
      <p className={'font-light text-sm'}>请输入同一网络下服务器的Ip地址与端口</p>
      <p className={'text-red-400 text-sm'}>{errorMessage}</p>
      <div className={'w-full flex flex-row items-center justify-between gap-3'}>
        <Input isRequired type={"number"} defaultValue={wsAddress.ip1} onChange={(event) => {
          setWsAddress({
            ...wsAddress,
            ip1: event.target.value
          });
        }}/>
        <p>.</p>
        <Input isRequired type={"number"} defaultValue={wsAddress.ip2} onChange={(event) => {
          setWsAddress({
            ...wsAddress,
            ip2: event.target.value
          });
        }}/>
        <p>.</p>
        <Input isRequired type={"number"} defaultValue={wsAddress.ip3} onChange={(event) => {
          setWsAddress({
            ...wsAddress,
            ip3: event.target.value
          });
        }}/>
        <p>.</p>
        <Input isRequired type={"number"} defaultValue={wsAddress.ip4} onChange={(event) => {
          setWsAddress({
            ...wsAddress,
            ip4: event.target.value
          });
        }}/>
      </div>

      <div className={'w-full flex flex-row items-center justify-between gap-3'}>
        <Input className={'max-w-sm'} isRequired label={'端口'} labelPlacement={"outside-left"} type={"number"}
               defaultValue={wsAddress.port.toString()} onChange={(event) => {
          setWsAddress({
            ...wsAddress,
            port: parseInt(event.target.value)
          });
        }}/>
        <Button color={"primary"} onClick={() => {
          connectSocket();
        }}>连接</Button>
      </div>

      <Divider/>

      <div className={'flex flex-col w-full justify-between flex-1'}>
        <Textarea
          isReadOnly
          label="服务器消息"
          variant="bordered"
          labelPlacement="outside"
          placeholder="暂无消息"
          defaultValue={getMessage}
          value={getMessage}
          className="w-full"
        />
        <div className={'w-full flex flex-row justify-end'}>
          <Button color={"primary"} onClick={() => {
            setGetMessage('');
          }}>清空消息</Button>
        </div>
      </div>

      <Divider/>

      <div className={'flex flex-col w-full justify-between flex-1'}>
        <Textarea
          variant="bordered"
          placeholder="请输入要发送到WebSocket服务器的消息"
          defaultValue={sendMessage}
          className="w-full"
          onChange={(event) => {
            setSendMessage(event.target.value);
          }}
        />
        <div className={'w-full flex flex-row justify-end'}>
          <Button color={"primary"} onClick={() => {
            handleSendMessage(sendMessage);
          }}>发送消息</Button>
        </div>
      </div>
    </div>
  );
}

export default WebSocketBoard;
