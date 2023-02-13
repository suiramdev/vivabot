import { Events, GuildMemberRoleManager, Interaction } from "discord.js";
import setup from "../../models/setup";
import Event from "../../types/Event";

export const event: Event = {
  name: Events.InteractionCreate,
  async callback(client, interaction: Interaction) {
    if (interaction.isButton() && interaction.id == "authentify") {
      interaction.deferReply();
      const document = await setup.findOne({
        guild: interaction.guildId,
      });
      if (!document) return;
      (interaction.member.roles as GuildMemberRoleManager).add(
        JSON.parse(document.data).role
      );
      interaction.deleteReply();
    }
  },
};
