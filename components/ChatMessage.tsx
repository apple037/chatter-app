import JazziconImage from "./JazzIconImage";

export default function ChatMessage({ address, message, connectedAddress }: { address: string, message: string, connectedAddress?: `0x${string}` }) {
    const isSelf = connectedAddress?.toLowerCase() === address.toLowerCase();
    console.log('isSelf:', isSelf);
    console.log('connectedAddress:', connectedAddress);
    console.log('address:', address);

    return (
        <div className={`flex flex-row items-center gap-2 py-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
            <JazziconImage 
                address={address} 
                className={`w-6 h-6 rounded-full ${isSelf ? 'order-2' : 'order-1'}`} 
            />
            <div className={`px-4 py-2 rounded-lg ${isSelf ? 'rounded-br-none bg-blue-600 text-white' : 'rounded-bl-none bg-gray-300 text-gray-700'}`}>
                {message}
            </div>
        </div>
    );
}
