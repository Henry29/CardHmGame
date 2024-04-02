/*
* Servidor basico de websockets, se requiere unicamente la libreria ws y node
* npm install ws
* se necesita node v. 18.14.0 o mas actual
*/
const WebSocket = require('ws');
const MAX_LENGTH_MSG = 20;
const clientes = new Map();
const puerto = 8081;
var nextClientId = 0;
const wss = new WebSocket.Server({ port: puerto }, () => {
    console.log("Signalling server is now listening on port " + puerto);
});
//mandas a todos los compis, excepto al iniciador
//puedes comentar esto si quieres que la funcion broadcast funcione de otra manera
wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws, req) => {
    const authToken = req.url;
    const clientId = GenerarId();
    if (isValidToken(authToken)) {
        //se guarda al cliente
        clientes.set(clientId, {clientews: ws, nombre: '', ready : false});
        //al cliente se le envia su identificador, la logica puede cambiar
        ws.send(JSON.stringify({type: 'myId', data : clientId}));
    } else {
        // Usuario no autorizado, cerrar la conexión
        console.log('fail');
        ws.close();
    }
    //ws.close es como un retorno, si llego hasta aqui se ha logrado conectar
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`);
    ws.on('message', message => {
        try {
            // Intenta parsear el mensaje como JSON
            const msg = JSON.parse(message);
            // Verifica si el mensaje es válido
            if (isValidMessage(msg)) {
                //TODO AQUI, puedes implementar las funciones aqui.
                //en esta parte se comunida el cliente con el servidor
                wss.broadcast(ws, JSON.stringify(msg));
            } else {
                console.log('Mensaje no válido:', msg);
            }
        } catch (error) {
            // Maneja mensajes que no son JSON
            console.error('Error al parsear el mensaje JSON:', error);
            console.log('Mensaje recibido:', message);
        }
    });
    ws.on('close', ws=> {
        //se elimina al cliente, como esta en un array aparte, se elimina tambien alli
        //en este momento seguimos teniendo el id del cliente, podemos usarlo aqui por mas tiempo que pase
        clientes.delete(clientId);
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`);
    })

    ws.on('error', error => {
        //pues el cliente es desconectado automaticamente si hay un error
        console.log(`Client error. Total connected clients: ${wss.clients.size}`);
    });
});
//para los id de los clientes
function GenerarId(){
    return nextClientId++;
}
//para validar el id, por alguna razon el regex no funciona
function isValidToken(token){
    var cauteriza = token+ "";
    if (!cauteriza.includes('/?token=')) 
        return false;
    cauteriza = cauteriza.replace('/?token=','');
    return cauteriza == 'AA1186';
}
//mas que todo es para que no falle al parsear y no le envien cosas raras
//aun necesito ponerle el sanitizador de mensajes, hay uno de node gratuito
function isValidMessage(message) {
    if (typeof message !== 'object') 
        return false;
    if(message === null)
        return false;
    if (!'text' in message)
        return false;
    if (typeof message.data !== 'string')
        return false;
    return true;
}