import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import setup from "../../models/setup";
import Command from "../../types/Command";
import { errorEmbed, successEmbed } from "../../utils/embeds";

export const command: Command = {
  name: "picker",
  description: "Role picker",
  options: [
    {
      name: "add",
      description: "Add a role to the role picker",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "Role to add to the role picker",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a role from the role picker",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role",
          description: "Role to remove from the role picker",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "setup",
      description: "Setup the role picker",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async callback(client, interaction) {
    if (interaction.options.getSubcommand() === "add") {
      let document = await setup.findOneAndUpdate(
        {
          name: "picker",
          guild: interaction.guildId,
        },
        {
          $addToSet: {
            data: interaction.options.getRole("role")?.id,
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
          successEmbed(
            "Le rôle a bien été ajouté à la liste des rôles à choisir."
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const document = await setup.findOneAndUpdate(
        {
          name: "picker",
          guild: interaction.guildId,
        },
        {
          $pull: {
            data: interaction.options.getRole("role")?.id,
          },
        },
        {
          upsert: true,
        }
      );
      document.save();
      await interaction.reply({
        embeds: [
          successEmbed(
            "Le rôle a bien été retiré de la liste des rôles à choisir."
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "setup") {
      const document = await setup.findOne({
        name: "picker",
        guild: interaction.guildId,
      });
      await interaction.channel.send({
        embeds: [
          {
            title: "Rôles",
            description:
              "Cliquez sur les boutons ci-dessous pour obtenir un rôle.",
            color: 0x4f545c,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: document.data.map((roleId: string) => ({
              type: ComponentType.Button,
              customId: `pick-${roleId}`,
              label: interaction.guild.roles.cache.get(roleId)?.name,
              style: ButtonStyle.Secondary,
            })),
          },
        ],
      });
    }
  },
};
