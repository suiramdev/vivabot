import {
  ApplicationCommandData,
  ChatInputCommandInteraction,
  CommandInteraction,
} from "discord.js";
import Terry from "../core/Terry";

type Command = ApplicationCommandData & {
  callback: (client: Terry, interaction: ChatInputCommandInteraction) => void;
};

export default Command;
