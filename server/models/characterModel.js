const mongoose = require('mongoose')
const addToCodex = require('./../middleware/addToCodex')
const Container = require('./containerModel')

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

const characterTypes = ['player', 'npc']

const characterSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  characterType: {
    type: String,
    required: true,
    enum: characterTypes,
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
  inventory: [
    {
      type: Schema.ObjectId,
      ref: 'Container',
    },
  ],
})

// PROFICIENCY
characterSchema.pre('save', function (next) {
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
characterSchema.pre('save', function (next) {
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
characterSchema.pre('save', function (next) {
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

mongoose.plugin(addToCodex, 'characters')

const Character = mongoose.model('Character', characterSchema)

module.exports = Character
