import { ApplicationCommandOptionType } from "discord.js";
import Setup from "../../models/Setup";
import Command from "../../types/Command";
import { successEmbed } from "../../utils/embeds";

export const command: Command = {
  name: "auth",
  description: "Authentification system",
  options: [
    {
      name: "setup",
      description: "Setup the authentification system",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "Role to give to the user when he accept the rules",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async callback(client, interaction) {
    if (interaction.options.getSubcommand() === "setup") {
      const document = await Setup.findOneAndUpdate(
        {
          name: "auth",
          guild: interaction.guildId,
        },
        {
          data: {
            channel: interaction.channelId,
            role: interaction.options.getRole("role")?.id,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      document.save();
      await interaction.reply({
        embeds: [
          successEmbed("Le système d'authentification a bien été configuré !"),
        ],
        ephemeral: true,
      });
    }
  },
};
