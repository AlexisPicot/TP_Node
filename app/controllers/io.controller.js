const fs = require('fs');
const path = require('path');
const CONFIG = JSON.parse(process.env.CONFIG);
module.exports = class IOController {

    static listen(httpServer) {
        let io = require('socket.io');
        let file = "efa0a79a-2f20-4e97-b0b7-71f824bfe349";
        let presentation = JSON.parse(fs.readFileSync(path.resolve(CONFIG.presentationDirectory, file + ".pres.json"), 'utf8'));
        let index = -1;
        const maMap = new Map();
        let listen = io.listen(httpServer);
        listen.on('connection', function (socket) {
            console.log('a user connected');

            socket.on('data_comm', function (msg) {
                console.log('data_comm: ' + msg);
                this.join(this.conn.request.query['pres']);
                // maMap.set(msg, this);
                // Array.from(maMap.entries()).forEach(k => {
                //     if (!k[1].connected)
                //         maMap.delete(k[0])
                // })
            });
            socket.on('slidEvent', function (msg) {
                let parse = JSON.parse(msg);
                switch (parse.CMD) {
                    case "PREV" :
                        index--;
                        break;
                    case "NEXT" :
                        index++;
                        break;
                }
                if (parse.CMD === "START")
                    socket.to(this.conn.request.query['pres']).emit('START', JSON.stringify(presentation, null, 2));
                else if (parse.CMD==='END')
                    socket.to(this.conn.request.query['pres']).emit('END', 'Thank\'s for watching');
                else
                    socket.to(this.conn.request.query['pres']).emit('command_received', JSON.stringify(presentation.slidArray[index], null, 2));

                // Array.from(maMap.entries())
                //     .filter(e => e[0] === parse.PRES_ID)
                //     .forEach(e => {
                //
                //         if (parse.CMD === "START")
                //             e[1].emit('START', JSON.stringify(presentation, null, 2));
                //         else if (parse.CMD==='END')
                //             e[1].emit('END', 'Thank\'s for watching');
                //         else
                //             e[1].emit('command_received', JSON.stringify(presentation.slidArray[index], null, 2));
                //     });

            });
        });


    }
};