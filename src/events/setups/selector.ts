import { Events, GuildMemberRoleManager, Interaction } from "discord.js";
import Setup from "../../models/Setup";
import Event from "../../types/Event";

export const event: Event = {
  name: Events.InteractionCreate,
  async callback(client, interaction: Interaction) {
    if (!interaction.isStringSelectMenu()) return;

    const setups = await Setup.find({
      type: "selector",
      guild: interaction.guildId,
      id: interaction.customId,
    });

    if (setups) {
      const roles = interaction.values;

      await interaction.deferUpdate();

      for (const setup of setups) {
        await (interaction.member.roles as GuildMemberRoleManager).remove(
          setup.data
        );
      }

      for (const role of roles) {
        await (interaction.member.roles as GuildMemberRoleManager).add(role);
      }
    }
  },
};
