import Terry from "../core/Terry";

type Event = {
  name: string;
  callback: (client: Terry, ...args) => void;
};

export default Event;
