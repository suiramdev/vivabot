import { Events, GuildMemberRoleManager, Interaction } from "discord.js";
import setup from "../../models/setup";
import Event from "../../types/Event";

export const event: Event = {
  name: Events.InteractionCreate,
  async callback(client, interaction: Interaction) {
    if (interaction.isButton() && interaction.customId.startsWith("pick-")) {
      await interaction.deferUpdate();
      const roleID = interaction.customId.split("-")[1];
      if (
        (interaction.member.roles as GuildMemberRoleManager).cache.has(roleID)
      ) {
        (interaction.member.roles as GuildMemberRoleManager).remove(roleID);
      } else {
        (interaction.member.roles as GuildMemberRoleManager).add(roleID);
      }
    }
  },
};
