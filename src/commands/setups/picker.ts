import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import Setup from "../../models/Setup";
import Command from "../../types/Command";
import { successEmbed } from "../../utils/embeds";

export const command: Command = {
  name: "picker",
  description: "Role picker",
  options: [
    {
      name: "add",
      description: "Add a role to a picker",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the picker to assign to",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "role",
          description: "The discord role to add to",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove a role from a picker",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the picker to remove from",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "role",
          description: "The discord role to remove from",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "setup",
      description: "Setup the role picker here",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the picker to setup",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "title",
          description: "The title of the embed message",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "description",
          description: "The description of the embed message",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async callback(client, interaction) {
    if (interaction.options.getSubcommand() === "add") {
      let setup = await Setup.findOneAndUpdate(
        {
          name: "picker",
          guild: interaction.guildId,
          id: interaction.options.getString("id"),
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
      setup.save();
      await interaction.reply({
        embeds: [
          successEmbed("The role has been added to the list of roles to pick."),
        ],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const setup = await Setup.findOneAndUpdate(
        {
          name: "picker",
          guild: interaction.guildId,
          id: interaction.options.getString("id"),
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
      setup.save();
      await interaction.reply({
        embeds: [
          successEmbed(
            "The role has been removed from the list of roles to pick."
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "setup") {
      const setup = await Setup.findOne({
        name: "picker",
        guild: interaction.guildId,
      });
      await interaction.channel.send({
        embeds: [
          {
            title: interaction.options.getString("title"),
            description: interaction.options.getString("description"),
            color: 0x4f545c,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: setup.data.map((roleId: string) => ({
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
