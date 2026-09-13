export const ENEMY_LIST = [
  { folder: "1 Snake", name: "Snake", idleFrames: 4, attackFrames: 6, hurtFrames: 2, deathFrames: 4, attackType: "melee" },
  { folder: "2 Hyena", name: "Hyena", idleFrames: 4, attackFrames: 6, hurtFrames: 2, deathFrames: 6, attackType: "melee" },
  { folder: "3 Scorpio", name: "Scorpio", idleFrames: 4, attackFrames: 4, hurtFrames: 2, deathFrames: 4, attackType: "melee" },
  { folder: "4 Vulture", name: "Vulture", idleFrames: 4, attackFrames: 4, hurtFrames: 2, deathFrames: 4, attackType: "projectile" },
  { folder: "5 Mummy", name: "Mummy", idleFrames: 4, attackFrames: 6, hurtFrames: 2, deathFrames: 6, attackType: "spell" },
  { folder: "6 Deceased", name: "Deceased", idleFrames: 4, attackFrames: 4, hurtFrames: 2, deathFrames: 6, attackType: "projectile" },
];

export const getEnemyIndexForMilestone = (milestone) => {
  if (!milestone) return 0;
  const str = milestone.title || milestone.id || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % ENEMY_LIST.length;
};

export const getDialogueScript = (enemyName, topic) => {
  const scripts = {
    "Snake": {
      greeting: `Sssss... Another mortal dares step into the code garden of ${topic}? I am the Python of these domains. My venom will corrupt your syntax!`,
      responses1: [
        "Your fangs don't scare me. I will run a clean parse!",
        "A snake? I'll just write a script to sweep you away.",
        "I seek to pass this milestone. Stand aside!"
      ],
      reactions1: [
        `Parse? *hisses* You will syntax error before you can even indent!`,
        `Sweep me? *hisses* My venom runs deeper than your library paths!`,
        `Pass? *cackles* No one passes my bite! Prepare to be poisoned!`
      ],
      responses2: [
        "[Draw weapon] Enough talk. Let's see your bite!",
        "[Brace yourself] My shields will block your venom."
      ],
      finalThreat: `*hisses* FEEL MY SYNTAX VENOM! DIE!`
    },
    "Hyena": {
      greeting: `Aha-ha-ha! Look at this juicy allocation! A fresh programmer to scavenge in the garbage heap of ${topic}! *cackles hysterically*`,
      responses1: [
        "I am not garbage to be collected. Draw your claws!",
        "Go back to the wild. I compile in clean runtimes.",
        "Just let me pass this milestone."
      ],
      reactions1: [
        `Claws? *guffaws* I scavenge the heap! I will strip your memory allocation to zero!`,
        `Clean runtimes? *cackles* There is nothing clean about what I'll do to your code block!`,
        `Pass? *wheezes* The only way out is through the garbage collector!`
      ],
      responses2: [
        "[Draw weapon] Enough talk. Draw your blade!",
        "[Brace yourself] I will compile whatever errors you throw."
      ],
      finalThreat: `HEAP OVERFLOW! SCAVENGE THE REMAINS! *howls*`
    },
    "Scorpio": {
      greeting: `CLANK-CLANK! Intruder detected in the nesting grounds of ${topic}! My sting contains a lethal layout thrashing payload!`,
      responses1: [
        "I will force-render my way past you. Draw your stinger!",
        "Your claws look like unclosed tags. Let me close them.",
        "Please let me pass the milestone."
      ],
      reactions1: [
        `Stinger? *snaps* One strike and your render tree is detached forever!`,
        `Unclosed? *clatters* I will clamp down on your event loop!`,
        `Pass? *hisses* No element leaves the DOM intact!`
      ],
      responses2: [
        "[Draw weapon] Prepare for structural collapse!",
        "[Brace yourself] I will shield against your stinger."
      ],
      finalThreat: `STING OF THE UNCAUGHT EXCEPTION! DIE!`
    },
    "Vulture": {
      greeting: `SCREEECH! I circle over the dead projects of ${topic}! I see the stench of unhandled promises on you!`,
      responses1: [
        "My promises are resolved. Yours are about to reject!",
        "Fly away, scavenger. I am building a legacy.",
        "I must conquer this milestone."
      ],
      reactions1: [
        `Rejected? *screeches* I devour broken async routines for breakfast!`,
        `Legacy? *caws* All code turns to dust in the wind!`,
        `Conquer? *flaps wings* You will fall from the sky like an uncaught panic!`
      ],
      responses2: [
        "[Draw weapon] Sky or ground, you fall today!",
        "[Brace yourself] My code is impervious to your talons."
      ],
      finalThreat: `FEATHERSTORM OF REJECTED PROMISES! SCREECH!`
    },
    "Mummy": {
      greeting: `Thousands of years... wrapped in the legacy bandages of ${topic}... Who disturbs my ancient scope?`,
      responses1: [
        "Your legacy code is deprecated. Time for a modern refactor!",
        "Return to your tomb, elder. Modern JS is here.",
        "I seek the wisdom of this milestone."
      ],
      reactions1: [
        `Deprecated? *groans* Legacy is immortal! You cannot delete what has no source map!`,
        `Modern? *rasps* Modern frameworks fade, but my curse remains in production!`,
        `Wisdom? *sighs* Wisdom comes only at the price of your soul's memory!`
      ],
      responses2: [
        "[Draw weapon] I will unwrap your legacy code forever!",
        "[Brace yourself] Let us test your ancient magic."
      ],
      finalThreat: `CURSE OF THE ANCIENT MONOLITH! BE BURIED!`
    },
    "Deceased": {
      greeting: `*gasping rasp* I am the shadow of devs who gave up on ${topic}... Join us in the endless backlog...`,
      responses1: [
        "I never give up. My resolve is cast in steel!",
        "I will clear the backlog and free your spirit.",
        "I am here to claim victory over this milestone."
      ],
      reactions1: [
        `Steel? *rattles* So were they before the merge conflicts broke them...`,
        `Free us? *whispers* You cannot free what has already been abandoned...`,
        `Victory? *chuckles hollowly* Victory is an illusion of the sprint...`
      ],
      responses2: [
        "[Draw weapon] I will end your eternal sprint!",
        "[Brace yourself] My passion will purge your shadows."
      ],
      finalThreat: `SHADOW OF THE ABANDONED REPO! SOCCUMB!`
    }
  };

  return scripts[enemyName] || scripts["Snake"];
};
