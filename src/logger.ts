import * as path from "path";
import * as winston from "winston";
import { Format, TransformableInfo } from "logform";
import * as winstonFile  from "winston-daily-rotate-file";

const maxsize = 2000 * 1000 * 10;
const level = "debug";

const directory = path.join(__dirname, "../../logs/")
console.log(directory);

const getLoggerConfiguration = (): winston.LoggerOptions => {
    const printfFormat: Format =
        winston.format.printf((info: TransformableInfo) => `${info.timestamp} [${info.level}] ${info.message}`);
    return {
        transports: [
            new (winston.transports.Console)({
                level: "verbose",
                handleExceptions: true,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    printfFormat
                )
            }),
            new winstonFile({
                filename: `${directory}/application.log`,
                level: "verbose",
                handleExceptions: true,
                json: false,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    printfFormat
                )
            })
        ],
        exceptionHandlers: [
            new winston.transports.File({
                filename: `${directory}/unhandledExceptions.log`
            })
        ],
        exitOnError: false
    };
}

 export const messagesLogger = winston.createLogger({
   transports: [
    new winston.transports.File({maxsize, level, filename: path.join(__dirname, "/logs/messages.log")}),
   ],
 });

export const errorLogger = () => 0
// export const errorLogger = winston.createLogger({
//   format: winston.format.json(),
//   transports: [
//     new winston.transports.File({maxsize, level, filename: path.join(__dirname, "/logs/error.log")}),
//   ],
// });
