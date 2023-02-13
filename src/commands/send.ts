import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../types/Command";

export const command: Command = {
  name: "send",
  description: "Send a message through the bot",
  options: [
    {
      name: "data",
      description: "Message's data in JSON format",
      type: ApplicationCommandOptionType.String,
    },
  ],
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  callback(client, interaction) {
    interaction.channel.send(JSON.parse(interaction.options.getString("data")));
  },
};
