"use client";
import { useEffect, useState } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { Log, fromHex, parseAbiItem, trim } from "viem";
import ScrollableBox from "./ScrollableBox";
import ChatMessage from "./ChatMessage";

const contract_address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contract_json = require('../lib/contracts/Chatter.json');

interface MessageBoxProps {
    address: `0x${string}` | undefined;
}

const MessageBox = ({ address }: MessageBoxProps) => {

    const [messages, setMessages] = useState<Log[]>([]);
    const client = usePublicClient();
    
    // contract events
    useEffect(() => {
        if (!client) return;
        
        const fetchMessages = async () => {
            try {
                const blockNumber = await client.getBlockNumber();
                console.log('Current block number:', blockNumber);
                // get the logs
                const logs = await client.getLogs({
                    address: contract_address,
                    fromBlock: blockNumber - BigInt(500) < BigInt(0) ? BigInt(0) : blockNumber - BigInt(500),
                    toBlock: blockNumber,
                    events: [parseAbiItem('event Message(address indexed sender, string message)')]
                });
                console.log('Logs:', logs);
                setMessages(logs);
            } catch (error) {
                console.error('Error fetching block number or messages:', error);
            }
        };

        fetchMessages();
    }, [client]);
    
    useWatchContractEvent({
        address: contract_address,
        abi: contract_json.abi,
        eventName: 'Message',
        onLogs(logs) {
            console.log('New logs!', logs);
            // append the new logs to the existing messages array
            setMessages((prevMessages) => {
                return prevMessages ? [...prevMessages, ...logs] : logs;
            });
        },
    });

    function parseEvent(log: Log, columnName: string) {
        // sender
        if (columnName === 'sender') {
            if (!log.topics || !log.topics[1]) return;
            const hex = trim(log.topics[1]);
            console.log('Sender:', hex);
            return hex;
        }
        // message
        if (columnName === 'message') {
            return fromHex(log.data, 'string') || "";
        }
    }

    return (
        <ScrollableBox className='flex flex-col py-5 px-2 w-full h-full overflow-y-auto scrollbar-thumb-blue scrollbar-track-blue scrollbar-w-2 scrollbar-track-blue-lighter scrolling-touch'>
            {messages?.map((logmsg, i) => 
                <ChatMessage 
                    address={parseEvent(logmsg, 'sender') ?? ""} 
                    message={parseEvent(logmsg, 'message') ?? ""}
                    key={i} 
                    connectedAddress={address}
                />
            )}
            {/* {pendingMessage && <div className="flex flex-row items-center w-full justify-end"><span className="p-3">{pendingIcon}</span> <ChatMessage address={pendingMessage.args.sender} message={pendingMessage.args.message} connectedAddress={address} /></div>} */}
        </ScrollableBox>
    );
};

export default MessageBox;
