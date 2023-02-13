import { Captcha as CaptchaGenerator } from "captcha-canvas";
import { Events, GuildMember, TextChannel } from "discord.js";
import Captcha from "../../models/Captcha";
import Setup from "../../models/Setup";
import Event from "../../types/Event";

export const event: Event = {
  name: Events.GuildMemberAdd,
  async callback(client, member: GuildMember) {
    const setup = await Setup.findOne({
      name: "auth",
      guild: member.guild.id,
    });
    if (!setup) return;

    const channel = member.guild.channels.cache.get(
      setup.data.channel
    ) as TextChannel;

    const captcha = new CaptchaGenerator();
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();

    const message = await channel.send({
      content: `<@${member.id}>`,
      embeds: [
        {
          title: "Bienvenue sur le serveur !",
          description:
            "Pour accéder au serveur, veuillez recopier le captcha ci-dessous :",
          image: {
            url: `attachment://captcha.png`,
          },
        },
      ],
      files: [
        {
          attachment: await captcha.png,
          name: "captcha.png",
        },
      ],
    });

    new Captcha({
      guild: member.guild.id,
      member: member.id,
      message: message.id,
      code: captcha.text,
    }).save();
  },
};
