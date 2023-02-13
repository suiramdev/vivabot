import * as dotenv from "dotenv";
import Terry from "./core/Terry";
import { IntentsBitField } from "discord.js";

dotenv.config();

const client = new Terry({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
  ],
});
client.login(process.env.TOKEN);
