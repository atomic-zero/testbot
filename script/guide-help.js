module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info', 'cmd', 'list', 'commands']
};

module.exports.run = async function({
  api,
  event,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');

  try {
    const eventCommands = [...Utils.handleEvent.values()].map(command => command.name);
    const commands = [...Utils.commands.values()].map(command => command.name);

    if (!input) {
      const pages = 20;
      let page = 1;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `Command List:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
      }

      helpMessage += '\nEvent List:\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. 「 ${prefix}${eventCommand} 」\n`;
      });

      helpMessage += `\nPage ${page}/${Math.ceil(commands.length / pages)}. To view the next page, type '${prefix}help page number'. To view information about a specific command, type '${prefix}help command name'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 20;
      let start = (page - 1) * pages;
      let end = start + pages;
      let helpMessage = `Command List:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
      }

      helpMessage += '\nEvent List:\n\n';
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. 「 ${prefix}${eventCommand} 」\n`;
      });

      helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent.values(), ...Utils.commands.values()]
        .find(command => command.aliases.includes(input?.toLowerCase()));

      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          info,
          type,
          description,
          usage,
          credits
        } = command;

        const roleMessage = role !== undefined ? (role === 0 ? 'Permission: User' : 'Permission: Admin') : '';
        const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = info ? `Info: ${info}\n` : '';
        const typeMessage = type ? `Type: ${type}\n` : '';
        const usageMessage = usage ? `Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `Credits: ${credits}\n` : '';

        const message = `Name: ${name}\nVersion: ${version}\n${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
