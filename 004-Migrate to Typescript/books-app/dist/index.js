"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var path_1 = require("path");
var http_1 = require("http");
var method_override_1 = require("method-override");
var url_1 = require("url");
var express_session_1 = require("express-session");
var passport_1 = require("passport");
var socket_io_1 = require("socket.io");
var redis_adapter_1 = require("@socket.io/redis-adapter");
var redis_1 = require("redis");
var errors_js_1 = require("./middlewares/errors.js");
var users_js_1 = require("./routes/users.js");
var books_js_1 = require("./routes/books.js");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server);
var pubClient = (0, redis_1.createClient)({ url: "redis://redis:6379" });
var subClient = pubClient.duplicate();
Promise.all([pubClient.connect(), subClient.connect()]).then(function () {
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    console.log("Redis адаптер подключен");
});
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: "SECRET" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.set("views", path_1.default.join(__dirname, "views"));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use("/api/users", users_js_1.default);
app.use("/api/books", books_js_1.default);
app.use(errors_js_1.default);
io.on('connection', function (socket) {
    var id = socket.id;
    console.log("Socket connected: ".concat(id));
    socket.on('message-to-me', function (msg) {
        msg.type = 'me';
        socket.emit('message-to-me', msg);
    });
    socket.on('message-to-all', function (msg) {
        msg.type = 'all';
        io.emit('message-to-all', msg);
    });
    var roomName = socket.handshake.query.roomName;
    console.log("Socket roomName: ".concat(roomName));
    socket.join(roomName);
    socket.on('message-to-room', function (msg) {
        msg.type = "room: ".concat(roomName);
        io.to(roomName).emit('message-to-room', msg);
    });
    socket.on('disconnect', function () {
        console.log("Socket disconnected: ".concat(id));
    });
});
function startMongoDb(port, url) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongoose_1.default.connect(url)];
                case 1:
                    _a.sent();
                    server.listen(port, function () {
                        console.log("Server is running on port ".concat(port));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var port = process.env.PORT || 3000;
startMongoDb(port, process.env.ME_CONFIG_MONGODB_URL);
