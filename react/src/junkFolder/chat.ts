// chat.ts

export interface Connection {
    connect: () => void;
    disconnect: () => void;
    sendMessage: (message: string) => void;
}

export function createConnection(serverUrl: string, roomId: string): Connection {
    let socket: WebSocket | null = null;

    return {
        connect() {
            const url = `${serverUrl}/room/${roomId}`;
            socket = new WebSocket(url);

            socket.onopen = () => {
                console.log(`✅ Connected to ${roomId}`);
            };

            socket.onmessage = (event: MessageEvent) => {
                console.log(`📩 Message from ${roomId}:`, event.data);
            };

            socket.onerror = (event: Event) => {
                console.error(`⚠️ WebSocket error:`, event);
            };
        },

        disconnect() {
            if (socket) {
                socket.close();
                console.log(`❌ Disconnected from ${roomId}`);
            }
        },

        sendMessage(message: string) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(message);
                console.log(`📤 Message sent: ${message}`);
            } else {
                console.warn("⚠️ Cannot send, socket not open");
            }
        }
    };
}
