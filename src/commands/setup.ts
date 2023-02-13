import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import setup from "../models/setup";
import Command from "../types/Command";

export const command: Command = {
  name: "setup",
  description: "Setup the bot",
  options: [
    {
      name: "type",
      description: "Type of setup",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "authentification",
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
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async callback(client, interaction) {
    interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case "authentification":
        const document = await setup.findOneAndUpdate(
          {
            name: "authentification",
            guild: interaction.guildId,
          },
          {
            data: JSON.stringify({
              role: interaction.options.getRole("role")?.id,
            }),
          },
          {
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
                  customId: "authentify",
                  label: "Accepter",
                  style: ButtonStyle.Success,
                },
              ],
            },
          ],
        });
        break;
    }
    interaction.deleteReply();
  },
};
