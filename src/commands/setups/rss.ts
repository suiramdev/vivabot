import { ApplicationCommandOptionType } from "discord.js";
import Feed from "../../models/Feed";
import Command from "../../types/Command";
import { successEmbed } from "../../utils/embeds";

export const command: Command = {
  name: "rss",
  description: "RSS system",
  options: [
    {
      name: "subscribe",
      description: "Subscribe to a RSS feed",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "url",
          description: "URL of the RSS feed",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "channel",
          description: "Channel to send the RSS feed",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: "unsubscribe",
      description: "Unsubscribe from a RSS feed",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "url",
          description: "URL of the RSS feed",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  defaultMemberPermissions: ["Administrator"],
  async callback(client, interaction) {
    if (interaction.options.getSubcommand() === "subscribe") {
      if (
        await Feed.exists({
          guild: interaction.guildId,
          url: interaction.options.getString("url"),
        })
      )
        throw new Error("Ce flux RSS est déjà existant");
      new Feed({
        guild: interaction.guildId,
        url: interaction.options.getString("url"),
        channel: interaction.options.getChannel("channel")?.id,
      }).save();
      await interaction.reply({
        embeds: [successEmbed("Le flux RSS a bien été ajouté !")],
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "unsubscribe") {
      await Feed.findOneAndDelete({
        guild: interaction.guildId,
        url: interaction.options.getString("url"),
      });
      await interaction.reply({
        embeds: [successEmbed("Le flux RSS a bien été supprimé !")],
        ephemeral: true,
      });
    }
  },
};
