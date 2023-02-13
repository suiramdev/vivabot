import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../types/Command";

export const command: Command = {
  name: "clear",
  description: "Clear messages in the channel",
  options: [
    {
      name: "amount",
      description: "Amount of messages to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
  async callback(client, interaction) {
    await interaction.deferReply();
    let amount = interaction.options.getInteger("amount") + 1;
    for (let i = 0; i < amount / 100; i++) {
      interaction.channel.bulkDelete(amount > 100 ? 100 : amount);
    }
  },
};
