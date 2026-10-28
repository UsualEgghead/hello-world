// Question bank for Tech+ Quest, organized by CompTIA Tech+ (ITF+) domain.
// Each question: { q, choices: [...4], correct: index, explain }
(function (global) {
  var QUESTIONS = {
    concepts: [
      {
        q: 'What is the smallest unit of data a computer can process?',
        choices: ['Byte', 'Bit', 'Nibble', 'Word'],
        correct: 1,
        explain: 'A bit (binary digit) is either 0 or 1 — the smallest unit of data. Eight bits make one byte.'
      },
      {
        q: 'In CompTIA\'s troubleshooting methodology, what comes right after identifying the problem?',
        choices: ['Document findings', 'Establish a theory of probable cause', 'Verify full system functionality', 'Implement the solution'],
        correct: 1,
        explain: 'The order is: identify the problem, establish a theory, test the theory, plan the solution, implement it, verify, then document.'
      },
      {
        q: 'Which number system uses only the digits 0 and 1?',
        choices: ['Decimal', 'Hexadecimal', 'Binary', 'Octal'],
        correct: 2,
        explain: 'Binary is base-2 and is the native language of digital computers.'
      },
      {
        q: 'What does the computing phrase "garbage in, garbage out" describe?',
        choices: ['A recycling program for old hardware', 'Bad input data produces bad output results', 'A type of malware', 'A disk defragmentation process'],
        correct: 1,
        explain: 'If the data fed into a system is flawed, the results will be flawed too, no matter how good the processing is.'
      },
      {
        q: 'Which of these best describes an algorithm?',
        choices: ['A type of computer hardware', 'A step-by-step set of instructions to solve a problem', 'A programming language', 'A database table'],
        correct: 1,
        explain: 'An algorithm is a logical sequence of steps for completing a task or solving a problem.'
      },
      {
        q: 'Which unit is commonly used to measure CPU clock speed?',
        choices: ['Volts', 'Bytes', 'Hertz', 'Lumens'],
        correct: 2,
        explain: 'Hertz (Hz) measures cycles per second — a 3.2 GHz CPU completes 3.2 billion cycles per second.'
      }
    ],
    infrastructure: [
      {
        q: 'Which device connects multiple devices on a LAN and forwards data using MAC addresses?',
        choices: ['Router', 'Modem', 'Switch', 'Hub'],
        correct: 2,
        explain: 'A switch intelligently forwards frames only to the port of the intended device, based on MAC address.'
      },
      {
        q: 'Which connector type is standard for wired Ethernet cables?',
        choices: ['RJ-45', 'RJ-11', 'USB-C', 'HDMI'],
        correct: 0,
        explain: 'RJ-45 connectors terminate twisted-pair Ethernet cabling used in most wired LANs.'
      },
      {
        q: 'What does "NIC" stand for?',
        choices: ['Network Interface Card', 'Network Internet Connector', 'New Internal Component', 'Node Identification Code'],
        correct: 0,
        explain: 'A NIC is the hardware that lets a device physically connect to a network, wired or wireless.'
      },
      {
        q: 'Which device converts digital signals so a computer can connect to the internet over telephone or cable lines?',
        choices: ['Access point', 'Modem', 'Patch panel', 'Switch'],
        correct: 1,
        explain: 'A modem (modulator-demodulator) translates between your ISP\'s signal and your network\'s digital data.'
      },
      {
        q: 'What is the main purpose of a network firewall?',
        choices: ['Store backup data', 'Supply electrical power', 'Filter and block unauthorized network traffic', 'Connect printers wirelessly'],
        correct: 2,
        explain: 'A firewall enforces rules about what traffic is allowed in or out of a network, protecting it from unauthorized access.'
      },
      {
        q: 'Which IEEE standard family is commonly known as Wi-Fi?',
        choices: ['802.3', '802.11', '802.15', '802.1X'],
        correct: 1,
        explain: '802.11 is the IEEE standard for wireless local area networking, branded as Wi-Fi.'
      }
    ],
    applications: [
      {
        q: 'What type of software manages hardware resources and provides a platform for other programs?',
        choices: ['Operating system', 'Utility software', 'Device driver', 'Firmware updater'],
        correct: 0,
        explain: 'The operating system (like Windows, macOS, or Linux) manages hardware and runs applications.'
      },
      {
        q: 'Which file extension typically indicates a Windows executable program?',
        choices: ['.txt', '.jpg', '.exe', '.csv'],
        correct: 2,
        explain: '.exe files are compiled programs that Windows can run directly.'
      },
      {
        q: 'What is the purpose of a device driver?',
        choices: ['To encrypt files on disk', 'To let the OS communicate with a specific hardware device', 'To compress large files', 'To schedule automatic backups'],
        correct: 1,
        explain: 'Drivers translate between the operating system and specific hardware so the OS can use the device.'
      },
      {
        q: 'Which of these is an example of productivity software?',
        choices: ['Antivirus suite', 'Word processor', 'OS kernel', 'Device firmware'],
        correct: 1,
        explain: 'Productivity software (word processors, spreadsheets, presentation tools) helps users create documents and content.'
      },
      {
        q: 'What does it mean when software is "open source"?',
        choices: ['It is always free of charge forever', 'Its source code is publicly available to view and modify', 'It only runs on Linux', 'It cannot legally be modified'],
        correct: 1,
        explain: 'Open-source licenses make the underlying source code publicly viewable and often modifiable.'
      },
      {
        q: 'What term describes software you can try for free for a limited time before paying?',
        choices: ['Freeware', 'Firmware', 'Shareware', 'Malware'],
        correct: 2,
        explain: 'Shareware lets users try software for a trial period, after which a license is usually required.'
      }
    ],
    development: [
      {
        q: 'Which control structure repeats a set of instructions while a condition is true?',
        choices: ['Branch', 'Loop', 'Variable', 'Function'],
        correct: 1,
        explain: 'Loops (like "while" or "for") repeat code as long as a condition holds.'
      },
      {
        q: 'What is a variable in programming?',
        choices: ['A fixed value that never changes', 'A named storage location that can hold a changeable value', 'A type of hardware chip', 'A database query'],
        correct: 1,
        explain: 'Variables store data under a name so a program can reference and update it.'
      },
      {
        q: 'Which logic structure runs one of two paths depending on a condition?',
        choices: ['Loop', 'Array', 'If/Else branching', 'Sequence'],
        correct: 2,
        explain: 'If/Else statements let a program choose between two (or more) paths based on a condition.'
      },
      {
        q: 'What is pseudocode used for?',
        choices: ['Compiling a program into machine code', 'Outlining program logic in plain language before writing real code', 'Encrypting source code', 'Running a program faster'],
        correct: 1,
        explain: 'Pseudocode describes an algorithm\'s steps informally, helping developers plan before coding in a real language.'
      },
      {
        q: 'Which data type represents true/false values?',
        choices: ['Integer', 'String', 'Boolean', 'Float'],
        correct: 2,
        explain: 'Boolean values are binary: true or false, used heavily in conditions and logic.'
      },
      {
        q: 'What is the term for a collection of ordered values stored under one variable name?',
        choices: ['Array', 'Loop', 'Class', 'Boolean'],
        correct: 0,
        explain: 'An array holds multiple values in order, accessible by index, under a single variable name.'
      }
    ],
    database: [
      {
        q: 'What does SQL stand for?',
        choices: ['Structured Query Language', 'Simple Query Logic', 'System Query List', 'Sequential Query Loop'],
        correct: 0,
        explain: 'SQL (Structured Query Language) is used to create, read, update, and delete data in relational databases.'
      },
      {
        q: 'In a relational database, what uniquely identifies each record in a table?',
        choices: ['Foreign key', 'Index', 'Primary key', 'Field'],
        correct: 2,
        explain: 'A primary key is a column (or set of columns) that uniquely identifies each row in a table.'
      },
      {
        q: 'Which SQL command retrieves data from a database?',
        choices: ['INSERT', 'DELETE', 'UPDATE', 'SELECT'],
        correct: 3,
        explain: 'SELECT queries read and return data from one or more tables.'
      },
      {
        q: 'What is a single row in a database table commonly called?',
        choices: ['Field', 'Record', 'Schema', 'Index'],
        correct: 1,
        explain: 'A record (or row/tuple) represents one entry in a table, made up of multiple fields.'
      },
      {
        q: 'Which term describes data that doesn\'t fit neatly into rows and columns, like videos or social media posts?',
        choices: ['Structured data', 'Normalized data', 'Unstructured data', 'Metadata'],
        correct: 2,
        explain: 'Unstructured data lacks a predefined format, unlike structured data in relational tables.'
      },
      {
        q: 'What is the purpose of a foreign key?',
        choices: ['To encrypt sensitive columns', 'To link one table to another by referencing its primary key', 'To speed up every query automatically', 'To delete duplicate rows'],
        correct: 1,
        explain: 'Foreign keys create relationships between tables by pointing to a primary key in another table.'
      }
    ],
    security: [
      {
        q: 'What do the three letters in the "CIA triad" stand for?',
        choices: ['Confidentiality, Integrity, Availability', 'Control, Inspection, Authorization', 'Cyber, Internet, Access', 'Compliance, Isolation, Auditing'],
        correct: 0,
        explain: 'The CIA triad is the core model for information security: keeping data confidential, accurate, and accessible.'
      },
      {
        q: 'Which type of malware disguises itself as legitimate software to trick users into installing it?',
        choices: ['Worm', 'Trojan horse', 'Spyware', 'Adware'],
        correct: 1,
        explain: 'A Trojan horse looks harmless or useful but carries a hidden malicious payload.'
      },
      {
        q: 'Which authentication factor is "something you know"?',
        choices: ['Fingerprint', 'Security badge', 'Password or PIN', 'Retina scan'],
        correct: 2,
        explain: 'Passwords and PINs are knowledge-based factors, as opposed to biometrics (something you are) or tokens (something you have).'
      },
      {
        q: 'What is "phishing"?',
        choices: ['A firewall misconfiguration', 'A social engineering attack using deceptive messages to steal information', 'A method for backing up data', 'A type of network cable'],
        correct: 1,
        explain: 'Phishing tricks victims via fake emails or messages into revealing credentials or other sensitive info.'
      },
      {
        q: 'Which practice adds a second layer of protection to an account beyond a password?',
        choices: ['Reusing the same password everywhere', 'Multi-factor authentication', 'Disabling software updates', 'Sharing credentials with coworkers'],
        correct: 1,
        explain: 'Multi-factor authentication (MFA) requires a second proof of identity, like a code or biometric, in addition to a password.'
      },
      {
        q: 'What type of malware self-replicates across networks without needing a user to run it?',
        choices: ['Trojan', 'Adware', 'Worm', 'Rootkit'],
        correct: 2,
        explain: 'Worms spread automatically across networks by exploiting vulnerabilities, unlike Trojans which need a user to launch them.'
      }
    ]
  };

  var api = { QUESTIONS: QUESTIONS };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.TechPlusQuestions = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
