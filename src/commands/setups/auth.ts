import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import setup from "../../models/setup";
import Command from "../../types/Command";

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
      const document = await setup.findOneAndUpdate(
        {
          name: "auth",
          guild: interaction.guildId,
        },
        {
          data: interaction.options.getRole("role")?.id,
        },
        {
          new: true,
          upsert: true,
        }
      );
      document.save();
      interaction.channel.send({
        embeds: [
          {
            title: "Authentification",
            description:
              "1・Soyez toujours aimable et respectueux envers les autres membres.\n2・N'envoyez pas de messages en série ou de spam.\n3・N'utilisez pas de langage vulgaire ou offensant.\n4・Évitez les publicités non sollicitées.",
            footer: {
              text: "En cliquant sur le bouton ci-dessous, vous acceptez les règles du serveur.",
            },
            color: 0x2d7d46,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                customId: "auth",
                label: "Accepter",
                style: ButtonStyle.Success,
              },
            ],
          },
        ],
      });
    }
  },
};
