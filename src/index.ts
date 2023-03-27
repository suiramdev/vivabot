import * as dotenv from "dotenv";
import VivaBot from "./core/VivaBot";
import { IntentsBitField } from "discord.js";

dotenv.config();

const client = new VivaBot({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.MessageContent,
  ],
});
client.login(process.env.TOKEN);
