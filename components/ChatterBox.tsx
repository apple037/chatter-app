"use client";
import { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const contract_address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contract_json = require('../lib/contracts/Chatter.json');

const ChatterBox = () => {
    const [message, setMessage] = useState<string>('');
    const [showHash, setShowHash] = useState<boolean>(false);
    const { data: hash, writeContract } = useWriteContract();

    // get the transaction receipt 
    const { status } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (status) {
            console.log('status', status);
            // if status is success, clear the message and show hash
            if (status === 'success') {
                console.log('Hash confirmed: ' + hash);
                setMessage('');
                setShowHash(true);
                setTimeout(() => {
                    setShowHash(false);
                }, 3000);
            }
        }
    }, [status, hash]);

    function sendMessage() {
        if (!message) return;
        
        writeContract({
            abi: contract_json.abi,
            address: contract_address,
            functionName: 'sendMessage',
            args: [message]
        });
    }

    function hideHash() {
        setShowHash(false);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex w-full p-5 fixed bottom-0 bg-black">
                <input 
                    type='text' 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Textbox"
                    className="w-full text-gray-600 p-3 bg-gray-200 rounded-l-md focus:outline-none focus:placeholder-gray-300"
                />
                <button onClick={sendMessage} className="px-4 py-3 bg-blue-500 rounded-r-lg hover:bg-blue-400 ease-in-out duration-500 text-white">Send🤡</button>
            </div>
            {/* Transaction Hash Notification */}
            {showHash && (
                <div 
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 cursor-pointer"
                    onClick={hideHash}
                >
                    Transaction Hash: {hash} (click to dismiss)
                </div>
            )}
        </main>
    )
}

export default ChatterBox;
