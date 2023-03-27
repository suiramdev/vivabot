import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import Setup from "../../models/Setup";
import Command from "../../types/Command";
import { successEmbed } from "../../utils/embeds";

export const command: Command = {
  name: "selector",
  description: "Role selector",
  options: [
    {
      name: "add",
      description: "Add a role to a selector",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the selector to assign to",
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
      description: "Remove a role from a selector",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the selector to remove from",
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
      description: "Setup the role selector here",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The identifier of the selector to setup",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "placeholder",
          description: "The placeholder message of the selector",
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
          name: "selector",
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
        embeds: [successEmbed("The role has been added to the list.")],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      const setup = await Setup.findOneAndUpdate(
        {
          name: "selector",
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
        embeds: [successEmbed("The role has been removed from the list.")],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "setup") {
      const setup = await Setup.findOne({
        name: "selector",
        guild: interaction.guildId,
        id: interaction.options.getString("id"),
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
            components: [
              {
                customId: interaction.options.getString("id"),
                type: ComponentType.StringSelect,
                placeholder: interaction.options.getString("placeholder"),
                minValues: 1,
                maxValues: 1,
                options: setup.data.map((roleId: string) => ({
                  value: roleId,
                  label: interaction.guild.roles.cache.get(roleId)?.name,
                })),
              },
            ],
          },
        ],
      });
    }
  },
};
