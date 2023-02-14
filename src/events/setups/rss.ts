import { Events, Message, TextChannel } from "discord.js";
import Event from "../../types/Event";
import Feed from "../../models/Feed";
import Parser from "rss-parser";
import FeedItem from "../../models/FeedItem";
import Terry from "../../core/Terry";

async function rssLookup(client: Terry) {
  const feeds = await Feed.find();
  const parser = new Parser();

  for (const feed of feeds) {
    const channel = client.channels.cache.get(feed.channel) as TextChannel;
    const items = (await parser.parseURL(feed.url)).items
      .filter((item) => new Date(item.isoDate) >= new Date(feed.lastUpdate))
      .sort(
        (a, b) => new Date(a.isoDate).valueOf() - new Date(b.isoDate).valueOf()
      );

    for (const item of items) {
      await channel.send({
        embeds: [
          {
            title: item.title,
            description: item.contentSnippet,
            url: item.link,
            timestamp: item.isoDate,
          },
        ],
      });

      await FeedItem.create({
        feed: feed._id,
        item: item.link,
      });
    }

    feed.lastUpdate = new Date();
    await feed.save();
  }

  setTimeout(() => rssLookup(client), 1000 * 60 * 5);
}

export const event: Event = {
  name: Events.ClientReady,
  async callback(client) {
    rssLookup(client);
  },
};
