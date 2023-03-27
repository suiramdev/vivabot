import {
  ApplicationCommandData,
  ChatInputCommandInteraction,
} from "discord.js";
import VivaBot from "../core/VivaBot";

type Command = ApplicationCommandData & {
  callback: (client: VivaBot, interaction: ChatInputCommandInteraction) => any;
};

export default Command;
