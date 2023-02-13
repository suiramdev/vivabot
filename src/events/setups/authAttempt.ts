import { Events, Message } from "discord.js";
import Captcha from "../../models/Captcha";
import Setup from "../../models/Setup";
import Event from "../../types/Event";

export const event: Event = {
  name: Events.MessageCreate,
  async callback(client, message: Message) {
    const setup = await Setup.findOne({
      name: "auth",
      guild: message.guild.id,
    });
    if (!setup) return;

    if (message.channel.id === setup.data.channel) {
      const captcha = await Captcha.findOne({
        guild: message.guild.id,
        member: message.author.id,
      });
      if (!captcha) return;

      if (captcha.code === message.content) {
        await message.member.roles.add(setup.data.role);
        await message.channel.messages.cache.get(captcha.message)?.delete();
        await Captcha.deleteOne({ _id: captcha._id });
      }
      await message.delete();
    }
  },
};
