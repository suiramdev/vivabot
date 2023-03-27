import VivaBot from "../core/VivaBot";

type Event = {
  name: string;
  callback: (client: VivaBot, ...args) => void;
};

export default Event;
