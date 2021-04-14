import { Message, TextChannel } from "discord.js";
import {Suscriptor} from "@lottielabs/bottie";

/**
 * Clase minima para la creación de comandos.
 * @see https://github.com/faztcommunity/xfazt-bot/wiki
 */
export default abstract class Command extends Suscriptor<"command"> {
    public event_type:"command" = "command";

    /**
     * Nombre del comando.
     * No es case sensitive, se lo trata en minúsculas.
     */
    readonly abstract name:string

    /**
     * Descripción del comando.
     */
    readonly abstract description:string

    /**
     * La función que se ejecuta al recibir una configuración, su implementación es opcional.
     * @param command_name El nombre de un comando.
     * @param text_channel El canal al cual notificar el cambio.
     * @param config El objeto de configuración para el comando.
     */
    public configured?(command_name:string, text_channel:TextChannel, config:object):void

    /**
     * La función que se ejecuta cuando el comando es ejecutado.
     * @param message Un mensaje de Discord.
     * @param args Argumentos del comando.
     */
    protected abstract executed(message:Message, ...args:string[]):void

    /**
     * Convierte las propiedades del comando (de la clase), a un json string.
     * @example '{"name": "ping", "description": "hace pong!"}'
     */
    public to_string():string {
        return JSON.stringify(this);
    }

    /**
     * Comprueba si el evento ejecutado es para si mismo.
     * @param command_name El nombre de un comando
     */
    protected is_for_this(command_name:string):boolean {
        return command_name.toLowerCase() === this.name.toLowerCase();
    }

    public notified(command_name:string, message:Message, ...args:string[]):void {
        if(this.is_for_this(command_name)) this.executed(message, ...args);
    }

    /**
     * Retorna un elemento random de un array de strings.
     * @param responses Lista de respuestas
     */
    protected random_response(responses:string[]):string {
        const random_index = Math.floor(Math.random() * responses.length);
        return responses[random_index];
    }
}

/**
 * Type de ayuda, representa lo necesario para disparar un comando.
 */
export type command_payload = {
    name:string,
    message:Message,
    args:string[]
}
