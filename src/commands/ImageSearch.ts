import { Message } from "discord.js";
import Command from "../bot/Command";
import GoogleImages from "google-images";
import {URL} from "url";

export default class ImageSearch extends Command {
    readonly name = "img"
    readonly description = "Buscador de imágenes en google."
    private google_images:GoogleImages;

    constructor(engine_id: string, api_key: string){
        super();
        this.google_images = new GoogleImages(engine_id, api_key);
    }

    private filter_lookaside(images:GoogleImages.Image[]){
        return images.filter(image => {
            const url = new URL(image.url);
            return (url.hostname != "lookaside.fbsbx.com");
        });
    }

    public executed(message:Message, ...words:string[]):void {
        const query = words.join(" ");
        if(!query) {
            message.channel.send("¿Qué imagen deseas que busque?");
        } else {
            this.google_images.search(query)
                .then(images => {
                    images = this.filter_lookaside(images);

                    if(images.length === 0) {
                        message.channel.send(`No encontré nada para \`${query}\` en internet.`);
                    } else {
                        const random_number = Math.floor((Math.random() * 5) + 1);
                        const image_selected = images[random_number].url;
                        message.channel.send(image_selected);
                    }
                })
                .catch(() => {
                    message.channel.send("No creo poder encontrar lo que pedides.");
                });
        }
    }
}