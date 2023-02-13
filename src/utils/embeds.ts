export const errorEmbed = (message: string) => {
  return {
    title: "Erreur",
    description: message,
    color: 0xed4245,
  };
};

export const successEmbed = (message: string) => {
  return {
    title: "Succès",
    description: message,
    color: 0x3aa55c,
  };
};
