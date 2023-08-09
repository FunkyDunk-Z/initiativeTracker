const mongoose = require('mongoose')
const addToCodex = require('./../middleware/addToCodex')

const Schema = mongoose.Schema

const abilityNames = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]

const skillNames = [
  'acrobatics',
  'animal handling',
  'arcana',
  'athletics',
  'deception',
  'history',
  'insight',
  'intimidation',
  'investigation',
  'medicine',
  'nature',
  'perception',
  'performance',
  'persuasion',
  'religion',
  'sleight of hand',
  'stealth',
  'survival',
]

const senseNames = [
  'passive perception',
  'passive insight',
  'passive investigation',
]

const playerCharacterSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  characterName: {
    type: String,
    required: true,
  },
  characterTitles: {
    type: Schema.ObjectId,
    ref: 'Titles',
  },
  level: {
    type: Number,
    default: 1,
  },
  ancestry: {
    type: Schema.ObjectId,
    ref: 'Ancestry',
  },
  class: {
    type: Schema.ObjectId,
    ref: 'Class',
  },
  abilities: [
    {
      _id: false,
      abilityName: {
        type: String,
        enum: abilityNames,
      },
      abilityScore: {
        type: Number,
      },
      abilityMod: {
        type: Number,
      },
      savingThrow: {
        _id: false,
        savingThrowMod: {
          type: Number,
        },
        isProficient: {
          type: Boolean,
          default: false,
        },
        hasAdvantage: {
          type: Boolean,
          default: false,
        },
      },
    },
  ],
  skills: [
    {
      _id: false,
      skillName: {
        type: String,
        enum: skillNames,
      },
      skillAbility: {
        type: String,
        enum: abilityNames,
      },
      isProficient: {
        type: Boolean,
        default: false,
      },
      hasDoubleProficiency: {
        type: Boolean,
        default: false,
      },
      skillMod: {
        type: Number,
      },
      hasAdvantage: {
        type: Boolean,
        default: false,
      },
    },
  ],
  senses: [
    {
      _id: false,
      senseName: {
        type: String,
        enum: senseNames,
      },
      skill: {
        type: String,
      },
      senseMod: {
        type: Number,
      },
      hasAdvantage: {
        type: Boolean,
        default: false,
      },
    },
  ],
  proficiency: {
    type: Number,
  },
  initiative: {
    type: Number,
    hasAdvantage: {
      type: Boolean,
      default: false,
    },
  },
  armourClass: {
    baseValue: {
      type: Number,
      default: 10,
    },
    armourMod: {
      type: Number,
      default: 0,
    },
  },
  healthPoints: {
    currentHP: {
      type: Number,
      default: 0,
    },
    maxHP: {
      type: Number,
      default: 0,
    },
    temporaryHP: {
      type: Number,
      default: 0,
    },
    hitDie: {
      type: Number,
      default: function () {
        return this.level
      },
    },
  },
  speeds: {
    walking: {
      type: Number,
      default: 35,
    },
    swimming: {
      type: Number,
      default: function () {
        return Math.floor(this.speeds.walking / 2)
      },
    },
    flying: {
      type: Number,
      default: 0,
    },
  },
})

// PROFICIENCY
playerCharacterSchema.pre('save', function (next) {
  if (this.level < 5) {
    this.proficiency = 2
  } else if (this.level < 11) {
    this.proficiency = 3
  } else if (this.level < 17) {
    this.proficiency = 4
  } else {
    this.proficiency = 5
  }

  next()
})

// ABILITY SCORES
playerCharacterSchema.pre('save', function (next) {
  this.abilities.forEach((ability) => {
    const { abilityScore } = ability

    if (abilityScore > 30 || abilityScore < 0) {
      return next()
    }

    const mod = Math.floor((abilityScore - 10) / 2)

    ability.abilityMod = mod
    ability.savingThrow.savingThrowMod = mod

    if (ability.savingThrow.isProficient === true) {
      ability.savingThrow.savingThrowMod += this.proficiency
    }
  })

  next()
})

// SKILLS
playerCharacterSchema.pre('save', function (next) {
  const abilityScores = this.abilities.reduce((acc, ability) => {
    acc[ability.abilityName] = ability.abilityMod
    return acc
  }, {})

  this.skills.forEach((skill) => {
    const abilityMod = abilityScores[skill.skillAbility]

    skill.skillMod =
      abilityMod +
      (skill.isProficient ? this.proficiency : 0) +
      (skill.hasDoubleProficiency ? this.proficiency : 0)
  })

  this.initiative = abilityScores.dexterity

  next()
})

// SENSES
playerCharacterSchema.pre('save', function (next) {
  const skillMods = this.skills.reduce((acc, skill) => {
    acc[skill.skillName] = skill.skillMod
    return acc
  }, {})

  this.senses.forEach((sense) => {
    const senseMod = skillMods[sense.skill]

    sense.senseMod = senseMod
  })

  next()
})

mongoose.plugin(addToCodex, 'characters')

const PlayerCharacter = mongoose.model('PlayerCharacter', playerCharacterSchema)

module.exports = PlayerCharacter
