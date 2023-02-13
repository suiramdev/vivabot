import { Events, Interaction } from "discord.js";
import Event from "../types/Event";
import { errorEmbed } from "../utils/embeds";

export const event: Event = {
  name: Events.InteractionCreate,
  async callback(client, interaction?: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    try {
      await client.commands
        .get(interaction.commandName)
        .callback(client, interaction);
      if (!interaction.replied) {
        await interaction.deferReply();
        await interaction.deleteReply();
      }
    } catch (error) {
      if (!interaction.deferred) await interaction.deferReply();
      await interaction.editReply({
        embeds: [errorEmbed(error.message ?? "Une erreur est survenue.")],
      });
    }
  },
};
