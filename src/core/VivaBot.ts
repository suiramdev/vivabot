import { Client, ClientOptions, Collection, Events } from "discord.js";
import { findFiles } from "../utils/files";
import colors from "colors";
import * as path from "path";
import Command from "../types/Command";
import mongoose from "mongoose";

class Terry extends Client {
  public commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);

    this.loadEvents("../events");
    this.on(Events.ClientReady, () => {
      console.log(colors.green(`✔ %s`), this.user!.tag);
      this.loadCommands("../commands");
    });
  }

  public async login(token?: string): Promise<string> {
    try {
      const promise = super.login(token);
      try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log(colors.green(`✔ Database`));
      } catch (error) {
        console.log(colors.red(`✘ Database`));
        console.log(colors.grey("  ╰ %s"), error);
      }
      return promise;
    } catch (error) {
      console.log(colors.red(`✘ Client`));
      console.log(colors.grey("  ╰ %s"), error);
      return error;
    }
  }

  public loadEvents(dir: string): void {
    try {
      findFiles(path.resolve(__dirname, dir), (file) =>
        file.endsWith(".js")
      ).forEach(async (file) => {
        if (
          file.split(path.sep).includes("dev") &&
          process.env.NODE_ENV !== "development"
        ) {
          console.log(colors.grey("  ╰ Skipping %s"), file);
          return;
        }
        const { event } = await import(file);
        this.on(event.name, event.callback.bind(null, this));
        console.log(colors.grey("  ╰ Loaded %s"), file);
      });
      console.log(colors.green(`✔ Events`));
    } catch (error) {
      console.log(colors.red(`✘ Events`));
      console.log(colors.grey("  ╰ %s"), error);
    }
  }

  public loadCommands(dir: string): void {
    try {
      this.commands = new Collection();
      findFiles(path.resolve(__dirname, dir), (file) =>
        file.endsWith(".js")
      ).forEach(async (file) => {
        if (
          file.split(path.sep).includes("dev") &&
          process.env.NODE_ENV !== "development"
        ) {
          console.log(colors.grey("  ╰ Skipping %s"), file);
          return;
        }
        const { command } = await import(file);

        this.application.commands.create(command);
        this.commands.set(command.name, command);
        console.log(colors.grey("  ╰ Loaded %s"), file);
      });
      console.log(colors.green(`✔ Commands`));
    } catch (error) {
      console.log(colors.red(`✘ Commands`));
      console.log(colors.grey("  ╰ %s"), error);
    }
  }
}

export default Terry;
