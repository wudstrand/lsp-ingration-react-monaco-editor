import React, {useEffect, useState} from 'react';
import {toSocket, WebSocketMessageReader, WebSocketMessageWriter} from "vscode-ws-jsonrpc";
import {
    CloseAction,
    ErrorAction,
    MessageTransports,
    MonacoLanguageClient, MonacoServices,
} from "monaco-languageclient";
import normalizeUrl from 'normalize-url';
import MonacoEditor from "react-monaco-editor";
import {MonacoEditorProps} from "react-monaco-editor/src/types";
import * as monaco from "monaco-editor";


type Monaco = typeof monaco;
const ReconnectingWebSocket = require('reconnecting-websocket');


interface Props extends MonacoEditorProps {
    enableEdit?: boolean
}

const LSPConnectedEditor: React.FC<Props> = ({enableEdit, ...other}) => {
    function createLanguageClient (transports: MessageTransports): MonacoLanguageClient {
        return new MonacoLanguageClient({
            name: 'PYLS Language Client',
            clientOptions: {
                documentSelector: ['python'],
                errorHandler: {
                    error: () => ({ action: ErrorAction.Continue }),
                    closed: () => ({ action: CloseAction.DoNotRestart })
                }
            },
            connectionProvider: {
                get: () => {
                    return Promise.resolve(transports);
                }
            }
        });
    }

    const willMount = (monaco: Monaco) => {
        monaco.languages.register({
            id: 'python',
            extensions: ['.py'],
            aliases: ['PYTHON', 'python', 'py'],
        });

        MonacoServices.install();
    }

    useEffect(() => {
        console.log("Creating websocket")

        const url = normalizeUrl(`ws://localhost:5000`);
        const socketOptions = {
            maxReconnectionDelay: 10000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1.3,
            connectionTimeout: 10000,
            maxRetries: Infinity,
            debug: false
        };
        const webSocket: WebSocket = new ReconnectingWebSocket.default(url, [], socketOptions);

        webSocket.onopen = () => {
            const socket = toSocket(webSocket);
            const reader = new WebSocketMessageReader(socket);
            const writer = new WebSocketMessageWriter(socket);
            const languageClient = createLanguageClient({
                reader,
                writer
            });
            languageClient.start();
            reader.onClose(() => languageClient.stop());
        };

        return () => { webSocket.close() }
    }, [])

    return (
        <MonacoEditor
            height="90vh"
            language={'python'}
            theme={'vs-dark'}
            editorWillMount={(monaco: Monaco) => willMount(monaco)}
            {...other}
            options={{
                glyphMargin: true,
                lightbulb: {
                    enabled: true
                }
            }}
        />
    )
}

export default LSPConnectedEditor;
