import { Interaction } from "discord.js";
import Event from "../types/Event";

export const event: Event = {
  name: "interactionCreate",
  callback(client, interaction?: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    try {
      client.commands
        .get(interaction.commandName)
        .callback(client, interaction);
    } catch (error) {
      interaction.reply({
        embeds: [
          {
            title: "Error",
            description: error.message,
            color: 0xff0000,
          },
        ],
        ephemeral: true,
      });
      return;
    }
  },
};
